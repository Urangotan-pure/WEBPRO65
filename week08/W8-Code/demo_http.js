var http = require('http'); //import modul http แล้วเก็บไว้ในตัวแปร

//create a server object: สร้างเว็บ server
http.createServer(function (req, res) {
  console.log('Got a request!')
  res.write('Hello World! 555'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080