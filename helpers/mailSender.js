import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD,
  },
});

function sendMail(message) {
  return transport.sendMail(message);
}

export default sendMail;
