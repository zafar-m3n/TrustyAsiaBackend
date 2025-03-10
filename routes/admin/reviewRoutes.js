const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  bulkCreateReviews,
} = require("../../controllers/admin/reviewController");
const adminMiddleware = require("../../middlewares/adminMiddleware");

// ✅ Get all reviews (Paginated)
router.get("/", adminMiddleware, getAllReviews);

// ✅ Get a single review by ID
router.get("/:id", adminMiddleware, getReviewById);

// ✅ Create a new review
router.post("/", adminMiddleware, createReview);

// ✅ Update a review
router.patch("/:id", adminMiddleware, updateReview);

// ✅ Delete a review
router.delete("/:id", adminMiddleware, deleteReview);

// ✅ Bulk Insert Reviews (CSV Data)
router.post("/bulk", adminMiddleware, bulkCreateReviews);

module.exports = router;
