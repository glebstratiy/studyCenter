const Course = require("../models/course.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.schedule = async (req, res) => {
  const decodedToken = jwt.decode(req.cookies.token, { complete: true });
  const username = decodedToken.payload.username;
  const user = await User.findOne({ username });
  const coursesFromDB = await Course.find();
  res.render("../views/schedule/schedule.hbs", {
    courses: coursesFromDB,
    isLoggedIn: req.cookies.token,
    user: user
  });
};
