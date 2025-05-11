const express = require('express');
const router = express.Router();
const postController = require('../Controller/catalognews.controller');

// GET tất cả bài viết
router.get('/all', postController.getAllPosts);


module.exports = router;
