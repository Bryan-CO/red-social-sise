import express from 'express';
import { userRouter } from './routes/user.js';
const app = express();
const PORT = process.env.PORT ?? 1234;

app.use('/users', userRouter);
app.listen(PORT, () => console.log(`App escuchando en http://localhost:${PORT}`));