const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Access Denied" });
    }

    jwt.verify(token, process.env.NODE_TRUSTYASIA_JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
      }

      const user = await User.findByPk(decoded.id);

      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden: Admin Access Required" });
      }

      req.admin = user; // Attach admin user details
      next();
    });
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = adminMiddleware;
