import { usersService } from './../services/users.service.js';

const getAll = (req, res) => {
  return res.json(usersService.getAll());
};

const getById = (req, res) => {
  const { id } = req.params;
  const user = usersService.getById(id);

  if (!user) {
    return res.status(404).send({ message: 'Not found' });
  }

  return res.json(user);
};

export const usersController = {
  getAll,
  getById,
};
