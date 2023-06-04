const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true
  }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
