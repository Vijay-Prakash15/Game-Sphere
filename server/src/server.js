require("dotenv").config();

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
    origin: "http://localhost:5173", // 🔥 FIXED
    methods: ["GET", "POST"],
    credentials: true
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