const mongoose = require("mongoose");

const snakeScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  foodEaten: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SnakeScore", snakeScoreSchema);
