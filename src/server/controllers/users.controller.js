import { userService } from '../services/user.service.js';

const getAll = (req, res) => {
  return res.json(userService.getAll());
};

const getById = (req, res) => {
  const { id } = req.params;
  const user = userService.getById(id);

  if (!user) {
    return res.status(404).send({ message: 'Not found' });
  }

  return res.json(user);
};

export const userController = {
  getAll,
  getById,
};
