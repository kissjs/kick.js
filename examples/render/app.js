var kick = require('../../lib/kick');
var jade = require('jade');
var app = kick();
var http = require('http');

// define view renderer
app.render = function(name, options, callback) {
  if(options.cache === undefined) options.cache = true;
  // render file
  jade.renderFile(__dirname + '/views/' + name + '.jade', options, callback);
}

app.locals = {
  title: 'I am title'
}

app.get('/', function(req, res, next){
    res.render('index', {user: 'world'});
})

http.createServer(app).listen(3000);
