import express from 'express';
import { roomsController } from '../controllers/rooms.controller.js';

export const roomsRouter = new express.Router();

roomsRouter.get('/', roomsController.getAll);
roomsRouter.get('/:id', roomsController.getById);
