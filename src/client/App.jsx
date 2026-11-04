import { useEffect, useState } from 'react';

export const App = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName')
  });

  useEffect(() => {
  if (userName) {
    localStorage.setItem('userName', userName);
  }
  }, [userName]);

  useEffect(() => {
  const socket = new WebSocket('ws://localhost:3005');
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      type: 'setUsername',
      username: 'Hanna',
    }));
  });
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
  });
  return () => socket.close();
}, []);

  function handleSubmit(event) {
    event.preventDefault();
  }

  function validateRoom(value) {
    if (!value) return 'Room is required';
    if (value.length < 3) return 'Name must be at least 3 characters';
    return '';
  }

  const createRoom = async (roomName) => {
    const response = await fetch('http://localhost:3005/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: roomName.trim() }),
    });

    if (!response.ok) {
      return 'Failed to create room';
    }

    const newRoom = await response.json();
    console.log({ newRoom });
    setRooms((currentRooms) => [...currentRooms, newRoom]);
    setRoomName(''); // очищуємо інпут
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('http://localhost:3005/room');
      const data = await response.json();

      console.log({ data });
      setRooms(data);
    };

    fetchRooms();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebaHeader">
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

      <div className="roomsection">
        <ul className="roomList">
          {rooms.map((room) => {
            return (
              <li key={room.id} className="roomListByOne">
                {room.name}
              </li>
            );
          })}
        </ul>
      </div>

       <div className="messages-list">
         {messages.map((message) => {
           <div key={message.id}>{message.text}</div>
         })}
      </div>

      <form className="message-form" action="">
        <input type="text" placeholder="Введіть повідомлення" />
        <button type="submit">Send</button>
      </form>
    </aside>
  );
};

