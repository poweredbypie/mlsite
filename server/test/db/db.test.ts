import { Record, Player, Level } from "../../src/schema";
import { connectDB, unplugDB } from "./mongomemoryserver";
import env from "dotenv";

connectDB();

const level = new Level({
  name: "Yatagarasu",
  creator: "Viprin and more",
  position: 1
});

level.save();

