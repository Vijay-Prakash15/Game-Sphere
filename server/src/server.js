require("dotenv").config();

// Enforce environment variables presence check
const requiredEnv = ["JWT_SECRET", "MONGO_URI"];
requiredEnv.forEach(envName => {
  if (!process.env[envName]) {
    console.error(`Fatal Startup Error: Missing required environment variable: ${envName}`);
    process.exit(1);
  }
});

const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// ✅ HTTP server
const server = http.createServer(app);

// ✅ Socket.io setup (FIXED)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Socket.io auth middleware
const jwt = require("jsonwebtoken");
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new Error("Authentication error: Token is required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = {
      id: decoded.userId,
      name: decoded.name
    };
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

// ✅ socket handler
const { handleGameSockets } = require("./sockets/gameHandler");
handleGameSockets(io);

// ✅ DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ start server
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});