const Mill = require("../models/MillModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { converAndTransformToDate } = require("../crud/functions");

exports.createNewMill = async (req, res, next) => {
  const mill = await Mill.create(req.body);
  if (!mill) {
    return next("can not create mill!");
  }
  res.status(201).json(mill);
};

exports.getAllMills = async (req, res, next) => {
  let mill = await Mill.find();
  // { startDate: { $eq: req.query.startDate } }
  if (!mill) {
    return next("can not find mills!");
  }
  // if (req.query.stopCategory) {
  //   mill = await Mill.findOne({ stopCategory: req.query.stopCategory });
  //   if (!mill) {
  //     return next(
  //       `can not find mill with Stop Category: (${req.query.stopCategory})`
  //     );
  //   }
  // }
  if (req.query.startDate && req.query.stopDate) {
    mill = await Mill.find({
      $and: [
        { startDate: { $gte: req.query.startDate } },

        { stopDate: { $lte: req.query.stopDate } },
      ],
    });
    console.log(mill);

    if (!mill.length) {
      return next(
        "no matched results with this date, enter another date and try again"
      );
    }
    return res.status(200).json({
      millCount: mill.length,
      data: mill,
    });
  }
  if (req.query.search) {
    mill = await Mill.findOne({
      name: { $regex: new RegExp(req.query.search, "ig") },
    });
    // console.log(mill);
    if (!mill) {
      return next("can not find mills!");
    }
    return res.status(200).json({
      millCount: mill?.length,
      data: mill,
    });
  }
  if (req.query.tn) {
    mill = await Mill.findOne({
      tn: {
        $regex: new RegExp(req.query.tn, "ig"),
      },
    });
    // console.log(mill);
    if (!mill) {
      return next("can not find mills!");
    }
    return res.status(200).json({
      millCount: mill?.length,
      data: mill,
    });
  }
  if (req.query.cat) {
    mill = await Mill.find({
      stopCategory: {
        $regex: new RegExp(req.query.cat, "ig"),
      },
    });
    // console.log(mill);
    if (!mill) {
      return next("can not find mills!");
    }
    return res.status(200).json({
      millCount: mill?.length,
      data: mill,
    });
  }
  mill.forEach((m) => {
    m.duration = converAndTransformToDate(m.startDate, m.stopDate);
    // console.log(mill);
    m.save();
  });
  // mill.duration = converAndTransformToDate(this.startDate, this.stopDate);

  res.status(200).json({
    millCount: mill.length,
    data: mill,
  });
};
// 60000 min => millsecounds
// 3600000 hour => millsecounds
// 86400000 day => millsecounds
exports.getMill = async (req, res, next) => {
  const mill = await Mill.findById(req.params.id).select("-section");
  if (mill && mill.startDate && mill.stopDate) {
    const differenceInMilliseconds = mill.stopDate - mill.startDate;
    mill.duration = converAndTransformToDate(
      new Date(mill.startDate).getTime(),
      new Date(mill.stopDate).getTime()
    );
    await mill.save();
    // mill.duration = dateOnStr;
    // console.log(`${dateOnStr}`);
    // await mill.save();
  }
  if (!mill) {
    return next("can not find mills!");
  }
  res.status(200).json({
    millCount: mill.length,
    data: mill,
  });
};

exports.updateMill = async (req, res, next) => {
  // req.authorization = req.cookies.jwt;
  // const { id } = jwt.verify(req.cookies.jwt, process.env.DB_PASS);
  // const loggedInUser = await User.findById(req.params.id);
  const mill = await Mill.findByIdAndUpdate(req.params.id, {
    ...req.body,
    ...{
      $addToSet: {
        updatedBy: req.body.updatedBy,
      },
    },
  });
  // mill = Mill.updateOne({})

  // await mill.save();
  // if (!mill.updatedBy.includes(`${loggedInUser._id}`)) {
  //   mill.updatedBy.push(loggedInUser._id);
  // }
  // { $addToSet: { <field1>: <value1>, ... } }
  console.log(mill);

  if (!mill) {
    return next("Can Not Found This Mill!");
  }
  res.status(200).json(mill);
};
