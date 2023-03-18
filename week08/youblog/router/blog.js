
const express = require('express')

const router = express()

const article = require('../article-db') /* .. จุดสองจุดเพราะอยู่นอก router */


router.get('/blogapi', (req, res) => {
  console.log(req.query)
  res.json(article)
})

router.get('/blogapi/:name', (req, res) => {
    console.log(req.params)
    res.json(article.find(article => article.id === req.params.id))
  })
  module.exports = router