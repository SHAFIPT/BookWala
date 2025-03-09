import "reflect-metadata";
import './config/container';
import express from 'express';
import * as dotenv from 'dotenv';
import connectDB from './config/db'
import cores from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import router from "./routes/router";
import  {errorHandler } from '../src/middleware/errorHandlingMiddleWare'
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
connectDB()
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())
app.use(cores({
    origin: 'http://localhost:5173',
    credentials: true         
}))

app.use('/',router)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN API' });
});
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});