const chai = require('chai');
const expect = chai.expect;
const http = require('chai-http');
const app = require('../../server/');

chai.use(http);

describe('IndexRoute: GET /', () => {
  it('should return json with status of the api', done => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        if (error) throw error;
        let data = response.body;
        expect(response.statusCode).to.eql(200);
        expect(data).to.be.an('object');
        expect(data).to.have.all.keys('status', 'host', 'user_agent', 'request_origin');
        done();
      });
  });
});
