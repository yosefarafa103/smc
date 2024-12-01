const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  blockUser,
  login,
  logout,
} = require("../controller/UserController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

const {
  createItem,
  getAllItems,
  updateItem,
  getUser,
} = require("../crud/functions");
const User = require("../models/userModel");
const router = express.Router();
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").post(createUser).get(getAllItems(User));
router.route("/:userId").patch(updateUser).delete(deleteUser).get(getUser);
// router.use(isLoggedIn, isAdmin);
router.route("/block-user/:userId").patch(blockUser);
module.exports = router;
