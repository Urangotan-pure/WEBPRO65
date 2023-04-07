const express = require("express");
const pool = require("../config");
const path = require("path");
const router = express.Router();
const multer = require("multer");

//ตั้งค่า multer
//destination เก็บรูป
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./static/uploads"); // path to save file
    },
    filename: function (req, file, callback) {
      // set file name
      callback(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  //กำหนดตัวแปรสำหรับเรียกใช้งาน
  const upload = multer({ storage: storage });

// Get comment
router.get('/:blogId/comments', function(req, res, next){
});

// Create new comment
router.post('/:blogId/comments', upload.single("comment_image"),async function(req, res, next){
    // return
    // create code here
    console.log("เข้าไหมมมมมมม")
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    const comment = req.body.comment;
    const like = req.body.like;

    const conn = await pool.getConnection()
    await conn.beginTransaction(); // เป็นการเริ่มให้ database เริ่มจำ

    try {
        console.log(req.params.blogId)
      //insert เข้าตาราง blog
      let results = await conn.query(
        "INSERT INTO comments(blog_id,`like`,comment,comment_date) VALUES(?,0,?,CURRENT_TIMESTAMP);",
        [req.params.blogId,comment]
      )
      
      const comment_id = results[0].insertId;

      //insert เข้าตาราง image
      await conn.query(
        "INSERT INTO images(blog_id, file_path, comment_id) VALUES(?, ?, ?);",
        [req.params.blogId, file.path.substr(6),comment_id ])

      // ถ้าทุก transaction เสร็จแล้ว ให้ทำการ ส่ง/เสร็จเลย
      await conn.commit()
      // res.send("success!");
      res.redirect('/blogs/' + req.params.blogId) //กลับไปที่หน้า index.js
    } catch (err) {
      //ถ้ามี query ใด query หนึ่งมีปัญหา/พัง ให้สถานะ database กลับไป
      await conn.rollback();
      next(err);
    } finally {
      console.log('finally')
      conn.release(); //ปิด transaction
    }
});

// Update comment
router.put('/comments/:commentId', function(req, res, next){
    return
});

// Delete comment
router.delete('/comments/:commentId', function(req, res, next){
    return
});

// Delete comment
router.put('/comments/addlike/:commentId', function(req, res, next){
    return
});


exports.router = router