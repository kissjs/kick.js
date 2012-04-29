var http = require('http');

var app = module.exports = function(req, res) {
  res.end('hello world');
}

if(!module.parent) {
  http.createServer(app).listen(3000);
}
