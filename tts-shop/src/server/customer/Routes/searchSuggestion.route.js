const express = require('express');
const router = express.Router();
const searchSuggestionController = require('../Controller/searchSuggestion.controller');

// ✅ Gọi đúng tên hàm đã export
router.get('/search-suggestion', searchSuggestionController.getSearchSuggestions);

module.exports = router;
