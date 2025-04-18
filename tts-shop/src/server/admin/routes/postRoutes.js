// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Lấy danh sách
router.get('/', postController.getPosts);


module.exports = router;