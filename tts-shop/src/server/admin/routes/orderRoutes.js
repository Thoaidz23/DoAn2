// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Lấy danh sách đơn hàng
router.get('/', orderController.getOrders);

// Lấy chi tiết đơn hàng theo mã đơn (code_order)
router.get('/:code', orderController.getOrderByCode);

// Cập nhật trạng thái đơn hàng theo mã đơn (code_order)
router.put('/:code/status', orderController.updateOrder);

router.put("/print/:code", orderController.printOrderIfUnconfirmed);

module.exports = router;  
