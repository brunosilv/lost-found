const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('/home/bruno/development/lost-found/app.js'); // weird issue with path

const expect = chai.expect;
chai.use(chaiHttp);

describe('Airport Lost and Found API Tests', () => {
  let authToken;

  // Test the login route
  describe('POST /agent/login', () => {
    it('should return a valid token on successful login', (done) => {
      chai.request(app)
        .post('/agent/login')
        .send({ username: 'testAgent', password: 'testPassword' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          authToken = res.body.token;
          done();
        });
    });

    it('should return an error on invalid login credentials', (done) => {
      chai.request(app)
        .post('/agent/login')
        .send({ username: 'invalidUser', password: 'invalidPassword' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  // Test the secure route
  describe('GET /agent/secure-route', () => {
    it('should return "Secure route accessed" with a valid token', (done) => {
      chai.request(app)
        .get('/agent/secure-route')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.eql({ message: 'Secure route accessed' });
          done();
        });
    });

    it('should return an error without a valid token', (done) => {
      chai.request(app)
        .get('/agent/secure-route')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
