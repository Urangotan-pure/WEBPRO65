
const express = require('express')

const app = express()

const path = require('path')

// Setup ejs
app.set('view engine', 'ejs'); //ทำให้เชื่อมกัน
app.set('views', path.join(__dirname, 'views')); //การเรียกเก็บเข้าไป ใน folderที่สร้าง

// Setup static path
app.use(express.static(path.join(__dirname, 'public'))) //การเรียกเก็บเข้าไป ใน folderที่สร้าง

// Config Router
const indexRouter = require('./router/index')
const blogRouter = require('./router/blog') /* อย่าลืม module.exports = router */

app.use('/', indexRouter) //เมื่อเจอ / ให้ไปเรียก indexRouter
app.use('/blog', blogRouter) //เมื่อเจอ / ให้ไปเรียก indexRouter

//2 ด้านบนคือการ group path



app.listen(3000, () => {
  console.log('Start server at port 3000.')
})













// // ดึงข้อมูล json มาเก็บไว้ในตัวแปร
// const article = require('./article-db')

// app.get('/', (req, res) => {
//   res.send('Hello World 5555')
// })


/* ------  npm install -g nodemon ช่วยให้ reset ได้ ----- */

// // กำหนดให้ path blogapi แสดงข้อมูลบทความทั้งหมดในรูปแบบ json

// app.get('/blogapi', (req, res) => {
//   console.log(req.query)
//   res.json(article)
// })

// // กำหนดให้ path blogapi/id แสดงข้อมูลบทความตาม id ที่กำหนด
// // '/blogapi/:id'  [id] คือ path parameter 
// app.get('/blogapi/:id/:name', (req, res) => {
//   console.log(req.params)
//   res.json(article.find(article => article.id === req.params.id))
//   //req ส่งมาจาก client
//   ///req.params.id จำ*******************
//   //ซึ่ง id นำมาจาก path parameter 
// })


// //path   ---> /blogapi/?name=urang&list[]=1&list[]=2&list[]=3