import { Schema, model } from "mongoose";

const recordSchema = new Schema({
  player: { type: String, required: true },
  level: { type: String, required: true },
  hertz: { type: Number, required: true },
  link: { type: String, required: true },
  playerID: { type: Schema.Types.ObjectId, ref: "Player" },
  levelID: { type: Schema.Types.ObjectId, ref: "Level" },
});

recordSchema.pre("save", async function () {
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
          return 2250 / (0.37 * this.position + 9) - 40;
        },
      },
    },
    statics: {
      levelPoints() {
        return this.find({ position: { $lte: 100 } })
          .then((levels) => {
            return levels.map((l) => [l._id, l.position]);
          })
          .catch((e) => {
            console.log(e);
          });
      },
    },
  }
);

levelSchema.pre("save", async function () {
  try {
    const levels = await Level.updateMany(
      { position: { $gte: this.position } },
      { $inc: { position: 1 } },
      { new: true }
    );
  } catch (e) {
    console.log(e)
  }
  const lp = levelPoints();
  Player.updateAllPoints(lp);
});

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
        get() {
          return this.populate("records", "hertz").then((p) => {
            let rrs = {};
            for (let r of p.records) {
              rrs[r.hertz] = (rrs[r.hertz] || 0) + 1;
            }
            return rrs;
          });
        },
      },
      class: {
        get() {
          const classes = [
            [1, "Former Good Player"],
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
      updateAllPoints(lp) {
        this.find({ points: { $gt: 0 } }).then((players) => {
          var promises = [];
          for (let p of players) {
            const levelIDs = p.getCompletedLevels().map((l) => l._id);
            const points = lp
              .filter((e) => levelIDs.includes(e[0]))
              .reduce((a, b) => a + b[1], 0);
            p.points = points;
            p.save();
          }
        });
      },
    },
    methods: {
      getCompletedLevels() {
        return this.populate("records", "levelID").then((p) =>
          p.records.map((r) => Level.findById(r.levelID))
        );
      },
      updatePoints() {
        const levels = this.getCompletedLevels();
        const points = levels.map((l) => l.points).reduce((a, b) => a + b, 0);
        this.points = points;
        this.save();
      },
    },
  }
);

// playerSchema.pre("save", async function () {
//   this.points = this.updatePoints();
// });

const Record = model("Record", recordSchema);
const Level = model("Level", levelSchema);
const Player = model("Player", playerSchema);

export { Record, Level, Player };
