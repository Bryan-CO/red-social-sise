import { Router } from 'express';
import { PublicationController } from '../controllers/publication.js';
import { CommentController } from '../controllers/comment.js';
import { ReactionController } from '../controllers/reaction.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permsRequired } from '../middlewares/validatePerms.js';

export const publicacionRouter = Router();

// PUBLICACIONES

publicacionRouter.get('/', PublicationController.getAll);

publicacionRouter.get('/:id', authRequired, PublicationController.getById);

publicacionRouter.post('/', authRequired, PublicationController.create);

publicacionRouter.patch('/:id', authRequired, PublicationController.update);

publicacionRouter.delete('/:id', authRequired, permsRequired, PublicationController.delete);

// COMENTARIOS

publicacionRouter.get('/:id/comments', authRequired, CommentController.getAll);

publicacionRouter.post('/:id/comments', authRequired, CommentController.create);

publicacionRouter.post('/:id/answer/:comment', authRequired, CommentController.createAnswer);

// REACCIONES

publicacionRouter.post('/:id/reactions', authRequired, ReactionController.create)

publicacionRouter.get('/:id/reactions', authRequired, ReactionController.getAllById)

publicacionRouter.get('/:id/reactions/:idReaction', authRequired, ReactionController.getById)
