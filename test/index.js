'use strict'

var expect = require('must')
var mocha = require('mocha')

const WebOPAC = require('..')

var settings

try {
  settings = require('./settings.local.json')
} catch (e) {
  // ignore and proceed
  settings = {}
}

if (!settings.rootUrl) {
  const mockServer = require('./mock-server')

  const port = 8080
  mockServer.listen(port)
  settings.rootUrl = 'http://localhost:' + port
}

mocha.describe('WebOPAC', () => {
  mocha.describe('startSession()', () => {
    mocha.it('should start a session', (done) => {
      const client = new WebOPAC(settings.rootUrl)
      client.startSession()
        .then(() => {
          expect(client.session).to.be.an.object()
          expect(client.session.id).to.be.a.string()
          expect(client.session.id).to.be.not.empty()
        })
        .then(done)
        .catch(done)
    })
  })

  mocha.describe('findById(id)', () => {
    mocha.it('should return a title', (done) => {
      const client = new WebOPAC(settings.rootUrl)
      client.findById(362191)
        .then((title) => {
          expect(title).to.equal('Matrix [Bildtonträger]')
        })
        .then(done)
        .catch(done)
    })
  })
})
