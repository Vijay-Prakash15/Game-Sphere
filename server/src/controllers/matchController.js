const Match = require("../models/Match");
const User = require("../models/User");

// Get Match History for Currently Logged-in User
exports.getUserMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find({
      $or: [{ player1Id: userId }, { player2Id: userId }]
    })
      .populate("player1Id player2Id winnerId loserId", "name avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    res.json({ success: true, matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Match Details by ID
exports.getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id)
      .populate("player1Id player2Id winnerId loserId", "name avatar");

    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    res.json({ success: true, match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Match Details by Room Code (for Results Page)
exports.getMatchByRoomCode = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const match = await Match.findOne({ roomCode })
      .populate("player1Id player2Id winnerId loserId", "name avatar");

    if (!match) {
      return res.status(404).json({ success: false, message: "Match not found" });
    }

    res.json({ success: true, match });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Optimized Leaderboards database-side
exports.getLeaderboard = async (req, res) => {
  try {
    const { gameType } = req.params;
    const gameKey = gameType.replace(/-/g, '');

    const allowedKeys = ["tictactoe", "rockpaperscissors", "guessNumber", "snake"];
    if (!allowedKeys.includes(gameKey)) {
      return res.status(400).json({ success: false, message: "Invalid game type" });
    }

    const sortField = gameKey === "snake" ? "stats.snake.bestScore" : `stats.${gameKey}.wins`;

    const leaderboardUsers = await User.find({ [sortField]: { $gt: 0 } })
      .sort({ [sortField]: -1 })
      .limit(10)
      .select(`name avatar stats.${gameKey} totalWins totalMatches`);

    // Format leaderboard output
    const leaderboard = leaderboardUsers.map(user => {
      const gStats = user.stats[gameKey] || {};
      return {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        wins: gameKey === "snake" ? undefined : gStats.wins || 0,
        losses: gameKey === "snake" ? undefined : gStats.losses || 0,
        matchesPlayed: gameKey === "snake" ? undefined : gStats.totalRounds || 0,
        bestScore: gameKey === "snake" ? gStats.bestScore || 0 : undefined,
        winRate: gameKey !== "snake" && gStats.totalRounds ? ((gStats.wins / gStats.totalRounds) * 100).toFixed(1) : 0
      };
    });

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
