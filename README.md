kick.js
=======

sinatra style routing framework

    var app = kick();

    app.use(function(req, res, next) {
            req.hello = 'hello world';
            next();
    })

    app.get('/', function(req, res, next) {
        res.end(req.hello);
    })

    app.get('/user/:userid', function(req, res, next) {
        res.end(req.params.userid + req.hello);
    })


## benchmark

benchmark with [siege.js](https://github.com/guileen/siege.js),
constant routing has similar RPS with helloworld,
param routing (30 param routing defined) lose 5% RPS.

node hello world [[code](https://github.com/guileen/kick.js/blob/master/benchmark/node.js)]

    GET:/  without cookie
        done:100000
        200 OK: 100000
        rps: 7495
        response: 0ms(min)	17ms(max)	1ms(avg)

    GET:/user/30/abcdefg  without cookie
        done:100000
        200 OK: 100000
        rps: 7577
        response: 0ms(min)	17ms(max)	1ms(avg)

kick example [[code](https://github.com/guileen/kick.js/blob/master/benchmark/app.js)]

    GET:/  without cookie
        done:100000
        200 OK: 100000
        rps: 7411
        response: 0ms(min)	18ms(max)	1ms(avg)

    GET:/user/30/abcdefg  without cookie
        done:100000
        200 OK: 100000
        rps: 7079
        response: 0ms(min)	17ms(max)	1ms(avg)

### app.configure(env, fn)
### app.use(middleware, ...)

    app.configure('development', function(){
        app.use(connect.logger('dev'))
        app.use(connect.static(__dirname + '/public'))
        app.use(connect.cookieParser('tobo!'))
        app.use(connect.session());
    });

### app.get(path, middleware, ...)


Constant routing, O(1)

    app.get('/about', routes.about);


Param routing, O(N)

    app.get('/user/:userid', function(req, res, next) {
        res.end(req.params.userid);
    });

Above will match `/user/123` and `req.params.userid` is `123`

Regular expression routing, O(N)

    app.get(/^\/user-(\d+)$/, function(req, res, next) {
        res.end(req.params[1])
    });

Above will match `/user-123` and `req.params[1]` is `123`

> N = count(params routing) + count(regular expression routing)
