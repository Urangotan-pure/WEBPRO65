const express = require("express")
const session = require("express-session")
const path = require("path")
const app = express();

// Statics
app.use(express.static('static'))

//setting for express-session
app.use(session({
  secret: 'cute cat',
  resave: false,
  saveUninitialized: true
}))

// set the view engine to ejs
app.set('view engine', 'ejs')
// set root folder for views
app.set('views', path.join(__dirname, 'views'))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//check ว่ามี การสมัครเข้าสู่ระบบยัง?
// อันนี้เรียกว่า ทำ middleware
function requiredLogin(req, res, next) {
  if(!req.session.user){
    res.redirect('/login')
  }else{
    next()
  }
}

//middleware ซึ่งจะถูกเรียกใช้ก่อน routes อื่นๆ
app.use(function(req, res, next) {
  res.locals.user = req.session.user
  next()//next ตรงนี้จะไปทำ index ต่อ 
})

//เพื่อให้ redirect มาที่ index
app.get('/',requiredLogin ,function(req, res, next) {
  // สามารถส่งค่าไปให้ index ได้
  res.render('index')
  // res.render('index', {
  //   user: req.session.user
  //   // แต่การส่งแบบนี้ไม่ค่อยดี / นิยม --> ควรใช้ middleware
  // }
  // )
})

//เปิดหน้า เรียกดู
app.get('/login', function (req, res, next) {
  res.render('login')
});

//เก็บค่า
app.post('/login', function (req, res, next) {
  username = req.body.username // ดูที่ name='username'
  password = req.body.password // ดูที่ name='password'

  //check username & password ว่าถูกต้องตามต้องการหรือไม่
  if(username === "admin" && password === "admin123"){
    if(!req.session.user){
      req.session.user = {
        username: 'admin',
        firstname: 'Urang',
        lastname: 'Otan',
        role: 'admin'
      }
    }
    res.redirect('/')
  }
  else{
    res.render('login', {
      error : 'ชื่อหรือรหัสไม่ถูกต้อง'
    })
  }
});

app.get('/logout', requiredLogin, function (req, res, next) {
  req.session.user = null;
  res.redirect('login');
});

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})