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

it('should get params', function() {
    var obj = app.pathMatch('GET', '/user/abcde', app.defines[2]);
    obj.userid.should.equal('abcde');
})

it('should get params and middlewares', function() {
    var obj = app.getParamsAndMiddlewares('GET', '/');
    obj.middlewares.should.include(index);
    obj.middlewares.should.include(allget);
});

it('should init const handlers', function() {
    app.getHandler('GET', '/');
    should.exist(app.constHandlers['GET/']);
    should.exist(app.constHandlers['POST/login']);
    app.defines.length.should.equal(2);
})
