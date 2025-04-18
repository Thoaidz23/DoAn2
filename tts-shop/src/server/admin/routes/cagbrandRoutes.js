// routes/cagbrandRoutes.js

const express = require('express');
const router = express.Router();
const cagbrandController = require('../controllers/cagbrandController');

// Lấy danh sách bài viết
router.get('/', cagbrandController.getCagbrands);

module.exports = router;
