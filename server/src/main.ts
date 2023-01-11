import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import cors from "cors";
import mongoose, { ClientSession } from "mongoose";
import path from "path";
import { Record, Level, Player } from "./schema";

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
    req.headers.authorization &&
    (req.headers.authorization ?? "" !== (process.env.BOT_TOKEN as string))
  ) {
    return res.sendStatus(403);
  } else {
    next();
  }
};

const transaction = (
  fn: (req: Request, res: Response, session: ClientSession) => Promise<number>
) => {
  return async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    let result: any;
    try {
      session.startTransaction();
      result = res.sendStatus(await fn(req, res, session));
      await session.commitTransaction();
    } catch (code) {
      await session.abortTransaction();
      result =
        typeof code === "number" ? res.sendStatus(code) : res.sendStatus(500);
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

app.post(
  "/levels",
  authed,
  transaction(async (req, res, session) => {
    if (await Level.exists({ name: req.body.name as string })) throw 409;
    const level = new Level({
      name: req.body.name as string,
      creator: req.body.creator as string,
      position: req.body.position as number,
    });
    await level.add(session);
    return 201;
  })
);

app.delete(
  "/levels/:name",
  authed,
  transaction(async (req, res, session) => {
    const level = await Level.findOne({ name: req.params.name });
    if (level === null) throw 404;
    level.del(session);
    return 200;
  })
);

app.patch(
  "/levels/:name",
  authed,
  transaction(async (req, res, session) => {
    if (req.body.newpos !== undefined) {
      const level = await Level.findOne({ name: req.params.name });
      if (level === null) throw 404;
      await level.move(session, req.body.newpos as number);
      return 200;
    }
    if (req.body.newname !== undefined) {
      const level = await Level.findOneAndUpdate(
        { name: req.params.name },
        { $set: { name: req.body.newname as string } }
      ).session(session);
      if (level === null) throw 404;
      await Record.levelNameUpdate(session, level._id, req.body.newname);
      return 200;
    }
    if (req.body.newcreator !== undefined) {
      const level = await Level.findOneAndUpdate(
        { name: req.params.name },
        { $set: { creator: req.body.newcreator as string } }
      ).session(session);
      if (level === null) throw 404;
      return 200;
    }
    throw 400;
  })
);

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
app.post(
  "/players",
  authed,
  transaction(async (req, res, session) => {
    if (await Player.exists({ name: req.body.name as string })) throw 409;
    const player = new Player({
      name: req.body.name as string,
      points: 0,
    });
    player.$session(session);
    await player.save();
    return 201;
  })
);

app.delete(
  "/players/:name",
  authed,
  transaction(async (req, res, session) => {
    const player = await Player.findOne({ name: req.params.name });
    if (player === null) throw 404;
    await player.ban(session);
    return 200;
  })
);

app.patch(
  "/players/:name",
  authed,
  transaction(async (req, res, session) => {
    if (req.body.newname !== undefined) {
      const player = await Player.findOneAndUpdate(
        { name: req.params.name },
        { $set: { name: req.body.newname as string } }
      ).session(session);
      if (player === null) throw 404;
      await Record.playerNameUpdate(session, player._id, req.body.newname);
      return 200;
    }
    if (req.body.newdiscord !== undefined) {
      const player = await Player.findOneAndUpdate(
        { name: req.params.name },
        { $set: { discord: req.body.newdiscord as number } }
      ).session(session);
      if (player === null) throw 404;
      return 200;
    }
    throw 400;
  })
);

app.post(
  "/records",
  authed,
  transaction(async (req, res, session) => {
    if (
      !(await Player.exists({ name: req.body.player as string })) ||
      !(await Level.exists({ name: req.body.level as string }))
    )
      throw 404;
    if (req.body.hertz === undefined || req.body.link === undefined) throw 400;
    const record = new Record({
      player: req.body.player as string,
      level: req.body.level as string,
      hertz: req.body.hertz as number,
      link: req.body.link as string,
    });
    record.$session(session);
    await record.save();
    return 201;
  })
);

app.delete(
  "/records",
  authed,
  transaction(async (req, res, session) => {
    if (req.body.player === undefined || req.body.level === undefined)
      throw 400;
    const record = await Record.findOne({
      player: req.body.player as string,
      level: req.body.level as string,
    });
    if (record === null) throw 404;
    await record.cascadingDelete(session, 1);
    return 200;
  })
);

try {
  mongoose.connect(process.env.MONGODB_TEST_URI as string);
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
