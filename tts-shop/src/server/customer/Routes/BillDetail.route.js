const express = require('express');
const router = express.Router();
const { getOrderDetail } = require('../Controller/BillDetail.controller');
const { Cancel } = require('../Controller/CancelOrder.controller');

router.get('/:code_order', getOrderDetail);
router.put('/cancel/:code_order', Cancel);

module.exports = router;

