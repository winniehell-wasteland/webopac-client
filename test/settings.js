const MockServer = require('./mock-server')

function loadSettings () {
  var settings

  try {
    settings = require('./settings.local.json')

    if (settings.rootUrl) {
      return Promise.resolve(settings)
    }
  } catch (e) {
    // ignore and proceed
    settings = {}
  }

  const mockServer = new MockServer()

  return mockServer.start()
    .then(() => {
      settings.mockServer = mockServer
      settings.rootUrl = 'http://' + mockServer.host + ':' + mockServer.port
      return settings
    })
}

module.exports = {
  load: loadSettings
}
