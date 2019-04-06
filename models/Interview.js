const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterviewSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  address: String,
  application: {
    type: Schema.Types.ObjectId,
    ref: "Job"
  }
});

module.exports = mongoose.model("Interview", InterviewSchema);
