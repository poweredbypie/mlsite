import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { Record, Level, Player } from "./schema";

if (process.env.MONGODB_URI === undefined) {
  env.config();
}

const app = express();
const port = process.env.PORT ?? 3000;

app.use(bodyParser.json());
app.use("/", express.static(path.resolve(__dirname, "../client")));

app.get("/levels", async (req, res) => {
  return res.json();
});

mongoose.connect(process.env.MONGODB_URI as string);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
