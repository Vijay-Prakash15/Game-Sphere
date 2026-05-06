import React, { useState, useEffect } from "react";

const CHOICES = [
  { label: "Rock", value: "R", emoji: "✊", desc: "Crushes Scissors" },
  { label: "Paper", value: "P", emoji: "✋", desc: "Covers Rock" },
  { label: "Scissors", value: "S", emoji: "✌️", desc: "Cuts Paper" },
];

const getResult = (me, opp) => {
  if (!me || !opp) return null;
  if (me === opp) return "draw";
  if (
    (me === "R" && opp === "S") ||
    (me === "P" && opp === "R") ||
    (me === "S" && opp === "P")
  ) return "win";
  return "lose";
};

const RockPaperScissors = ({ gameState, myId, onMakeMove }) => {

  // ✅ Hooks FIRST (important)
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // ✅ Safe access
  const players = gameState?.players || [];

  const myIndex = players.findIndex((p) => p.userId === myId);

  const myMove =
    myIndex === 0
      ? gameState?.p1Choice || gameState?.p1Move
      : gameState?.p2Choice || gameState?.p2Move;

  const oppMove =
    myIndex === 0
      ? gameState?.p2Choice || gameState?.p2Move
      : gameState?.p1Choice || gameState?.p1Move;

  const isLocked =
    (myIndex === 0 && gameState?.p1Move) ||
    (myIndex === 1 && gameState?.p2Move);

  const result = getResult(myMove, oppMove);

  const myScore =
    myIndex === 0 ? gameState?.p1Score || 0 : gameState?.p2Score || 0;

  const oppScore =
    myIndex === 0 ? gameState?.p2Score || 0 : gameState?.p1Score || 0;

  // ✅ Effects ALWAYS before return
  useEffect(() => {
    if (myMove && oppMove) {
      const t = setTimeout(() => setShowResult(true), 300);
      return () => clearTimeout(t);
    }
    setShowResult(false);
  }, [myMove, oppMove]);

  useEffect(() => {
    setSelected(null);
  }, [gameState?.currentRound]);

  // ✅ AFTER hooks → safe returns
  if (!gameState || players.length === 0) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  if (myIndex === -1) return null;

  const handleClick = (value) => {
    if (isLocked) return;
    setSelected(value);
    onMakeMove({ choice: value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4">

      {/* HEADER */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase">
          Round {gameState.currentRound || 1}
        </p>

        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-600 mt-2">
          Rock Paper Scissors
        </h1>

        <p className="text-gray-500 mt-2">
          {isLocked ? "⏳ Waiting for opponent..." : "Choose your move"}
        </p>
      </div>

      {/* SCOREBOARD */}
      <div className="flex items-center gap-6 mb-10">

        <div className="bg-white rounded-xl shadow p-6 text-center w-32 border border-indigo-200">
          <p className="text-xs text-gray-400 uppercase">You</p>
          <p className="text-3xl font-bold text-indigo-600">{myScore}</p>
        </div>

        <span className="text-gray-400 font-bold">VS</span>

        <div className="bg-white rounded-xl shadow p-6 text-center w-32 border">
          <p className="text-xs text-gray-400 uppercase">Opponent</p>
          <p className="text-3xl font-bold">{oppScore}</p>
        </div>

      </div>

      {/* CHOICES */}
      <div className="flex gap-5 w-full max-w-xl">
        {CHOICES.map((c) => {
          const isSelected = selected === c.value;

          return (
            <div
              key={c.value}
              onClick={() => handleClick(c.value)}
              className={`
                flex-1 cursor-pointer rounded-2xl p-6 text-center transition-all duration-200
                border bg-white shadow hover:shadow-lg
                ${isLocked ? "opacity-60 cursor-not-allowed" : ""}
                ${isSelected ? "border-indigo-500 scale-105 shadow-xl bg-indigo-50" : ""}
              `}
            >
              <div className="text-5xl mb-3">{c.emoji}</div>

              <h3 className="font-bold text-lg text-gray-700">{c.label}</h3>

              <p className="text-xs text-gray-400 mt-1">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* RESULT OVERLAY */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center w-80">

            <p className="text-4xl mb-4">
              {myMove} vs {oppMove}
            </p>

            <h2
              className={`text-2xl font-bold mb-4 ${
                result === "win"
                  ? "text-green-500"
                  : result === "lose"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {result === "win" && "You Win 🎉"}
              {result === "lose" && "You Lose 😔"}
              {result === "draw" && "Draw 🤝"}
            </h2>

            <button
              onClick={() => setShowResult(false)}
              className="px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Next Round →
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default RockPaperScissors;