const express = require("express");
const router = express.Router();

const {
  getBusinessesController,
  getBusinessByIdController,
  getCategoriesController,
} = require("../controllers/businessController");

router.get("/businesses", getBusinessesController);
router.get("/businesses/:id", getBusinessByIdController);
router.get("/categories", getCategoriesController);

module.exports = router;
