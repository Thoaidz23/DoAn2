const express = require("express");
const router = express.Router();
const {updateUserInfo,getUserById} = require("../Controller/UploadAcc.controller");

router.get("/:id", getUserById);
// Route PUT cập nhật thông tin người dùng
router.put("/:id", updateUserInfo);

module.exports = router;
