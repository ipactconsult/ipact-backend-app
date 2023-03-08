var chai = require('chai')
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

  
  describe('My test', function() {
  it('foo should be "bar"', function(done) {
    var requester = chai.request('http://localhost:5000').keepOpen()
    Promise.all([
        requester.get('/header/findAll'),
        requester.post('/feedback/post/').send({username:"test",role:"test",message:"test",active:"true"})
      ])
      .then(responses => console.log(responses))
      .then(() => requester.close())
      done();
  });
});
describe('My test2', function() {
  it('foo should be "bar"', function(done) {
    var requester = chai.request('http://localhost:5000').keepOpen()
    Promise.all([
        requester.get('/header/findAll'),
        requester.post('/feedback/post/').send({username:"test",role:"test",message:"test",active:"true"})
      ])
      .then(responses => console.log(responses))
      .then(() => requester.close())
      done();
  });
});