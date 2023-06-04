const express = require("express");
const { schedule } = require("../controllers/schedule.controller");

const scheduleRouter = express.Router();

scheduleRouter.use("/", schedule);

module.exports = scheduleRouter;
