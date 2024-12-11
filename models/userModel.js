const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
  username: {
    type: String,
    required: [
      true,
      "the account must be have username required and contains only characters!",
    ],
    minLength: [3, "your username must be 3 characters and more "],
    // validate: [validator.isAlpha, "enter your username present characters only!"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [6, "password must be 6 charcters or more!"],
  },
  confirmPassword: {
    type: String,
    // required: [true, "please enter confirm password it's required"],
    validate: {
      validator: function (elment) {
        return elment === this.password;
      },
      message: "Please Enter Correct Password!",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "role is only user or admin",
    },
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
userSchema.pre("find", function (next) {
  // { isActive: { $ne: false } }
  // this.find({ isActive: { $ne: false } }).select('-isActive');
  next();
});
userSchema.pre("save", function (next) {
  //   if (!this.isModified("password") || this.isNew) return next();
  // this.password = undefined;
  this.confirmPassword = undefined;
  next();
});

const User = new model("User", userSchema);

module.exports = User;
