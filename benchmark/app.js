var kick = require('../lib/kick')
  // , profiler = require('v8-profiler')
  , http = require('http');

var redis = require('redis').createClient()

var app = module.exports = kick();

app.use(function(req, res, next) {
    req.hello = 'hello world';
    next();
})

app.get('/', function(req, res, next) {
    res.end(req.hello);
})

app.get('/redis', function(req, res, next) {
    redis.set('foo', 'bar', function(err, data) {
        if(err) return next(err);
        res.end(data)
    })
})

function paramHandler(req, res, next) {
    res.end(req.params.userid + req.hello);
}

//  30 handlers /user/1-30/:userid'
for(var i = 1; i <= 30; i++)
  app.get('/user/' + i + '/:userid/:itemid', paramHandler);

// setInterval(function(){
//   profiler.startProfiling('flow');
//   setTimeout(function(){
//       profiler.stopProfiling('flow');
//   }, 100)
// }, 1000)

if(!module.parent) {
  http.createServer(app).listen(3000);
}

