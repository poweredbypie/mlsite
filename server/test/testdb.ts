import { Record, Player, Level } from "../src/schema";
import mongoose from "mongoose";
import env from "dotenv";

env.config();
mongoose.connect(process.env.MONGODB_URI as string);

const level = new Level({
  name: "Yatagarasu",
  creator: "Viprin and more",
  position: 1
});

level.save();

