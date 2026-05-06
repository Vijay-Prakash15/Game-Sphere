import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket";

import TicTacToe from "../games/ticTacToe/TicTacToe";
import RockPaperScissors from "../games/rps/RockPaperScissors";
import GuessNumber from "../games/guessNumber/GuessNumber";

const GameRoom = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [roundResult, setRoundResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [hint, setHint] = useState("");

  const myUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = myUser._id || myUser.id || Math.random().toString();
  console.log("MY USER:", myUser);
  console.log("MY ID:", myId);

  // ✅ 1. Fetch Room + Join Socket
  useEffect(() => {
    const initRoom = async () => {
      if (!myId) {
        setError("User not found. Login again.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/rooms/${code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.message);
          return;
        }

        setRoom(data.room);

        // 🔥 Join room (IMPORTANT)
        socket.emit("join-room", { roomCode: code, userId: myId });
      } catch (err) {
        setError("Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    initRoom();
  }, [code, myId]);

  // ✅ 2. Socket Listeners
  useEffect(() => {
    if (!code || !myId) return;

    const handleStateSync = (state) => {
      setGameState(state);
    };

    const handleGameStarted = (state) => {
      setGameState((prev) => ({
        ...(prev || {}),
        ...state,
        status: "in_progress",
      }));
      setRoundResult(null);
      setHint("");
    };

    const handleOpponentMove = (data) => {
      if (data.hint) setHint(data.hint);
      setGameState((prev) => ({ ...prev, ...data }));
    };

    const handleRoundResult = (data) => setRoundResult(data);
    const handleMatchResult = (data) => setMatchResult(data);

    socket.on("game-state-sync", handleStateSync);
    socket.on("game-started", handleGameStarted);
    socket.on("opponent-move", handleOpponentMove);
    socket.on("round-result", handleRoundResult);
    socket.on("match-result", handleMatchResult);

    // 🔥 reconnect fix
    socket.on("connect", () => {
      socket.emit("join-room", { roomCode: code, userId: myId });
    });

    return () => {
      socket.off("game-state-sync", handleStateSync);
      socket.off("game-started", handleGameStarted);
      socket.off("opponent-move", handleOpponentMove);
      socket.off("round-result", handleRoundResult);
      socket.off("match-result", handleMatchResult);
    };
  }, [code, myId]);

  // ✅ 3. Send Move
  const handleMakeMove = (moveData) => {
    socket.emit("make-move", { roomCode: code, move: moveData });
  };

  // ================= UI =================

  if (loading)
    return <div className="p-10 text-center font-bold">Loading...</div>;

  if (error)
    return <div className="p-10 text-red-500 text-center">{error}</div>;

  const isWaiting =
    (!gameState && room?.status !== "in-progress") ||
    gameState?.status === "waiting";

  // 🔄 WAIT SCREEN
  if (isWaiting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Waiting for opponent...</h2>
          <p className="text-gray-500">
            Share code: <span className="font-bold">{code}</span>
          </p>
        </div>
      </div>
    );
  }

  // 🏆 MATCH RESULT
  if (matchResult) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Match Over</h1>
        <p>
          Winner:{" "}
          {matchResult.finalWinner === "draw"
            ? "Draw"
            : matchResult.finalWinner}
        </p>

        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-5 py-2 bg-blue-500 text-white rounded"
        >
          Back Home
        </button>
      </div>
    );
  }

  // ⏱ ROUND RESULT
  if (roundResult) {
    return (
      <div className="text-center mt-20">
        <h2>Round {roundResult.round} Over</h2>
        <p>Winner: {roundResult.winner}</p>
      </div>
    );
  }

  // 🎮 GAME RENDER
  const stateWithHint = { ...gameState, currentHint: hint };

  const renderGame = () => {
    switch (room.gameType) {
      case "tic-tac-toe":
        return (
          <TicTacToe
            gameState={gameState}
            myId={myId}
            onMakeMove={handleMakeMove}
          />
        );

      case "rock-paper-scissors":
        return (
          <RockPaperScissors
            gameState={gameState}
            myId={myId}
            onMakeMove={handleMakeMove}
          />
        );

      case "guess-number":
        return (
          <GuessNumber
            gameState={stateWithHint}
            myId={myId}
            onMakeMove={handleMakeMove}
          />
        );

      default:
        return <div>Unknown Game</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold">
          Room: <span className="text-blue-600">{code}</span>
        </h1>
        <p className="text-gray-500 capitalize">
          {room.gameType.replace("-", " ")}
        </p>
      </div>

      {/* GAME */}
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl">
        {renderGame()}
      </div>

      {/* HINT */}
      {hint && room.gameType === "guess-number" && (
        <div className="fixed bottom-5 bg-black text-white px-4 py-2 rounded">
          {hint}
        </div>
      )}
    </div>
  );
};

export default GameRoom;
