var kick = require('../kick')
  , http = require('http');

var app = module.exports = kick();

app.get('/', function(req, res, next) {
    res.end('hello world');
})

app.get('/user/:userid', function(req, res, next) {
    res.end(req.params.userid);
})

if(!module.parent) {
  http.createServer(app).listen(3000);
}
