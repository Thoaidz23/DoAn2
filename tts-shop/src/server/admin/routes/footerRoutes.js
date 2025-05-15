const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footerController');

// Lấy tất cả footer
router.get('/', footerController.getAllFooters);

// Cập nhật footer theo ID
router.put('/:id', footerController.updateFooterById);

module.exports = router;
