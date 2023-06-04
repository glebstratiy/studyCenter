const express = require('express');
const { getUser } = require('../controllers/account.controller');


const accRouter = express.Router();

accRouter.use('/', getUser);

module.exports = accRouter;