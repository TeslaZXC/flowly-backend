import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import findRouter from "./src/routes/findRouites.js"

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/find', findRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
