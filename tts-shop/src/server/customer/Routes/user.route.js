const express = require('express');
const router = express.Router();
const { register, login } = require('../Controller/user.controller');

// Route đăng ký
router.post('/register', register);

// Route đăng nhập
router.post('/login', login);

module.exports = router;
