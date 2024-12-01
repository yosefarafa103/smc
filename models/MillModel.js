const { Schema, model } = require("mongoose");
const { converAndTransformToDate } = require("../crud/functions");

const millSchema = Schema({
  name: {
    type: String,
    required: [true, "please enter mill name"],
  },
  tn: {
    type: String,
    required: [true, "please enter Machine Tag Number"],
  },

  startDate: {
    type: Date,
    default: Date.now(),
    // required: [true, "please enter start date"],
  },
  stopDate: {
    type: Date,
    default: Date.now() + 18000000,
    // required: [true, "please enter start date"],
  },
  stopCategory: {
    type: String,
    // Maintenance, Breakdown,Planned, Other
    enum: {
      values: ["maintenance", "breakdown", "planned", "other"],
      message: "Value Should Only Be [Maintenance, Breakdown,Planned, Other]",
    },
  },
  duration: {
    type: String,
    // default: this.startDate,
  },
  carriedOutBy: {
    type: String,
    required: [true, "please enter carried out by"],
  },
  // updatedBy: {
  //   type: [Schema.ObjectId],
  //   ref: "User",
  //   default: [],
  // },
  description: String,
});

millSchema.pre(/^find/, async function (next) {
  // this.select({ __v: false });
  // await calculateDateDifference(this._id);

  // this.populate({
  //   path: "updatedBy",
  //   select: "username",
  // });
  next();
});
millSchema.pre("findOneAndUpdate", async function (next) {
  // this.select({ section: false });
  console.log(this.duration);

  console.log("updating...");
  next();
});
millSchema.post("findOneAndUpdate", async function (doc) {
  // this.select({ section: false });
  console.log("updated");

  // await calculateDateDifference(this._id);
  // this.duration = await calculateDateDifference(this._id);
  // console.log(this.duration);
  // ()
});
const MillModel = model("Mill", millSchema);

module.exports = MillModel;
