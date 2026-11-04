import express from 'express';
import { usersController } from './../controllers/users.controller.js';

export const usersRouter = new express.Router();

usersRouter.get('/', usersController.getAll);
usersRouter.get('/:id', usersController.getById);
