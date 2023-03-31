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
router.get("/:blogId/comments", function (req, res, next) {});

router.post("/:blogId/comments", upload.single("comment_image"),async function (req, res, next) {
    // create code here
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
      conn.release();
    }
  }
);

// // Create new comment
// router.post("/:blogId/comments", async function (req, res, next) {
//   const { comment, like, comment_by_id } = req.body;
//   const id = req.params.blogId;
//   try {
//     const [rows2, fields2] = await pool.query(
//       "INSERT INTO comments(blog_id, comment, `like`, comment_date, comment_by_id) value(?, ?, ?, CURRENT_TIMESTAMP, ?)",
//       [id, comment, like, comment_by_id]
//     );
//     return res.json({
//       message: `A new comment is added (ID: ${rows2.insertId})`,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// Update comment
router.put("/comments/:commentId", async function (req, res, next) {
  const { comment, like, comment_date, comment_by_id, blog_id } = req.body;
  const id = req.params.commentId;
  try {
    const [rows2, fields2] = await pool.query(
      "update `comments` set `comment` = ?, `like` = ?, `comment_date` = ?, `comment_by_id` = ?, `blog_id` = ? where `id`=?",
      [comment, like, comment_date, comment_by_id, blog_id, id]
    );
    console.log([comment, like, comment_date, comment_by_id, blog_id, id]);
    return res.json({
      message: `Comment ID ${id} is updated.`,
      comment: {
        comment: comment,
        like: like,
        comment_date: comment_date,
        comment_by_id: comment_by_id,
        blog_id: blog_id,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete comment
router.delete("/comments/:commentId", async function (req, res, next) {
  const id = req.params.commentId;
  try {
    const [rows2, fields2] = await pool.query(
      "DELETE from comments WHERE id=?",
      [id]
    );
    return res.json({
      message: `Comment ID ${id} is deleted.`,
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete comment
router.put("/comments/addlike/:commentId", async function (req, res, next) {
  const id = req.params.commentId;
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM comments WHERE id=?",
      [id]
    );
    let likeNum = rows[0].like;
    likeNum += 1;
    const [rows2, fields2] = await pool.query(
      "UPDATE comments SET comments.like = ? WHERE id = ?;",
      [likeNum, id]
    );
    return res.json({
      blogId: rows[0].blog_id,
      commentId: id,
      likeNum: likeNum, //5 คือจำนวน like ของ comment ที่มี id = 20 หลังจาก +1 like แล้ว
    });
  } catch (error) {
    console.log(error);
  }
});

exports.router = router;
