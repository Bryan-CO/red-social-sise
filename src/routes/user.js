import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { authRequired } from '../middlewares/validateToken.js';
import { permsRequired } from '../middlewares/validatePerms.js';
import { ChatController } from '../controllers/chat.js';

export const userRouter = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array 
 */
userRouter.get('/', authRequired, UserController.getAll);

userRouter.get('/:id', authRequired, UserController.getById);

userRouter.post('/', authRequired, UserController.create);

userRouter.patch('/:id', authRequired, UserController.update);

userRouter.delete('/:id', authRequired, permsRequired, UserController.delete);

// CHATS

userRouter.get('/:id/chats', authRequired, ChatController.getAllByUser);
