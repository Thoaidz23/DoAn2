// routes/cagpostRoutes.js

const express = require('express');
const router = express.Router();
const cagpostController = require('../controllers/cagpostController');

// Lấy danh sách danh mục bài viết
router.get('/', cagpostController.getCagposts);

// Thêm danh mục bài viết
router.post('/', cagpostController.addCagpost);

// Lấy danh mục bài viết theo ID
router.get('/:id', cagpostController.getCagpostById);
router.put('/:id', cagpostController.updateCagpost);

// Xóa danh mục bài viết theo ID
router.delete('/:id', cagpostController.deleteCagpost);

module.exports = router;
