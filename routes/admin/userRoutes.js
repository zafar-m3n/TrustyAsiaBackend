const express = require("express");
const router = express.Router();
const adminMiddleware = require("../../middlewares/adminMiddleware");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../controllers/admin/userController");

router.use(adminMiddleware);

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
