import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";

//Configure env
dotenv.config();

//Database
connectDB();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(morgan("dev"));

//rest api
app.get("/", (req, res) => {
  res.send({ message: "Welcome to ShopMonk app" });
});

//PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
