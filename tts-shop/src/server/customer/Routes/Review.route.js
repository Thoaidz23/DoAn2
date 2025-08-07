const express = require("express");
const router = express.Router();
const reviewController = require("../Controller/Review.controller");

// Route
router.get("/check-reviewed", reviewController.checkAlreadyReviewed);
router.get("/check-purchased", reviewController.hasPurchasedProduct);

router.post("/", reviewController.addReview);

// Thêm route
router.put("/:id", reviewController.updateReview);

router.get("/:productId", reviewController.getReviewsByProduct);

module.exports = router;
