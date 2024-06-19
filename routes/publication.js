import { Router } from 'express';
import { PublicationController } from '../controllers/publication.js';
import { CommentController } from '../controllers/comment.js';
import { ReactionController } from '../controllers/reaction.js';

export const publicacionRouter = Router();

publicacionRouter.get('/', PublicationController.getAll);

publicacionRouter.get('/:id', PublicationController.getById);

publicacionRouter.post('/', PublicationController.create);

publicacionRouter.patch('/:id', PublicationController.update);

publicacionRouter.delete('/:id', PublicationController.delete);

publicacionRouter.get('/:id/comments', CommentController.getAll);

publicacionRouter.post('/:id/comments', CommentController.create);

publicacionRouter.patch('/:id/comments/:idComment', CommentController.update);

publicacionRouter.delete('/:id/comments/:idComment', CommentController.delete);

publicacionRouter.get('/:id/reactions/:idReaction', ReactionController.getById)

publicacionRouter.post('/:id/reactions', ReactionController.create)