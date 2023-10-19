const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let rooms = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Usuário conectado');


  socket.on('create', (room) => {
    if (!room) return
    rooms.push({
      name: room,
      createdAt: new Date(),
      user: socket.id
    })
    socket.emit('ListRooms', rooms)
    console.log(`Usuário criou a sala: ${room}`);
  });

  socket.on('reqListRooms', () => {
    socket.emit('resListRooms', rooms)
  })


  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Usuário entrou na sala: ${room}`);
  });

  socket.on('message', (data) => {
    io.to(data.room).emit('message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

function listRooms(socket) {

}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor is running at ${PORT}!`);
});
