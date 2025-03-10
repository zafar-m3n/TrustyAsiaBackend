const User = require("../../models/UserModel");
const Review = require("../../models/ReviewModel");
const Business = require("../../models/BusinessModel");
const { Op } = require("sequelize");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalBusinesses = await Business.count();
    const totalReviews = await Review.count();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBusinesses,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Error fetching dashboard stats." });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const latestUsers = await User.findAll({
      attributes: ["id", "name", "email", "created_at"],
      limit: 5,
      order: [["created_at", "DESC"]],
    });

    const latestReviews = await Review.findAll({
      attributes: ["id", "content", "rating", "title", "created_at"],
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: Business, attributes: ["id", "name", "logo_url", "website_url"] },
      ],
      limit: 5,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: {
        latestUsers,
        latestReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ success: false, message: "Error fetching recent activity." });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
};
