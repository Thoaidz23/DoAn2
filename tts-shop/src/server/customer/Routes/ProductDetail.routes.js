const express = require("express");
const router = express.Router();
const { productController  } = require("../Controller/ProductDetail.controller");

// Route: GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;
