const express = require("express");
const { loginController, registerController, authController } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Login Route
router.post("/login", loginController);

// Register Route
router.post("/register", registerController);

router.post("/me", authMiddleware, authController);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/redirect", passport.authenticate("google"), async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.NODE_TRUSTYASIA_FRONTEND_URL}/login`);
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: req.user.id }, process.env.NODE_TRUSTYASIA_JWT_SECRET, {
      expiresIn: "1d",
    });

    res.redirect(
      `${process.env.NODE_TRUSTYASIA_FRONTEND_URL}/auth/success?token=${token}&id=${
        req.user.id
      }&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(
        req.user.email
      )}&profile_image=${encodeURIComponent(req.user.profile_image)}&role=${req.user.role}`
    );
  } catch (error) {
    console.log("Google OAuth Error:", error);
    res.redirect(`${process.env.NODE_TRUSTYASIA_FRONTEND_URL}/login`);
  }
});

module.exports = router;
