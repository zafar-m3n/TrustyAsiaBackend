const express = require("express");
const session = require("express-session");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const { connectDB } = require("./config/db");
require("./config/passportSetup");

// ✅ Load Environment Variables
dotenv.config();

// ✅ Connect to Database
connectDB();

// ✅ Load Sequelize Associations
require("./models/associateModels");

// ✅ Create Express App
const app = express();

// ✅ Middleware Setup
app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.NODE_TRUSTYASIA_FRONTEND_URL || "http://localhost:5173",
    credentials: true, 
  })
);

app.use(
  session({
    secret: process.env.NODE_TRUSTYASIA_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_TRUSTYASIA_MODE === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ API Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/businesses", require("./routes/businessRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewRoutes"));
app.use("/api/v1/admin/users", require("./routes/admin/userRoutes"));
app.use("/api/v1/admin/reviews", require("./routes/admin/reviewRoutes"));
app.use("/api/v1/admin/dashboard", require("./routes/admin/dashboardRoutes"));
app.use("/api/v1/admin/businesses", require("./routes/admin/businessRoutes"));

// ✅ Root Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

// ✅ Define Port
const PORT = process.env.NODE_TRUSTYASIA_PORT || 8080;

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT} in ${process.env.NODE_TRUSTYASIA_MODE} mode`.bgCyan.white);
});
