import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import env from "dotenv"
import levelsSchema from "../../schemas/levels"
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
if(!process.env.MONGODB_URI) {
  env.config()
}

const app = express();
const port = process.env.PORT ?? 3000;

app.use(bodyParser.json());
app.use("/", express.static(path.resolve(__dirname, "../client")));

app.get("/levels", async (req, res) => {
  const levels = await levelsSchema.find()
  return res.json(levels)
})

mongoose.connect(process.env.MONGODB_URI as string);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
