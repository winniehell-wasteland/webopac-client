'use strict'

var mocha = require('mocha')
require('must')

const WebOPAC = require('..')

const MockServer = require('./mock-server')

var settings

try {
  settings = require('./settings.local.json')
} catch (e) {
  // ignore and proceed
  settings = {}
}

var mockServer

if (!settings.rootUrl) {
  mockServer = new MockServer()
  mockServer.start()
    .then(() => {
      settings.rootUrl = 'http://' + mockServer.host + ':' + mockServer.port
    })
    .catch((e) => {
      throw e
    })
}

mocha.describe('WebOPAC', () => {
  var client

  mocha.before(() => {
    client = new WebOPAC(settings.rootUrl)
  })

  mocha.after(() => {
    if (mockServer) {
      mockServer.stop()
    }
  })

  mocha.describe('#findById(id)', () => {
    mocha.it('should return a title', (done) => {
      client.findById(362191)
        .then((title) => {
          title.must.equal('Matrix [Bildtonträger]')
        })
        .then(done)
        .catch(done)
    })
  })
})
