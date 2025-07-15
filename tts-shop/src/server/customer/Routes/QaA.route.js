const express = require('express');
const router = express.Router();
const qnaController = require('../Controller/QaA.controller');

// Dùng đúng tên hàm đã export
router.get('/', qnaController.getAllQnA);
router.post('/question', qnaController.postQuestion);
router.post('/reply', qnaController.postReply);

// ✅ Thêm các route xóa
router.delete("/question/:id", qnaController.deleteQuestion);
router.delete("/reply/:id", qnaController.deleteReply);

module.exports = router;
