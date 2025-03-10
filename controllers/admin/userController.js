const bcrypt = require("bcryptjs");
const User = require("../../models/UserModel");

// ✅ Get all users (Paginated)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: ["id", "name", "email", "role", "created_at"],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error fetching users." });
  }
};

// ✅ Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // ✅ Check if the email already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // ✅ Remove password before sending response
    const { password: _, ...userResponse } = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Error creating user." });
  }
};

// ✅ Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "created_at"],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Error fetching user." });
  }
};

// ✅ Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let updatedFields = { name, email, role };

    // ✅ Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    await user.update(updatedFields);

    // ✅ Remove password from response
    const { password: _, ...updatedUser } = user.toJSON();

    res.status(200).json({ success: true, message: "User updated successfully.", data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Error updating user." });
  }
};

// ✅ Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await user.destroy();

    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Error deleting user." });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
