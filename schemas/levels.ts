import mongoose from "mongoose"

let records = new mongoose.Schema({
    name: String,
    link: String,
    hertz: Number
})

let levels = new mongoose.Schema({
    name: String,
    creators: String,
    records: [records]
})

export default mongoose.model("levels", levels)