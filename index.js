const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const Handlebars = require('handlebars');
const coursesrouter = require("./routes/courses.route");
const authRouter = require("./routes/auth.route");
const authMiddleware = require("./middlewares/jwt.middleware");
const accRouter = require("./routes/account.route");
const User = require("./models/user.model");
const Course = require("./models/course.model");
const scheduleRouter = require("./routes/schedule.route");
const contactsRouter = require("./routes/contacts.route");

const app = express();
const PORT = 3001;



const header = fs.readFileSync("views/header.hbs", "utf-8");
hbs.handlebars.registerPartial("header", header);
const footer = fs.readFileSync("views/footer.hbs", "utf-8");
hbs.handlebars.registerPartial("footer", footer);

hbs.handlebars.registerHelper('isCourseCompleted', function(course, coursesEnded) {
  const foundCourse = coursesEnded.find(c => c.name === course.name);
  return foundCourse ? true : false;
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));

app.use("/courses", authMiddleware, coursesrouter);
app.use("/auth", authRouter);
app.use("/contacts", contactsRouter);
app.use("/account", authMiddleware, accRouter);
app.use("/schedule", authMiddleware, scheduleRouter);


app.get("/", async (req, res) => {
  const token = req.cookies.token;
  res.render("home.hbs", { isLoggedIn: token });
});

app.post("/setProgress", async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const courseId = keys[0];
    const coursesFromDB = await Course.find();
    const completedCourse = await Course.findById(courseId);
    const decodedToken = jwt.decode(req.cookies.token, { complete: true });
    const username = decodedToken.payload.username;
    const date = new Date();
    const options = {
      timeZoneName: 'short'
    };
    
    const formattedDate = date.toLocaleString('en-US', options);
    const user = await User.findOneAndUpdate(
      { username: username }, 
      { $inc: { progress: 10 }, $push: { coursesEnded: { name: completedCourse.name, date: formattedDate } } }, 
      { new: true }
    );
    res.redirect("/account");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/createLesson", async (req, res) => {
  try {
    const decodedToken = jwt.decode(req.cookies.token, { complete: true });
    const username = decodedToken.payload.username;
    const user = await User.findOneAndUpdate(
      { username: username }, 
      { $push: { lessons: { courseName: req.body.courseName, day: req.body.day, time: req.body.time } } }, 
      { new: true }
    );
    res.redirect("/schedule");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/deleteLesson", async (req, res) => {
  try {
    const id = req.body.id;
    const lessonObjectId = new mongoose.Types.ObjectId(id);
    const decodedToken = jwt.decode(req.cookies.token, { complete: true });
    const username = decodedToken.payload.username;
    const user = await User.findOne({ username })
    const updatedLessons = user.lessons.filter(lesson => lesson._id.toString() !== lessonObjectId.toString());
    await User.findOneAndUpdate({username: username}, { lessons: updatedLessons }, { new: true });
    res.redirect("/schedule");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

mongoose
  .connect(
    "mongodb+srv://gstratiyj:qweqwe123@cluster0.doekvgv.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
