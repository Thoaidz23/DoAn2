const express = require('express');
const router = express.Router();
const cartController = require('../Controller/CartPage.controller');

router.get('/:userId', cartController.getCart);
router.put('/update', cartController.updateQuantity);
router.delete('/delete', cartController.deleteFromCart);

module.exports = router;
