const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const matchRoutes = require("./routes/matchRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

// ✅ CORS FIX (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Rate Limiter middleware
const rateLimiter = require("./middleware/rateLimiter");
app.use("/api", rateLimiter(200, 15 * 60 * 1000)); // 200 requests per 15 mins

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