const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.getUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedToken = jwt.decode(req.cookies.token, { complete: true });
    const username = decodedToken.payload.username;
    const user = await User.findOne({ username });

    res.render("../views/account/account.hbs", {
      user: user,
      isLoggedIn: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
