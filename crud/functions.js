const User = require("../models/userModel");

const createItem = (model) => {
  return async (req, res, next) => {
    try {
      const item = await model.create(req.body);
      res.status(201).json(item);
      if (!item) {
        return next("cannot create item");
      }
    } catch (err) {
      return next(err);
    }
  };
};
const updateItem = (model, paramName) => {
  return async (req, res, next) => {
    try {
      const item = await model.findByIdAndUpdate(
        req.params + `${paramName}`,
        req.body,
        { new: true }
      );
      console.log(item);
      res.status(200).json(item);
      if (!item) {
        return next("cannot update item");
      }
    } catch (err) {
      return next(err);
    }
  };
};
const getAllItems = (model) => async (req, res, next) => {
  try {
    const items = await model.find();
    res.status(200).json({
      data: items,
    });
  } catch (err) {
    return next(err);
  }
};
const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  console.log(user);

  if (!user) {
    return next(err);
  }
  res.status(200).json({
    data: user,
  });
};
const getItem = (model) => async (req, res, next) => {
  const item = await model.findById(req.params.id);
  console.log(item);
  if (!item) {
    return next(err);
  }
  res.status(200).json({
    data: item,
  });
};
const converAndTransformToDate = (startDate, stopDate) => {
  console.log(startDate);
  console.log(stopDate);

  const differenceInMilliseconds = stopDate - startDate;
  let dateOnStr = differenceInMilliseconds;
  if (dateOnStr <= 60000) {
    dateOnStr /= 1000;
    dateOnStr = `${dateOnStr}s`;
  } else if (dateOnStr < 3600000) {
    // check if less hour
    dateOnStr /= 60000;
    dateOnStr = `${dateOnStr.toString().slice(0, 2)}m`;
  } else if (dateOnStr >= 36e5) {
    // check if great hour
    // let [hours, mins] = `${Number(dateOnStr).toFixed(2)}`.split(".");
    dateOnStr /= 3600000;
    let hours = Math.floor(dateOnStr);
    let minsDecimal = dateOnStr - hours;
    let mins = Math.round(minsDecimal * 60);
    dateOnStr = `${hours}h${mins > 0 ? ` and ${mins}m` : ""}`;
  }
  return dateOnStr;
};
const convertFromStrTomMs = (date) => {
  const arr = date.match(/\w/g);

  const checkUnits = (unit, count) => {
    if (unit === "h") {
      return count * 36e5;
    } else if (unit === "m") {
      return count * 60e3;
    } else if (unit === "d") {
      return count * 864e5;
    }
  };
  // console.log(arr.filter((item) => /\d/.test(item)).join(''));

  if (arr.length === 2) {
    const [count, unit] = arr;

    return checkUnits(unit, count);
  } else {
    let count = arr.filter((item) => /\d/g.test(+item)).join("");

    let [unit] = arr.filter((item) => /\D/g.test(+item));
    // let [unit] = arr
    //   .slice(0, arr.indexOf(arr.filter((el) => !Number(el))[0]) + 1)
    //   .filter((item) => /\D/g.test(+item));
    return checkUnits(unit, count);
  }
  return 1;
};
const transformMsToDate = (dateOnStr) => {
  let result = "";
  if (dateOnStr <= 60000) {
    dateOnStr /= 1000;
    result = `${dateOnStr}s`;
  } else if (dateOnStr < 3600000) {
    // check if less hour
    dateOnStr /= 60000;
    result = `${dateOnStr.toString().slice(0, 2)}m`;
  } else if (dateOnStr >= 36e5) {
    // check if great hour
    // let [hours, mins] = `${Number(dateOnStr).toFixed(2)}`.split(".");
    dateOnStr /= 3600000;
    let hours = Math.floor(dateOnStr);
    let minsDecimal = dateOnStr - hours;
    let mins = Math.round(minsDecimal * 60);
    result = `${hours}h ${mins > 0 ? `and ${mins}m` : ""}`;
  } else if (dateOnStr >= 864e5) {
    // check if great day
    dateOnStr /= 864e5;
    result = `${dateOnStr}d`;
  }
  return result.trim();
};
const deleteItem = (model) => async (req, res, next) => {
  await model.findByIdAndDelete(req.params.id);
  res.status(204).send("item deleted!");
};
const saveNewProperties = (mill, key, object) => {
  // if (mill?.millStats) {
  if (!mill) {
    throw Error("can not find this mill");
  }
  //  "other", "millStatsCarryOutBy"
  return (mill[object][key] = mill[key]
    .map((el) => convertFromStrTomMs(el.trim()))
    .reduce((el, acc) => acc + el, 0));
  // }
  // mill.millStats[key] = transformMsToDate(mill.millStats.other);
};
module.exports = {
  createItem,
  getAllItems,
  updateItem,
  converAndTransformToDate,
  convertFromStrTomMs,
  getUser,
  transformMsToDate,
  saveNewProperties,
  deleteItem,
  getItem
};
/* 
else if (dateOnStr >= 864e5) {
    // check if great | EQ day
    dateOnStr /= 864e5;
    dateOnStr = `${dateOnStr.toFixed(1)}d`;
  }
 */
