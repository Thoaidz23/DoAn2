const express = require("express");
const router = express.Router();
const { getAllSpecs } = require("../Controller/parameterController");

router.get("/specs", getAllSpecs);

module.exports = router;
