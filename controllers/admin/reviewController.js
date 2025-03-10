const Review = require("../../models/ReviewModel");
const Business = require("../../models/BusinessModel");
const User = require("../../models/UserModel");
const { Op } = require("sequelize");

// ✅ Get all reviews (Paginated)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? {
          [Op.or]: [{ title: { [Op.like]: `%${search}%` } }, { content: { [Op.like]: `%${search}%` } }],
        }
      : {};

    const { count, rows } = await Review.findAndCountAll({
      where: whereCondition,
      include: [
        { model: Business, attributes: ["id", "name", "logo_url", "website_url"] },
        { model: User, attributes: ["id", "name", "email"] },
      ],
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
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews." });
  }
};

// ✅ Get a single review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        { model: Business, attributes: ["id", "name", "logo_url"] },
        { model: User, attributes: ["id", "name", "email"] },
      ],
    });

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ success: false, message: "Error fetching review." });
  }
};

// ✅ Create a new review (Admin)
const createReview = async (req, res) => {
  try {
    const { user_id, business_id, rating, title, content } = req.body;

    if (!user_id || !business_id || !rating || !content) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newReview = await Review.create({ user_id, business_id, rating, title, content });

    res.status(201).json({
      success: true,
      message: "Review created successfully.",
      data: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Error creating review." });
  }
};

// ✅ Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, content } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    await review.update({ rating, title, content });

    res.status(200).json({ success: true, message: "Review updated successfully.", data: review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Error updating review." });
  }
};

// ✅ Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    await review.destroy();

    res.status(200).json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Error deleting review." });
  }
};

// ✅ Bulk Insert Reviews (CSV Data)
const bulkCreateReviews = async (req, res) => {
  try {
    const { reviews } = req.body;

    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ success: false, message: "Invalid data format." });
    }

    const newReviews = await Review.bulkCreate(reviews);

    res.status(201).json({
      success: true,
      message: `${newReviews.length} reviews added successfully.`,
      data: newReviews,
    });
  } catch (error) {
    console.error("Error bulk inserting reviews:", error);
    res.status(500).json({ success: false, message: "Error inserting reviews." });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  bulkCreateReviews,
};
