const express = require("express");
const router = express.Router();
const groupProductController  = require("../Controller/ProductDetail.controller");

// ⚠️ Lỗi xảy ra nếu dòng dưới đây gọi tới một thuộc tính không tồn tại
router.get("/:id", groupProductController.getProductDetail);

module.exports = router;
