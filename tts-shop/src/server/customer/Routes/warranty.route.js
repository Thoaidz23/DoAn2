const express = require('express');
const router = express.Router();
const warrantyController = require('../Controller/Warranty.controller');

// Gửi yêu cầu bảo hành
router.post('/', warrantyController.createWarrantyRequest);

// Lấy tất cả yêu cầu bảo hành (admin)
router.get('/', warrantyController.getAllWarrantyRequests);

// Cập nhật trạng thái bảo hành (admin)
router.put('/:id', warrantyController.updateWarrantyStatus);

module.exports = router;
