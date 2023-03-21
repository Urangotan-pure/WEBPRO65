// import express
// import ใช้เฉพาะ function router
// import article เพื่อนำมาใช้ และที่จุด2จุดคือ ไฟล์อยู่นอก folder
const express = require('express')
const router = express.Router()
const article = require("../article-db");

//มีการนำ 'article' มาเก็บใน data ด้วย
router.get('/', function(req, res, next) {
    if(req.query.search == "" || req.query.search == null){
        var searchData = article;
    }
    else{
        var searchValue = req.query.search;
        var searchData = [];
        article.map((val) => {
            if(val.title.toLowerCase().includes(searchValue.toLowerCase())){
                searchData.push(val);
            }
        })
    }
    var data = {title:"You Blog", article: searchData}
    res.render('index', data);
})

//ส่งออกไป เพื่อให้ไฟล์อื่นๆใช้งานได้
module.exports = router