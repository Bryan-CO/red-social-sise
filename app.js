import express from 'express';
import { userRouter } from './routes/user.js';
import { status404 } from './middlewares/status404.js';
import { corsMiddleware } from './middlewares/cors.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('./config.json');

const app = express();
const PORT = config.development.server.port ?? 3000;

app.use(express.json());
app.use(corsMiddleware());
app.use('/users', userRouter);
app.use(status404());

app.listen(PORT, () => console.log(`App escuchando en http://localhost:${PORT}`));