var express = require('express')
  , http = require('http');

var app = module.exports = express.createServer();


app.use(function(req, res, next) {
    req.hello = 'hello world';
    next();
});


app.get('/', function(req, res, next) {
    res.send();
    // res.end('hello world');
})

function paramHandler(req, res, next) {
    res.send();
    // res.end(req.params.userid + req.hello);
}

//  30 handlers /user/30/:userid'
for(var i = 1; i <= 30; i++)
  app.get('/user/' + i + '/:userid', paramHandler);

if(!module.parent) {
  http.createServer(function(req, res){
      app(req, res);
  }).listen(3000);
}
