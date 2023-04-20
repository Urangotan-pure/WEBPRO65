const express = require('express')
const app = express()

//Middleware มีลักษณะเป็นfunction 

const myLogger = function (req, res, next) {
    console.log(`LOGGED @ ${req.originalurl} on ${new Date()}`);
    //เมื่อจบบรรทัดด้านบน เราต้องบอก  middleware  ว่าให้ทำงานถัดไป
    next()
}

const requestTime = function (req, res, next) {
    req.requestTime = new Date()
    next()
}

// การมาใส่ myLogger ทุก path เปป็นสิ่งที่ไม่ควรทำ
// app.get('/', myLogger, (req, res) => {
//     let responseText = 'Hello, class WEBPRO?'
//     res.send(responseText)
// })

// app.get('/profile', myLogger, (req, res) => {
//     let responseText = "HI, i'm monkey"
//     res.send(responseText)
// })

app.use(myLogger)  //ตรงนี้เป็นการเรียก ทุกครั้งก่อนไปทำตาม path  แต่ถ้าเราไม่มี path นั้นมันก็อาจจะเกิด error ได้ เพราะมันหา path ที่จะ next ไม่เจอ
app.use(requestTime)  //อันนี้เรียกใช้ function เพื่อให้ path นั้นๆ นำไปใช้ได้

app.get('/', (req, res, next) => {
    let responseText = 'Hello, class WEBPRO?' + ' @ ' + req.requestTime
    // res.send(responseText)
    req.responseText = responseText
    next();
})

app.get('/profile', (req, res, next) => {
    let responseText = "HI, i'm monkey" + ' @ ' + req.requestTime
    // res.send(responseText)
    req.responseText = responseText
    next();
})

//ต้องการจบ middleware circle
app.use((req,res,next) => {
    res.send(req.responseText)
})

app.listen(3000)