/*!
 * kick.js - benchmark/connect.js
 * 
 * !!! npm install connect@1.8.6
 * 
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect');
var profiler = require('v8-profiler');
var http = require('http');

var app = module.exports = connect();
app.use(function(req, res, next) {
  req.hello = 'hello world';
  next();
});

app.use(connect.router(function(app) {
  app.get('/', function(req, res, next) {
    res.end(req.hello);
  });

  app.get('/user/:userid', function(req, res, next) {
    res.end(req.params.userid + req.hello);
  });
}));

setInterval(function() {
  profiler.startProfiling('flow');
  setTimeout(function() {
    profiler.stopProfiling('flow');
  }, 100);
}, 1000);

if (!module.parent) {
  app.listen(3000);
}