const express = require("express");
const path = require("path")
const pool = require("../config");

const router = express.Router();

router.get('/', async function (req, res,next){
  const [rows, fields]  =await pool.query(
    'SELECT a.*, b.file_path FROM blogs AS a LEFT JOIN images AS b ON a.id = b.blog_id AND b.main = 1')
  res.render('index', {data : JSON.stringify(rows)}) //ส่งตัวแปร  blogs
})

// // For tutorial 1
// router.post("/blogs/addlike/:blogId", async function (req, res, next) {
//   // Your code here
// });

// // For tutorial 2
// router.get("/blogs/search", async function (req, res, next) {
//   // Your code here
// });

// // For inserting new blog
// router.post("/create", async function (req, res, next) {
//   // Your code here
// });

// For blog detail page
router.get("/detail/:blogId", async function (req, res, next) {
  // Your code here
  const [blogs, columns1]  = await pool.query(
    'SELECT * FROM blogs WHERE id = ?',
    [req.params.blogId])

    const [image, columns2]  = await pool.query(
    'SELECT * FROM images WHERE blog_id = ?',
    [req.params.blogId])

    const [comments, columns3]  = await pool.query(
      'SELECT * FROM comments WHERE blog_id = ?',
      [req.params.blogId])
  


  console.log(blogs)
  console.log(image)
  res.render('blogs/detail',{
    blog : JSON.stringify(blogs[0]),
    images : JSON.stringify(image),
    comments : JSON.stringify(comments),
  })
});

// // For updating blog
// router.put("/update/:blogId", function (req, res) {
//   // Your code here
// });

// // For deleting blog
// router.delete("/delete/:id", function (req, res) {
//   // Your code here
// });






// router.get('/', async function (req, res,next){
//   const [rows, fields]  =await pool.query('SELECT * FROM blogs')
//   console.log('-------------------------------SELECT---------------------------------------')
//   console.log('rows', rows)
//   console.log('----------------------------------------------------------------------')
//   res.render('index', {blogs: rows}) //ส่งตัวแปร  blogs
// })


// //--------------INSERT------------------
// router.get('/insert', async function (req, res,next){
//   const [rows, fields]  =await pool.query(
//     'INSERT INTO blogs(title, content, status, pinned, blogs.like) VALUES (?, ?, ?, ?,?)',
//     ['New title!', 'My content bla bla bla', '01', 1, 10]
//     )
//   console.log('rows', rows.insertId)
//   const [rows2, fields2]  =await pool.query('SELECT * FROM blogs')
//   res.render('index', {blogs: rows2}) //ส่งตัวแปร  blogs

//   console.log('---------------------------------INSERT-------------------------------------')
//   console.log('rows', rows2)
//   console.log('----------------------------------------------------------------------')
// })


// //--------------UPDATE------------------
// router.get('/update', async function (req, res,next){
//   const [rows, fields]  =await pool.query(
//     'UPDATE blogs SET blogs.like=? WHERE id > 3',
//     [30]
//     )
//   const [rows2, fields2]  =await pool.query('SELECT * FROM blogs')
//   res.render('index', {blogs: rows2}) //ส่งตัวแปร  blogs

//   console.log('---------------------------------UPDATE-------------------------------------')
//   console.log('rows: ', rows.affectedRows) //กระทบกี่ตัว
 //   console.log('rows', rows2)
//   console.log('----------------------------------------------------------------------')
// })

// //--------------DELETE------------------
// router.get('/delete/:id', async function (req, res,next){
//   const blogId = req.params.id  //get ค่า id 0kd path
//   const [rows, fields]  =await pool.query(
//     'DELETE FROM blogs WHERE id = ?',
//     [blogId]
//     )
//   const [rows2, fields2]  =await pool.query('SELECT * FROM blogs')
//   res.render('index', {blogs: rows2}) //ส่งตัวแปร  blogs

//   console.log('---------------------------------DELETE-------------------------------------')
//   console.log('affect-rows: ', rows.affectedRows) //กระทบกี่ตัว
//   console.log('changed-rows: ', rows.changedRows) //ที่กระทบเปลี่ยนแปลงไปกี่ตัว
//   console.log('rows', rows2)
//   console.log('----------------------------------------------------------------------')
// })



exports.router = router;
