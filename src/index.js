'use strict';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import { usersRouter } from './server/routers/usersRouter.js';
import { roomsRouter } from './server/routers/roomsRouter.js';

const PORT = process.env.PORT || 3005;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(process.cwd())));

app.use('/user', usersRouter);
app.use('/room', roomsRouter);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

const wss = new WebSocketServer({ server });

const rooms = {
  'room-id': { name: 'General', messages: [] }, //зберігаю повідомлення разом з кімнатою
};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'setUsername':
        ws.username = data.username; // зберігаєш ім'я для цього з'єднання
        break;

      case 'createRoom':
        const roomId = uuid(); //створити унікальний ID
        rooms[roomId] = { name: data.name, messages: [] }; // створюєш кімнату в rooms
        ws.roomId = roomId;
        ws.send(JSON.stringify({ type: 'rooCreated', roomId })); // треба відправити roomId назад клієнту
        break;

      case 'sendMessage': // відправляєш тільки в цю кімнату
        rooms[data.roomId].messages.push({
          // додаєш повідомлення в масив кімнати
          author: data.author,
          text: data.text,
          time: data.time,
        });
        break;

      case 'joinRoom':
        ws.roomId = data.roomId;
        ws.send(
          JSON.stringify({
            type: 'oldMessages',
            messages: rooms[data.roomId].messages,
          }),
        );
        break;
    }
  });
});
