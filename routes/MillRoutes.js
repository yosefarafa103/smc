const express = require("express");
const {
  createNewMill,
  getAllMills,
  getMill,
  updateMill,
  deleteMill,
} = require("../controller/MillController");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const { createItem } = require("../crud/functions");
const Mill = require("../models/MillModel");
const router = express.Router();
// router.use(isLoggedIn);

router.route("/").post(createItem(Mill)).get(getAllMills);
router.route("/:id").get(getMill).patch(updateMill).delete(deleteMill)
module.exports = router;
