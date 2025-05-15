const express = require('express');
const router = express.Router();
const upload = require("../middlewares/uploadProduct");  
const groupProductController = require('../controllers/groupProductController');

// Lấy tất cả dòng sản phẩm
router.get('/', groupProductController.getAllProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/edit/:id', groupProductController.getGroupProductById);

// Lấy danh mục sản phẩm và thương hiệu
router.get('/categories', groupProductController.getProductCag);
router.get('/brands', groupProductController.getBrandCategory);

// Các option cấu hình
router.get('/ram', groupProductController.getRamOptions);
router.get('/rom', groupProductController.getRomOptions);
router.get('/color', groupProductController.getColorOptions);

// Thêm và cập nhật sản phẩm
router.post('/add', upload.single("image"), groupProductController.addProduct);
router.post('/update/:id', upload.single("image"), groupProductController.updateProduct);

// Quản lý ảnh phụ
router.get('/images/:id', groupProductController.getProductImages);
router.post('/images/upload/:id', upload.single("image"), groupProductController.uploadProductImage);
router.delete('/images/delete/:imageId', groupProductController.deleteProductImage);

module.exports = router;
