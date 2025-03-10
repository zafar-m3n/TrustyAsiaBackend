const express = require("express");
const router = express.Router();
const { getDashboardStats, getRecentActivity } = require("../../controllers/admin/dashboardController");
const adminMiddleware = require("../../middlewares/adminMiddleware");

// ✅ Route: Get Dashboard Stats
router.get("/stats", adminMiddleware, getDashboardStats);

// ✅ Route: Get Recent Activity
router.get("/recent", adminMiddleware, getRecentActivity);

module.exports = router;
