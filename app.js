const express = require('express')
const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, UPDATE, DELETE, OPTIONS')
  res.header('Content-Type', 'application/json')
  next()
})

// global variable
global.__basedir = __dirname

// ping api to check application status
app.get('/ping', (req, res) => res.send('Hello World'))

app.post('/login', require('./component/authenticate/login').login)
app.post('/token', require('./component/authenticate/verifyAuthToken').apiFn)
app.post('/authorize', require('./component/authenticate/verifyApplication').logindata)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`app listening on ${port} port!!`))
