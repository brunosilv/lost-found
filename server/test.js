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
      chai
        .request(app)
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
      chai
        .request(app)
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
      chai
        .request(app)
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
      chai
        .request(app)
        .get('/agent/secure-route')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  // Test the register route
  describe('POST /agent/register', () => {
    it('should create a new agent', (done) => {
      const newAgent = {
        username: 'newAgent',
        password: 'newPassword',
      };

      chai
        .request(app)
        .post('/agent/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newAgent)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });

    it('should return an error without a valid token', (done) => {
      const newAgent = {
        username: 'newAgent',
        password: 'newPassword',
      };

      chai
        .request(app)
        .post('/agent/register')
        .send(newAgent)
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
      chai
        .request(app)
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
        type: 'Laptop',
        description: 'Macbook Air',
        color: 'Silver',
        brand: 'Apple',
        lostTime: '2023-11-14T09:00:00Z',
      };

      chai
        .request(app)
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

  // Test the update product route
  describe('PUT /product/:productId', () => {
    it('should update an existing product', (done) => {
      const updateData = {
        status: 'found',
      };

      chai
        .request(app)
        .put(`/product/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('found');
          expect(res.body.updatedTime).to.not.be.null;
          done();
        });
    });
  });

  // Test the create product route with invalid lostTime format
  describe('POST /product', () => {
    it('should fail to create a new product with invalid lostTime format', (done) => {
      const invalidProduct = {
        type: 'Playstation',
        description: '5',
        color: 'White',
        brand: 'Playstation',
        lostTime: 'invalid-date-format', // Invalid date format
      };

      chai
        .request(app)
        .post('/product')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProduct)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          // Add assertions for the response body if needed
          done();
        });
    });
  });

  // Test the delete product route
  describe('DELETE /product/:productId', () => {
    it('should delete an existing product', (done) => {
      chai
        .request(app)
        .delete(`/product/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  // Test suite for product search by keywords
  describe('GET /products/search (keywords)', () => {
    it('should search for products based on keywords', (done) => {
      const keywords = 'Laptop';

      chai
        .request(app)
        .get(`/product/search?keywords=${keywords}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  // TODO: Create product to use on search scenarios
  // Test suite for product search by lost time
  describe('GET /product/search (lost time)', () => {
    it('should search for products based on a lost time', (done) => {
      const lostTime = '2023-11-14T09:00:00Z';

      chai
        .request(app)
        .get(`/product/search?lostTime=${lostTime}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  // Test suite for product search by keywords and lost time
  describe('GET /product/search (keywords and lost time)', () => {
    it('should search for products based on keywords and a lost time', (done) => {
      const keywords = 'Smartphone';
      const lostTime = '2023-11-14T09:00:00Z';

      chai
        .request(app)
        .get(`/product/search?keywords=${keywords}&lostTime=${lostTime}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  // Test suite for product search by message
  describe('GET /product/search (message)', () => {
    it('should search for products based on a specified message', (done) => {
      const message = 'I lost my Oppo Smartphone';

      chai
        .request(app)
        .get(`/product/search?message=${message}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('End-to-End Search Test', () => {
    let createdProducts = [];
    before(async () => {
      const productsToCreate = [
        {
          type: 'Laptop',
          description: 'Macbook Air',
          color: 'Silver',
          brand: 'Apple',
          lostTime: '2023-11-14T09:00:00Z',
        },
        {
          type: 'Smartphone',
          description: 'Samsung Galaxy S23',
          color: 'Black',
          brand: 'Samsung',
          lostTime: '2023-11-15T10:30:00Z',
        },
        {
          type: 'Headphones',
          description: 'Airpods Pro',
          color: 'White',
          brand: 'Apple',
          lostTime: '2023-11-16T12:00:00Z',
        },
      ];

      await Promise.all(
        productsToCreate.map(async (product) => {
          const res = await chai
            .request(app)
            .post('/product')
            .set('Authorization', `Bearer ${authToken}`)
            .send(product);

          createdProducts.push(res.body);
        })
      );
    });

    it('should search for products by keywords', (done) => {
      chai
        .request(app)
        .get('/product/search?keywords=Samsung')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(1);
          expect(res.body[0].type).to.equal('Smartphone');
          done();
        });
    });

    it('should search for products by message', (done) => {
      chai
        .request(app)
        .get('/product/search?message=I lost my Apple Macbook Air')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(1);
          expect(res.body[0].description).to.equal('Macbook Air');
          done();
        });
    });

    it('should search for products by lost time range', (done) => {
      chai
        .request(app)
        .get(
          '/product/search?lostTimeStart=2023-11-14T00:00:00Z&lostTimeEnd=2023-11-16T23:59:59Z'
        )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(3);
          done();
        });
    });

    // Clean up created products after all tests are done
    after(async () => {
      await Promise.all(
        createdProducts.map(async (product) => {
          await chai
            .request(app)
            .delete(`/product/${product._id}`)
            .set('Authorization', `Bearer ${authToken}`);
        })
      );
    });
  });
});
