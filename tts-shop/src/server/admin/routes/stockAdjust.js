const express = require("express");
const router = express.Router();
const stockAdjust = require("../controllers/stockAdjustController");

router.get("/", stockAdjust.getAll);            // danh sách điều chỉnh
router.get("/:id", stockAdjust.getDetail);      // chi tiết phiếu
router.post("/", stockAdjust.create);           // tạo phiếu điều chỉnh

module.exports = router;
