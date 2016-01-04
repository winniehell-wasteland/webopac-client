'use strict'

var superagent = require('superagent')

class WebOPAC {

  constructor (rootUrl) {
    this.rootUrl = rootUrl
  }

  apiCall (relativeUrl) {
    return new Promise((resolve, reject) => {
      superagent
        .get(this.rootUrl + relativeUrl)
        .end((error, res) => {
          error ? reject(error) : resolve(res)
        })
    })
  }

  findById (id) {
    const relativeUrl = '/start.do?Login=Internet&BaseURL=this&Query=0000=%22' + id + '%22'
    const titlePattern = /&amp;title=(.+?)&amp;/

    return this.apiCall(relativeUrl)
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

        throw new Error('Could not parse response!')
      })
      .then(function (html) {
        var titleMatch = titlePattern.exec(html)
        if (titleMatch && titleMatch.length === 2) {
          return decodeURIComponent(titleMatch[1]).replace(/\+/g, ' ')
        }

        return null
      })
  }
}

module.exports = WebOPAC
