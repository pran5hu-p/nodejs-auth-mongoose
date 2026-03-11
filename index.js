import 'dotenv/config';
import express from "express";
import { connectmongoDB } from "./connection.js";
import userRouter from './routes/user.routes.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

connectmongoDB(process.env.MONGODB_URL).then(() => console.log('MongoDB Connected'));

app.use(express.json());

app.use(authMiddleware);

app.use('/user', userRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));