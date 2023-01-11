import { Record, Player, Level } from "../src/schema";
import env from "dotenv";
import mongoose, { ClientSession } from "mongoose";

mongoose.connect(
  "mongodb+srv://admin:IeMd0RhSWDdfVh6D@mldb.rq64ftg.mongodb.net/test?retryWrites=true&w=majority"
);

var session: ClientSession;

beforeAll(async () => {
  session = await mongoose.startSession();
});

const beginTransaction = () => {
  while (session.inTransaction() === true) continue;
  session.startTransaction();
};

const disconnect = async () => {
  await Record.deleteMany();
  await Player.deleteMany();
  await Level.deleteMany();
  await mongoose.connection.close();
};

afterAll(disconnect);

test("Add a level", async () => {
  beginTransaction();
  const level = new Level({
    name: "Sunset Sandstorm",
    creator: "crohn44",
    position: 1,
  });
  await level.add(session);
  await session.commitTransaction();
  expect(level._id).toBeDefined();
  const levelQuery = await Level.findOne({ name: "Sunset Sandstorm" });
  expect(levelQuery?.creator).toStrictEqual("crohn44");
});

test("Add a player", async () => {
  beginTransaction();
  const player1 = new Player({
    name: "Coopersuper",
    points: 0,
  });
  player1.$session(session);
  await player1.save();
  const player2 = new Player({
    name: "Biprex",
    points: 0,
  });
  player2.$session(session);
  await player2.save();
  const player3 = new Player({
    name: "Noxop",
    points: 0,
  });
  player3.$session(session);
  await player3.save();
  await session.commitTransaction();
  const player = await Player.findOne({ name: "Coopersuper" });
  expect(player).not.toBeNull();
});

test("Add a record", async () => {
  beginTransaction();
  const r = new Record({
    player: "Biprex",
    level: "Sunset Sandstorm",
    hertz: 60,
    link: "https://youtube.com/bullshitbullshitbullshit",
  });
  r.$session(session);
  await r.save();
  await session.commitTransaction();
  const record = await Record.findOne({
    player: "Biprex",
    level: "Sunset Sandstorm",
  });
  expect(record).not.toBeNull();
  const level = await Level.findOne({ name: "Sunset Sandstorm" });
  expect((level?.records ?? [null])[0]).toStrictEqual(record?._id);
  expect(record?.levelID).toStrictEqual(level?._id);
  const player = await Player.findOne({ name: "Biprex" });
  expect((player?.records ?? [null])[0]).toStrictEqual(record?._id);
  expect(record?.playerID).toStrictEqual(player?._id);
  expect(player?.points).toBeGreaterThan(0);
});

test("Add level above", async () => {
  const bpoints = (await Player.findOne({ name: "Biprex" }))?.points;
  beginTransaction();
  const level = new Level({
    name: "Dr Dingleberry",
    creator: "Zoink Doink",
    position: 1,
  });
  await level.add(session);
  const record = new Record({
    player: "Coopersuper",
    level: "Dr Dingleberry",
    hertz: 60,
    link: "https://youtube.com/ginger",
  });
  record.$session(session);
  await record.save();
  await session.commitTransaction();
  const apoints = (await Player.findOne({ name: "Biprex" }))?.points;
  const levelQuery = await Level.findOne({ name: "Sunset Sandstorm" });
  expect(levelQuery?.position).toStrictEqual(2);
  expect(bpoints ?? -1).toBeGreaterThan(apoints ?? -1);
});

test("Move level up", async () => {
  beginTransaction();
  await new Level({
    name: "RUST",
    creator: "neigefeu",
    position: 3,
  }).add(session);
  await new Level({
    name: "Yatagarasu",
    creator: "Viprin and more",
    position: 4,
  }).add(session);
  await new Level({
    name: "gregory",
    creator: "cornfungi",
    position: 5,
  }).add(session);
  await session.commitTransaction();
  const level = await Level.findOne({ name: "gregory" });
  await level?.move(session, 2);
  const movedLevel = await Level.findOne({ name: "gregory" });
  expect(movedLevel?.position).toStrictEqual(2);
  const bumpedLevel = await Level.findOne({ name: "RUST" });
  expect(bumpedLevel?.position).toStrictEqual(4);
});

test("Move level down", async () => {
  beginTransaction();
  const level = await Level.findOne({ name: "Dr Dingleberry" });
  await level?.move(session, 4);
  await session.commitTransaction();
  const movedLevel = await Level.findOne({ name: "Dr Dingleberry" });
  expect(movedLevel?.position).toStrictEqual(4);
  const bumpedLevel = await Level.findOne({ name: "RUST" });
  expect(bumpedLevel?.position).toStrictEqual(3);
});

test("Remove level", async () => {
  beginTransaction();
  const level = await Level.findOne({ name: "Dr Dingleberry" });
  await level?.del(session);
  await session.commitTransaction();
  const player = await Player.findOne({ name: "Coopersuper" });
  expect(player?.points).toStrictEqual(0);
  expect((player?.records ?? [null]).length).toStrictEqual(0);
  const records = await Record.find({ level: "Dr Dingleberry" });
  expect(records.length).toStrictEqual(0);
  const removedLevel = await Level.findOne({ name: "Dr Dingleberry" });
  expect(removedLevel).toBeNull();
  const bumpedLevel = await Level.findOne({ name: "Yatagarasu" });
  expect(bumpedLevel?.position).toStrictEqual(4);
});

test("Remove record", async () => {
  beginTransaction();
  const r = new Record({
    player: "Noxop",
    level: "Yatagarasu",
    hertz: 120,
    link: "https://youtube.com/noxopwow",
  });
  r.$session(session);
  await r.save();
  await session.commitTransaction();
  const player = await Player.findOne({ name: "Noxop" });
  expect(player?.points).toBeGreaterThan(0);
  const record = await Record.findOne({ name: "Noxop", level: "Yatagarasu" });
  await record?.cascadingDelete(session, 1);
  const player2 = await Player.findOne({ name: "Noxop" });
  expect(player2?.points).toStrictEqual(0);
});

test("Ban a player", async () => {
  beginTransaction();
  const r = new Record({
    player: "Biprex",
    level: "RUST",
    hertz: 60,
    link: "https://youtube.com/hackedlmao",
  });
  r.$session(session);
  await r.save();
  await session.commitTransaction();
  beginTransaction();
  const player = await Player.findOne({ name: "Biprex" });
  await player?.ban(session);
  await session.commitTransaction();
  const bannedPlayer = await Player.findOne({ name: "Biprex" });
  expect(bannedPlayer).toBeNull();
  const level = await Level.findOne({ name: "Sunset Sandstorm" });
  expect((level?.records ?? [null]).length).toStrictEqual(0);
  const records = await Record.find({ player: "Biprex" });
  expect(records.length).toStrictEqual(0);
});

test("Abort transaction", async () => {
  beginTransaction();
  const r = new Record({
    player: "Noxop",
    level: "RUST",
    hertz: 60,
    link: "https://youtube.com/gabogoaoboa",
  });
  r.$session(session);
  await r.save();
  await session.abortTransaction();
  const abortedRecord = await Record.findOne({ player: "Noxop", level: "RUST" });
  expect(abortedRecord).toBeNull();
})