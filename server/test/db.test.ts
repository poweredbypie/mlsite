import { Record, Player, Level } from "../src/schema";
import env from "dotenv";
import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://admin:IeMd0RhSWDdfVh6D@mldb.rq64ftg.mongodb.net/test?retryWrites=true&w=majority"
);

// const connect = async () => {
//   mongoose.connect("mongodb+srv://admin:IeMd0RhSWDdfVh6D@mldb.rq64ftg.mongodb.net/test?retryWrites=true&w=majority")
// }

const disconnect = async () => {
  await Record.deleteMany();
  await Player.deleteMany();
  await Level.deleteMany();
  await mongoose.connection.close();
};

// afterAll(async () => {
//   // Record.deleteMany();
//   // Player.deleteMany();
//   // Level.deleteMany();

// })

test("Create new level", async () => {
  const level = new Level({
    name: "Sunset Sandstorm",
    creator: "crohn44",
    position: 1,
  });
  await level.add();
  expect(level._id).toBeDefined();
  const levelQuery = await Level.findOne({ name: "Sunset Sandstorm" });
  expect(levelQuery?.creator).toStrictEqual("crohn44");
});

test("Add a player", async () => {
  await new Player({
    name: "Coopersuper",
    points: 0,
  }).save();
  await new Player({
    name: "Biprex",
    points: 0,
  }).save();
  await new Player({
    name: "Noxop",
    points: 0,
  }).save();
  const player = await Player.findOne({ name: "Coopersuper" });
  expect(player).not.toBeNull();
});

test("Add a record", async () => {
  await new Record({
    player: "Biprex",
    level: "Sunset Sandstorm",
    hertz: 60,
    link: "https://youtube.com/bullshitbullshitbullshit",
  }).save();
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
  const level = new Level({
    name: "Dr Dingleberry",
    creator: "Zoink Doink",
    position: 1,
  });
  await level.add();
  await new Record({
    player: "Coopersuper",
    level: "Dr Dingleberry",
    hertz: 60,
    link: "https://youtube.com/ginger"
  }).save();
  const apoints = (await Player.findOne({ name: "Biprex" }))?.points;
  const levelQuery = await Level.findOne({ name: "Sunset Sandstorm" });
  expect(levelQuery?.position).toStrictEqual(2);
  expect(bpoints ?? 0).toBeGreaterThan(apoints ?? 1);
});

test("Move level up", async () => {
  await new Level({
    name: "RUST",
    creator: "neigefeu",
    position: 3,
  }).add();
  await new Level({
    name: "Yatagarasu",
    creator: "Viprin and more",
    position: 4,
  }).add();
  await new Level({
    name: "gregory",
    creator: "cornfungi",
    position: 5,
  }).add();
  const level = await Level.findOne({ name: "gregory" });
  await level?.move(2);
  const movedLevel = await Level.findOne({ name: "gregory" });
  expect(movedLevel?.position).toStrictEqual(2);
  const bumpedLevel = await Level.findOne({ name: "RUST" });
  expect(bumpedLevel?.position).toStrictEqual(4);
});

test("Move level down", async () => {
  const bpoints = (await Player.findOne({ name: "Coopersuper" }))?.points;
  const level = await Level.findOne({ name: "Dr Dingleberry" });
  await level?.move(4);
  const apoints = (await Player.findOne({ name: "Coopersuper" }))?.points;
  const movedLevel = await Level.findOne({ name: "Dr Dingleberry" });
  expect(movedLevel?.position).toStrictEqual(4);
  const bumpedLevel = await Level.findOne({ name: "RUST" });
  expect(bumpedLevel?.position).toStrictEqual(3);
  expect(bpoints ?? 0).toBeGreaterThan(apoints ?? 1)
});

test("Remove level", async () => {
  const level = await Level.findOne({ name: "Dr Dingleberry" });
  await level?.del();
  const player = await Player.findOne({ name: "Coopersuper" });  
  expect(player?.points).toStrictEqual(0);
  const records = await Record.find({ level: "Dr Dingleberry" });
  expect(records.length).toStrictEqual(0);
  const removedLevel = await Level.findOne({ name: "Dr Dingleberry" });
  expect(removedLevel).toBeNull();
  const bumpedLevel = await Level.findOne({ name: "Yatagarasu" });
  expect(bumpedLevel?.position).toStrictEqual(4);
  await disconnect();
});
