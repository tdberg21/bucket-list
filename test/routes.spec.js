process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../server.js');
const  knex = require('../db/knex.js');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the awesome homepage and a status of 200 for the correct route', done => {
    chai.request(app)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 status for incorrect urls', done => {
    chai.request(app)
    .get('/somuchsadness')
    .end((error, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {
  
  before((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/listitems', () => {
    it('should return a bucket list array', done => {
      chai.request(app)
        .get('/api/v1/listitems')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(3);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('title');
          response.body[0].should.have.property('description');
          response.body[0].id.should.equal(4);
          response.body[0].title.should.equal('listItem1');
          response.body[0].description.should.equal('item number 1')
          done();
        });
    });
  });

  describe('POST /api/v1/listitems', () => {
    it('should add a bucket list item', done => {
      chai.request(app)
        .post('/api/v1/listitems')
        .send({
          title: 'New Item Title',
          description: 'New Item description'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(1);
          done();
        });
    });

    it('should not create a list item with missing parameters', done => {
      chai.request(app)
        .post('/api/v1/listitems')
        .send({
          title: 'Testing'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('You are missing a required parameter: description')
          done();
        });
    });
  });

  describe('DELETE /api/v1/listitems/:id', () => {
    it('should delete a list item', done => {
      chai.request(app)
        .delete('/api/v1/listitems/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('message');
          response.body.message.should.equal('Item with id:1 successfully deleted');
          chai.request(app)
            .get('/api/v1/listitems')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(3);
              done();
            });
        });
    });

    it('should not delete a list item if id is incorrect', done => {
      chai.request(app)
        .delete('/api/v1/listitems/taco')
        .end((error, response) => {
          response.should.have.status(500);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          chai.request(app)
            .get('/api/v1/listitems')
            .end((err, res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.equal(3);
              done();
            });
        });
    });
  });
});