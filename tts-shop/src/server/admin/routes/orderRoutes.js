// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Lấy danh sách don hang
router.get('/', orderController.getOrders);

module.exports = router;