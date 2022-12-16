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
  {}
);

recordSchema.pre("save", async function () {
  const player = Player.findByName(this.player)
    .then((p) => {
      p.records.push(this._id);
      p.save();
    })
    .catch(() => {
      throw new Error("Player not found");
    });
  const level = Level.findByName(this.level)
    .then((l) => {
      l.records.push(this._id);
      l.save();
    })
    .catch(() => {
      throw new Error("Level not found");
    });
  this.playerID = player._id;
  this.levelID = level._id;
});

const levelSchema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: String, required: true },
    position: { type: Number, required: true, unique: true },
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
      findByName(name) {
        return this.findOne({ name: new RegExp(name, "i") });
      },
    },
    methods: {},
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
      findByName(name) {
        return this.findOne({ name: new RegExp(name, "i") });
      },
    },
  }
);

playerSchema.pre("save", async function () {
  this.points = this.populate("records", "levelID").then(async (p) => {
    let points = 0;
    for await (let r of p.records) {
      const level = await Level.findById(r.levelID);
      points += level.points;
    }
    return points;
  });
});

const Record = model("Record", recordSchema);
const Level = model("Level", levelSchema);
const Player = model("Player", playerSchema);

export { Record, Level, Player };
