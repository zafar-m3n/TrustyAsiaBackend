const { Op } = require("sequelize");
const Business = require("../models/BusinessModel");
const Category = require("../models/CategoryModel");

// Get all businesses with search, filter, and pagination
const getBusinessesController = async (req, res) => {
  try {
    const {
      search,
      category_id,
      location,
      minRating,
      sortBy = "created_at",
      sortOrder = "DESC", 
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (category_id) {
      const categoryIds = category_id.split(",").map((id) => parseInt(id.trim()));
      where.category_id = { [Op.in]: categoryIds };
    }

    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }

    if (minRating) {
      where.rating = { [Op.gte]: parseFloat(minRating) };
    }

    const validSortFields = {
      rating: "rating",
      name: "name",
      reviews: "review_count",
    };
    const sortField = validSortFields[sortBy] || "created_at";

    const offset = (page - 1) * limit;

    const { count, rows } = await Business.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ["name"] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder.toUpperCase()]],
    });

    res.status(200).send({
      success: true,
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: `Error fetching businesses: ${error.message}`,
    });
  }
};

// Get single business by ID
const getBusinessByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findByPk(id, {
      include: [{ model: Category, attributes: ["name"] }],
    });

    if (!business) {
      return res.status(404).send({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).send({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: `Error fetching business: ${error.message}`,
    });
  }
};

// Get all categories
const getCategoriesController = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.status(200).send({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: `Error fetching categories: ${error.message}`,
    });
  }
};

module.exports = {
  getBusinessesController,
  getBusinessByIdController,
  getCategoriesController,
};
