import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnect from "./config/db";
import taskRoutes from './routes/taskRoutes';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5678;

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


app.use('/api/v1',taskRoutes);
app.use('/api/v1',userRoutes);


dbConnect();

app.get('/', (req, res) => {
  res.send(`<h1>Welcome to Ts-Based Backend</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});

