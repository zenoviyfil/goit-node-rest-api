import express from 'express'
import auth from "../middleware/auth.js";
import { register, login, logout, getCurrentUser, updateSub } from '../controllers/userControllers.js'
import validateBody from '../helpers/validateBody.js';
import { emailSchema, loginSchema, registerSchema, subscriptionSchema } from '../schemas/userSchema.js';
import { changeAvatar, resendVerification, verifyEmail } from '../controllers/avatarController.js';
import { upload } from '../middleware/upload.js';

const userRouter = express.Router();

userRouter.post("/register", validateBody(registerSchema), register);
userRouter.post('/login', validateBody(loginSchema), login)
userRouter.post("/logout", auth, logout);
userRouter.get("/current", auth, getCurrentUser);
userRouter.patch("/", auth, validateBody(subscriptionSchema), updateSub);
userRouter.patch("/avatars", auth, upload.single("avatar"), changeAvatar)
userRouter.get("/verify/:verificationToken", verifyEmail)
userRouter.post("/verify", validateBody(emailSchema), resendVerification)

export default userRouter