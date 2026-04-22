const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  gameType: {
    type: String,
    enum: ["tic-tac-toe", "rock-paper-scissors", "guess-number"],
    required: true,
  },
  players: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["waiting", "in-progress", "completed"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GameRoom", gameRoomSchema);