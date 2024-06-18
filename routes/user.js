import { randomUUID } from 'node:crypto';
import { Router } from 'express';

export const userRouter = Router();

userRouter.get('/', (req, res) => res.send('HOLAAAAA'));