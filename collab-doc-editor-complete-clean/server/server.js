const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinDoc', (docId) => {
    socket.join(docId);
    console.log(`User joined document: ${docId}`);
  });

  socket.on('docUpdate', ({ docId, content }) => {
    socket.to(docId).emit('docUpdate', content);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});