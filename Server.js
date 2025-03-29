import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
