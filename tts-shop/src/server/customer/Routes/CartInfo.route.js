const express = require("express");
const router = express.Router();
const {getPay }  = require("../Controller/CartInfo.controller");

// ⚠️ Lỗi xảy ra nếu dòng dưới đây gọi tới một thuộc tính không tồn tại
router.get("/:id", getPay);


module.exports = router;
