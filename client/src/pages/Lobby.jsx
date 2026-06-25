import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket, { connectSocket } from "../socket/socket";
import user1 from "../assets/user1.jpg";
import user2 from "../assets/user2.jpg";

const GAME_ICONS = {
  "tic-tac-toe": "⭕",
  chess: "♟️",
  snake: "🐍",
  simon: "🎯",
  checkers: "🔴",
  default: "🎮",
};

const getGameIcon = (type = "") =>
  GAME_ICONS[type.toLowerCase()] || GAME_ICONS["default"];

const Lobby = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { code, gameType } = location.state || {};

  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);

  const storedUser = localStorage.getItem("user");
  let myUser = storedUser ? JSON.parse(storedUser) : null;
  let myId = myUser?._id || myUser?.id || null;

  useEffect(() => {
    if (!code || !gameType) navigate("/home");
  }, []);

  useEffect(() => {
    if (!code || !myId) return;

    const s = connectSocket();
    s.emit("join-room", { roomCode: code });

    s.on("room-update", (data) => setPlayers(data.players));
    s.on("game-started", () => navigate(`/room/${code}`));

    return () => {
      s.off("room-update");
      s.off("game-started");
    };
  }, [code, myId, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const player1 = players[0];
  const player2 = players[1];
  const bothReady = players.length >= 2;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-blue-300 opacity-20 rounded-full blur-3xl top-[-100px] left-[-80px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-300 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-60px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs tracking-widest text-blue-400 uppercase font-semibold">
            Game Sphere · Multiplayer
          </p>
          <h1 className="text-2xl font-extrabold text-blue-900">
            🎮 Game Lobby
          </h1>
        </div>

        {/* Game badge */}
        <div className="flex justify-center mb-6">
          <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 border text-xs font-bold tracking-wider text-blue-700">
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
            {getGameIcon(gameType)} {gameType}
          </span>
        </div>

        {/* Room code */}
        <div className="flex flex-col items-center mb-8">
          <p className="text-xs tracking-widest text-blue-300 mb-2 uppercase">
            Room Code
          </p>

          <div
            onClick={handleCopy}
            className="cursor-pointer flex items-center gap-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 border hover:scale-105 transition"
          >
            <span className="text-2xl font-extrabold tracking-widest text-blue-600">
              {code}
            </span>
            <span className="text-xs font-bold">📋 Copy</span>
          </div>

          {copied && (
            <span className="text-green-600 text-xs mt-2 font-semibold">
              ✓ Copied!
            </span>
          )}
        </div>

        {/* Players */}
        <div className="flex items-center gap-4 mb-6">
          {/* Player 1 */}
          <div
            className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border ${
              player1
                ? "bg-blue-100 border-blue-300"
                : "border-dashed opacity-60"
            }`}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              <img
                src={user1}
                alt="avatar"
                className="w-full h-full object-cover brightness-105 contrast-110"
              />
            </div>
            <p className="text-xs font-bold mt-2">Player 1</p>
            {player1?.userId === myId && (
              <span className="text-[10px] bg-blue-500 text-white px-2 rounded-full mt-1">
                YOU
              </span>
            )}
            {!player1 && (
              <p className="text-xs text-gray-400 mt-1">Waiting...</p>
            )}
          </div>

          {/* VS */}
          <div className="text-lg font-bold text-blue-500">VS</div>

          {/* Player 2 */}
          <div
            className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border ${
              player2
                ? "bg-blue-100 border-blue-300"
                : "border-dashed opacity-60"
            }`}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={user2} // player2 ke liye user2
                alt="avatar"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              />
            </div>
            <p className="text-xs font-bold mt-2">Player 2</p>
            {player2?.userId === myId && (
              <span className="text-[10px] bg-blue-500 text-white px-2 rounded-full mt-1">
                YOU
              </span>
            )}
            {!player2 && (
              <p className="text-xs text-gray-400 mt-1">Waiting...</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold ${
            bothReady
              ? "text-green-700 bg-green-100"
              : "text-yellow-700 bg-yellow-100"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              bothReady
                ? "bg-green-500 animate-ping"
                : "bg-yellow-500 animate-pulse"
            }`}
          />
          {bothReady
            ? "🚀 Both players ready — starting game..."
            : "⏳ Waiting for opponent..."}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
