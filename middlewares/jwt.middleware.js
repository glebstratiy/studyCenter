const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  try{
    const decoded = jwt.verify(token, 'goliylox');
    req.user = decoded;
    next();
  } catch(err){
    res.redirect('/auth/login')
  }
};

module.exports = authMiddleware;