import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

import { User } from "../schemas/userSchema.js";
import HttpError from "../helpers/HttpError.js";
import sendMail from '../helpers/mailSender.js'

const {JWT, BASE_LOCAL_URI} = process.env

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user !== null) {
      return next(HttpError(409, "Email in use!"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email);
    const verificationToken = crypto.randomUUID()

    const message = {
      to: email,
      from: "fil.zenoviy@gmail.com",
      subject: "Verify email",
      html: `To confirm your email please click on <a target="_blank" href="${BASE_LOCAL_URI}/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please open the link ${BASE_LOCAL_URI}/api/users/verify/${verificationToken}`,
    };
    sendMail(message);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatar,
      verificationToken
    });

    res
      .status(201)
      .json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newUser.avatar,
        },
      });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user === null) {
      return next(HttpError(401, "Email or password is wrong!"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(HttpError(401, "Email or password is wrong!"));
    }
    if (user.verify === false) {
      return next(HttpError(401, "Please verify your email"))
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT,
      { expiresIn: "1h" }
    );

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res
      .status(200)
      .json({
        token: token,
        user: { email: user.email, subscription: user.subscription, avatar: user.avatar },
      });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ email: user.email, subscription: user.subscription, avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

const updateSub = async (req, res, next) => {
  try {
    if (
      Object.keys(req.body).length !== 1 ||
      Object.keys(req.body)[0] !== "subscription"
    ) {
      return next(HttpError(400, "Body must have one field: subscription"));
    }

    const { subscription: updateSub } = req.body;
    const data = await User.findByIdAndUpdate(
      req.user.id,
      { subscription: updateSub },
      { new: true }
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, getCurrentUser, updateSub };
