const express = require("express");
const router = express.Router();
const {
  createReviewController,
  getBusinessReviewsController,
  getUserReviewsController,
  updateReviewController,
  deleteReviewController,
} = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createReviewController);

router.get("/business/:businessId", getBusinessReviewsController);

router.get("/user/:userId", getUserReviewsController);

router.put("/:reviewId", authMiddleware, updateReviewController);

router.delete("/:reviewId", authMiddleware, deleteReviewController);

module.exports = router;
