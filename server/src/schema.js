import { Schema, model } from "mongoose";

const recordSchema = new Schema(
  {
    player: { type: String, required: true },
    level: { type: String, required: true },
    hertz: { type: Number, required: true },
    link: { type: String, required: true },
    playerID: { type: Schema.Types.ObjectId, ref: "Player" },
    levelID: { type: Schema.Types.ObjectId, ref: "Level" },
  },
  {
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
        this.deleteOne();
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
    this.playerID = player._id;
    this.levelID = level._id;
    player.updatePoints();
  } catch (e) {
    console.error(e);
  }
});

const levelSchema = new Schema(
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
          this.save();
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
          this.records.forEach((r) => r.cascadingDelete());
          this.deleteOne();
          const lp = Level.levelPoints();
          Player.updateAllPoints(lp);
        } catch (e) {
          console.error(e);
        }
      },
      async move(pos) {
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
          await this.update({ $set: { position: pos } });
          const lp = Level.levelPoints();
          Player.updateAllPoints(lp);
        } catch (e) {
          console.error(e);
        }
      },
    },
  }
);

levelSchema.pre("save", async function () {
  try {
    const lp = Level.levelPoints();
    Player.updateAllPoints(lp);
  } catch (e) {
    console.error(e);
  }
});

const playerSchema = new Schema(
  {
    name: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
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
          let rrs = {};
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
          for (let c of classes) {
            if (this.points < c[0]) {
              return c[1];
            }
          }
          throw new Error("Invalid points value");
        },
      },
    },
    statics: {
      async updateAllPoints(lp) {
        const players = await this.find();
        for (let p of players) {
          const levelIDs = p.getCompletedLevels().map((l) => l._id);
          const points = lp
            .filter((e) => levelIDs.includes(e[0]))
            .reduce((a, b) => a + b[1], 0);
          p.points = points;
          p.save();
        }
      },
    },
    methods: {
      async getCompletedLevels() {
        await this.populate("records", "levelID");
        this.records.map((r) => Level.findById(r.levelID));
      },
      updatePoints() {
        const levels = this.getCompletedLevels();
        const points = levels.map((l) => l.points).reduce((a, b) => a + b, 0);
        this.points = points;
        this.save();
      },
      async ban() {
        try {
          await this.populate("records");
          this.records.forEach((r) => r.cascadingDelete());
          this.deleteOne();
        } catch (e) {
          console.error(e);
        }
      },
    },
  }
);

const Record = model("Record", recordSchema);
const Level = model("Level", levelSchema);
const Player = model("Player", playerSchema);

export { Record, Level, Player };
