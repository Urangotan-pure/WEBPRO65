const express = require("express");
const pool = require("../config");
const router = express.Router();

// Get comment
router.get('/:blogId/comments', function(req, res, next){
});

// Create new comment
router.post('/:blogId/comments', async function(req, res, next){
    const {
        comment,
        like,
        comment_by_id
    } = req.body
    const id = req.params.blogId
    try {
        const [rows2, fields2] = await pool.query("INSERT INTO comments(blog_id, comment, `like`, comment_date, comment_by_id) value(?, ?, ?, CURRENT_TIMESTAMP, ?)", 
        [
            id,
            comment,
            like,
            comment_by_id
        ]);
        return res.json({"message":`A new comment is added (ID: ${rows2.insertId})`})
    } catch (error) {
        console.log(error);
    }
    
});

// Update comment
router.put('/comments/:commentId', async function(req, res, next){
    const {
        comment,
        like,
        comment_date,
        comment_by_id,
        blog_id
    } = req.body
    const id = req.params.commentId
    try {
        const [rows2, fields2] = await pool.query("update `comments` set `comment` = ?, `like` = ?, `comment_date` = ?, `comment_by_id` = ?, `blog_id` = ? where `id`=?", 
        [
            comment,
            like,
            comment_date,
            comment_by_id,
            blog_id,
            id
        ]);
        console.log([
            comment,
            like,
            comment_date,
            comment_by_id,
            blog_id,
            id
        ]);
        return res.json({
            "message":`Comment ID ${id} is updated.`,
            "comment": {
                "comment": comment,
                "like": like,
                "comment_date": comment_date,
                "comment_by_id": comment_by_id,
                "blog_id": blog_id
            }
        })
    } catch (error) {
        console.log(error);
    }

});

// Delete comment
router.delete('/comments/:commentId', async function(req, res, next){
    const id = req.params.commentId
    try {
        const [rows2, fields2] = await pool.query("DELETE from comments WHERE id=?", 
        [
            id
        ]);
        return res.json({
            "message":`Comment ID ${id} is deleted.`,
        })
    } catch (error) {
        console.log(error);
    }
});

// Delete comment
router.put('/comments/addlike/:commentId', async function(req, res, next){
    const id = req.params.commentId
    try {
        const [rows, fields] = await pool.query("SELECT * FROM comments WHERE id=?", [
            id,
        ]);
        let likeNum = rows[0].like
        likeNum += 1
        const [rows2, fields2] = await pool.query("UPDATE comments SET comments.like = ? WHERE id = ?;", 
        [
            likeNum,
            id
        ]);
        return res.json({
            "blogId": rows[0].blog_id,
            "commentId": id,
            "likeNum": likeNum //5 คือจำนวน like ของ comment ที่มี id = 20 หลังจาก +1 like แล้ว
        })
    } catch (error) {
        console.log(error);
    }
});


exports.router = router