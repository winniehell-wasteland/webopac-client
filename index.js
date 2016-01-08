'use strict'

var superagent = require('superagent')

class WebOPAC {

  constructor (rootUrl) {
    this.rootUrl = rootUrl
    this.agent = superagent.agent()
  }

  apiCall (relativeUrl) {
    return new Promise((resolve, reject) => {
      this.agent
        .get(this.rootUrl + relativeUrl)
        .end((error, res) => {
          error ? reject(error) : resolve(res)
        })
    })
  }

  findById (id) {
    return this.requireSession()
      .then((session) => {
        const relativeUrl = `/search.do?CSId=${session.id}&methodToCall=quickSearch&Query=0000=%22${id}%22`
        return this.apiCall(relativeUrl)
      })
      .then(function (res) {
        if (res.status !== 200) {
          throw new Error(res.status)
        }

        if (res.text.indexOf('noHitsText.jsp') > -1) {
          throw new Error('Not found!')
        }

        if (res.text.indexOf('<!-- START jsp/result/hit.jsp -->') > -1) {
          return res.text
        }

        throw new Error(`Could not parse response:\n${res.text}`)
      })
      .then(function (html) {
        const titlePattern = /&amp;title=(.+?)&amp;/
        var titleMatch = titlePattern.exec(html)
        if (titleMatch && titleMatch.length === 2) {
          return decodeURIComponent(titleMatch[1]).replace(/\+/g, ' ')
        }

        return null
      })
  }

  requireSession () {
    if (this.session && this.session.id) {
      return Promise.resolve(this.session)
    }

    return this.startSession()
  }

  startSession () {
    const relativeUrl = '/start.do'
    const sessionIdPattern = /<input type="hidden" name="CSId" value="(.+?)" \/>/

    const handleResponse = (res) => {
      if (res.status === 200) {
        return res.text
      }
    }

    const parseSessionId = (html) => {
      const sessionIdMatch = sessionIdPattern.exec(html)
      if (sessionIdMatch && sessionIdMatch.length === 2) {
        return sessionIdMatch[1]
      }
    }

    const storeSession = (sessionId) => {
      this.session = {
        id: sessionId
      }
      return this.session
    }

    return this.apiCall(relativeUrl)
      .then(handleResponse)
      .then(parseSessionId)
      .then(storeSession)
  }
}

module.exports = WebOPAC
