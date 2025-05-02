// routes/cagproductRoutes.js

const express = require('express');
const router = express.Router();
const cagproductController = require('../controllers/cagproductController');

// Lấy danh sách danh muc
router.get('/', cagproductController.getCagproducts);

// Thêm danh mục
router.post('/', cagproductController.addProductCategory);

router.get('/:id', cagproductController.getProductCategoryById); // ✅ Lấy chi tiết 1 danh mục
router.put('/:id', cagproductController.updateProductCategory);  // ✅ Cập nhật danh mục

// Xóa danh mục theo ID
router.delete('/:id', cagproductController.deleteProductCategory);


module.exports = router;
