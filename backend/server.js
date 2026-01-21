import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import "dotenv/config";


const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
  },
});

const ROOM = 'group';

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('joinRoom', async (userName) => {
        console.log(`${userName} is joining the group.`);

        await socket.join(ROOM);

        // broadcast
        socket.to(ROOM).emit('roomNotice', userName);
    });

    socket.on('chatMessage', (msg) => {
      socket.to(ROOM).emit("chatMessage", msg);
    });

    socket.on('typing', (userName) => {
        socket.to(ROOM).emit('typing', userName);
    });

    socket.on('stopTyping', (userName) => {
        socket.to(ROOM).emit('stopTyping', userName);
    });
});


server.listen(PORT, () => {
    console.log(`server is running`);
});
