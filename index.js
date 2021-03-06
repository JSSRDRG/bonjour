'use strict'

const Registry = require('./lib/registry.js')
const Server = require('./lib/mdns-server.js')
const Browser = require('./lib/browser.js')

function Bonjour (opts, error) {
  if (!(this instanceof Bonjour)) return new Bonjour(opts, error)

  if (typeof opts === 'function') {
    error = opts
    opts = undefined
  }

  this._server = new Server(opts, error)
  this._registry = new Registry(this._server)
}

Bonjour.prototype.publish = function (opts) {
  return this._registry.publish(opts)
}

Bonjour.prototype.unpublishAll = function (cb) {
  this._registry.unpublishAll(cb)
}

Bonjour.prototype.find = function (opts, onup) {
  return new Browser(this._server.mdns, opts, onup)
}

Bonjour.prototype.findOne = function (opts, cb) {
  const browser = new Browser(this._server.mdns, opts)
  browser.once('up', function (service) {
    browser.stop()
    if (cb) cb(service)
  })
  return browser
}

Bonjour.prototype.destroy = function () {
  this._registry.destroy()
  this._server.mdns.destroy()
}

module.exports = Bonjour
