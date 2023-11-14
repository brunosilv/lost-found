const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Airport Lost and Found API Tests', () => {
  let authToken;
  let productId;
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

  // Test the list products route
  describe('GET /product', () => {
    it('should return a list of products', (done) => {
      chai.request(app)
        .get('/product')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  // Test the create product route
  describe('POST /product', () => {
    it('should create a new product', (done) => {
      const newProduct = {
        name: 'Laptop',
        description: 'Lost laptop',
        color: 'Silver',
        brand: 'Dell',
        lostTime: '2023-11-14T10:30:00Z',
      };

      chai.request(app)
        .post('/product')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          productId = res.body._id;
          done();
        });
    });
  });

  // Test the delete product route
  describe('DELETE /product/:productId', () => {
    it('should delete an existing product', (done) => {
      chai.request(app)
        .delete(`/product/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
