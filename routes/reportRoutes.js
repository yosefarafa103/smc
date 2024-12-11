const express = require("express");
const {
  createNewReport,
  getAllReports,
  deleteReport,
} = require("../controller/reportController");
const { deleteItem, getItem } = require("../crud/functions");
const router = express.Router();
const Report = require("../models/ReportModels");

router.route("/").post(createNewReport).get(getAllReports);
router.route("/:id").delete(deleteItem(Report)).get(getItem(Report))
module.exports = router;
