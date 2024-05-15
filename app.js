import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config"
import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const {URI, PORT} = process.env
// const URI="mongodb+srv://user1:YGyE7PyeB7x@cluster0.hlp2rdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const PORT="3000"

mongoose.set('strictQuery', true)

mongoose.connect(URI).then(() => {app.listen(PORT, () => {
  console.log("Database connection successful")
})}).catch(error => {console.log(error.message)
  process.exit(1)
})