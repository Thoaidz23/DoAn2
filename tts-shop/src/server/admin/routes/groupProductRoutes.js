const express = require('express');
const router = express.Router();
const upload = require("../middlewares/uploadProduct");  
const groupProductController = require('../controllers/groupProductController');
// Lấy tất cả dòng sản phẩm
router.get('/', groupProductController.getAllProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/edit/:id', groupProductController.getGroupProductById);

// Thêm route mới để lấy danh mục sản phẩm
router.get('/categories', groupProductController.getProductCag);

// Lấy danh mục thương hiệu
router.get('/brands', groupProductController.getBrandCategory);

// Các route cho RAM, ROM, và Color dưới /api/products
router.get('/ram', groupProductController.getRamOptions); // Lấy dữ liệu RAM
router.get('/rom', groupProductController.getRomOptions); // Lấy dữ liệu ROM
router.get('/color', groupProductController.getColorOptions); // Lấy dữ liệu Color

// Thêm sản phẩm mới
router.post('/add', upload.single("image"), (req, res) => {
  groupProductController.addProduct(req, res);
});

// Cập nhật thông tin sản phẩm
router.put('/update/:id', upload.single("image"), (req, res) => {
  groupProductController.updateProduct(req, res);  // Gọi controller xử lý cập nhật
});

module.exports = router;
