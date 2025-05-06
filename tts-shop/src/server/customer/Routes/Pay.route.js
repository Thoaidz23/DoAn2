const express = require('express');
const router = express.Router();
const PayController  = require('../Controller/Pay.controller');

router.post('/addpay', PayController.addToPay);

module.exports = router;
