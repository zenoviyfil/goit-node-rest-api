import express from 'express'
import auth from '../middleware/auth.js';

import userRouter from "./userRouter.js"
import contactsRouter from './contactsRouter.js'

const router = express.Router()

router.use("/users", userRouter);
router.use("/contacts",auth, contactsRouter);

export default router