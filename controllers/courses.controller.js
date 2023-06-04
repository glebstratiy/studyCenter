const Course = require("../models/course.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.courses = async (req, res) => {
  const decodedToken = jwt.decode(req.cookies.token, { complete: true });
  const username = decodedToken.payload.username;
  const coursesEnded = await User.findOne({ username: username }, 'coursesEnded');
  const coursesFromDB = await Course.find();
  res.render("../views/courses/courses.hbs", { courses: coursesFromDB, coursesEnded: coursesEnded.coursesEnded, isLoggedIn: req.cookies.token });
};
