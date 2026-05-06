const Match = require("../models/Match");
const User = require("../models/User");

// Get Match History
exports.getUserMatches = async (req, res) => {
  try {
    const userId = req.params.userId;
    const matches = await Match.find({
      $or: [{ player1Id: userId }, { player2Id: userId }]
    }).populate("player1Id player2Id", "name avatar").sort("-completedAt");

    res.json({ success: true, matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { gameType } = req.params;
    let users = await User.find().select("name stats totalMatches totalWins");

    // Map to game specific stats
    if (gameType && gameType !== "all") {
        const gameKey = gameType.replace(/-/g, '');
        users = users.map(user => ({
            name: user.name,
            wins: user.stats[gameKey]?.wins || 0,
            matchesPlayed: user.stats[gameKey]?.totalRounds || 0, // Using rounds as a proxy for matches played for simple leaderboards
            winRate: user.stats[gameKey]?.totalRounds ? (user.stats[gameKey]?.wins / user.stats[gameKey]?.totalRounds * 100).toFixed(2) : 0
        })).sort((a,b) => b.wins - a.wins);
    }

    res.json({ success: true, leaderboard: users.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
