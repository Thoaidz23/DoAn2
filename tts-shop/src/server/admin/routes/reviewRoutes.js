const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/:id_group_product", reviewController.getReviewsByGroup);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
