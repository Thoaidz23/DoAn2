const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

// Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// ✅ Đặt route này lên trước để tránh hiểu nhầm là ID
router.get('/categories', productController.getProductCag);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Thêm sản phẩm mới
router.post('/', upload.single('hinhanh'), productController.addProduct);

module.exports = router;
