const Match = require("../models/Match");
const User = require("../models/User");
const GameRoom = require("../models/GameRoom");

// In-memory room state for fast game loops
const activeRooms = new Map();

const GAME_CONFIG = {
  tictactoe: { moveTimeLimitSeconds: 5, pointsPerWin: 1, boardSize: 3 },
  rps: { choiceTimeLimitSeconds: 5, pointsPerWin: 1 },
  guessNumber: {
    guessTimeLimitSeconds: 5,
    maxGuessesPerRound: 3,
    pointsPerWin: 1,
  },
  matchFormat: { pointsToWin: 2, totalRounds: 3 },
};

const handleGameSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async ({ roomCode, userId }) => {
      try {
        console.log("JOIN ROOM:", roomCode, userId);

        const room = await GameRoom.findOne({ code: roomCode });
        if (!room) {
          return socket.emit("error", { message: "Room not found" });
        }

        socket.join(roomCode);

        let state = activeRooms.get(roomCode);
        if (!state) {
          state = {
            gameType: room.gameType,
            roomId: room._id,
            players: [],
            currentRound: 1,
            p1Score: 0,
            p2Score: 0,
            status: "waiting",
            roundsData: [],
          };
          activeRooms.set(roomCode, state);
        }

        // ✅ ADD / UPDATE PLAYER
        const existingPlayer = state.players.find((p) => p.userId === userId);

        if (!existingPlayer && state.players.length < 2) {
          state.players.push({ socketId: socket.id, userId, ready: true });
        } else if (existingPlayer) {
          existingPlayer.socketId = socket.id;
        }

        console.log("UPDATED PLAYERS:", state.players);

        // ✅ SEND UPDATE TO LOBBY
        io.to(roomCode).emit("room-update", {
          players: state.players,
          status: state.status,
          gameType: state.gameType,
        });

        // ✅ FIX 1: game-state-sync — only necessary fields
        socket.emit("game-state-sync", {
          players: state.players,
          status: state.status,
          gameType: state.gameType,
          p1Score: state.p1Score,
          p2Score: state.p2Score,
        });

        // ✅ START GAME IF 2 PLAYERS
        if (state.players.length === 2 && state.status === "waiting") {
          state.status = "starting"; // prevent duplicate start
          console.log("🔥 STARTING GAME...");
          setTimeout(() => startGame(io, roomCode, state), 500);
        }

        // reconnect sync
        if (state.status === "in_progress") {
          emitGameState(io, roomCode, state);
        }
      } catch (err) {
        console.error("join-room error:", err);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("make-move", (data) => {
      const { roomCode, move } = data;
      const state = activeRooms.get(roomCode);
      if (!state || state.status !== "in_progress") return;

      const playerIndex = state.players.findIndex(
        (p) => p.socketId === socket.id,
      );
      if (playerIndex === -1) return;

      if (state.gameType === "tic-tac-toe") {
        handleTicTacToeMove(io, roomCode, state, playerIndex, move);
      } else if (state.gameType === "rock-paper-scissors") {
        handleRPSMove(io, roomCode, state, playerIndex, move);
      } else if (state.gameType === "guess-number") {
        handleGuessNumberMove(io, roomCode, state, playerIndex, move);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [roomCode, state] of activeRooms.entries()) {
        const playerIndex = state.players.findIndex(
          (p) => p.socketId === socket.id,
        );
        if (playerIndex !== -1 && state.status === "in_progress") {
          socket.to(roomCode).emit("opponent-disconnected", {
            message: "Opponent disconnected. Waiting for reconnect...",
          });
        }
      }
    });
  });
};

// --- Game Flow Controllers ---

const startGame = (io, roomCode, state) => {
  state.status = "in_progress";
  state.currentRound = 1;
  state.p1Score = 0;
  state.p2Score = 0;

  // ✅ FIX 2: game-started — only necessary fields
  io.to(roomCode).emit("game-started", {
    players: state.players,
    status: "in_progress",
    p1Score: state.p1Score,
    p2Score: state.p2Score,
    gameType: state.gameType,
  });

  emitGameState(io, roomCode, state);
  startRound(io, roomCode, state);
};

const startRound = (io, roomCode, state) => {
  state.p1Move = null;
  state.p2Move = null;

  emitGameState(io, roomCode, state);

  if (state.gameType === "tic-tac-toe") {
    state.board = Array(9).fill(null);
    state.turnIndex = (state.currentRound - 1) % 2;

    io.to(roomCode).emit("game-started", {
      round: state.currentRound,
      gameType: state.gameType,
      status: state.status,
      players: state.players,
      turnIndex: state.turnIndex,
      board: state.board,
    });

    startTimer(io, roomCode, state, GAME_CONFIG.tictactoe.moveTimeLimitSeconds);
  } else if (state.gameType === "rock-paper-scissors") {
    io.to(roomCode).emit("game-started", {
      round: state.currentRound,
      gameType: state.gameType,
      status: state.status,
      players: state.players,
      opponentChosen: false,
    });

    startTimer(io, roomCode, state, GAME_CONFIG.rps.choiceTimeLimitSeconds);
  } else if (state.gameType === "guess-number") {
    state.secretNumber = null;
    state.guessesLeft = GAME_CONFIG.guessNumber.maxGuessesPerRound;
    state.pickerIndex = (state.currentRound - 1) % 2;
    state.guesserIndex = state.pickerIndex === 0 ? 1 : 0;

    io.to(roomCode).emit("game-started", {
      round: state.currentRound,
      gameType: state.gameType,
      status: state.status,
      players: state.players,
      pickerIndex: state.pickerIndex,
      guesserIndex: state.guesserIndex,
    });
  }
};

const endRound = async (io, roomCode, state, winnerIndex) => {
  clearTimeout(state.timer);

  let roundWinner = "draw";
  if (winnerIndex === 0) {
    roundWinner = "player1";
    state.p1Score++;
  } else if (winnerIndex === 1) {
    roundWinner = "player2";
    state.p2Score++;
  }

  state.roundsData.push({
    roundNumber: state.currentRound,
    player1Move: state.p1Move,
    player2Move: state.p2Move,
    winner: roundWinner,
    duration: 0,
  });

  io.to(roomCode).emit("round-result", {
    round: state.currentRound,
    winner: roundWinner,
    p1Score: state.p1Score,
    p2Score: state.p2Score,
    nextRoundStartsIn: 3,
  });

  if (
    state.p1Score >= GAME_CONFIG.matchFormat.pointsToWin ||
    state.p2Score >= GAME_CONFIG.matchFormat.pointsToWin
  ) {
    setTimeout(() => endMatch(io, roomCode, state), 3000);
  } else {
    state.currentRound++;
    setTimeout(() => startRound(io, roomCode, state), 3000);
  }
};

const endMatch = async (io, roomCode, state) => {
  state.status = "completed";

  let finalWinner = "draw";
  if (state.p1Score > state.p2Score) finalWinner = "player1";
  else if (state.p2Score > state.p1Score) finalWinner = "player2";

  try {
    const match = new Match({
      roomId: state.roomId,
      gameType: state.gameType,
      player1Id: state.players[0].userId,
      player2Id: state.players[1].userId,
      rounds: state.roundsData,
      finalWinner,
      player1Score: state.p1Score,
      player2Score: state.p2Score,
    });
    await match.save();

    const p1 = await User.findById(state.players[0].userId);
    const p2 = await User.findById(state.players[1].userId);

    if (p1 && p2) {
      const gameKey = state.gameType.replace(/-/g, "");

      p1.totalMatches++;
      p2.totalMatches++;
      if (p1.stats[gameKey]) p1.stats[gameKey].totalRounds++;
      if (p2.stats[gameKey]) p2.stats[gameKey].totalRounds++;

      if (finalWinner === "player1") {
        p1.totalWins++;
        if (p1.stats[gameKey]) p1.stats[gameKey].wins++;
        p2.totalLosses++;
        if (p2.stats[gameKey]) p2.stats[gameKey].losses++;
      } else if (finalWinner === "player2") {
        p2.totalWins++;
        if (p2.stats[gameKey]) p2.stats[gameKey].wins++;
        p1.totalLosses++;
        if (p1.stats[gameKey]) p1.stats[gameKey].losses++;
      }

      await p1.save();
      await p2.save();
    }

    await GameRoom.findByIdAndUpdate(state.roomId, { status: "completed" });
    activeRooms.delete(roomCode);

    io.to(roomCode).emit("match-result", {
      finalWinner,
      p1Score: state.p1Score,
      p2Score: state.p2Score,
      matchId: match._id,
    });
  } catch (err) {
    console.error("Failed to save match:", err);
  }
};

const startTimer = (io, roomCode, state, seconds) => {
  clearTimeout(state.timer);
  state.timer = setTimeout(() => {
    handleTimeout(io, roomCode, state);
  }, seconds * 1000);
};

const handleTimeout = (io, roomCode, state) => {
  if (state.gameType === "tic-tac-toe") {
    const loserIndex = state.turnIndex;
    const winnerIndex = loserIndex === 0 ? 1 : 0;
    io.to(roomCode).emit("turn-timeout", { loserIndex });
    endRound(io, roomCode, state, winnerIndex);
  } else if (state.gameType === "rock-paper-scissors") {
    if (!state.p1Move && !state.p2Move) endRound(io, roomCode, state, -1);
    else if (!state.p1Move) endRound(io, roomCode, state, 1);
    else if (!state.p2Move) endRound(io, roomCode, state, 0);
    else evaluateRPS(io, roomCode, state);
  } else if (state.gameType === "guess-number") {
    state.guessesLeft--;
    io.to(roomCode).emit("opponent-move", {
      hint: "Time's up! Missed guess.",
      guessesLeft: state.guessesLeft,
    });
    if (state.guessesLeft <= 0) {
      endRound(io, roomCode, state, state.pickerIndex);
    } else {
      startTimer(
        io,
        roomCode,
        state,
        GAME_CONFIG.guessNumber.guessTimeLimitSeconds,
      );
    }
  }
};

// --- Tic Tac Toe Logic ---
const handleTicTacToeMove = (io, roomCode, state, playerIndex, move) => {
  if (state.turnIndex !== playerIndex) return;
  if (state.board[move.position] !== null) return;

  clearTimeout(state.timer);

  const symbol = playerIndex === 0 ? "X" : "O";
  state.board[move.position] = symbol;

  if (playerIndex === 0) state.p1Move = move.position;
  else state.p2Move = move.position;

  const nextTurn = playerIndex === 0 ? 1 : 0;
  state.turnIndex = nextTurn;

  io.to(roomCode).emit("opponent-move", {
    board: state.board,
    turnIndex: nextTurn,
    lastMove: { playerIndex, position: move.position },
  });

  const winner = checkTicTacToeWin(state.board);
  if (winner) {
    endRound(io, roomCode, state, playerIndex);
  } else if (state.board.every((c) => c !== null)) {
    endRound(io, roomCode, state, -1);
  } else {
    startTimer(io, roomCode, state, GAME_CONFIG.tictactoe.moveTimeLimitSeconds);
  }
};

const checkTicTacToeWin = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return null;
};

// --- RPS Logic ---
const handleRPSMove = (io, roomCode, state, playerIndex, move) => {
  if (playerIndex === 0) state.p1Move = move.choice;
  if (playerIndex === 1) state.p2Move = move.choice;

  // ✅ 🔥 ADD HERE (IMPORTANT)
  io.to(state.players[playerIndex].socketId).emit("receive-move", {
    success: true,
  });

  const opponentIndex = playerIndex === 0 ? 1 : 0;

  if (state.players[opponentIndex]) {
    io.to(state.players[opponentIndex].socketId).emit("opponent-move", {
      opponentChosen: true,
    });
  }

  if (state.p1Move && state.p2Move) {
    evaluateRPS(io, roomCode, state);
  }
};

const evaluateRPS = (io, roomCode, state) => {
  const p1 = state.p1Move;
  const p2 = state.p2Move;

  io.to(roomCode).emit("opponent-move", {
    p1Choice: p1,
    p2Choice: p2,
    p1Move: p1,
    p2Move: p2,
  });

  if (p1 === p2) {
    endRound(io, roomCode, state, -1);
  } else if (
    (p1 === "R" && p2 === "S") ||
    (p1 === "S" && p2 === "P") ||
    (p1 === "P" && p2 === "R")
  ) {
    endRound(io, roomCode, state, 0);
  } else {
    endRound(io, roomCode, state, 1);
  }
};

// --- Guess Number Logic ---
const handleGuessNumberMove = (io, roomCode, state, playerIndex, move) => {
  clearTimeout(state.timer);

  if (playerIndex === state.pickerIndex) {
    if (move.type === "set-number") {
      state.secretNumber = parseInt(move.number);
      io.to(roomCode).emit("opponent-move", { event: "number-set" });
      startTimer(
        io,
        roomCode,
        state,
        GAME_CONFIG.guessNumber.guessTimeLimitSeconds,
      );
    }
  } else if (
    playerIndex === state.guesserIndex &&
    state.secretNumber !== null
  ) {
    const guess = parseInt(move.guess);
    state.guessesLeft--;

    if (guess === state.secretNumber) {
      io.to(roomCode).emit("opponent-move", {
        hint: "Correct!",
        guess,
        guessesLeft: state.guessesLeft,
      });
      endRound(io, roomCode, state, state.guesserIndex);
    } else {
      const hint = guess > state.secretNumber ? "Too high" : "Too low";
      io.to(roomCode).emit("opponent-move", {
        hint,
        guess,
        guessesLeft: state.guessesLeft,
      });

      if (state.guessesLeft <= 0) {
        endRound(io, roomCode, state, state.pickerIndex);
      } else {
        startTimer(
          io,
          roomCode,
          state,
          GAME_CONFIG.guessNumber.guessTimeLimitSeconds,
        );
      }
    }
  }
};

const emitGameState = (io, roomCode, state) => {
  io.to(roomCode).emit("game-state-sync", {
    players: state.players,
    status: state.status,
    gameType: state.gameType,
    currentRound: state.currentRound,
    p1Score: state.p1Score,
    p2Score: state.p2Score,
    p1Move: state.p1Move || null,
    p2Move: state.p2Move || null,
    board: state.board || null,
    turnIndex: state.turnIndex ?? null,
  });
};

module.exports = { handleGameSockets };
