import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/", express.static(path.resolve(__dirname, "../client")));

mongoose.connect(process.env.MONGODB_URI as string);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});