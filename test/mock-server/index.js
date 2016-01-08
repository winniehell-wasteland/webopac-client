'use strict'

const cookieParser = require('cookie-parser')
const express = require('express')
const path = require('path')
const session = require('express-session')

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

const sessionCheck = (req, res, next) => {
  const hasSession = req.cookies && (Object.keys(req.cookies).length > 0)
  const isStartPage = (req.url === '/start.do') || (req.url === '/start.do/')
  if (!hasSession && !isStartPage) {
    throw new Error('Session is required!')
  }

  next()
}

const urlPatcher = (req, res, next) => {
  req.url = req.url.replace(/CSId=.+?&/, '')
  req.url = req.url.replace('?', '/')
  next()
}

app.use(cookieParser())
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(urlPatcher)
app.use(logger)
app.use(sessionCheck)
app.use('/', express.static(path.join(__dirname, 'mocks'), {extensions: ['html']}))
app.use(errorHandler)

module.exports = app
