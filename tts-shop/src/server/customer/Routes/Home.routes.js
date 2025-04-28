const express = require('express');
const router = express.Router();

const { getHomeData } = require('../Controller/Home.controller');

router.get('/', getHomeData);

module.exports = router;