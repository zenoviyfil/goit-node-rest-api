import * as fs from "fs/promises";
import path from "path";
import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";
import { User } from "../schemas/userSchema.js";
import sendMail from "../helpers/mailSender.js";

const { MAIL_URI } = process.env;

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(HttpError(400, "Avatar file was not found"));
    }

    const { path: tmpUploadPath, filename } = req.file;
    const newPath = path.resolve("public", "avatars", filename);

    const img = await Jimp.read(tmpUploadPath);
    await img.resize(250, 250).writeAsync(tmpUploadPath);

    await fs.rename(tmpUploadPath, newPath);
    const avatar = `/avatars/${filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatar },
      { new: true }
    );

    res.status(200).send({ avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (user === null) {
      return next(HttpError(404, "User not found!"));
    }

    await User.findOneAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      return next(HttpError(404, "User not found!"));
    }
    if (user.verify) {
      return next(HttpError(400, "Verification has already been passed"));
    }
    const message = {
      to: email,
      from: "fil.zenoviy@gmail.com",
      subject: "Resend verify email",
      html: `To confirm your email please click on <a target="_blank" href="${MAIL_URI}/api/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your email please open the link ${MAIL_URI}/api/users/verify/${user.verificationToken}`,
    };
    sendMail(message);

    return res.status(201).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export { changeAvatar, verifyEmail, resendVerification };
