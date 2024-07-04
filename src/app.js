import express from 'express';
import cookieParser from 'cookie-parser'
import { AuthRouter } from './routes/authentication.js';
import { userRouter } from './routes/user.js';
import { publicacionRouter } from './routes/publication.js';
import { commentRouter } from './routes/comment.js';
import { corsMiddleware } from './middlewares/cors.js';
import { status404 } from './middlewares/status404.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { chatRouter } from './routes/chat.js';
import { messageRouter } from './routes/message.js';


const app = express();

// * Middlewares
app.use(cookieParser())
app.use(corsMiddleware());

// * Content Type Config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// * Routes
app.use('/auth', AuthRouter);
app.use('/users', userRouter);
app.use('/publications', publicacionRouter);
app.use('/comments', commentRouter);
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);

// * Status 404
app.use(status404());

// * Error Handler
app.use(errorHandler);

// * Server Listen Config
const PORT = process.env.SERVER_PORT ?? 4000;
app.listen(PORT, () => console.log(`App escuchando en http://localhost:${PORT}`));