import express from 'express';
const app = express();
const PORT = process.env.PORT ?? 1234;


app.listen(PORT, () => console.log(`App escuchando en http://localhost:${PORT}`));