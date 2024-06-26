import { Router } from 'express';
import { CommentController } from '../controllers/comment.js';

export const commentRouter = Router();

commentRouter.get('/:id', CommentController.getById);

commentRouter.get('/:id/answers', CommentController.getAnswerById);

commentRouter.patch('/:idComment', CommentController.update);

commentRouter.delete('/:idComment', CommentController.delete);
