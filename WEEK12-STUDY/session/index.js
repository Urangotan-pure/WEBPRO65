const express = require("express")
const path = require("path")
const app = express();

// Statics
app.use(express.static('static'))

// set the view engine to ejs
app.set('view engine', 'ejs')
// set root folder for views
app.set('views', path.join(__dirname, 'views'))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})