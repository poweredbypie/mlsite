import { Schema, model, Types, Model, Document, PopulatedDoc } from "mongoose";

interface IRecord {
  player: string;
  level: string;
  hertz: number;
  link: string;
  playerID?: Types.ObjectId;
  levelID?: Types.ObjectId;
}

interface IRecordMethods {
  cascadingDelete(): Promise<void>;
}

interface RecordModel extends Model<IRecord, {}, IRecordMethods> {
  playerNameUpdate(id: Types.ObjectId, newname: string): Promise<void>;
  levelNameUpdate(id: Types.ObjectId, newname: string): Promise<void>;
}

type RecordDocument = Document<unknown, any, IRecord> &
  IRecord & { _id: Types.ObjectId } & IRecordMethods;

interface ILevel {
  name: string;
  creator: string;
  position: number;
  records?: Types.ObjectId[];
  points?: number;
}

interface ILevelMethods {
  add(): Promise<void>;
  del(): Promise<void>;
  move(pos: number): Promise<void>;
}

interface LevelModel extends Model<ILevel, {}, ILevelMethods> {
  levelPoints(): Promise<[Types.ObjectId, number][]>;
}

type LevelDocument = Document<unknown, any, ILevel> &
  ILevel & { _id: Types.ObjectId } & ILevelMethods;

interface IPlayer {
  name: string;
  points: number;
  discord?: number;
  records?: Types.ObjectId[];
  hertz?: { [rr: number]: number };
  class?: string;
}

interface IPlayerMethods {
  getCompletedLevels(): Promise<LevelDocument[]>;
  updatePoints(): Promise<void>;
  ban(): Promise<void>;
}

interface PlayerModel extends Model<IPlayer, {}, IPlayerMethods> {
  updateAllPoints(lp: [Types.ObjectId, number][]): Promise<void>;
}

type PlayerDocument = Document<unknown, any, IPlayer> &
  IPlayer & { _id: Types.ObjectId } & IPlayerMethods;

const recordSchema = new Schema<IRecord, RecordModel, IRecordMethods>(
  {
    player: { type: String, required: true },
    level: { type: String, required: true },
    hertz: { type: Number, required: true },
    link: { type: String, required: true },
    playerID: { type: Schema.Types.ObjectId, ref: "Player" },
    levelID: { type: Schema.Types.ObjectId, ref: "Level" },
  },
  {
    statics: {
      async playerNameUpdate(id: Types.ObjectId, newname: string) {
        await this.updateMany({ playerID: id }, { $set: { player: newname } });
      },
      async levelNameUpdate(id: Types.ObjectId, newname: string) {
        await this.updateMany({ levelID: id }, { $set: { level: newname } });
      },
    },
    methods: {
      async cascadingDelete() {
        await Player.findByIdAndUpdate(
          this.playerID,
          {
            $pull: { records: this._id },
          },
          { new: true }
        );
        await Level.findByIdAndUpdate(this.levelID, {
          $pull: { records: this._id },
        });
        await this.deleteOne();
      },
    },
  }
);

recordSchema.pre("save", async function () {
  try {
    const player = await Player.findOneAndUpdate(
      { name: this.player },
      { $addToSet: { records: this._id } },
      { new: true }
    );
    const level = await Level.findOneAndUpdate(
      { name: this.level },
      { $addToSet: { records: this._id } },
      { new: true }
    );
    this.playerID = player?._id;
    this.levelID = level?._id;
    await player?.updatePoints();
  } catch (e) {
    console.error(e);
  }
});

const levelSchema = new Schema<ILevel, LevelModel, ILevelMethods>(
  {
    name: { type: String, required: true },
    creator: { type: String, required: true },
    position: { type: Number, required: true },
    records: [{ type: Schema.Types.ObjectId, ref: "Record" }],
  },
  {
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      points: {
        get() {
          return this.position <= 100
            ? 2250 / (0.37 * this.position + 9) - 40
            : 0;
        },
      },
    },
    statics: {
      async levelPoints() {
        try {
          const levels = await this.find({ position: { $lte: 100 } });
          return levels.map((l) => [l._id, l.points]);
        } catch (e) {
          console.error(e);
        }
      },
    },
    methods: {
      async add() {
        try {
          await Level.updateMany(
            { position: { $gte: this.position } },
            { $inc: { position: 1 } }
          );
          await this.save();
        } catch (e) {
          console.error(e);
        }
      },
      async del() {
        try {
          await Level.updateMany(
            { position: { $gt: this.position } },
            { $inc: { position: -1 } }
          );
          await this.populate("records");
          await this.records.forEach((r: RecordDocument) =>
            r.cascadingDelete()
          );
          await this.deleteOne();
          const lp = await Level.levelPoints();
          await Player.updateAllPoints(lp);
        } catch (e) {
          console.error(e);
        }
      },
      async move(pos: number) {
        try {
          if (this.position > pos) {
            await Level.updateMany(
              {
                $and: [
                  { position: { $gte: pos } },
                  { position: { $lt: this.position } },
                ],
              },
              { $inc: { position: 1 } }
            );
          } else if (this.position < pos) {
            await Level.updateMany(
              {
                $and: [
                  { position: { $lte: pos } },
                  { position: { $gt: this.position } },
                ],
              },
              { $inc: { position: -1 } }
            );
          }
          await Level.findByIdAndUpdate(this._id, { $set: { position: pos } });
          const lp = await Level.levelPoints();
          await Player.updateAllPoints(lp);
        } catch (e) {
          console.error(e);
        }
      },
    },
  }
);

levelSchema.pre("save", async function () {
  try {
    const lp = await Level.levelPoints();
    await Player.updateAllPoints(lp);
  } catch (e) {
    console.error(e);
  }
});

const playerSchema = new Schema<IPlayer, PlayerModel, IPlayerMethods>(
  {
    name: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
    discord: { type: Number },
    records: [{ type: Schema.Types.ObjectId, ref: "Record" }],
  },
  {
    minimize: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      hertz: {
        async get() {
          await this.populate("records", "hertz");
          let rrs: { [rr: number]: number } = {};
          for (let r of this.records) {
            rrs[r.hertz] = (rrs[r.hertz] || 0) + 1;
          }
          this.depopulate();
          return rrs;
        },
      },
      class: {
        get() {
          const classes = [
            [1, "Legacy"],
            [50, "Class D"],
            [150, "Class C"],
            [300, "Class B"],
            [600, "Class A"],
            [1000, "Class S"],
            [20000, "Overlords"],
          ];
          return (classes.find((c) => this.points < c[0]) ?? classes[0])[1];
        },
      },
    },
    statics: {
      async updateAllPoints(lp: [Types.ObjectId, number][]) {
        const players: PlayerDocument[] = await this.find();
        for (let p of players) {
          const levelIDs = await p
            .getCompletedLevels()
            .then((levels) => levels.map((l) => l._id));
          const points = lp
            .filter((e) => levelIDs.includes(e[0]))
            .reduce((a, b) => a + b[1], 0);
          p.points = points;
          await p.save();
        }
      },
    },
    methods: {
      async getCompletedLevels() {
        await this.populate("records", "levelID");
        return this.records.map((r: RecordDocument) =>
          Level.findById(r.levelID)
        );
      },
      async updatePoints() {
        const levels = await this.getCompletedLevels();
        const points = levels
          .map((l: LevelDocument) => l.points)
          .reduce((a: number, b: number) => a + b, 0);
        this.points = points;
        await this.save();
      },
      async ban() {
        try {
          await this.populate("records");
          await this.records.forEach((r: RecordDocument) =>
            r.cascadingDelete()
          );
          await this.deleteOne();
        } catch (e) {
          console.error(e);
        }
      },
    },
  }
);

export const Record = model<IRecord, RecordModel>("Record", recordSchema);
export const Level = model<ILevel, LevelModel>("Level", levelSchema);
export const Player = model<IPlayer, PlayerModel>("Player", playerSchema);
