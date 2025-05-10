// routes/resetPassword.js
const express = require('express');
const router = express.Router();
const { resetPassword } = require('../Controller/Newpassword.controller');

router.post('/api/password/reset', resetPassword);

module.exports = router;
