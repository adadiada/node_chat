'use strict';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

const PORT = process.env.PORT || 3005;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(process.cwd(), 'public')));

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
        // зберігаєш ім'я для цього з'єднання
        ws.username = data.username;
        break;
      case 'createRoom':
        const roomId = uuid(); //створити унікальний ID
        rooms[roomId] = { name: data.name, messages: [] }; // створюєш кімнату в rooms
        break;
      case 'sendMessage': // додаєш повідомлення в масив кімнати
        // відправляєш тільки в цю кімнату
        rooms[data.roomId].messages.push({
          author: data.author,
          text: data.text,
          time: data.time,
        });
        break;
    }

    ws.roomId = data.roomId; //Зберігати користувачa yakiy приєднується до кімнати
    for (const client of wss.clients) {
      if (client.roomId === data.roomId) {
        client.send(JSON.stringify(data));
      }
    }
  });
});
