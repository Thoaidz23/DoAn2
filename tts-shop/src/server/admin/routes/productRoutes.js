// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Lấy danh sách sản phẩm
router.get('/', productController.getProducts);

// Thêm một sản phẩm mới
router.post('/', productController.addProduct);

module.exports = router;
