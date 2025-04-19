// routes/cagpostRoutes.js

const express = require('express');
const router = express.Router();
const cagpostController = require('../controllers/cagpostController');

// Lấy danh sách bài viết
router.get('/', cagpostController.getCagposts);

module.exports = router;
