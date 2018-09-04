const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../server.js');

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
  describe('GET /api/v1/bucketlist', () => {
    it('should return a bucket list array', done => {
      chai.request(app)
        .get('/api/v1/bucketlist')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          done();
        });
    });
  });
});