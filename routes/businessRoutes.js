const express = require("express");
const router = express.Router();

const {
  getBusinessesController,
  getBusinessByIdController,
  getBusinessByWebsiteController,
  getCategoriesController,
} = require("../controllers/businessController");

router.get("/businesses", getBusinessesController);
router.get("/businesses/:id", getBusinessByIdController);
router.get("/business/:website", getBusinessByWebsiteController);
router.get("/categories", getCategoriesController);

module.exports = router;
