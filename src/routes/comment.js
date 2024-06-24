import { Router } from 'express';
import { CommentController } from '../controllers/comment.js';

export const commentRouter = Router();

commentRouter.patch('/:idComment', CommentController.update);

commentRouter.delete('/:idComment', CommentController.delete);