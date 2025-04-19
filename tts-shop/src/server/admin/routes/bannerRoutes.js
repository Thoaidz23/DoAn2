// routes/bannerRoutes.js

const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// Lấy danh sách banner
router.get('/', bannerController.getBanners);


module.exports = router;
