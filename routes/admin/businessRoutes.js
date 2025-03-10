const express = require("express");
const {
  getAllBusinessesAdmin,
  getBusinessByIdAdmin,
  createBusinessAdmin,
  updateBusinessAdmin,
  deleteBusinessAdmin,
} = require("../../controllers/admin/businessController");
const adminMiddleware = require("../../middlewares/adminMiddleware");

const router = express.Router();

// ✅ Get all businesses (Admin)
router.get("/", adminMiddleware, getAllBusinessesAdmin);

// ✅ Get a single business (Admin)
router.get("/:id", adminMiddleware, getBusinessByIdAdmin);

// ✅ Create a business (Admin)
router.post("/", adminMiddleware, createBusinessAdmin);

// ✅ Update a business (Admin)
router.put("/:id", adminMiddleware, updateBusinessAdmin);

// ✅ Delete a business (Admin)
router.delete("/:id", adminMiddleware, deleteBusinessAdmin);

module.exports = router;
