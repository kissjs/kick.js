var express = require('express')
  , profiler = require('v8-profiler')
  , http = require('http');

var app = module.exports = express.createServer();

// app.configure('development', function(){

//     app.use(function(req, res, next) {
//         console.log('dev middleware');
//         next();
//     });

// })

app.get('/', function(req, res, next) {
    res.end('hello world');
})

app.get('/user/:userid', function(req, res, next) {
    res.end(req.params.userid);
})

setInterval(function(){
  profiler.startProfiling('flow');
  setTimeout(function(){
      profiler.stopProfiling('flow');
  }, 100)
}, 1000)

if(!module.parent) {
  http.createServer(function(req, res){
      app(req, res);
  }).listen(3000);
}
