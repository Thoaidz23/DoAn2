// server/admin/routes/warrantyRoutes.js

const express = require("express");
const router = express.Router();
const warrantyController = require("../controllers/warrantyController");

router.get("/", warrantyController.getAllWarrantyRequests);
router.put("/:id", warrantyController.updateWarrantyStatus); // 👈 Cập nhật trạng thái

module.exports = router;
