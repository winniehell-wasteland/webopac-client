'use strict'

var httpServer = require('http-server')
var path = require('path')

const logger = {
  debug: () => {
  },
  info: console.log,
  error: console.error,
  request: function (req, res, error) {
    var date = new Date()
    if (error) {
      logger.error(
        '[%s] "%s %s" Error (%s): "%s"',
        date, req.method, req.url,
        error.status.toString(), error.message
      )
    } else {
      logger.debug(
        '[%s] "%s %s" "%s"',
        date, req.method, req.url,
        req.headers['user-agent']
      )
    }
  }
}

class MockServer {
  constructor () {
    this.host = '127.0.0.1'
    this.port = 8080

    const options = {
      root: path.join(__dirname, 'mocks'),
      ext: 'html',
      logFn: logger.request,
      before: [
        MockServer.prepareRequest
      ]
    }

    this.server = httpServer.createServer(options)
  }

  start () {
    return new Promise((fulfill) => {
      this.server.listen(this.port, this.host, fulfill)
    })
      .then(() => {
        logger.info(
          'Serving %s on http://%s:%s',
          this.server.root, this.host, this.port
        )
      })
  }

  stop () {
    this.server.close()
  }

  static prepareRequest (req, res) {
    req.url = req.url.replace('?', '/')
    res.emit('next')
  }
}

module.exports = MockServer
