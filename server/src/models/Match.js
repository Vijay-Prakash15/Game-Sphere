const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameRoom",
  },
  gameType: {
    type: String,
    enum: ["tic-tac-toe", "rock-paper-scissors", "guess-number"],
    required: true,
  },
  player1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  player2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rounds: [
    {
      roundNumber: Number,
      player1Move: mongoose.Schema.Types.Mixed,
      player2Move: mongoose.Schema.Types.Mixed,
      winner: {
        type: String,
        enum: ["player1", "player2", "draw"],
      },
      duration: Number,
    },
  ],
  finalWinner: {
    type: String,
    enum: ["player1", "player2", "draw"],
  },
  player1Score: {
    type: Number,
    default: 0,
  },
  player2Score: {
    type: Number,
    default: 0,
  },
  totalDuration: Number,
  completedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Match", matchSchema);
