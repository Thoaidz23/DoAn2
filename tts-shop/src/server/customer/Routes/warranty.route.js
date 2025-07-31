const express = require('express');
const router = express.Router();
const warrantyController = require('../Controller/Warranty.controller');

// Gửi yêu cầu bảo hành
router.post('/', warrantyController.createWarrantyRequest);

module.exports = router;
