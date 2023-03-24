const mysql = require('mysql2/promise');
//method  'createPool' ยืดหยุ่นกว่า
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'webpro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//export ออกไป
module.exports = pool;