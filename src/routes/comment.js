import { Router } from 'express';
import { CommentController } from '../controllers/comment.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permsRequired } from '../middlewares/validatePerms.js';

export const commentRouter = Router();

commentRouter.get('/:id', authRequired, CommentController.getById);

commentRouter.get('/:id/answers', authRequired, CommentController.getAnswerById);

commentRouter.patch('/:idComment', authRequired, CommentController.update);

commentRouter.delete('/:idComment', authRequired, permsRequired, CommentController.delete);
