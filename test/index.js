'use strict'

const settings = require('./settings.local.json')

const WebOPAC = require('..')
const client = new WebOPAC(settings.rootUrl)

client.findById(362191)
  .then(function (title) {
    console.log(title)
  })
  .catch(function (e) {
    console.error(e)
  })
