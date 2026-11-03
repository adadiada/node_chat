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
  const { name, userId } = req.body;

  if (!userId || !name) {
    return res.status(400).send({ message: 'Bad request' });
  }
  // Перевірка чи існує користувач

  const room = roomsService.getById(userId);

  if (!room) {
    return res.status(400).send({ message: 'Bad request' });
  }

  const roomCreate = roomsService.create({
    userId,
    name,
  });

  if (!roomCreate) {
    return res.status(404).send({ message: 'Not found' });
  }

  res.status(201).json(roomCreate);
};

const upDate = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ message: 'Bad request' });
  }

  const newRoom = roomsService.create(name);

  res.status(201).json(newRoom);
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
