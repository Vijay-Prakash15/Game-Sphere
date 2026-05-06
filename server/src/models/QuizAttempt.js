const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  questions: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      selectedAnswer: Number,
      isCorrect: Boolean,
      timeTaken: Number,
    },
  ],
  totalCorrect: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
