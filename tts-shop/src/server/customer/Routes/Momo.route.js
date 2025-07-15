const express = require('express');
const router = express.Router();
const momoController = require('../Controller/Momo.controller');

router.post('/create-payment-url', momoController.createMomoPaymentUrl);
router.post('/ipn', momoController.handleMomoIPN);

module.exports = router;
