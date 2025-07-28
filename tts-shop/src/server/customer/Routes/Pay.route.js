const express = require('express');
const router = express.Router();
const payController = require('../Controller/Pay.controller');

// Các route đã có
router.post('/addpay', payController.addToPay);

// ✅ Thêm route mới
router.post('/generate-order-code', payController.generateOrderCode);

module.exports = router;
