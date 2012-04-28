var kick = require('../kick')
  , should = require('should')
  ;

function a(){}
function b(){}
function c(){}
function d(){}
function e(){}
function f(){}
function index(){}
function allget(){}
function profile(){}
function login(){}

var app = kick({test: true});

app.use(a)
  .use(b)
  .use(c)

app.get('/', index)
app.get('/*', allget)
app.get('/user/:userid', profile)
app.post('/login', login)

it('should middlewares', function() {
    app.baseMiddlewares.should.include(a).include(b).include(c);
})

it('should path math', function() {
    var obj = app.pathMatch('GET', '/user/abcde', app.defines[2]);
    obj.userid.should.equal('abcde');
})

it('should get middlewares', function() {
    var obj = app.getParamsAndMiddlewares('GET', '/');
    obj.middlewares.should.include(index);
    obj.middlewares.should.include(allget);
})

it('should ', function() {
    var handler = app.getHandler('GET', '/user/12345');
    console.log(handler.toString());
})
