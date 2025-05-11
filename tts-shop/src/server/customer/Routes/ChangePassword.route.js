const express = require("express");
const router = express.Router();
const userController = require("../Controller/ChangePassword.controller");

// Đổi mật khẩu
router.post("/:id", userController.changePassword);

module.exports = router;
