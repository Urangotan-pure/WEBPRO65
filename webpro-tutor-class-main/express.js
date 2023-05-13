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

app.get('/get_todo', async (req, res, next) => {
    const [data] = await pool.query('SELECT * FROM todo')
    return res.send(data)
})

app.delete('/todo/:id', async (req, res, next) => {
    const id = req.params.id;
    console.log(id)

    //การ select ข้อมูลไม่ต้องสร้าง Transaction
    const [todo] = await pool.query('SELECT * FROM todo WHERE id=?', [id])
    console.log(todo)

    if (!todo.length) {
        return res.status(404).send({
            "message": "ไม่พบ ToDo ที่ต้องการลบ"
        })
    }

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        const [data] = await pool.query('DELETE FROM todo WHERE id=?', [id])
        res.send({
            "message": `ลบ ToDo '${todo[0].title}' สำเร็จ`,
        })
        await conn.commit()


    } catch (error) {
        await conn.rollback()
        res.send(error)
    } finally {
        conn.release()
    }


})


//------------------------------ ส่วนของการเรียกดูค่า ระหว่าง วัน x ถึง วัน  y ------------------------------------
const dateJoi = Joi.object({
    //เช็คว่าต้องมีข้อมูล "วันเริ่ม" และต้องเป็นวันที่
    start_date: Joi.date().required(),
    //เช็คว่า "วันสิ้นสุด" ต้องมีข้อมูล และ "วันเริ่ม" มีค่ามากกว่า "วันสิ้นสุด"  
    end_date: Joi.date().required().min(Joi.ref('start_date'))


    // end_date: Joi.date().required().when('start_date', {
    //     is: Joi.date().required(),
    //     then: Joi.date().min(Joi.ref('start_date')).required()
    // })
});


app.get('/todo', async (req, res, next) => {
    const result = dateJoi.validate(req.query)
    if (result.error) {
        console.log(result.error.details)
        return res.status(400).send(result.error.details)
    }

    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    // console.log(start_date)
    // console.log(end_date)

    const [data1] = await pool.query('SELECT * , DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date FROM todo WHERE due_date BETWEEN ? AND ?', [start_date, end_date])
    return res.send(data1)
})


//---------------------------- ส่วนการ POST ลง database -------------------------
const signupSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
}).unknown()

app.post('/todo', async (req, res, next) => {

    try {
        await signupSchema.validateAsync(req.body, { abortEarly: false }) //ให้ทำการcheckทุกเงื่อนไขก่อน
    } catch (error) {
        return res.status(400).json({
            "message": "ต้องกรอก title"
          })
    }

    const order = await pool.query("SELECT MAX(`order`) as 'max' FROM todo")
    console.log(order[0][0].max) //ตั้งเป็นตัวแปรแล้วเรียกใช้
    // console.log(order[0]);

    const user_id = await pool.query("SELECT MAX(`id`) as 'max' FROM todo")
    console.log(user_id[0][0].max) //ตั้งเป็นตัวแปรแล้วเรียกใช้
    // console.log(user_id[0]);

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.due_date;
    console.log(date);

    try {
        //date ไม่มีค่า ---> ใช้เวลาปัจจุบัน
        if (!date) {
            const [insert] = await pool.query('INSERT INTO todo (title, description, due_date, `order`) VALUES(?, ?,CURRENT_TIMESTAMP,?);', [title, description, (order[0][0].max)+1])
            // console.log("date")
        }
        //date มีค่า
        else {
            const [insert] = await pool.query('INSERT INTO todo (title, description, due_date,  `order`) VALUES(?, ?, ?, ?);', [title, description,date, (order[0][0].max)+1 ])
        }
        //หลังจาก INSERT เข้าไปเสร็จแล้ว
        await conn.commit()
        //ทำการส่งค่าที่รับเข้ามาใหม่
        res.status(201).send({
            "message": `สร้าง ToDo'${title}' สำเร็จ`,
            "todo": {
                "id": (user_id[0][0].max)+1,
                "title": title,
                "description": description,
                "due_date": date,
                "order": (order[0][0].max)+1
            }
        })
    } catch (error) {
        await conn.rollback()
        res.send(error)
    } finally {
        conn.release()
    }


})

module.exports = app;
