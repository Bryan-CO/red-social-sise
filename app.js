import express from 'express';
import { userRouter } from './routes/user.js';
import { status404 } from './middlewares/status404.js';
import { corsMiddleware } from './middlewares/cors.js';
import { publicacionRouter } from './routes/publication.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import { createRequire } from 'node:module';

// const require = createRequire(import.meta.url);
// const config = require('./config.json');

const app = express();
const PORT = process.env.SERVER_PORT ?? 3000;

app.use(express.json());
app.use(corsMiddleware());
app.use('/users', userRouter);
app.use('/publications', publicacionRouter);
app.use(status404());
app.use(errorHandler);


app.listen(PORT, () => console.log(`App escuchando en http://localhost:${PORT}`));