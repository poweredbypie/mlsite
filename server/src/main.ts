import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";
import path from "path";
import { Record, Level, Player } from "./schema.js";

env.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.resolve(__dirname, "../client")));

// const authed = (token: string) => {
//   return bcrypt.compareSync(token, process.env.BOT_TOKEN as string);
// };

app.get("/levels", async (req, res) => {
  const levels = await Level.find({ position: { $lte: 100 } })
    .lean()
    .populate("points")
    .sort("position");
  return res.status(200).json(levels);
});

app.get("/levels/:id", async (req, res) => {
  const level = await Level.findById(req.params.id)
    .lean()
    .populate("records", "player hertz link playerID");
  return res.status(200).json(level?.records);
});

app.get("/players", async (req, res) => {
  const players = await Player.find({ points: { $gt: 0 } })
    .select("name points")
    .lean()
    .sort("-points");
  return res.status(200).json(players);
});

app.get("/players/:id", async (req, res) => {
  const player = await Player.findById(req.params.id)
    .lean()
    .populate("hertz")
    .populate("class")
    .populate("records", "level hertz link levelID");
  return res.status(200).json(player);
});

// needs auth
app.post("/players", async (req, res) => {
  const player = new Player({
    name: req.body.name,
    points: 0,
  });
  player.save();
  return res.sendStatus(201);
});

try {
  mongoose.connect(process.env.MONGODB_URI as string);
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
