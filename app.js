import express from 'express';
import { userRouter } from './routes/user.js';
import { status404 } from './middlewares/404.js';

const app = express();
const PORT = process.env.PORT ?? 1234;

app.use('/users', userRouter);
app.use(status404()); 
app.listen(PORT, () => console.log(`App escuchando en http://localhost:${PORT}`));