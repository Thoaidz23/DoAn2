const express = require("express");
const router = express.Router();
const userController = require("../Controller/MyAccout.controller");

router.get("/:id", userController.getUserById);

module.exports = router;
