kick.js
=======

expressjs like routing framework

example:

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

benchmark with [siege.js](https://github.com/guileen/siege.js) use example code

express:

FYI: express use `res.send()` send a empty response

    GET:/
        done:100000
        200 OK: 100000
        rps: 5943
        response: 1ms(min)	29ms(max)	2ms(avg)

    GET:/user/abcdefg
        done:100000
        200 OK: 100000
        rps: 5740
        response: 1ms(min)	28ms(max)	2ms(avg)

kick:

    GET:/
        done:100000
        200 OK: 100000
        rps: 7451
        response: 1ms(min)	20ms(max)	2ms(avg)

    GET:/user/abcdefg
        done:100000
        200 OK: 100000
        rps: 7180
        response: 1ms(min)	29ms(max)	2ms(avg)

