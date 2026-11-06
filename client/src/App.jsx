import { useRef } from 'react';
import { useEffect, useState } from 'react';

export const App = () => {
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(''); // Стейт для текущей комнаты
  const [inputMessage, setInputMessage] = useState(''); // Стейт для инпута сообщения
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName')
  });

  const ws = useRef(null);

  // userName с localStorage
  useEffect(() => {
  if (userName) {
    localStorage.setItem('userName', userName);
  }
  }, [userName]);

  useEffect(() => {
  const socket = new WebSocket('ws://localhost:3005');
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      type: 'setUserName',
      username: 'Hanna',
    }));
  });
    
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
      
      // Обработка истории сообщений при входе в комнату
        if (data.type === 'oldMessages') {
          setMessages(data.messages || []);
        }
     if (data.type === 'newMessage') {
          setMessages((currentMessages) => [...currentMessages, data.message]);
     }
     });
    
  return () => socket.close();
}, []);

  const createRoom = async (roomName) => { // HTTP POST: Создание комнаты
    if (!roomName.trim()) return;
      const response = await fetch('http://localhost:3005/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName.trim() }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      const newRoom = await response.json();
      setRooms((currentRooms) => [...currentRooms, newRoom]);
      setRoomName(''); // очищуємо інпут
  };

  useEffect(() => { //HTTP GET: Загрузка списка комнат при старте приложения 
    const fetchRooms = async () => {

        const response = await fetch('http://localhost:3005/room');
        const data = await response.json();
  
        console.log({ data });
        setRooms(data);
       };

    fetchRooms();
  }, []);

   // Функция для выбора и входа в комнату (Join Room)
   const handleJoinRoom = (roomId) => {
  setActiveRoomId(roomId);
  setMessages([]);
  if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    ws.current.send(JSON.stringify({
      type: 'joinRoom',
      roomId,
    }));
  }
   };
   
  
  const handleDeletRoom = async (id) => {
    await fetch(`http://localhost:3005/room/${id}`, {
       method: 'DELETE',
     });
  };
  
  const handleUpdateRoom = async (roomId, newName) => {
    await fetch(`http://localhost:3005/room/${roomId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
     });
  };
  
  // Функция для отправки текстового сообщения по WebSocket
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!inputMessage.trim() || !activeRoomId) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'sendMessage',
        roomId: activeRoomId,
        author: userName,
        text: inputMessage.trim(),
      }));
      setInputMessage(''); // очищаем инпут сообщения
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebaHeader">
        <section>
          <h2>Rooms</h2>
          <ul className="roomList">
            {rooms.map((room) => (
              <li key={room.id} style={{ cursor: 'pointer', padding: '3px' }}>
                <button onClick={() => handleJoinRoom(room.id)}>
                  {room.name}
                </button>
                <button type="button" onClick={() => handleDeletRoom(room.id)}>
                  x
                </button>
                <button type="button" onClick={() => handleUpdateRoom(room.id)}>
                  ✏️
                </button>
              </li>
            ))}
          </ul>
        </section>
        <div>
      </div>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room name"
        />
        <button
          type="button"
          className="btnCreateRoom"
          onClick={() => createRoom(roomName)}
        >
          <span>+</span>
        </button>
       </div>

        <div className="messagesList">
          {messages.map((message) => (
            <div key={message.id}>
              <strong>{message.author}</strong>
              <span>{message.text}</span>
            </div>
          ))}
        </div>

    <form className="messageForm" onSubmit={handleSendMessage}>
  <input
    type="text"
    value={inputMessage}
    placeholder="Введіть повідомлення"
    onChange={(e) => setInputMessage(e.target.value)}
  />
  <button type="submit">
    Send
  </button>
</form>
    </aside>
  );
};

