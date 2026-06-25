const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    totalMatches: { type: Number, default: 0 },
    totalWins: { type: Number, default: 0 },
    totalLosses: { type: Number, default: 0 },
    stats: {
        tictactoe: { wins: { type: Number, default: 0 }, losses: { type: Number, default: 0 }, totalRounds: { type: Number, default: 0 } },
        rockpaperscissors: { wins: { type: Number, default: 0 }, losses: { type: Number, default: 0 }, totalRounds: { type: Number, default: 0 } },
        guessNumber: { wins: { type: Number, default: 0 }, losses: { type: Number, default: 0 }, totalRounds: { type: Number, default: 0 } },
        quiz: { totalAttempts: { type: Number, default: 0 }, avgScore: { type: Number, default: 0 } },
        snake: { bestScore: { type: Number, default: 0 } }
    },
    avatar: { type: String },
    lastLogin: { type: Date }
}, { timestamps: true });

userSchema.index({ "stats.tictactoe.wins": -1 });
userSchema.index({ "stats.rockpaperscissors.wins": -1 });
userSchema.index({ "stats.guessNumber.wins": -1 });
userSchema.index({ "stats.snake.bestScore": -1 });

module.exports = mongoose.model("User", userSchema);