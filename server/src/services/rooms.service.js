import { v4 as uuid } from 'uuid';

let rooms = [];

const getAll = () => {
  return rooms;
};

const getById = (id) => {
  // console.log('id', typeof id);
  return rooms.find((room) => room.id === +id) || null;
};

const createRoom = async ({ name }) => {
  console.log('name', name);
  const room = {
    id: uuid(),
    name,
    messages: [],
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

const update = async ({ id, name }) => {
  const roomUpdate = rooms.find((r) => r.id === id);

  if (!roomUpdate) {
    return;
  }

  return await Object.assign(roomUpdate, { name });
};

export const roomsService = {
  getAll,
  getById,
  createRoom,
  deleteById,
  update,
};
