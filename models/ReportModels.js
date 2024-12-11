const { Schema, model } = require("mongoose");
const reportSchema = Schema({
  title: {
    type: String,
    required: [true, "please provide title of report"],
  },
  editedBy: {
    ref: "User",
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  mill: {
    type: {},
  },
});

const reportModel = new model("Report", reportSchema);

module.exports = reportModel;
