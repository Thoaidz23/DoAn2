const express = require("express");
const router = express.Router();
const { refundPaypalPayment } = require("../Controller/Paypal.controller");

// POST /api/paypal/refund
router.post("/refund", refundPaypalPayment);

module.exports = router;
