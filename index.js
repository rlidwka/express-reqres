require('./lib/i-want-es6')

var http         = require('http')
  , resolve      = require('path').resolve
  , Templation   = require('templation')
  , request      = require('./lib/request')
  , response     = require('./lib/response')
  , compileETag  = require('./lib/utils').compileETag
  , compileTrust = require('./lib/utils').compileTrust

module.exports = function expressCompat(options) {
  if (!options) options = {}
  function def(key, value) {
    if (options[key] != null) return
    options[key] = typeof(value) === 'function' ? value() : value
  }

  def('env',                 process.env.NODE_ENV || 'development')
  def('views',               resolve('views'))
  def('view cache',          options.env === 'production')
  def('x-powered-by',        true)
  def('etag',                'weak')
  def('subdomain offset',    2)
  def('trust proxy',         false)
  def('jsonp callback name', 'callback')
  def('etag fn',             function(){ return compileETag(options['etag']) })
  def('trust proxy fn',      function(){ return compileTrust(options['trust proxy']) })
  def('templation',          function() {
    var views = new Templation({
      cache: options['view cache'],
      root: options['views'],
    })

    var defaultEngine = options['view engine']
    if (defaultEngine) {
      defaultEngine = defaultEngine.replace(/^\./, '')
      if (Templation.engines[defaultEngine]) {
        views.use(defaultEngine, Templation.engines[defaultEngine])
      } else {
        views.use(defaultEngine, require(defaultEngine).__express)
      }
    }
    return views
  })

  return function expressInit(req, res, next) {
    /**
     * Initialization middleware, exposing the
     * request and response to eachother, as well
     * as defaulting the X-Powered-By header field.
     *
     * @param {Function} app
     * @return {Function}
     * @api private
     */

    req.res = res
    res.req = req
    req.next = next
    req.settings = options

    Object.setPrototypeOf(req, request)
    Object.setPrototypeOf(res, response)

    res.locals = res.locals || Object.create(null)

    if (options['x-powered-by'])
      res.setHeader('X-Powered-By', 'Sexpress') // stands for "Secure Express" :)

    next()
  }
}

