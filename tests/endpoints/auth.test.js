const chai = require('chai');
const expect = chai.expect;
const http = require('chai-http');
const app = require('../../server/');
const faker = require('faker');

chai.use(http);

describe('Auth:routes', () => {


  context('When we signup and login with valid user credentials', () => {

    const userLoginCredentials = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };


    it('should return user json data after successful signup', done => {
      chai.request(app)
        .post('/auth/signup')
        .send(userLoginCredentials)
        .end((error, response) => {
          if (error) throw error;
          let data = response.body;
          expect(data.user.name).to
            .eql(`${userLoginCredentials.firstName} ${userLoginCredentials.lastName}`);
          expect(data.user.email).to.eql(userLoginCredentials.email);
          expect(data.user).to.have.any
            .keys('_id', 'projects', 'status', 'role', 'updated_at', 'created_at');
          expect(data.token).to.exist;
          done();
        });
    });

    it('should return user json data after successful Login', done => {
      chai.request(app)
        .post('/auth/login')
        .send(userLoginCredentials)
        .end((error, response) => {
          if (error) throw error;
          let data = response.body;
          expect(data.token).to.exist;
          expect(data.token).to.a('string');
          expect(data.user).to.exist;
          expect(data.user).to.be.an('object');
          done();
        });
    });

    it('Should return user json data after successful logout', done => {
      chai.request(app)
        .get('/auth/logout')
        .end((error, response) => {
          if (error) throw error;
          expect(response.body).to.be.an('object');
          expect(response.body).to.deep.eq({ message: 'You have been logged out' });
          done();
        });
    });
  });

  context('When we signup and login with Invalid credentials', () => {
    const invalidUserCredentials = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email()
    };

    it('Should return json error message after failed signup attempt', done => {

      chai.request(app)
        .post('/auth/signup')
        .send(invalidUserCredentials)
        .end((error, response) => {
          if (error) {
            expect(response.body).to.exist;
            expect(response.body.error).to.equal('Missing require parameters');
            expect(response.body.errors[0]).to.equal('Missing required property password');
          }
          return done();
        });
    });

    it('Should return json error message after failed login attempt', done => {
      chai.request(app)
        .post('/auth/login')
        .send(invalidUserCredentials)
        .end((error, response) => {
          if (error) {
            expect(response.statusCode).to.eq(404);
            expect(response.body).to.exist;
            expect(response.body).to.deep.eq({ message: `User of email ${invalidUserCredentials.email} not found` });
          }
          return done();
        });
    });
  });
});
