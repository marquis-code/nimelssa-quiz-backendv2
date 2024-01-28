import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import dotenv from "dotenv";
import helmet from "helmet";
import { checkUserAccess } from './middlewares/authenticate'
import { connectDB } from '../config/db.config'
import authRouter from './router/authentication'
import quizRouter from './router/quiz'
import userRouter from './router/users'
dotenv.config();
const app = express()
connectDB()

app.use(cors({
    credentials: true
}))
app.use(compression())
app.use(helmet());
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.use('/v1/auth', authRouter)
app.use('/v1/quiz', checkUserAccess, quizRouter)
app.use('/v1/user', checkUserAccess, userRouter)

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });