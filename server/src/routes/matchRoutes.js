const express = require("express");
const router = express.Router();
const {
  getUserMatches,
  getLeaderboard,
  getMatchById,
  getMatchByRoomCode,
} = require("../controllers/matchController");
const authMiddleware = require("../middleware/auth");

// Paginated match history for current user
router.get("/", authMiddleware, getUserMatches);

// Retrieve leaderboard for specific games (public)
router.get("/leaderboard/:gameType", getLeaderboard);

// Retrieve details of a specific match by ID
router.get("/:id", authMiddleware, getMatchById);

// Retrieve match details by Room Code (for Results Page)
router.get("/room/:roomCode", authMiddleware, getMatchByRoomCode);

module.exports = router;
