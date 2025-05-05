const express = require('express');
const router = express.Router();
const upload = require("../middlewares/uploadBanner");  
const bannerController = require('../controllers/bannerController');

// Lấy danh sách banner
router.get('/', bannerController.getBanners);

// Thêm mới banner
router.post("/", upload.single("image"), bannerController.addBanner);

router.get("/edit/:id", bannerController.getBannerById);
router.put("/:id", upload.single("image"), bannerController.editBanner);

router.delete("/:id", bannerController.deleteBanner);


module.exports = router;
