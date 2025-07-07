const express = require("express");
const router = express.Router();
const reviewController = require("../Controller/Review.controller");

router.get("/:productId", reviewController.getReviewsByProduct);
router.post("/", reviewController.addReview);


module.exports = router;
