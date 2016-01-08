'use strict'

const express = require('express')
const path = require('path')

const app = express()

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(404).send('No mock available!')
}

const logger = (req, res, next) => {
  const now = new Date()
  console.log(`[${now}] ${req.method} ${req.url}`)
  next()
}

const urlPatcher = (req, res, next) => {
  req.url = req.url.replace('?', '/')
  next()
}

app.use(logger)
app.use(urlPatcher)
app.use('/', express.static(path.join(__dirname, 'mocks'), {extensions: ['html']}))
app.use(errorHandler)

module.exports = app
