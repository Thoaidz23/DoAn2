const express = require('express');
const router = express.Router();
const chatController = require('../Controller/chat.controller');

// Định nghĩa các route
router.post('/start', chatController.startChat);
router.post('/send', chatController.sendMessage);

module.exports = router;
