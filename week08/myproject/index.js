const express = require('express') //เป็นการนำมาใช้งาน
const app = express() /// instance
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World5!')
})

// รับฟัง
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})