import { Schema, model, Types, Model, Document, ClientSession } from "mongoose";

interface IRecord {
  player: string;
  level: string;
  hertz: number;
  link: string;
  playerID?: Types.ObjectId;
  levelID?: Types.ObjectId;
}

interface IRecordMethods {
  cascadingDelete(session: ClientSession, justOne?: number): Promise<void>;
}

interface RecordModel extends Model<IRecord, {}, IRecordMethods> {
  playerNameUpdate(
    session: ClientSession,
    id: Types.ObjectId,
    newname: string
  ): Promise<void>;
  levelNameUpdate(
    session: ClientSession,
    id: Types.ObjectId,
    newname: string
  ): Promise<void>;
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
  add(session: ClientSession): Promise<void>;
  del(session: ClientSession): Promise<void>;
  move(session: ClientSession, pos: number): Promise<void>;
}

interface LevelModel extends Model<ILevel, {}, ILevelMethods> {
  levelPoints(): Promise<[Types.ObjectId, number][]>;
}

type LevelDocument = Document<unknown, any, ILevel> &
  ILevel & { _id: Types.ObjectId } & ILevelMethods;

interface IPlayer {
  name: string;
  points: number;
  discord?: string;
  records?: Types.ObjectId[];
  hertz?: { [rr: number]: number };
  class?: string;
}

interface IPlayerMethods {
  getCompletedLevels(): Promise<LevelDocument[]>;
  updatePoints(session: ClientSession): Promise<void>;
  ban(session: ClientSession): Promise<void>;
}

interface PlayerModel extends Model<IPlayer, {}, IPlayerMethods> {
  updateAllPoints(
    session: ClientSession,
    lp: [Types.ObjectId, number][]
  ): Promise<void>;
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
      async playerNameUpdate(
        session: ClientSession,
        id: Types.ObjectId,
        newname: string
      ) {
        await this.updateMany(
          { playerID: id },
          { $set: { player: newname } }
        ).session(session);
      },
      async levelNameUpdate(
        session: ClientSession,
        id: Types.ObjectId,
        newname: string
      ) {
        await this.updateMany(
          { levelID: id },
          { $set: { level: newname } }
        ).session(session);
      },
    },
    methods: {
      async cascadingDelete(session: ClientSession, justOne?: number) {
        const level = await Level.findByIdAndUpdate(this.levelID, {
          $pull: { records: this._id },
        }).session(session);
        if (justOne === 1) {
          await Player.findByIdAndUpdate(this.playerID, {
            $pull: { records: this._id },
            $inc: { points: -(level?.points as number) },
          }).session(session);
        } else {
          await Player.findByIdAndUpdate(this.playerID, {
            $pull: { records: this._id },
          }).session(session);
        }
        await this.deleteOne({ session: session });
      },
    },
  }
);

recordSchema.pre("save", async function () {
  const session = this.$session();
  const level = await Level.findOneAndUpdate(
    { name: this.level },
    { $addToSet: { records: this._id } },
    { new: true }
  ).session(session as ClientSession);
  if (level === null) throw new Error("Level not found");
  const player = await Player.findOneAndUpdate(
    { name: this.player },
    {
      $addToSet: { records: this._id },
      $inc: { points: level.points as number },
    },
    { new: true }
  ).session(session as ClientSession);
  if (player === null) throw new Error("Player not found");
  this.playerID = player._id;
  this.levelID = level._id;
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
        const levels = await this.find({ position: { $lte: 100 } });
        return levels.map((l) => [l._id, l.points]);
      },
    },
    methods: {
      async add(session: ClientSession) {
        await Level.updateMany(
          { position: { $gte: this.position } },
          { $inc: { position: 1 } }
        ).session(session);
        this.$session(session);
        await this.save();
      },
      async del(session: ClientSession) {
        await Level.updateMany(
          { position: { $gt: this.position } },
          { $inc: { position: -1 } }
        ).session(session);
        await this.populate("records");
        await this.records.forEach((r: RecordDocument) =>
          r.cascadingDelete(session)
        );
        await this.deleteOne({ session: session });
        const lp = await Level.levelPoints();
        await Player.updateAllPoints(session, lp);
      },
      async move(session: ClientSession, pos: number) {
        if (this.position > pos) {
          await Level.updateMany(
            {
              $and: [
                { position: { $gte: pos } },
                { position: { $lt: this.position } },
              ],
            },
            { $inc: { position: 1 } }
          ).session(session);
        } else if (this.position < pos) {
          await Level.updateMany(
            {
              $and: [
                { position: { $lte: pos } },
                { position: { $gt: this.position } },
              ],
            },
            { $inc: { position: -1 } }
          ).session(session);
        }
        await Level.findByIdAndUpdate(this._id, {
          $set: { position: pos },
        }).session(session);
        const lp = await Level.levelPoints();
        await Player.updateAllPoints(session, lp);
      },
    },
  }
);

levelSchema.pre("save", async function () {
  const session = this.$session();
  const lp = await Level.levelPoints();
  await Player.updateAllPoints(session as ClientSession, lp);
});

const playerSchema = new Schema<IPlayer, PlayerModel, IPlayerMethods>(
  {
    name: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
    discord: { type: String },
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
      async updateAllPoints(
        session: ClientSession,
        lp: [Types.ObjectId, number][]
      ) {
        const players: PlayerDocument[] = await this.find();
        for (let p of players) {
          const levelIDs = await p
            .getCompletedLevels()
            .then((levels) => levels.map((l) => l._id));
          const points = lp
            .filter((e) => levelIDs.includes(e[0]))
            .reduce((a, b) => a + b[1], 0);
          p.points = points;
          if (p === null) throw 500;
          p.$session(session);
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
      async updatePoints(session: ClientSession) {
        const levels: LevelDocument[] = await this.getCompletedLevels();
        const points = levels
          .map((l) => l.points)
          .reduce((a: number, b: number) => a + b, 0);
        this.points = points;
        this.$session(session);
        await this.save();
      },
      async ban(session: ClientSession) {
        await this.populate("records");
        for (let r of this.records) {
          await r.cascadingDelete(session);
        }
        await this.deleteOne({ session: session });
      },
    },
  }
);

export const Record = model<IRecord, RecordModel>("Record", recordSchema);
export const Level = model<ILevel, LevelModel>("Level", levelSchema);
export const Player = model<IPlayer, PlayerModel>("Player", playerSchema);
