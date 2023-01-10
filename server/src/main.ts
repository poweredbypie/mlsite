import express, { Request, Response, NextFunction } from "express";
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

app.set("query parser", "simple");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", express.static(path.resolve(__dirname, "../client")));

const authed = (req: Request, res: Response, next: NextFunction) => {
  if (
    !bcrypt.compareSync(
      req.headers.authorization ?? "",
      process.env.BOT_TOKEN as string
    )
  )
    return res.sendStatus(403);
  next();
};

const transaction = (fn: (...args: any[]) => any) => {
  return async (...args: any[]) => {
    const session = await mongoose.startSession();
    let result: any;
    try {
      session.startTransaction();
      result = fn(...args);
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
    } finally {
      session.endSession();
      return result;
    }
  };
};

app.get("/levels", async (req, res) => {
  const levels = await Level.find({ position: { $lte: 100 } })
    .lean()
    .sort("position");
  return res.status(200).json(levels);
});

app.get("/levels/:name", async (req, res) => {
  const level = await Level.findOne({ name: req.params.name })
    .lean()
    .populate("records", "player hertz link playerID");
  return res.status(200).json(level?.records);
});

app.post("/levels", async (req, res) => {
  if (await Level.exists({ name: req.body.name as string }))
    return res.sendStatus(409);
  const level = new Level({
    name: req.body.name as string,
    creator: req.body.creator as string,
    position: req.body.position as number,
  });
  level.add();
  return res.sendStatus(201);
});

app.delete("/levels/:name", async (req, res) => {
  const level = await Level.findOne({ name: req.params.name });
  if (level === null) return res.sendStatus(404);
  level.del();
  return res.sendStatus(200);
});

app.patch("/levels/:name", async (req, res) => {
  if (req.body.newpos !== undefined) {
    const level = await Level.findOne({ name: req.params.name });
    if (level === null) return res.sendStatus(404);
    level.move(req.body.newpos as number);
    return res.sendStatus(200);
  }
  if (req.body.newname !== undefined) {
    const level = await Level.findOneAndUpdate(
      { name: req.params.name },
      { $set: { name: req.body.newname as string } }
    );
    if (level === null) return res.sendStatus(404);
    Record.levelNameUpdate(level._id, req.body.newname);
    return res.sendStatus(200);
  }
  if (req.body.newcreator !== undefined) {
    const level = await Level.findOneAndUpdate(
      { name: req.params.name },
      { $set: { creator: req.body.newcreator as string } }
    );
    return level ? res.sendStatus(200) : res.sendStatus(404);
  }
  return res.sendStatus(400);
});

app.get("/players", async (req, res) => {
  const players = await Player.find({ points: { $gt: 0 } })
    .select("name points")
    .lean()
    .sort("-points");
  return res.status(200).json(players);
});

app.get("/players/:name", async (req, res) => {
  const player = await Player.findOne({ name: req.params.name })
    .lean()
    .populate("records", "level hertz link levelID");
  return player
    ? res.status(200).json(player)
    : res.status(404).send("Player not found.");
});

// needs auth
app.post("/players", async (req, res) => {
  if (await Player.exists({ name: req.body.name as string }))
    return res.sendStatus(409);
  const player = new Player({
    name: req.body.name as string,
    points: 0,
  });
  player.save();
  return res.sendStatus(201);
});

app.delete("/players/:name", async (req, res) => {
  const player = await Player.findOne({ name: req.params.name });
  if (player === null) return res.sendStatus(404);
  player.ban();
  return res.sendStatus(200);
});

app.patch("/players/:name", async (req, res) => {
  if (req.body.newname !== undefined) {
    const player = await Player.findOneAndUpdate(
      { name: req.params.name },
      { $set: { name: req.body.newname as string } }
    );
    if (player === null) return res.sendStatus(404);
    Record.playerNameUpdate(player._id, req.body.newname);
    return res.sendStatus(200);
  }
  if (req.body.newdiscord !== undefined) {
    const player = await Player.findOneAndUpdate(
      { name: req.params.name },
      { $set: { discord: req.body.newdiscord as number } }
    );
    return player ? res.sendStatus(200) : res.sendStatus(404);
  }
});

app.post("/records", async (req, res) => {
  if (
    !(await Player.exists({ name: req.body.player as string })) ||
    !(await Level.exists({ name: req.body.level as string }))
  )
    return res.sendStatus(404);
  if (req.body.hertz === undefined || req.body.link === undefined)
    return res.sendStatus(400);
  const record = new Record({
    player: req.body.player as string,
    level: req.body.level as string,
    hertz: req.body.hertz as number,
    link: req.body.link as string,
  });
  record.save();
  return res.sendStatus(201);
});

app.delete("/records", async (req, res) => {
  if (req.body.player === undefined || req.body.level === undefined)
    return res.sendStatus(400);
  const record = await Record.findOne({
    player: req.body.player as string,
    level: req.body.level as string,
  });
  if (record === null) return res.sendStatus(404);
  record.cascadingDelete();
  return res.sendStatus(200);
});

try {
  mongoose.connect(process.env.MONGODB_URI as string);
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
