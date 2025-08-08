// server/admin/routes/warrantyRoutes.js

const express = require("express");
const router = express.Router();
const warrantyController = require("../controllers/warrantyController");

// Lấy danh sách bảo hành
router.get("/", warrantyController.getAllWarrantyRequests);

// Lấy chi tiết bảo hành theo mã đơn (code_order)
router.get('/:code', warrantyController.getWarrantyByCode);

// Cập nhật trạng thái bảo hành
router.put("/:id", warrantyController.updateWarrantyStatus);

module.exports = router;
