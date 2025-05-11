// routes/cagbrandRoutes.js

const express = require('express');
const router = express.Router();
const cagbrandController = require('../controllers/cagbrandController');

// Lấy danh sách
router.get('/', cagbrandController.getCagbrands);

// Thêm thương hiệu
router.post('/', cagbrandController.addCagbrand);

// Sửa thương hiệu
router.get('/:id', cagbrandController.getCagbrandById);
router.put('/:id', cagbrandController.updateCagbrand);

// Xóa danh mục theo ID
router.delete('/:id', cagbrandController.deleteProductCategory);

module.exports = router;
