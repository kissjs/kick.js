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
var http = require('http');

var app = module.exports = connect();
app.use(function(req, res, next) {
  req.hello = 'hello world';
  next();
});

function paramHandler(req, res, next) {
    res.end(req.params.userid + req.hello);
}

app.use(connect.router(function(app) {
  app.get('/', function(req, res, next) {
    res.end(req.hello);
  });

  //  30 handlers /user/1-30/:userid'
  for(var i = 1; i <= 30; i++)
    app.get('/user/' + i + '/:userid', paramHandler);

}));

if (!module.parent) {
  app.listen(3000);
}
