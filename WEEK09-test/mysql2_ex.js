

async function main(){
    const mysql = require('mysql2/promise');
    // create the connection
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'webpro',
    });

    
    //libary mmysql2 เพื่อส่ง query ไปที่ฐานข้อมูล เพื่อที่จะเรียกดูข้อมูลได้
    // return array ขนาด 2 ทั้งหมด
    //rows เก็บข้อมูลทั้งหมดจากฐานข้อมูล  *ส่วนมากสนใจอันนี้ เพราะสนใจที่เรา query เป็นหลัก
    //fields metadataของcolumn ของฐานข้อมูลที่เรา query
    
    try{
        const [rows, fields] = await conn.query('SELECT * FROM blogs')
        console.log('rows:', rows)
    }catch(err){
        console.log(err)
    }

    try{
        const [rows, fields] = await conn.query(
            'INSERT INTO `blogs`(title, content, status, pinned) VALUES(?, ?, ?, ?);',
            ['My new blog', 'TEST CONTENT', '01', 0]
        )
        console.log('affectedRows:', rows.affectedRows)
    }catch(err){
        console.log(err)
    }

    try{
        const [rows, fields] = await conn.query(
            'UPDATE `blogs` SET title = ?, content = ? WHERE id = ?;',
            ['My new blog 3', 'TEST CONTENT 2', 13]
        )
        console.log('changedRows:', rows.changedRows)
    }catch(err){
        console.log(err)
    }

}

main()