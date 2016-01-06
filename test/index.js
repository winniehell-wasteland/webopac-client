'use strict'

const testSettings = require('./settings')

const WebOPAC = require('..')

testSettings.load()
  .then((settings) => {
    const client = new WebOPAC(settings.rootUrl)

    return client.findById(362191)
      .then(function (title) {
        console.log(title)
      })
      .catch(function (e) {
        console.error(e)
      })
      .then(() => {
        if (settings.mockServer) {
          settings.mockServer.stop()
        }
      })
  })
  .catch(function (e) {
    const errorLines = e.stack.split('\n')
    errorLines.forEach(console.error)
  })
