const express = require('express')
const app = express()

const router1 = express.Router()
const router2 = express.Router()

//Here is a simple example of a middleware function called “myLogger”. 
//This function just prints “LOGGED” when a request to the app passes through it. 
//The middleware function is assigned to a variable named myLogger.
const myLogger = function (req, res, next) {
  console.log(`LOGGED @ ${req.originalUrl} on ${new Date()}`)
  next()
}

const requestTime = function (req, res, next) {
  req.requestTime = new Date()
  next()
}

router1.use(myLogger)
router1.use(requestTime)

router1.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

router2.get('/', (req, res) => {
  res.send('This is index of router 2!')
})

app.use('/router1', router1)
app.use('/router2', router2)

app.listen(3000)