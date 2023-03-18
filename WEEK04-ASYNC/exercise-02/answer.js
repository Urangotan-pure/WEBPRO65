// ข้อ 2.1

function display(msg) {
    let div = document.getElementById('ex01-div')
    div.innerHTML = msg
}

function showConfirm(callback) {
    // You code here
    const msg_ok = "ยืนยันจ้า";
    const msg_cancel = "ไม่ดีกว่า";
    if (window.confirm("ok / cancel")) {
        display(msg_ok);
      }else{
        display(msg_cancel);
      }
}

// ข้อ 2.2
function start() {
    // hint: ส่ง callback function เข้าไปเป็น argument ของ setTimeout()
    setTimeout(R_start, 0);
    function R_start() {
        document.getElementById("start").innerHTML = "Program started"
        setTimeout(R_process, 2000);
    }
    function R_process() {
        document.getElementById("process").innerHTML = "Hello World"
        setTimeout(R_end, 3000);
    }
    function R_end() {
        document.getElementById("end").innerHTML = "Program ended"
    }
}

// ข้อ 2.3
function stopTime() {
    var min = Math.floor(document.getElementById("Time").value / 60)
    var sec = document.getElementById("Time").value % 60
    // console.log(min)
    // console.log(sec)

    var re = setInterval(display_low, 1000);
    function display_low() {
        if (sec == 0 && min == 0){
            clearTimeout(re)
        }
        if (sec < 60){
            if(sec < 10){
                document.getElementById("setSecond").innerHTML = "0"+sec;
            }else{
                document.getElementById("setSecond").innerHTML = sec;
            }
            sec--;
        }
        if (sec == -2 && min > 0){
            min--;
            sec = 59
            document.getElementById("setSecond").innerHTML = sec;
            sec--;
        }
        if(min < 10){
            document.getElementById("setMinute").innerHTML = "0"+min;
        }else{
            document.getElementById("setMinute").innerHTML = min;
        }
    }

}

