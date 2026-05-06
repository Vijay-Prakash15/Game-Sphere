const express = require("express");
const router = express.Router();
const {
  createRoom,
  joinRoom,
} = require("../controllers/roomController");

const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.get("/:code", authMiddleware, async (req, res) => {
  try {
    const GameRoom = require("../models/GameRoom");
    const room = await GameRoom.findOne({ code: req.params.code });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;