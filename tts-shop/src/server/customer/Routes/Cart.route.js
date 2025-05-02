const express = require('express');
const router = express.Router();
const CartController  = require('../Controller/Cart.controller');

router.post('/add', CartController.addToCart);

module.exports = router;
