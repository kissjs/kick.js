var connect = require('connect')
  , http = require('http')
  , kick = require('../kick');

var app = module.exports = kick();

app
  .use(connect.logger('dev'))
  .use(connect.logger(':date :method :url - :status :response-time ms'))
  .use(connect.static(__dirname + '/public'))
  .use(connect.cookieParser('tobo!'))
  .use(connect.session());

app.get('/', function(req, res, next){
    res.writeHead(302, {
        location: 'index.html'
    });
    res.end();
});

app.get('/set-cookie', function(req, res, next) {
    req.session.username = 'user name';
    res.end();
})

app.get('/get-cookie', function(req, res, next) {
    res.end(req.session.username);
})

app.post('/login', connect.bodyParser(), function(req, res, next) {
    res.end(req.body.username);
});

if(!module.parent)
  http.createServer(app).listen(3000);
