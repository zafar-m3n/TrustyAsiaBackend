const { Op } = require("sequelize");
const Review = require("../models/ReviewModel");
const Business = require("../models/BusinessModel");
const User = require("../models/UserModel");

// 1️⃣ Create a Review
const createReviewController = async (req, res) => {
  try {
    const { business_id, rating, title, content } = req.body;

    if (!business_id || !rating || !content) {
      return res.status(400).json({ success: false, message: "Business ID, rating, and content are required." });
    }

    const business = await Business.findByPk(business_id);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    // Create the review
    const review = await Review.create({
      user_id: req.body.userId,
      business_id,
      rating,
      title,
      content,
    });

    const reviews = await Review.findAll({ where: { business_id } });
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    await business.update({
      rating: avgRating,
      review_count: reviews.length,
    });

    res.status(201).json({ success: true, message: "Review created successfully.", data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating review." });
  }
};

// 2️⃣ Get All Reviews for a Business
const getBusinessReviewsController = async (req, res) => {
  try {
    const { businessId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required." });
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { business_id: businessId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "profile_image"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Error fetching business reviews: ${error.message}`,
    });
  }
};

// 3️⃣ Get All Reviews by a User
const getUserReviewsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { user_id: userId },
      include: [{ model: Business, attributes: ["id", "name", "logo_url", "website_url"] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user reviews." });
  }
};

// 4️⃣ Update a Review
const updateReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, content } = req.body;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (review.user_id !== req.body.userId) {
      return res.status(403).json({ success: false, message: "You can only edit your own reviews." });
    }

    await review.update({ rating, title, content });

    // Update business rating
    const reviews = await Review.findAll({ where: { business_id: review.business_id } });
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    await Business.update({ rating: avgRating }, { where: { id: review.business_id } });

    res.status(200).json({ success: true, message: "Review updated successfully.", data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating review." });
  }
};

// 5️⃣ Delete a Review
const deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (review.user_id !== req.body.userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own reviews." });
    }

    const businessId = review.business_id;
    await review.destroy();

    // Update business rating
    const reviews = await Review.findAll({ where: { business_id: businessId } });
    const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

    await Business.update({ rating: avgRating, review_count: reviews.length }, { where: { id: businessId } });

    res.status(200).json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting review." });
  }
};

module.exports = {
  createReviewController,
  getBusinessReviewsController,
  getUserReviewsController,
  updateReviewController,
  deleteReviewController,
};
