import { Schema, model } from "mongoose";

const recordSchema = new Schema(
  {
    player: { type: String, required: true },
    level: { type: String, required: true },
    hertz: { type: Number, required: true },
    link: { type: String, required: true },
  },
  {}
);

const levelSchema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: String, required: true },
    position: { type: Number, required: true, unique: true },
    records: [{ type: Schema.Types.ObjectId, ref: "Record" }],
  },
  {
    minimize: false,
  }
);

const playerSchema = new Schema(
  {
    name: { type: String, required: true },
    points: { type: Number, required: true },
    records: [{ type: Schema.Types.ObjectId, ref: "Record" }],
  },
  {
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      hertz: {
        async get() {
          return await this.populate("records", "hertz").then((p) => {
            let rrs = {};
            for (let i = 0; i < p.records.length; i++) {
              rrs[p.records[i].hertz] = (rrs[p.records[i].hertz] || 0) + 1;
            }
            return rrs;
          });
        },
      },
    },
  }
);

const Record = model("Record", recordSchema);
const Level = model("Level", levelSchema);
const Player = model("Player", playerSchema);

export { Record, Level, Player };
