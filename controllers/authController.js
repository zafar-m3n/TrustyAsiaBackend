const userModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.NODE_TRUSTYASIA_JWT_SECRET, { expiresIn: "1d" });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: newUser.created_at,
      profile_image: newUser.profile_image,
      role: newUser.role,
    };

    res.status(201).send({
      success: true,
      message: "Registered Successfully",
      token: token,
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Internal Server Error ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.NODE_TRUSTYASIA_JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        profile_image: user.profile_image,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Internal Server Error ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: {
        id: req.body.userId,
      },
    });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        profile_image: user.profile_image,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Internal Server Error ${error.message}`,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
};
