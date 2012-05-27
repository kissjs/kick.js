/**
 * @author Gui Lin guileen@gmail.com
 *
 */
var util = require('util');

require('./response');
require('./request');

var exports = module.exports = function(options) {

  // handler is function(req, res)
  // middleware is function(req, res, next)

  options = options || {};
  var handlers = {}
    , defines = []
    , constHandlers = {}
    , constDefines = {}
    , constInited = false
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
    if(err) {
      console.log('error');
      console.log(err.stack);
      res.writeHead(500);
      res.end('Internal server error');
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }

  /**
   * main handler
   *
   */
  var app = function app(req, res) {
    req.app = res.app = app;
    req.res = res;
    res.req = req;

    // path, querystring
    var pathAndQuery = req.url.split('?', 2);
    var path = req.path = pathAndQuery[0];
    req.querystring = pathAndQuery[1];
    var method = req.method;

    // Why kick fast? it is simple
    (constHandlers[method + path] || getHandler(method, path))(req, res);
  }

  /**
   * app.get(path, middleware, ...)
   * app.post(path, middleware, ...)
   *
   * @param {string} path
   *
   *    const path: '/user'
   *    param path: '/user/:userid/edit'
   *
   *      you can access req.params.userid as ':userid'
   *
   *    regex path: /^\/user-(\d+)$/
   *
   *      you can access req.params[1] as '(\d+)'
   *
   *
   */
  ;methods.forEach(function(method) {
      var METHOD = method.toUpperCase();
      app[method] = function(path) {
        var middlewares = [].slice.call(arguments, 1);
        var define = {
          method: METHOD
        , path: path
        , middlewares: middlewares
        }
        if(util.isRegExp(path)) {
          define.regex = path
        } else if(~path.indexOf('*') || ~path.indexOf('/:')) {
          var names = [];
          var regex = path.replace(/\/(?:([^:\/]+)|\:([^\/]+))/g, function(full, normal, name){
              if(normal) return full;
              names.push(name);
              return '/(.+?)';
          }).replace(/\*/g, '.*?').replace(/\//g, '\\/');
          define.regex = new RegExp('^' + regex + '$');
          define.names = names;
        } else {
          // constHandlers for cache
          constDefines[METHOD + path] = define;
        }
        defines.push(define);
      }
  })

  app.del = app.delete;

  /**
   * app.all(path, middleware)
   *
   */
  app.all = function() {
    var args = [].slice.call(arguments);
    methods.forEach(function(method){
        app[method].apply(null, args);
    })
  }

  /**
   * app.use(middleware, ...)
   *
   */
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

  // dynamic handlers
  function getHandler(method, path) {

    // init const
    if(!constInited) {
      initConstHandlers();
      var handler = constHandlers[method + path];
      if(handler) return handler;
    }

    return makeHandler(getParamsAndMiddlewares(method, path));
  }

  /**
   * getParamsAndMiddlewares('GET', '/user')
   *
   * @return {object}
   *    params
   *    middlewares
   *
   */
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

      if(define.regex != null) {
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

  /**
   * cache handlers
   * constHandlers['GET/user'] = getHandler('GET', '/user')
   *
   */
  function initConstHandlers() {
    // put this at first line prevent circulation call
    constInited = true;

    for(var name in constDefines) {
      var define = constDefines[name];
      constHandlers[name] = getHandler(define.method, define.path);
    }

    // remove const element from defines, from end to begin
    for(var i = defines.length - 1; i >= 0; i--) {
      if(!defines[i].regex) defines.splice(i, 1);
    }

  }

  /**
   * makeHandler
   *
   * @param {object} options
   *        params : from path
   *        middlewares : of match
   *
   */
  function makeHandler(options) {
    var params = options.params;
    var middlewares = options.middlewares;
    middlewares = baseMiddlewares.concat(middlewares)

    if(middlewares.length == 1) {
      return function(req, res) {
        req.params = params;
        // req, res, next
        middlewares[0](req, res, function(err) {
            errorHandler(err, req, res);
        });
      }
    }

    return function(req, res) {

      req.params = params;

      var index = 0;
      req.next = next;
      next();

      function next(err) {
        if(err) {
          return errorHandler(err, req, res, next);
        }

        if(index >= middlewares.length) {
          // reach the end
          res.writeHead(404);
          return res.end('not found');
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
    app.constHandlers = constHandlers;
  }

  return app;
}
