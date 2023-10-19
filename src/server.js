const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let rooms = []

// Roteamento para a página HTML do chat
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Conexão do Socket.io
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

  // Lógica para enviar mensagens
  socket.on('message', (data) => {
    io.to(data.room).emit('message', data.message);
  });

  // Lógica para desconectar
  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

function listRooms(socket) {

}

// Inicie o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
