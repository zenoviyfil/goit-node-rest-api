import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config"
import router from './routes/index.js'
import path from 'path'

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(path.resolve("public/avatars")))

app.use("/api", router);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const {URI, PORT} = process.env

mongoose.set('strictQuery', true)

mongoose.connect(URI).then(() => {app.listen(PORT, () => {
  console.log("Database connection successful")
})}).catch(error => {console.log(error.message)
  process.exit(1)
})

export default app