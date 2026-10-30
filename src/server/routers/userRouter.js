import express from 'express';
import { userController } from '../controllers/users.controller.js';

export const usersRouter = new express.Router();

usersRouter.get('/', userController.getAll);
usersRouter.get('/:id', userController.getById);
