const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/:id_group_product", reviewController.getReviewsByGroup);
router.put("/:id/toggle", reviewController.toggleReviewStatus);

module.exports = router;
