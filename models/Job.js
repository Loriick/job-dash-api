const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  spontaneous: Boolean,
  jobUrl: String,
  date: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  interviews: {
    type: [Schema.Types.ObjectId],
    ref: "Interview"
  }
});

module.exports = mongoose.model("Job", JobSchema);
