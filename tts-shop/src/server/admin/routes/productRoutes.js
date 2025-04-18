const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById } = require('../controllers/productController');

// Lấy tất cả sản phẩm (danh sách)
router.get('/', getAllProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductById);

module.exports = router;
