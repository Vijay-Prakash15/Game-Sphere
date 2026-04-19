const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");

// 🔐 GET CURRENT USER
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User
      .findById(req.user.userId)
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

module.exports = router;