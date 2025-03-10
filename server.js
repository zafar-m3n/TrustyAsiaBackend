const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

// Load Associations
require("./models/associateModels");

// Rest Object
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/businesses", require("./routes/businessRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewRoutes"));
app.use("/api/v1/admin/users", require("./routes/admin/userRoutes"));

// Routes
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server Running",
  });
});

// Port
const port = process.env.NODE_TRUSTYASIA_PORT || 8080;

// Listen Port
app.listen(port, () => {
  console.log(`Server Running on Port ${port} in ${process.env.NODE_TRUSTYASIA_MODE} mode`.bgCyan.white);
});
