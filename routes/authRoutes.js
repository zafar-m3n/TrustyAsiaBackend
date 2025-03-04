const express = require("express");
const { loginController, registerController } = require("../controllers/authController");

const router = express.Router();

// Login Route
router.post("/login", loginController);

// Register Route
router.post("/register", registerController);

module.exports = router;
