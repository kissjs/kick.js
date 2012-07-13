// init config at very first
var config = require('./config')
  , redis = require('redis')
  ;

config.redisClient = redis.createClient(config.redis.port, config.redis.host);

/**
 * Module dependencies
 */
var kick = require('kick')
  , connect = require('connect')
  , http = require('http')
  , jade = require('jade')
  , myconsole = require('myconsole')
  , RedisStore = require('connect-redis')(connect)
  , app = kick()
  , PORT = process.env.PORT || 3000
  ;

myconsole.useColors = true;
myconsole.replace();

app.configure('development', function() {
    app.use(connect.logger('dev'))
      .use(connect.favicon())
      .use(connect.static(__dirname + '/public'))
      .use(require('connect-less')({ src: __dirname + '/public/', compress: false }));
});

// define view renderer
app.render = function(name, options, callback) {
  if(options.cache === undefined) options.cache = true;
  // render file
  jade.renderFile(__dirname + '/views/' + name + '.jade', options, callback);
}

app.locals = {
  title: 'Kick.JS'
}

app
  .use(connect.cookieParser('keyboard cat'))
  // .use(connect.session({ secret: "keyboard cat", store: new RedisStore }))

app.get('/', function(req, res, next) {
    res.render('index', {name: 'Kick'})
})

require('./routes')(app);

http.createServer(app).listen(PORT)
console.log('server running at %d', PORT)
