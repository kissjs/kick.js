var kick = require('../kick')
  , profiler = require('v8-profiler')
  , http = require('http');


var app = module.exports = kick();

app.use(function(req, res, next) {
    req.hello = 'hello world';
    next();
})

app.get('/', function(req, res, next) {
    res.end(req.hello);
})

function paramHandler(req, res, next) {
    res.end(req.params.userid + req.hello);
}

//  30 handlers /user/1-30/:userid'
for(var i = 1; i <= 30; i++)
  app.get('/user/' + i + '/:userid', paramHandler);

// setInterval(function(){
//   profiler.startProfiling('flow');
//   setTimeout(function(){
//       profiler.stopProfiling('flow');
//   }, 100)
// }, 1000)

if(!module.parent) {
  http.createServer(app).listen(3000);
}

