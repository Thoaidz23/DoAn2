// Router: postRouter.js
const express = require('express');
const router = express.Router();
const postController = require('../Controller/PostDetail.controller');

// Route để lấy bài viết theo id
router.get('/posts/:id_post', postController.getPostById);

module.exports = router;
