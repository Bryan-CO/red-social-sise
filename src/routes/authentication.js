import { Router } from 'express';
import { AuthController } from '../controllers/authentication.js';
import { authRequired } from '../middlewares/validateToken.js';

export const AuthRouter = Router();

AuthRouter.post('/generate', AuthController.generate);

AuthRouter.post('/register', AuthController.register);

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/logout', authRequired, AuthController.logout)
