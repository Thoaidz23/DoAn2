const express = require("express");
const router = express.Router();
const { compareProducts } = require("../Controller/Compare.controller");

router.get("/compare", compareProducts);

module.exports = router;
