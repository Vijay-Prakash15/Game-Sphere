const GameRoom = require("../models/GameRoom");
const generateRoomCode = require("../utils/generateRoomCode");

// CREATE ROOM
exports.createRoom = async (req, res) => {
  try {
    const { gameType } = req.body;
    const userId = req.user.id;
    const name = req.user.name;

    const code = generateRoomCode();

    const room = await GameRoom.create({
      code,
      gameType,
      players: [{ userId, name }],
    });

    res.status(201).json({
      success: true,
      room,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// JOIN ROOM
exports.joinRoom = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;
    const name = req.user.name;

    const room = await GameRoom.findOne({ code });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.players.length >= 2) {
      return res.status(400).json({ message: "Room is full" });
    }

    // Prevent duplicate join
    const alreadyJoined = room.players.find(
      (p) => p.userId.toString() === userId
    );

    if (!alreadyJoined) {
      room.players.push({ userId, name });
    }

    // Start game when 2 players join
    if (room.players.length === 2) {
      room.status = "in-progress";
    }

    await room.save();

    res.json({
      success: true,
      room,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};