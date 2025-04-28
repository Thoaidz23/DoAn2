const express = require('express');
const router = express.Router();
const categoryProductController = require('../Controller/Menubar.controller');

// Route: Lấy tất cả danh mục sản phẩm
router.get('/', categoryProductController.getAllCategories);

// Route: Lấy danh sách thương hiệu theo danh mục sản phẩm
router.get('/:id/brands', categoryProductController.getBrandsByCategory);

module.exports = router;
