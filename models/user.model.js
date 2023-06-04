const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    require: true
  },
  coursesEnded: [{
    name: String,
    date: String
  }],
  lessons: [{
    courseName: String,
    day: String,
    time: String
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User;