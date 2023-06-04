const express = require("express");
const { courses } = require("../controllers/courses.controller");

const coursesrouter = express.Router();

coursesrouter.use("/", courses);

module.exports = coursesrouter;
