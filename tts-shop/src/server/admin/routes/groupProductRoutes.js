const express = require('express');
const router = express.Router();
const groupProductController = require('../controllers/groupProductController');
// const upload = require('../middlewares/upload');

// Lấy tất cả dòng sản phẩm
router.get('/', groupProductController.getAllProducts);

// ✅ Đặt route này lên trước để tránh hiểu nhầm là ID
// router.get('/categories', productController.getProductCag);

// Lấy chi tiết sản phẩm theo ID
router.get('/detail/:id', groupProductController.getGroupProductDetail);

// Thêm sản phẩm mới
// router.post('/', upload.single('hinhanh'), productController.addProduct);

module.exports = router;
