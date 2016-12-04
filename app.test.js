// var app = require('./app.js');
// var expect = require('chai').expect;

// describe('testItems', function() {
//   it('item should be', function() {
//     expect(add(1, 1)).to.be.equal(2);
//   });
// });

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('app.js');
var should = chai.should();
chai.use(chaiHttp);
describe('Items', function() {
  it('should items GET', function(done) {
  chai.request(server)
    .get('/items')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
});

  // it('should list a SINGLE blob on /blob/<id> GET');
  // it('should add a SINGLE blob on /blobs POST');
  // it('should update a SINGLE blob on /blob/<id> PUT');
  // it('should delete a SINGLE blob on /blob/<id> DELETE');
});
