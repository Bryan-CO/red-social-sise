import { Router } from 'express';
import { MessageController } from '../controllers/message.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permsRequired } from '../middlewares/validatePerms.js';

export const messageRouter = Router();

messageRouter.get('/', authRequired, MessageController.getAll);

messageRouter.get('/:id', authRequired, MessageController.getById);

messageRouter.patch('/:id', authRequired, MessageController.update);

messageRouter.delete('/:id', authRequired, MessageController.delete);