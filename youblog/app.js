// การ import 'express' ที่ได้ติดตั้ง
// import file article-db.json
// import file path

const express = require("express")
// const article = require("./article-db");
const path = require("path")


//----------------------------------------------------------
// การเรียกใช้งานผ่าน function
const app = express()
// Setup ejs --> ทำให้สามารถใช้งานร่วมกันได้ระหว่าง app.js กับ ejs
//folder views แสดงผล 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Setup static path 
// folder public
app.use(express.static(path.join(__dirname, 'public')))

// ----------------------router------------------------------------
// กำหนดให้ path blogapi แสดงข้อมูลบทความทั้งหมดในรูปแบบ json

app.get("/blogapi", (req, res) => {
  res.json(article);
});
// กำหนดให้ path blogapi/:id แสดงข้อมูลบทความตาม id ที่กำหนด

app.get("/blogapi/:id", (req, res) => {
  res.json(article.find((article) => article.id === req.params.id));
});

// Config Router
const indexRouter = require('./router/index')
app.use('/', indexRouter)
const blogRouter = require('./router/blog')
app.use('/blog', blogRouter)


//-------------------------------------------------------
// // function get('[path]', ([function])
// //path กำหนด path ให้ user เรียกใช้
// //ถ้า มีการยิง path เข้ามาตามที่เรากำหนด ก็จะทำตาม function นี้
// // 'res' ดึงต่าเป็น 'http' ออกไป

// app.get('/IT', (req, res) => {
//   res.send('test Urangota')
// })

//-------------------------------------------------------
// function 'listen' มีพารามีเตอร์ 2 ตัว คือ port number , function
// เมื่อมีการ start server จะทำอะไรตาม function

app.listen(3000, () => {
  console.log("Start server at port 3000.");
});
