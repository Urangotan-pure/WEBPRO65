const { Router } = require('express');
const e = require('express');
const express = require('express');
const app = express();
const Joi = require("joi"); //+

const pool = require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** 
 *  เริ่มทำข้อสอบได้ที่ใต้ข้อความนี้เลยครับ
 * !!! ไม่ต้องใส่ app.listen() ในไฟล์นี้นะครับ มันจะไป listen ที่ไฟล์ server.js เองครับ !!!
 * !!! ห้ามลบ module.exports = app; ออกนะครับ  ไม่งั้นระบบตรวจไม่ได้ครับ !!!
*/

app.get('/get_todo', async (req,res,next) => {
    const [data] = await pool.query('SELECT * FROM todo')
    return res.send(data)
})

app.delete('/todo/:id', async (req,res,next) => {
    const id = req.params.id;
    console.log(id)

    //การ select ข้อมูลไม่ต้องสร้าง Transaction
    const [todo] = await pool.query('SELECT * FROM todo WHERE id=?', [id])
    console.log(todo)

    if(!todo.length){
        return res.status(404).send({
            "message": "ไม่พบ ToDo ที่ต้องการลบ"
          })
    }

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try{
       const [data] = await pool.query('DELETE FROM todo WHERE id=?',[id])
       res.send({
            "message": `ลบ ToDo '${todo[0].title}' สำเร็จ`,
          })
       await conn.commit()


    }catch(error){
        await conn.rollback()
        res.send(error)
    }finally{
        conn.release()
    }


})


const dateJoi = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required().min(Joi.ref('start_date'))
    // end_date: Joi.date().required().when('start_date', {
    //     is: Joi.date().required(),
    //     then: Joi.date().min(Joi.ref('start_date')).required()
    // })
});

app.get('/todo', async (req,res, next) =>{
    const result = dateJoi.validate(req.query)
    if(result.error){
        console.log(result.error.details)
        return res.status(400).send(result.error.details)
    }

    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    console.log(start_date)
    console.log(end_date)

    const [data1] = await pool.query('SELECT * , DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date FROM todo WHERE due_date BETWEEN ? AND ?', [start_date, end_date])
    return res.send(data1)
})

const signupSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
}).unknown()

app.post('/todo', async (req,res,next)=>{

    try{
        await signupSchema.validateAsync(req.body, { abortEarly: false }) //ให้ทำการcheckทุกเงื่อนไขก่อน
    }catch(error){
        return res.status(400).json(error)
    }

    const order = await pool.query("SELECT MAX(`order`) as 'max' FROM todo")
    console.log(order[0][0].max)

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.due_date;
    
    try{
        if(!date){
            const [insert] = await pool.query('INSERT INTO todo (title, description, due_date) VALUES(?, ?,CURRENT_TIMESTAMP);', [title,description])
            // console.log("date")
        }else{
            const [insert] = await pool.query('INSERT INTO todo (title, description, due_date) VALUES(?, ?,?);', [title,description,date])
        }
        await conn.commit()
        res.send({
            "message": "สร้าง ToDo 'อ่านหนังสือสอบ Web Pro' สำเร็จ",
            "todo": {
              "id": 1,
              "title": "อ่านหนังสือสอบ Web Pro",
              "description": "อ่านเกี่ยวกับ JS และ Vue JS",
              "due_date": "2023-05-01",
              "order": 1
            }
          })
    }catch(error){
        await conn.rollback()
        res.send(error)
    }finally{
        conn.release()
    }

    
})

module.exports = app;
