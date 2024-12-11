const { Schema, model } = require("mongoose");
const { converAndTransformToDate } = require("../crud/functions");

const millSchema = Schema({
  name: {
    type: String,
    required: [true, "please enter mill name"],
    // unique: [true, "mill must be unique!"],
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
    // enum: ["electrical", "mechanical", "production", "planned", "other"],
  },
  // ["electrical", 'mechanical', 'production', 'planned', 'Other']
  // updatedBy: {
  //   type: [Schema.ObjectId],
  //   ref: "User",
  //   default: [],
  // },
  millStats: {
    type: {
      planned: [String],
      breakdown: [String],
      other: [String],
      maintenance: [String],
    },
    default: {},
  },
  millStatsCarryOutBy: {
    type: {
      electrical: {
        type: [String],
        default: [],
      },
      mechanical: {
        type: [String],
        default: [],
      },
      production: {
        type: [String],
        default: [],
      },
      planned: {
        type: [String],
        default: [],
      },
      other: {
        type: [String],
        default: [],
      },
    },
    default: {},
  },
  description: String,
  planned: {
    type: [String],
    default: [],
  },
  breakdown: {
    type: [String],
    default: [],
  },
  other: {
    type: [String],
    default: [],
  },
  maintenance: {
    type: [String],
    default: [],
  },
});

millSchema.pre(/^find/, async function (next) {
  // await calculateDateDifference(this._id);
  // this.populate({
  //   path: "updatedBy",
  //   select: "username",
  // });
  next();
});
millSchema.post(/^find/, async function (doc) {
  // await calculateDateDifference(this._id);
  // this.populate({
  //   path: "updatedBy",
  //   select: "username",
  // });
  // console.log(doc.duration);
  
});
millSchema.pre("findOneAndUpdate", async function (next) {
  // this.select({ section: false });
  // console.log(this);


  console.log("updating...");
  next();
});
millSchema.post("findOneAndUpdate", async function (doc) {
  // this.select({ section: false });
  console.log("updated");
});
const MillModel = model("Mill", millSchema);

module.exports = MillModel;
