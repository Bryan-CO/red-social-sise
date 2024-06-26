import { Router } from 'express';
import { PublicationController } from '../controllers/publication.js';
import { CommentController } from '../controllers/comment.js';
import { ReactionController } from '../controllers/reaction.js';

export const publicacionRouter = Router();

// PUBLICACIONES

publicacionRouter.get('/', PublicationController.getAll);

publicacionRouter.get('/:id', PublicationController.getById);

publicacionRouter.post('/', PublicationController.create);

publicacionRouter.patch('/:id', PublicationController.update);

publicacionRouter.delete('/:id', PublicationController.delete);

// COMENTARIOS

publicacionRouter.get('/:id/comments', CommentController.getAll);

publicacionRouter.post('/:id/comments', CommentController.create);

publicacionRouter.post('/:id/:comment/answer', CommentController.createAnswer);

// REACCIONES

publicacionRouter.post('/:id/reactions', ReactionController.create)

publicacionRouter.get('/:id/reactions', ReactionController.getAllById)

publicacionRouter.get('/:id/reactions/:idReaction', ReactionController.getById)
