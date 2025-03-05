const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Category = require("./CategoryModel");

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "businesses",
    timestamps: false,
  }
);

// Define associations
Business.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Business, { foreignKey: "category_id" });

module.exports = Business;
