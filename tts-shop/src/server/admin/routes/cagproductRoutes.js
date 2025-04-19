// routes/cagproductRoutes.js

const express = require('express');
const router = express.Router();
const cagproductController = require('../controllers/cagproductController');

// Lấy danh sách sản phẩm
router.get('/', cagproductController.getCagproducts);


module.exports = router;
