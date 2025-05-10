const express = require('express');
const router = express.Router();
const { getPurchaseHistory } = require('../Controller/Order.controller');

router.get('/purchase-history/:id', getPurchaseHistory);

module.exports = router;
