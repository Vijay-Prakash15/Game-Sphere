const User = require("../models/User");
const Match = require("../models/Match");
const SnakeScore = require("../models/SnakeScore");

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch last 10 matches for history and streak calculation
    const matches = await Match.find({
      $or: [{ player1Id: userId }, { player2Id: userId }]
    })
      .sort("-createdAt")
      .limit(10)
      .populate("player1Id player2Id", "name avatar");

    // Calculate Favorite Game
    let favoriteGame = "None";
    let maxRounds = 0;
    const stats = user.stats || {};
    
    const games = [
      { name: "Tic Tac Toe", rounds: stats.tictactoe?.totalRounds || 0 },
      { name: "Rock Paper Scissors", rounds: stats.rockpaperscissors?.totalRounds || 0 },
      { name: "Guess the Number", rounds: stats.guessNumber?.totalRounds || 0 },
    ];

    games.forEach(g => {
      if (g.rounds > maxRounds) {
        maxRounds = g.rounds;
        favoriteGame = g.name;
      }
    });

    // Calculate Win Streak
    let currentStreak = 0;
    let bestStreak = 0;
    
    // Sort matches from oldest to newest for streak calculation
    const sortedMatches = [...matches].reverse();
    
    sortedMatches.forEach(m => {
      const isPlayer1 = m.player1Id._id.toString() === userId;
      const isWinner = (isPlayer1 && m.finalWinner === "player1") || (!isPlayer1 && m.finalWinner === "player2");
      
      if (isWinner) {
        currentStreak++;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
      } else if (m.finalWinner !== "draw") {
        currentStreak = 0;
      }
    });

    const winRate = user.totalMatches > 0 
      ? ((user.totalWins / user.totalMatches) * 100).toFixed(1) 
      : "0.0";

    res.json({
      success: true,
      user,
      stats: {
        totalGames: user.totalMatches,
        wins: user.totalWins,
        losses: user.totalLosses,
        winRate,
        favoriteGame,
        bestWinStreak: bestStreak
      },
      matchHistory: matches
    });

  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.saveSnakeScore = async (req, res) => {
  try {
    const { score, foodEaten, duration } = req.body;
    const userId = req.user.id;

    if (score === undefined) {
      return res.status(400).json({ success: false, message: "Score is required" });
    }

    const snakeScore = new SnakeScore({
      userId,
      score,
      foodEaten: foodEaten || 0,
      duration: duration || 0
    });

    await snakeScore.save();

    // Update user's best score if applicable
    const user = await User.findById(userId);
    if (user) {
      if (!user.stats.snake) {
        user.stats.snake = { bestScore: 0 };
      }
      if (score > user.stats.snake.bestScore) {
        user.stats.snake.bestScore = score;
        await user.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Score saved successfully",
      score: snakeScore
    });

  } catch (err) {
    console.error("Snake score save error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
