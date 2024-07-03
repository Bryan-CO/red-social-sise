import { Router } from 'express';
import { ChatController } from '../controllers/chat.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permsRequired } from '../middlewares/validatePerms.js';
import { MemberController } from '../controllers/member.js';

export const chatRouter = Router();

chatRouter.get('/', authRequired, ChatController.getAll);

chatRouter.get('/:id', authRequired, ChatController.getById);

chatRouter.post('/', authRequired, ChatController.create);

chatRouter.patch('/:id', authRequired, ChatController.update);

chatRouter.delete('/:id', authRequired, ChatController.delete);

// MEMBERS

chatRouter.get('/:id/members', authRequired, MemberController.getAllMembers);

chatRouter.post('/:id/members', authRequired, MemberController.addMember);

chatRouter.delete('/:id/members/:user', authRequired, MemberController.delete);