import express from 'express'
import userRouter from "./userRouter.js"
import contactsRouter from './contactsRouter.js'


const router = express.Router()

router.use("/users", userRouter);
router.use("/contacts", contactsRouter);

export default router