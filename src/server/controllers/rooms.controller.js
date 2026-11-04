import { roomsService } from '../services/rooms.service.js';

const getAll = (req, res) => {
  return res.json(roomsService.getAll());
};

const getById = (req, res) => {
  const { id } = req.params;
  const room = roomsService.getById(id); // шукаєш кімнату за id

  if (!room) {
    return res.status(404).send({ message: 'Not found' });
  }

  return res.json(room);
};

const create = async (req, res) => {
  const { name, userName } = req.body;

  if (!userName || !name) {
    return res.status(400).send({ message: 'Need write name and username' });
  }

  const roomCreate = await roomsService.create({
    userName,
    name,
  });

  if (!roomCreate) {
    return res.status(404).send({ message: 'Create room' });
  }
  console.log('roomCreate', roomCreate);

  return res.status(201).json(roomCreate);
};

const upDate = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ message: 'Updata name' });
  }

  const newRoom = roomsService.create(name);

  return res.status(201).json(newRoom);
};

const deletedRoomById = (req, res) => {
  const { id } = req.params;
  const deletedRoom = deleteById(+id); //Знайти кімнату за ID

  if (!deletedRoom) {
    return res.status(404).json({ message: 'Room not found' });
  }

  res.json(deletedRoom);
};

export const roomsController = {
  getAll,
  getById,
  create,
  deletedRoomById,
  upDate,
};
