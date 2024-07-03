import { Router } from 'express';
import { ChatController } from '../controllers/chat.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permsRequired } from '../middlewares/validatePerms.js';

export const chatRouter = Router();

chatRouter.get('/', authRequired, ChatController.getAll);

chatRouter.get('/:id', authRequired, ChatController.getById);

chatRouter.post('/', authRequired, ChatController.create);

chatRouter.patch('/:id', authRequired, ChatController.update);

chatRouter.delete('/:id', authRequired, ChatController.delete);
