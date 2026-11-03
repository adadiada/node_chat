import React, { useState } from 'react';

export const App = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [comment, setComment] = useState('');

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
    body: JSON.stringify({ name: roomName.trim() })
  });

    if (!response.ok) {
     return ('Failed to create room')
    }

    const newRoom = await response.json();
    setRoom([...room, newRoom]);  // додаємо нову кімнату
    setRoomName('');  // очищуємо інпут
};

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
           onClick={()=>createRoom(roomName)}
        >
          <span>+</span>
         </button>
       </div>

       <div className="roomsection">
         <ul className="roomList">
           {rooms.map((r) => {
             <li
               key="r.id"
               className="roomListByOne"
             ></li>
           })}
        </ul>
      </div>

       {/*
       <div className="messages-list">
         {messages.map((msj) => {
           <div key={msj.id}>{msj.text}</div>
         })}
      </div> */}

      <form className="message-form" action="">
        <input type="text" placeholder="Введіть повідомлення" />
        <button type="submit">Send</button>
      </form>
    </aside>
  );
};



// import React, { useState, useEffect } from 'react';
// import cn from 'cn';

// // Описываем типы для комнаты
// interface Room {
//   id: string;
//   name: string;
// }

// interface SidebarProps {
//   onRoomSelect?: (roomId: string) => void;
// }

// export const App: React.FC<SidebarProps> = ({ onRoomSelect }) => {
//   // --- СОСТОЯНИЕ (STATE) ---
//   const [username, setUsername] = useState<string>('Гість');
//   const [activeRoomId, setActiveRoomId] = useState<string>('1');
//   const [rooms, setRooms] = useState<Room[]>([
//     { id: '1', name: 'загальний-чат' },
//     { id: '2', name: 'флудилка' },
//     { id: '3', name: 'програмування-node-js-react' },
//   ]);

//   // 1. Извлекаем имя пользователя из localStorage при монтировании
//   useEffect(() => {
//     const savedName = localStorage.getItem('chat_username');
//     if (savedName) {
//       setUsername(savedName);
//     }
//   }, []);

//   // --- ХЕНДЛЕРЫ ДЛЯ УПРАВЛЕНИЯ КОМНАТАМИ (CRUD) ---

//   // Создать комнату
//   const handleCreateRoom = () => {
//     const roomName = prompt('Введіть назву для нової кімнати:');
//     if (!roomName || !roomName.trim()) return;

//     const newRoom: Room = {
//       id: Date.now().toString(),
//       name: roomName.trim().toLowerCase().replace(/\s+/g, '-'),
//     };

//     setRooms((prevRooms) => [...prevRooms, newRoom]);
//     setActiveRoomId(newRoom.id);
//     if (onRoomSelect) onRoomSelect(newRoom.id);
//   };

//   // Переименовать комнату
//   const handleRenameRoom = (e: React.MouseEvent, room: Room) => {
//     e.stopPropagation(); // Останавливаем всплытие, чтобы не срабатывал клик по самой комнате
//     const newName = prompt('Введіть нову назву кімнати:', room.name);
//     if (!newName || !newName.trim()) return;

//     setRooms((prevRooms) =>
//       prevRooms.map((r) =>
//         r.id === room.id ? { ...r, name: newName.trim() } : r,
//       ),
//     );
//   };

//   // Удалить комнату
//   const handleDeleteRoom = (e: React.MouseEvent, room: Room) => {
//     e.stopPropagation();
//     if (!confirm(`Ви впевнені, що хочете видалити кімнату "${room.name}"?`))
//       return;

//     const updatedRooms = rooms.filter((r) => r.id !== room.id);
//     setRooms(updatedRooms);

//     // Если удалили активную комнату, переключаемся на первую оставшуюся
//     if (activeRoomId === room.id) {
//       const nextActiveId = updatedRooms.length > 0 ? updatedRooms[0].id : '';
//       setActiveRoomId(nextActiveId);
//       if (onRoomSelect) onRoomSelect(nextActiveId);
//     }
//   };

//   // Клик по комнате (Выбор комнаты)
//   const handleRoomClick = (roomId: string) => {
//     setActiveRoomId(roomId);
//     if (onRoomSelect) onRoomSelect(roomId);
//   };

//   // Выход из системы (Logout)
//   const handleLogout = () => {
//     if (confirm('Вийти з акаунту?')) {
//       localStorage.removeItem('chat_username');
//       // Имитируем переход на страницу логина
//       window.location.href = '/login';
//     }
//   };

//   return (
//     <aside className="sidebar">
//       {/* 1. Действие создания комнаты */}
//       <div className="sidebar-header">
//         <button
//           className="btn-create-room"
//           id="btn-create-room"
//           onClick={handleCreateRoom}
//         >
//           <span>+</span> Створити кімнату
//         </button>
//       </div>

//       {/* 2. Динамический список комнат */}
//       <div className="rooms-section">
//         <h4 className="section-title">Текстові Кімнати</h4>
//         <ul className="rooms-list" id="rooms-list">
//           {rooms.map((room) => (
//             <li key={room.id}>
//               <a
//                 href={`#room-${room.id}`}
//                 className={classNames('room-item', {
//                   active: room.id === activeRoomId,
//                 })}
//                 onClick={() => handleRoomClick(room.id)}
//               >
//                 <span className="room-name">{room.name}</span>
//                 <div className="room-actions">
//                   <button
//                     className="action-btn"
//                     title="Перейменувати"
//                     onClick={(e) => handleRenameRoom(e, room)}
//                   >
//                     ✏️
//                   </button>
//                   <button
//                     className="action-btn"
//                     title="Видалити"
//                     onClick={(e) => handleDeleteRoom(e, room)}
//                   >
//                     ❌
//                   </button>
//                 </div>
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 3. Профиль текущего пользователя */}
//       <div className="sidebar-footer">
//         <div className="user-info">
//           <span className="username-display" id="user-display-name">
//             {username}
//           </span>
//           <span className="user-status">в мережі</span>
//         </div>
//         <button
//           className="btn-logout"
//           id="sidebar-logout-btn"
//           title="Вийти з акаунту"
//           onClick={handleLogout}
//         >
//           Вихід
//         </button>
//       </div>
//     </aside>
//   );
// };
