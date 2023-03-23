const mysql = require('mysql2/promise');
//method  'createPool' ยืดหยุ่นกว่า
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'MonKey3417',
  database: 'webpro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//export ออกไป
module.exports = pool;