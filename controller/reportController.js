const { createItem, deleteItem } = require("../crud/functions");
const Report = require("../models/ReportModels");

exports.createNewReport = createItem(Report);
exports.deleteReport = deleteItem(Report);
exports.getAllReports = async (req, res, next) => {
  const reports = await Report.find().populate("editedBy");
  console.log(reports);
  res.status(200).json(reports);
};
