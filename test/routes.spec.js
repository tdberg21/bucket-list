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

  describe('GET /api/v1/bucketlist', () => {
    it('should return a bucket list array', done => {
      chai.request(app)
        .get('/api/v1/bucketlist')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(3);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('title');
          response.body[0].should.have.property('description');
          response.body[0].id.should.equal(1);
          response.body[0].title.should.equal('listItem1');
          response.body[0].description.should.equal('item number 1')
          done();
        });
    });
  });

  describe('POST /api/v1/bucketlist', () => {
    it('should add a bucket list item', done => {
      chai.request(app)
        .post('/api/v1/bucketlist')
        .send({
          "title": "New Item Title",
          "description": "New Item description"
        })
        .end((error, response) => {
          // response.should.have.status(200);
          response.should.be.json;
          // response.body.should.be.a('object');
          // response.body.should.have.property('id');
          // response.body.id.should.equal(4);
          done();
        });
    });

    it('should not create a list item with missing parameters', done => {
      chai.request(app)
        .post('/api/v1/bucketlist')
        .send({
          title: 'Testing'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          done();
        });
    });
  });
});