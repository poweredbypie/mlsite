import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const db = new MongoMemoryServer();

export const connectDB = async () => {
  const uri = db.getUri();
  await mongoose.connect(uri);
}

export const unplugDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await db.stop();
}