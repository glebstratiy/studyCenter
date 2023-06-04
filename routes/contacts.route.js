const express = require("express");
const { contacts } = require("../controllers/contacts.controller");

const contactsRouter = express.Router();

contactsRouter.use("/", contacts);

module.exports = contactsRouter;
