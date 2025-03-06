const Business = require("./BusinessModel");
const User = require("./UserModel");
const Review = require("./ReviewModel");

// Business ↔ Reviews
Business.hasMany(Review, { foreignKey: "business_id", onDelete: "CASCADE" });
Review.belongsTo(Business, { foreignKey: "business_id", onDelete: "CASCADE" });

// User ↔ Reviews
User.hasMany(Review, { foreignKey: "user_id", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

module.exports = { Business, User, Review };
