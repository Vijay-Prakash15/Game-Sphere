const Match = require("../models/Match");
const User = require("../models/User");
const GameRoom = require("../models/GameRoom");
const { checkTicTacToeWin, checkRPSWin, getGuessHint } = require("../../../shared/gameRules");
const { GAME_CONFIG } = require("../../../shared/constants");

// In-memory room state for fast game loops
const activeRooms = new Map();

const handleGameSockets = (io) => {
  io.on("connection", (socket) => {
    // Read user identity from JWT verified middleware
    if (!socket.user) {
      console.error("Socket connection missing verified user metadata.");
      return socket.disconnect();
    }
    const userId = socket.user.id;
    const username = socket.user.name;

    console.log(`Authenticated user connected: ${username} (${userId}) on socket ${socket.id}`);

    socket.on("join-room", async ({ roomCode }) => {
      try {
        console.log("WS JOIN ROOM:", roomCode, "User:", username);

        const room = await GameRoom.findOne({ code: roomCode });
        if (!room) {
          return socket.emit("error", { message: "Room not found" });
        }

        // Validate that user is allowed in the room
        const isRegistered = room.players.some(p => p.userId.toString() === userId);
        if (!isRegistered) {
          return socket.emit("error", { message: "Access denied: Not registered in this room" });
        }

        socket.join(roomCode);

        let state = activeRooms.get(roomCode);
        if (!state) {
          // Sync state initialization with database values
          state = {
            gameType: room.gameType,
            roomId: room._id,
            players: [],
            currentRound: 1,
            p1Score: 0,
            p2Score: 0,
            status: room.status === "in-progress" ? "in_progress" : "waiting",
            roundsData: [],
            disconnectTimeout: null
          };
          activeRooms.set(roomCode, state);
        }

        // Reconnect cleanup: Clear disconnection timeout if player returns
        if (state.disconnectTimeout) {
          console.log(`Player returned. Clearing disconnect timeout for room ${roomCode}`);
          clearTimeout(state.disconnectTimeout);
          state.disconnectTimeout = null;
        }

        // Add or update player details
        const existingPlayer = state.players.find((p) => p.userId === userId);
        if (!existingPlayer && state.players.length < 2) {
          state.players.push({ socketId: socket.id, userId, username, ready: true });
        } else if (existingPlayer) {
          existingPlayer.socketId = socket.id;
          existingPlayer.username = username;
        }

        console.log(`LOBBY STATE (${roomCode}):`, state.players.map(p => p.username));

        // Sync updates to lobby
        io.to(roomCode).emit("room-update", {
          players: state.players,
          status: state.status,
          gameType: state.gameType,
        });

        // Trigger synchronization payload
        socket.emit("game-state-sync", {
          players: state.players,
          status: state.status,
          gameType: state.gameType,
          p1Score: state.p1Score,
          p2Score: state.p2Score,
          currentRound: state.currentRound,
          board: state.board || null,
          turnIndex: state.turnIndex ?? null,
          guessesLeft: state.guessesLeft || null,
          secretNumber: state.secretNumber || null,
        });

        // Automatically start game if room is full and waiting
        if (state.players.length === 2 && state.status === "waiting") {
          state.status = "starting";
          setTimeout(() => startGame(io, roomCode, state), 500);
        }

        // Trigger immediate sync on reconnect in-progress
        if (state.status === "in_progress") {
          emitGameState(io, roomCode, state);
        }
      } catch (err) {
        console.error("Join-room error:", err);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("make-move", (data) => {
      const { roomCode, move } = data;
      const state = activeRooms.get(roomCode);
      if (!state || state.status !== "in_progress") return;

      const playerIndex = state.players.findIndex((p) => p.socketId === socket.id);
      if (playerIndex === -1) return;

      // Delegate moves with bounds/validation checks
      if (state.gameType === "tic-tac-toe") {
        handleTicTacToeMove(io, roomCode, state, playerIndex, move);
      } else if (state.gameType === "rock-paper-scissors") {
        handleRPSMove(io, roomCode, state, playerIndex, move);
      } else if (state.gameType === "guess-number") {
        handleGuessNumberMove(io, roomCode, state, playerIndex, move);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id} (${username})`);
      for (const [roomCode, state] of activeRooms.entries()) {
        const playerIndex = state.players.findIndex((p) => p.socketId === socket.id);
        
        if (playerIndex !== -1 && state.status === "in_progress") {
          // Notify active opponent of drop
          socket.to(roomCode).emit("opponent-disconnected", {
            message: "Opponent disconnected. 30s timeout started.",
          });

          // Set 30s forfeit grace period
          if (!state.disconnectTimeout) {
            state.disconnectTimeout = setTimeout(async () => {
              console.log(`Forfeit timeout triggered. Deleting active room ${roomCode}`);
              const winnerIndex = playerIndex === 0 ? 1 : 0; // The player who did not disconnect wins
              await endMatch(io, roomCode, state, winnerIndex);
            }, 30000);
          }
        }
      }
    });
  });
};

// --- Game Loop Implementation ---

const startGame = (io, roomCode, state) => {
  state.status = "in_progress";
  state.currentRound = 1;
  state.p1Score = 0;
  state.p2Score = 0;
  state.roundsData = [];
  state.matchStartTime = Date.now();

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
  state.roundStartTime = Date.now();

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

    // Start picker timer (15 seconds to set the number)
    startTimer(io, roomCode, state, 15);
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

  const duration = Math.round((Date.now() - state.roundStartTime) / 1000);

  state.roundsData.push({
    roundNumber: state.currentRound,
    player1Move: state.p1Move,
    player2Move: state.p2Move,
    winner: roundWinner,
    duration,
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

const endMatch = async (io, roomCode, state, forcedWinnerIdx = null) => {
  state.status = "completed";
  clearTimeout(state.timer);
  if (state.disconnectTimeout) {
    clearTimeout(state.disconnectTimeout);
  }

  let finalWinner = "draw";
  if (forcedWinnerIdx !== null) {
    finalWinner = forcedWinnerIdx === 0 ? "player1" : "player2";
  } else {
    if (state.p1Score > state.p2Score) finalWinner = "player1";
    else if (state.p2Score > state.p1Score) finalWinner = "player2";
  }

  // Determine winner and loser IDs
  let winnerId = null;
  let loserId = null;

  if (finalWinner === "player1") {
    winnerId = state.players[0]?.userId;
    loserId = state.players[1]?.userId;
  } else if (finalWinner === "player2") {
    winnerId = state.players[1]?.userId;
    loserId = state.players[0]?.userId;
  }

  const duration = Math.round((Date.now() - (state.matchStartTime || Date.now())) / 1000);

  try {
    const match = new Match({
      roomId: state.roomId,
      roomCode,
      gameType: state.gameType,
      player1Id: state.players[0].userId,
      player2Id: state.players[1].userId,
      winnerId,
      loserId,
      rounds: state.roundsData,
      finalWinner,
      player1Score: state.p1Score,
      player2Score: state.p2Score,
      totalDuration: duration
    });
    await match.save();

    // Update User Stats
    const p1 = await User.findById(state.players[0].userId);
    const p2 = await User.findById(state.players[1].userId);

    if (p1 && p2) {
      // Fix spelling to use rockpaperscissors (spelled correctly)
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

    // Emit Game Ended events for navigation and display
    io.to(roomCode).emit("match-result", {
      finalWinner,
      p1Score: state.p1Score,
      p2Score: state.p2Score,
      matchId: match._id,
    });

    io.to(roomCode).emit("game-ended", {
      roomCode,
      winner: winnerId,
      loser: loserId,
      score: `${state.p1Score}-${state.p2Score}`,
      duration
    });

    // Cleanup state
    activeRooms.delete(roomCode);

  } catch (err) {
    console.error("Failed to conclude match:", err);
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
    // If picker timed out choosing a number
    if (state.secretNumber === null) {
      console.log(`Picker timed out setting secret number in room ${roomCode}`);
      // Picker forfeit round -> guesser wins
      endRound(io, roomCode, state, state.guesserIndex);
    } else {
      // Guesser timed out making a guess -> decrement guesses and update
      state.guessesLeft--;
      io.to(roomCode).emit("opponent-move", {
        hint: "Time's up! Missed guess.",
        guessesLeft: state.guessesLeft,
      });
      if (state.guessesLeft <= 0) {
        endRound(io, roomCode, state, state.pickerIndex);
      } else {
        startTimer(io, roomCode, state, GAME_CONFIG.guessNumber.guessTimeLimitSeconds);
      }
    }
  }
};

// --- Game Logic Controllers ---

const handleTicTacToeMove = (io, roomCode, state, playerIndex, move) => {
  if (state.turnIndex !== playerIndex) return;
  
  // Enforce server-side move bounds validation
  const pos = parseInt(move.position);
  if (isNaN(pos) || pos < 0 || pos > 8 || state.board[pos] !== null) {
    return;
  }

  clearTimeout(state.timer);

  const symbol = playerIndex === 0 ? "X" : "O";
  state.board[pos] = symbol;

  if (playerIndex === 0) state.p1Move = pos;
  else state.p2Move = pos;

  const nextTurn = playerIndex === 0 ? 1 : 0;
  state.turnIndex = nextTurn;

  io.to(roomCode).emit("opponent-move", {
    board: state.board,
    turnIndex: nextTurn,
    lastMove: { playerIndex, position: pos },
  });

  const winner = checkTicTacToeWin(state.board);
  if (winner) {
    endRound(io, roomCode, state, playerIndex);
  } else if (state.board.every((c) => c !== null)) {
    endRound(io, roomCode, state, -1); // Draw
  } else {
    startTimer(io, roomCode, state, GAME_CONFIG.tictactoe.moveTimeLimitSeconds);
  }
};

const handleRPSMove = (io, roomCode, state, playerIndex, move) => {
  // Validate move input
  const choice = move.choice;
  if (!["R", "P", "S"].includes(choice)) return;

  // Prevent editing already submitted moves
  if (playerIndex === 0 && state.p1Move) return;
  if (playerIndex === 1 && state.p2Move) return;

  if (playerIndex === 0) state.p1Move = choice;
  if (playerIndex === 1) state.p2Move = choice;

  io.to(state.players[playerIndex].socketId).emit("receive-move", {
    success: true,
  });

  const opponentIndex = playerIndex === 0 ? 1 : 0;
  if (state.players[opponentIndex]) {
    io.to(state.players[opponentIndex].socketId).emit("opponent-move", {
      opponentChosen: true,
    });
  }

  // Evaluate round if both moves are registered
  if (state.p1Move && state.p2Move) {
    clearTimeout(state.timer);
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

  const result = checkRPSWin(p1, p2);
  if (result === "draw") {
    endRound(io, roomCode, state, -1);
  } else if (result === "player1") {
    endRound(io, roomCode, state, 0);
  } else {
    endRound(io, roomCode, state, 1);
  }
};

const handleGuessNumberMove = (io, roomCode, state, playerIndex, move) => {
  if (playerIndex === state.pickerIndex) {
    if (move.type === "set-number" && state.secretNumber === null) {
      const num = parseInt(move.number);
      if (isNaN(num) || num < GAME_CONFIG.guessNumber.numberMin || num > GAME_CONFIG.guessNumber.numberMax) {
        return;
      }
      clearTimeout(state.timer); // Clear picker timeout
      state.secretNumber = num;
      io.to(roomCode).emit("opponent-move", { event: "number-set" });
      
      startTimer(io, roomCode, state, GAME_CONFIG.guessNumber.guessTimeLimitSeconds);
    }
  } else if (
    playerIndex === state.guesserIndex &&
    state.secretNumber !== null
  ) {
    const guess = parseInt(move.guess);
    if (isNaN(guess) || guess < GAME_CONFIG.guessNumber.numberMin || guess > GAME_CONFIG.guessNumber.numberMax) {
      return;
    }

    clearTimeout(state.timer);
    state.guessesLeft--;

    const hint = getGuessHint(guess, state.secretNumber);

    if (hint === "Correct!") {
      io.to(roomCode).emit("opponent-move", {
        hint,
        guess,
        guessesLeft: state.guessesLeft,
      });
      endRound(io, roomCode, state, state.guesserIndex);
    } else {
      io.to(roomCode).emit("opponent-move", {
        hint,
        guess,
        guessesLeft: state.guessesLeft,
      });

      if (state.guessesLeft <= 0) {
        endRound(io, roomCode, state, state.pickerIndex);
      } else {
        startTimer(io, roomCode, state, GAME_CONFIG.guessNumber.guessTimeLimitSeconds);
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
