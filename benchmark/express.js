var express = require('express')
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

if(!module.parent) {
  http.createServer(app).listen(4000);
}
