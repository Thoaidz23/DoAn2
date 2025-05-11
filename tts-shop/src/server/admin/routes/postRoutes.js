const express = require('express');
const router = express.Router();
const upload = require("../middlewares/uploadPost");  // Middleware cho upload ảnh bài viết
const postController = require('../controllers/postController');

// Lấy danh sách bài viết
router.get('/', postController.getPosts);

// Thêm mới bài viết
router.post("/", upload.single("image"), postController.addPost);

// Lấy thông tin bài viết theo ID (cho mục chỉnh sửa)
router.get("/edit/:id", postController.getPostById);

// Cập nhật bài viết theo ID
router.put("/:id", upload.single("image"), postController.editPost);

// Xóa bài viết theo ID
router.delete("/:id", postController.deletePost);

module.exports = router;
