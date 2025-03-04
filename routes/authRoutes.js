const express = require("express");
const { loginController, registerController, authController } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Login Route
router.post("/login", loginController);

// Register Route
router.post("/register", registerController);

router.post("/me", authMiddleware, authController);

module.exports = router;
