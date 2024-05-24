import auth from "../middleware/auth.js";
import express from 'express'
import { register, login, logout } from '../controllers/userControllers.js'

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post('/login', login)
userRouter.get("/logout", auth, logout);

export default userRouter