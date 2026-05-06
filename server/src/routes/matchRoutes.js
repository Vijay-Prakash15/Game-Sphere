const express = require("express");
const router = express.Router();
const { getUserMatches, getLeaderboard } = require("../controllers/matchController");
const authMiddleware = require("../middleware/auth");

router.get("/user/:userId", authMiddleware, getUserMatches);
router.get("/leaderboard/:gameType", getLeaderboard);

module.exports = router;
