const express = require("express");
const cors = require("cors");   // ✅ ADD THIS
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ CORS yaha lagao (TOP me)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// // ❗ DEBUG (add this temporarily)
// app.use((req, res, next) => {
//   console.log("BODY:", req.body);
//   next();
// });

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;