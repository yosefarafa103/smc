const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
module.exports = async (req, res, next) => {
  // res.send("..");
  const { id } = jwt.verify(req.cookies.jwt, process.env.DB_PASS);
  const loggedInUser = await User.findById(id);
  if (loggedInUser.role !== "admin") {
    return next("Thie Feature Is For Authorized Users Only!");
  }
  next();
};
