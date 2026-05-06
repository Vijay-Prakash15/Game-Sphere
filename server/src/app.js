const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const matchRoutes = require("./routes/matchRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/quiz", quizRoutes);

// error handler
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;