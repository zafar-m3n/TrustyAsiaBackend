const Business = require("../../models/BusinessModel");
const Category = require("../../models/CategoryModel");
const Review = require("../../models/ReviewModel");
const { Op } = require("sequelize");

// ✅ Get All Businesses (Paginated & Filtered)
const getAllBusinessesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category_id } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {
      ...(search ? { name: { [Op.like]: `%${search}%` } } : {}),
      ...(category_id ? { category_id } : {}),
    };

    const { count, rows } = await Business.findAndCountAll({
      where: whereCondition,
      include: [{ model: Category, attributes: ["id", "name"] }],
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
    console.error("Error fetching businesses:", error);
    res.status(500).json({ success: false, message: "Error fetching businesses." });
  }
};

// ✅ Get Single Business by ID
const getBusinessByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findByPk(id, {
      include: [{ model: Category, attributes: ["id", "name"] }],
    });

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(500).json({ success: false, message: "Error fetching business." });
  }
};

// ✅ Create a New Business
const createBusinessAdmin = async (req, res) => {
  try {
    const { name, description, category_id, location, logo_url, website_url } = req.body;

    if (!name || !category_id) {
      return res.status(400).json({ success: false, message: "Name and category are required." });
    }

    const newBusiness = await Business.create({
      name,
      description,
      category_id,
      location,
      logo_url,
      website_url,
    });

    res.status(201).json({
      success: true,
      message: "Business created successfully.",
      data: newBusiness,
    });
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({ success: false, message: "Error creating business." });
  }
};

// ✅ Update Business
const updateBusinessAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, location, logo_url, website_url } = req.body;

    const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    await business.update({ name, description, category_id, location, logo_url, website_url });

    res.status(200).json({ success: true, message: "Business updated successfully.", data: business });
  } catch (error) {
    console.error("Error updating business:", error);
    res.status(500).json({ success: false, message: "Error updating business." });
  }
};

// ✅ Delete Business (Cascade delete reviews)
const deleteBusinessAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findByPk(id);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found." });
    }

    // Delete all associated reviews before deleting the business
    await Review.destroy({ where: { business_id: id } });

    await business.destroy();

    res.status(200).json({ success: true, message: "Business deleted successfully." });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ success: false, message: "Error deleting business." });
  }
};

module.exports = {
  getAllBusinessesAdmin,
  getBusinessByIdAdmin,
  createBusinessAdmin,
  updateBusinessAdmin,
  deleteBusinessAdmin,
};
