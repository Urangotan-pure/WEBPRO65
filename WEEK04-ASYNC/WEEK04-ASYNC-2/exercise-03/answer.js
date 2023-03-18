// ข้อ 3.1
function getDogDemo() {
  // hint: เรียกใช้ getAPI() โดยดึงข้อมูลจาก url = https://dog.ceo/api/breeds/image/random
  // ลอง console.log() ดูว่าข้อมูลที่ได้มาเป็นอย่างไร
  url = "https://dog.ceo/api/breeds/image/random";
    getAPI(url,success,error)
      function success(res){
        console.log(res)
        setTimeout(()=>{
           document.getElementById("dogImg").src = res.message;
        },10000)
       
      }
      function error(error){
        console.log(error)
      }
    }


// ข้อ 3.2
function Rainbow() {
  //TODO
  // 1. ในกรณีที่ status = 'success' ให้แสดงตัวเลขเป็นสีตามที่กำหนดในแต่ละ STATE
  // 2. ให้แสดงชื่อ STATE (STATE 1 หรือ STATE 2 หรือ STATE 3) ในกล่องข้อความเมื่อเกิด Error
  // 3. เปลี่ยนสีข้อความเป็นสีแดงเมื่อเกิด Error (class = 'has-text-error')
  const rainbow = document.getElementById("rainbow")
 
  setTimeout(() => {
    // STATE 1 color = 'has-text-primary'
    var check = getResult();
    if(check.status == "success"){
      rainbow.innerHTML = check.text;
      rainbow.className = 'has-text-primary';
    }else{
      rainbow.innerHTML = "STATE1";
      rainbow.className = 'has-text-danger';
    }
      setTimeout(() => {
        // STATE 2 color = 'has-text-success'
        var check2 = getResult();
        if(check2.status == "success"){
          rainbow.innerHTML = check2.text;
          rainbow.className = 'has-text-success';

        }else{
          rainbow.innerHTML = "STATE2";
          rainbow.className = 'has-text-danger';
        }
        setTimeout(() => {
          // STATE 3 color = 'has-text-success' 
          var check3 = getResult();
          if(check3.status == "success"){
            rainbow.innerHTML = check3.text;
            rainbow.className = 'has-text-success';

          }else{
            rainbow.innerHTML = "STATE3";
            rainbow.className = 'has-text-danger';

          }
        }, 2000)

      }, 2000)

  }, 2000)


}

function getResult(){
  const num = Math.floor(Math.random() * 10)
  console.log(num)
  if(num > 5) {
    return {
      'status': 'success',
      'text': num
    }
  }else{
    return {
      'status': 'error',
      'text': num
    }
  }
}

// ข้อ 3.3
function evenNumber(num) {
  // hint : ทำการสร้าง promise และเรียกใช้
  let check = new Promise(
    function (resolve, reject){
      if(num % 2 == 0){
        const success = {
          text1 : 'success : ',
          text2 : num,
          text3 : ' is an even number'
        }
        resolve(success)
      }else{
        const error = {
          text1 : 'Error : ',
          text2 : num,
          text3 : ' is not an even number'
        }
        reject(error)
      }
    }
  )
  check.then((result)=>{
  document.getElementById("result").innerHTML = result.text1+result.text2+result.text3;
}).catch((error)=>{
  document.getElementById("result").innerHTML = error.text1+error.text2+error.text3;
})


}


// ข้อ 3.4
function task(id) {
  const delay = parseInt(Math.random() * 1000)
  return new Promise( function (resolve, reject){
      if(delay < 500 ){
        setTimeout(()=> {
        }, delay)
        resolve('task '+id+' : '+delay+'ms ... PASS')
      }else{
        setTimeout(()=> {
        }, delay)
        reject('task '+id+' : '+delay+'ms ... NOTPASS')
      }
    }
  )

}
function tester() {
  // hint : task(1).then().catch() ..... task(4)...
  // ต้องเรียก function task 4 ครั้ง เปลี่ยน id ไปเรื่อยๆ
  for (let i = 1; i <= 4; i++) {
    task(i).then((result)=>{
      console.log(result)
  }).catch((error)=>{
      console.log(error)
  })
  }
  
}

// ข้อ 3.5
// hint : เรียก getAPI() ที่ url = https://api.thecatapi.com/v1/images/search 
// อย่าลืม console.log() ดูข้อมูลที่ได้ด้วยว่ามีโครงสร้างแบบใด
function checkAuth(password) {
  return new Promise( function (resolve, reject){
    if(password == "Cisco"){
      resolve("รหัสผ่านถูกต้อง")
    }else{
      reject('รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง')
    }
  }
)
}

function fetchData(password) {
  checkAuth(password).then((result)=> {
    alert(result)
    url = "https://api.thecatapi.com/v1/images/search";
    getAPI(url,success,error)
    function success(res){
      // console.log(res[0])
      document.getElementById("cat").src = res[0].url;
    }
    function error(res){
      console.log(error)
    }
    
  }).catch((error)=>{
    alert(error)

  })
}

// GET API
function getAPI(url, success, error) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(this.response);
      success(res);
    } else if (this.readyState == 4) {
      const res = JSON.parse(this.response);
      error(res);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send();
}
