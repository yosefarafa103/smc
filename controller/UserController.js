const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res, next) => {
  try {
    // await User.deleteMany();
    const user = await User.create(req.body);
    const hashedPass = await bcrypt.hash(user.password, 10);
    const isMatched = await bcrypt.compare(user.password, hashedPass);
    console.log(isMatched);
    if (!isMatched) {
      return next("please enter correct password");
    }
    user.password = hashedPass;
    user.confirmPassword = hashedPass;
    await user.save();
    console.log(user);
    if (!user) {
      return next("cannot create item");
    }
    res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const item = await User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      {
        new: true,
      }
    );
    if (!item) {
      return next("can not find user");
    }
    await item.save({ validateBeforeSave: true });
    if (!item) {
      return next("cannot update item");
    }
    res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  await User.deleteOne({ _id: req.params.userId });
  res.status(204).send("user deleted!");
};
exports.blockUser = async (req, res, next) => {
  const item = await User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
  if (!item) {
    return next("can not find user");
  }
  console.log(item);
  res.status(200).json(item);
  if (!item) {
    return next("cannot update item");
  }
};
exports.logout = async (req, res, next) => {
  const unValidToken = jwt.sign({ id: "213123asdasdasd" }, process.env.DB_PASS);
  res.cookie("jwt", unValidToken, {
    expiresIn: "10d",
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "logout successfully",
  });
};
exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!username || !password) {
    return next("Please Enter username and password correctly!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next("Invalid username or password");
  }
  const token = jwt.sign({ id: user._id }, process.env.DB_PASS);
  req.user = user;
  res.cookie("jwt", token, {
    // domain: "/",
    expiresIn: "10d",
    httpOnly: true,
    // maxAge: 86400000,
  });

  res.status(200).json({
    status: "login success!",
    token,
  });
};
