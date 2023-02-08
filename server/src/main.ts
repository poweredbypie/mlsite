import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import cors from "cors";
import mongoose, { ClientSession } from "mongoose";
import path from "path";
import { Record, Level, Player, Log } from "./schema";

if (
  process.env.BOT_TOKEN === undefined ||
  process.env.MONGODB_URI === undefined
)
  env.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.set("query parser", "simple");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", express.static(path.resolve(__dirname, "../client")));

const authed = (req: Request, res: Response, next: NextFunction) => {
  if (!(req.headers.auth ?? "" === (process.env.BOT_TOKEN as string))) {
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
        typeof code === "number" ? res.sendStatus(code) : console.log(code);
    } finally {
      await session.endSession();
      return result;
    }
  };
};

app.get("/levels", async (req, res) => {
  const levels = await Level.find({ position: { $lte: 100 } })
    .lean({ virtuals: true })
    .sort("position")
    .select("-_id -__v -records");
  return res.status(200).json(levels);
});

app.get("/levels/:name", async (req, res) => {
  const level = await Level.findOne({ name: req.params.name })
    .lean({ virtuals: true })
    .populate("records", "-_id -__v -level -levelID -playerID")
    .select("-_id -__v");
  return level
    ? res.status(200).json(level)
    : res.status(404).send("Level not found.");
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
    await level.del(session);
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
    .lean()
    .sort("-points")
    .select("name points -_id");
  return res.status(200).json(players);
});

app.get("/players/:name", async (req, res) => {
  const player = await Player.findOne({ name: req.params.name })
    .lean({ virtuals: true })
    .populate("records", "-_id -__v -player -levelID -playerID")
    .select("-_id -id -__v");
  return player
    ? res.status(200).json(player)
    : res.status(404).send("Player not found.");
});

app.post(
  "/players",
  authed,
  transaction(async (req, res, session) => {
    if (await Player.exists({ name: req.body.name as string })) throw 409;
    const player = new Player({
      name: req.body.name as string,
      points: 0,
      discord:
        req.body.discord === null ? undefined : (req.body.discord as string),
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
        { $set: { discord: req.body.newdiscord as string } }
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
    if (
      await Record.exists({
        player: req.body.player as string,
        level: req.body.level as string,
      })
    )
      throw 409;
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

app.post("/submit", async (req, res) => {
  var isNew = 0;
  if (
    await Record.exists({
      player: req.body.player as string,
      level: req.body.level as string,
    })
  )
    return res.sendStatus(409);
  if (!(await Player.exists({ name: req.body.player as string }))) isNew += 1;
  if (!(await Level.exists({ name: req.body.level as string }))) isNew += 2;
  return fetch(`${process.env.BOT_LISTENER_URI}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req.body, isNew }),
  })
    .then((data) => res.sendStatus(data.status))
    .catch(() => res.sendStatus(503));
});

app.get("/members", async (req, res) => {
  const players = await Player.find({ discord: { $exists: true } })
    .lean()
    .sort("-points")
    .select("name discord points -_id");
  return res.status(200).json(players);
});

app.get("/logs", async (req, res) => {
  const logs = await Log.find().lean().select("-__v -_id");
  return res.status(200).json(logs);
});

app.post("/logs", authed, async (req, res) => {
  const log = new Log({
    date: req.body.date as string,
    content: req.body.content as string,
    type: req.body.type as number,
  });
  await log.save();
  return res.status(201).json({ id: log.id });
});

app.patch("/logs/:id", authed, async (req, res) => {
  const log = await Log.findByIdAndUpdate(req.params.id, {
    $set: { content: req.body.content },
  });
  return log ? res.sendStatus(200) : res.sendStatus(404);
});

app.delete("/logs/:id", authed, async (req, res) => {
  const log = await Log.findByIdAndDelete(req.params.id);
  return log ? res.sendStatus(200) : res.sendStatus(404);
});

try {
  mongoose.connect(process.env.MONGODB_URI as string);
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
