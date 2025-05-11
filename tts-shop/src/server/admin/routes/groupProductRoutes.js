const express = require('express');
const router = express.Router();

const groupProductController = require('../controllers/groupProductController');

// Lấy tất cả dòng sản phẩm
router.get('/', groupProductController.getAllProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/detail/:id', groupProductController.getGroupProductDetail);

// Thêm route mới để lấy danh mục sản phẩm
router.get('/categories', groupProductController.getProductCag);

// Lấy danh mục thương hiệu
router.get('/brands', groupProductController.getBrandCategory);

// Các route cho RAM, ROM, và Color dưới /api/products
router.get('/ram', groupProductController.getRamOptions); // Lấy dữ liệu RAM
router.get('/rom', groupProductController.getRomOptions); // Lấy dữ liệu ROM
router.get('/color', groupProductController.getColorOptions); // Lấy dữ liệu Color

module.exports = router;
