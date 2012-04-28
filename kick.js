var util = require('util');

module.exports = function(options) {
  options = options || {};
  var handlers = {}
    , defines = []
    , constPaths = []
    , baseMiddlewares = []
    , NODE_ENV = process.env.NODE_ENV || 'development'
    , methods = [
        'get'
      , 'post'
      , 'put'
      , 'head'
      , 'delete'
      , 'options'
      , 'trace'
      , 'copy'
      , 'lock'
      , 'mkcol'
      , 'move'
      , 'propfind'
      , 'proppatch'
      , 'unlock'
      , 'report'
      , 'mkactivity'
      , 'checkout'
      , 'merge'
      , 'm-search'
      , 'notify'
      , 'subscribe'
      , 'unsubscribe'
      , 'patch'
      ]
    ;

  var errorHandler = function(err, req, res){
    console.log('error');
    console.log(err);
  }

  var app = function app(req, res) {
    res.req = req;

    var pathAndQuery = req.url.split('?', 2);
    var path = req.path = pathAndQuery[0];
    req.querystring = pathAndQuery[1];
    var method = req.method;

    (/* handlers[method][path] || */ getHandler(method, path))(req, res);
  }

  ;methods.forEach(function(method) {
      app[method] = function(path) {
        var middlewares = [].slice.call(arguments, 1);
        var define = {
          method: method.toUpperCase()
        , path: path
        , middlewares: middlewares
        }
        if(util.isRegExp(path)) {
          define.regex = path
        } else if(~path.indexOf('*') || ~path.indexOf('/:')) {
          var names = [];
          var regex = path.replace(/\/:(.+?)(\/|$)/g, function(full, name, suff){
              names.push(name);
              return '/(.+?)' + suff;
          }).replace(/\*/g, '.*?').replace(/\//g, '\\/');
          define.regex = new RegExp('^' + regex + '$');
          define.names = names;
        } else {
          constPaths.push(path);
        }
        defines.push(define);
      }
  })

  app.del = app.delete;
  app.all = function() {
    var args = [].slice.call(arguments);
    methods.forEach(function(method){
        app[method].apply(null, args);
    })
  }

  // all
  app.use = function() {
    var args = [].slice.call(arguments)
    args.forEach(function(mid) {
        baseMiddlewares.push(mid);
    });
    return this;
  }

  app.errorHandler = function(fn) {
    errorHandler = fn;
  }

  app.configure = function(env, fn){
    var envs = 'all'
      , args = [].slice.call(arguments);
    fn = args.pop();
    if (args.length) envs = args;
    if ('all' == envs || ~envs.indexOf(NODE_ENV)) fn.call(app);
    return app;
  }

  // ------------ Routing ----------
  // handler is function(req, res)
  // middleware is function(req, res, next)

  // cache handlers
  function initHandlers() {
    // baseMiddlewares;
    staticHandlers;
    staticHandlers.forEach(function(){
        method;
        path;
        getHandler(method, path)
    })
  }

  // dynamic handlers
  function getHandler(method, path) {

    return makeHandler(getParamsAndMiddlewares(method, path));
  }

  function getParamsAndMiddlewares(method, path) {
    var middlewares = [], params = [];
    for(var i = 0; i < defines.length; i++) {
      var define = defines[i];
      var match = pathMatch(method, path, define);
      if(!match) continue;
      for(var j in match) {
        params[j] = match[j]
      }
      for(var j in define.middlewares) {
        middlewares.push(define.middlewares[j])
      }
    }
    return {
      params: params
    , middlewares: middlewares
    }
  }


  /**
   * pathMatch('GET', '/user/12345', {path: '/user/:userid', ...})
   *
   * return [1: '12345', 'userid': '12345']
   *
   */
  function pathMatch(method, path, define) {

    if((define.method == '*' || define.method == method)) {

      if(define.regex) {
        var match = path.match(define.regex);
        var names = define.names;
        if(names && match) for(var i = 0; i < names.length; i++) {
          // match[0] == full, match[1] is names[0]
          match[names[i]] = match[i + 1];
        }

        return match
      } else {
        return define.path == path
      }

    }
  }

  function makeHandler(options) {
    var params = options.params;
    var middlewares = options.middlewares;
    middlewares = baseMiddlewares.concat(middlewares)

    if(middlewares.length == 1) {
      return function(req, res) {
        req.params = params
        // req, res, next
        middlewares[0](req, res, errorHandler)
      }
    }

    return function(req, res) {

      req.params = params;

      var index = 0;
      next();

      function next(err) {
        if(err) {
          return errorHandler(err, req, res, next)
        }

        if(index >= middlewares.length) {
          // reach the end
          return res.end('not found', 404);
        }

        var middleware = middlewares[index++];
        middleware.call(null, req, res, next);
      }

    }
  }

  if(options.test) {
    app.baseMiddlewares = baseMiddlewares;
    app.defines = defines;
    app.getParamsAndMiddlewares = getParamsAndMiddlewares;
    app.pathMatch = pathMatch;
    app.getHandler = getHandler;
  }

  return app;
}
