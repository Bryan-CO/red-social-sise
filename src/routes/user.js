import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permsRequired } from '../middlewares/validatePerms.js';
import { ChatController } from '../controllers/chat.js';

export const userRouter = Router();

userRouter.get('/', authRequired, UserController.getAll);

userRouter.get('/:id', authRequired, UserController.getById);

userRouter.post('/', authRequired, UserController.create);

userRouter.patch('/:id', authRequired, UserController.update);

userRouter.delete('/:id', authRequired, permsRequired, UserController.delete);

// CHATS

userRouter.get('/:id/chats', authRequired, ChatController.getAllByUser);
