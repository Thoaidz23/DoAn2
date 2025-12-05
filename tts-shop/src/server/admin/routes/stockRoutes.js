const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.post("/import", stockController.importStock);
router.get("/", stockController.getAllStock);

// ⚠️ Route lịch sử phải đặt TRƯỚC /:id_stock
router.get("/history/:id_product", stockController.getHistoryByProduct);

router.get("/:id_stock", stockController.getStockDetail);

module.exports = router;
