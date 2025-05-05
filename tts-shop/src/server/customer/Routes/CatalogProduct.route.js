const express = require('express');
const router = express.Router();
const catalogProductController = require('../Controller/CatalogProduct.controller');

router.get('/:id_category', catalogProductController.getPostsByCategory);

module.exports = router;
