const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const { getUserProfile, saveSnakeScore } = require("../controllers/userController");

// 🔐 GET CURRENT USER
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User
      .findById(req.user.id)
      .select("-password"); // password hide

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔐 GET USER PROFILE STATS & HISTORY
router.get("/profile/:userId", auth, getUserProfile);

// 🔐 SAVE SNAKE SCORE
router.post("/snake/score", auth, saveSnakeScore);

module.exports = router;