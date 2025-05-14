const express = require("express");
const router = express.Router();
const {updateUserInfo,getUserById ,lockUserAccount} = require("../Controller/UploadAcc.controller");

router.get("/:id", getUserById);
// Route PUT cập nhật thông tin người dùng
router.put("/:id", updateUserInfo);
router.put("/lock-account/:id", lockUserAccount);

module.exports = router;
