const express = require('express');
const { registration, login, doLogin, doRegister, doLogout } = require("../controllers/auth.controller");


const authRouter = express.Router();

authRouter.use('/registration', registration);
authRouter.use('/doRegister', doRegister)
authRouter.use('/login', login);
authRouter.use('/doLogin', doLogin);
authRouter.use('/doLogout', doLogout);

module.exports = authRouter;