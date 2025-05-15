const express = require("express");
const router = express.Router();
const { getFooterInfo } = require("../Controller/Footer.controller");

router.get("/", getFooterInfo);

module.exports = router;
