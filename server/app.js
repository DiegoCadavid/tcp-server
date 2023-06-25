const { Server, Socket } = require('node:net');
const PORT = 3000;

const server = new Server();

// { socket, remoteSocket }

const clients = [];

server.on("connection", (socket) => {
  socket.setEncoding("utf-8")
  const remoteSocket = `${socket.remoteAddress == "::1" ? "localhost" : socket.remoteAddress}:${socket.remotePort}`
  console.log(`${remoteSocket} connected `)
  clients.push({
    socket,
    remoteSocket
  });

  socket.on("data", (data) => {
    if (data === "END") {
      socket.end();
      return;
    }

    clients.filter(c => c.remoteSocket !== remoteSocket).forEach((c) => {
      c.socket.write(`${remoteSocket} -> ${data}`);
    });
    console.log(`${remoteSocket} -> ${data}`);
  })

  socket.on("error", (err) => {
    if (err.code == "ECONNRESET") {
      console.log(`${remoteSocket} force disconnected!`);
    }
  })

  socket.on("close", () => {
    console.log(`${remoteSocket} Disconnected`);
  })
})

server.listen({ port: PORT, HOST: "0.0.0.0" }, () => {
  const address = server.address()
  console.log(`Server init in port ${address.port}`);
})