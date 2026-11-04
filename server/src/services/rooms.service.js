let rooms = [];

const getAll = () => {
  return rooms;
};

const getById = (id) => {
  // console.log('id', typeof id);
  return rooms.find((room) => room.id === +id) || null;
};

const createRoom = async ({ name, userName }) => {
  const room = {
    id: Date.now(),
    name,
    messages: [],
    userName,
  };

  rooms.push(room);

  return room;
};

const deleteById = (id) => {
  const index = rooms.findIndex((room) => room.id === id);

  if (index === -1) return;

  const [room] = rooms.splice(index, 1);

  return room;
};

export function update({ id, room }) {
  const roomUpdate = rooms.find((r) => r.id === id);

  if (!roomUpdate) return;

  return Object.assign(roomUpdate, { room });
}

export const roomsService = {
  getAll,
  getById,
  createRoom,
  deleteById,
};
