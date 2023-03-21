// import express
// import ใช้เฉพาะ function router
// import article เพื่อนำมาใช้ และที่จุด2จุดคือ ไฟล์อยู่นอก folder
const express = require('express')
const router = express.Router()
const article = require("../article-db");

router.get('/', function (req, res) {
    res.render('ไม่พบหน้าที่ต้องการ')
})

router.get('/:id', (req, res) => {
    var data = {title : article[req.params.id-1].title + '| You Blog', article: article[req.params.id-1]}
    res.render('detail', data)
})

//ส่งออกไป เพื่อให้ไฟล์อื่นๆใช้งานได้
module.exports = router