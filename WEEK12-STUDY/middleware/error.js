const express = require('express')
var fs = require('fs')
const app = express()

app.get('/', (req, res) => {
  throw new Error('BROKEN')
})

app.get('/error', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})

// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })

app.listen(3000)