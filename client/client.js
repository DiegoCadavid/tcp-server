const readline = require("node:readline");
const { stdin, stdout } = require("node:process");
const { Socket } = require("node:net");

const PORT = 3000;
const socket = new Socket();
socket.setEncoding("utf-8");

const rl = readline.createInterface({ 
  input: stdin,
  output: stdout
 })

rl.on("line", (data) => {
  if(!socket.remoteAddress) return;
  socket.write(data);
})


socket.on("data", (data) => {
  console.log(data);
})

socket.on("error", (err) => {
  if(err.code == "ECONNRESET" ) {
    console.log("Connection force Disconnected | trying connect to server in one second...")
    setTimeout(() => {
      socket.connect({ port: PORT }, () => {
        console.log("Connected to server again")
      })
    },1000)
  }
})

socket.on("close", (isErr) => {
  if(!isErr) {
    console.log("User Disconnected!")
    process.exit(0);
  }
})

socket.connect({ port: PORT }, () =>{
  console.log(`Connected to server!!`)
})


