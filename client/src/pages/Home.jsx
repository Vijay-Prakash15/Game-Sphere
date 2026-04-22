import { useState } from "react";
import {
  FaReact,
  FaBolt,
  FaShieldAlt,
  FaGlobe,
  FaTwitter,
  FaDiscord,
  FaTwitch,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

// ─── Game Modal Component ─────────────────────────────────────────────────────
const GameModal = ({ game, onClose, onCreateRoom, onJoinRoom }) => {
  if (!game) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fadeIn"
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] px-8 pt-9 pb-8 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative animate-slideUp"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-lg hover:bg-slate-200 transition"
        >
          ✕
        </button>

        {/* ICON + TITLE */}
        <div className="text-center mb-7">
          <div
            className="w-[72px] h-[72px] rounded-[18px] flex items-center justify-center text-[32px] mx-auto mb-4 shadow-md"
            style={{ background: game.bgColor || "#dbeafe" }}
          >
            {game.icon}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
            {game.title}
          </h2>
          <p className="text-sm text-slate-500">What would you like to do?</p>
        </div>

        {/* CREATE ROOM */}
        <div className="bg-blue-50 border-[1.5px] border-blue-200 rounded-[14px] p-5 mb-3">
          <div className="font-bold text-[13px] tracking-wider text-blue-800 mb-1">
            CREATE A ROOM
          </div>
          <div className="text-[13px] text-slate-500 mb-4">
            Get unique code & invite friends
          </div>

          <button
            onClick={() => onCreateRoom(game)}
            className="w-full py-3 text-white font-bold text-sm tracking-wider rounded-[10px] bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition"
          >
            CREATE ROOM
          </button>
        </div>

        {/* JOIN ROOM */}
        <div className="bg-purple-50 border-[1.5px] border-purple-200 rounded-[14px] p-5">
          <div className="font-bold text-[13px] tracking-wider text-purple-700 mb-1">
            JOIN A ROOM
          </div>
          <div className="text-[13px] text-slate-500 mb-4">
            Have a code from a friend?
          </div>

          <button
            onClick={() => onJoinRoom(game)}
            className="w-full py-3 text-white font-bold text-sm tracking-wider rounded-[10px] bg-gradient-to-br from-purple-500 to-purple-700 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition"
          >
            JOIN ROOM
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Game Card Component ──────────────────────────────────────────────────────
const GameCard = ({
  icon,
  title,
  difficulty,
  diffColor,
  buttonText,
  bgColor,
  onClick,
}) => (
  <div className="bg-white rounded-2xl px-6 pt-7 pb-5 min-w-[220px] flex-1 shadow-sm flex flex-col gap-2.5">
    {/* Icon Box */}
    <div
      className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl mb-2"
      style={{ background: bgColor }}
    >
      {icon}
    </div>

    <div className="font-bold text-[17px] text-gray-900">{title}</div>
    <div className="text-[13px] font-semibold" style={{ color: diffColor }}>
      {difficulty}
    </div>

    <button
      onClick={onClick}
      className="mt-2.5 py-3 w-full bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-900 hover:bg-gray-100 transition"
    >
      {buttonText}
    </button>
  </div>
);

// ─── Multiplayer Games Data ───────────────────────────────────────────────────
const MULTIPLAYER_GAMES = [
  {
    id: "tic-tac-toe",
    icon: "✖️",
    title: "Tic Tac Toe",
    difficulty: "Beginner",
    diffColor: "#22c55e",
    buttonText: "Play Now",
    bgColor: "#dbeafe",
  },
  {
    id: "rock-paper-scissors",
    icon: "✊",
    title: "Rock Paper Scissors",
    difficulty: "Beginner",
    diffColor: "#22c55e",
    buttonText: "Play Now",
    bgColor: "#fef3c7",
  },
  {
    id: "simon-game",
    icon: "🧠",
    title: "Simon Game",
    difficulty: "Intermediate",
    diffColor: "#f59e0b",
    buttonText: "Play Now",
    bgColor: "#ede9fe",
  },
  {
    id: "guess-the-number",
    icon: "#",
    title: "Guess the Number",
    difficulty: "Intermediate",
    diffColor: "#f59e0b",
    buttonText: "Play Now",
    bgColor: "#d1fae5",
  },
];

// ─── Single Player Games Data ─────────────────────────────────────────────────
const SOLO_GAMES = [
  {
    id: "snake",
    icon: "🐛",
    title: "Snake",
    difficulty: "Intermediate",
    diffColor: "#f59e0b",
    buttonText: "Play Solo",
    bgColor: "#dcfce7",
  },
  {
    id: "trivia-quiz",
    icon: "💡",
    title: "Trivia Quiz",
    difficulty: "Advanced",
    diffColor: "#ef4444",
    buttonText: "Play Solo",
    bgColor: "#dbeafe",
  },
];

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleOpenModal = (game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const handleCreateRoom = (game) => {
    // TODO: Add your create room logic here
    console.log("Creating room for:", game.title);
    handleCloseModal();
  };

  const handleJoinRoom = (game) => {
    // TODO: Add your join room logic here
    console.log("Joining room for:", game.title);
    handleCloseModal();
  };

  return (
    <div className="font-sans bg-blue-50 min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* GAME MODAL */}
      <GameModal
        game={selectedGame}
        onClose={handleCloseModal}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />

      {/* HERO */}
      <section className="relative px-8 py-20 text-center overflow-hidden bg-gradient-to-br from-blue-100 via-white to-indigo-100">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-300/30 rounded-full blur-3xl"></div>
        </div>

        <div className="inline-block bg-white border border-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-600 tracking-wider mb-7 animate-float">
          NEW: SIMON GAME ADDED
        </div>

        <h3 className="text-[clamp(36px,6vw,64px)] font-bold text-slate-900 leading-tight mb-2">
          Play Real-Time Games
        </h3>

        <h3
          className="text-[clamp(36px,6vw,64px)] font-bold leading-tight mb-7 
          bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 
          bg-clip-text text-transparent tracking-tight"
        >
          with Friends
        </h3>

        <p className="text-[17px] text-slate-500 max-w-[520px] mx-auto mb-10 leading-7">
          Create a room, share a code, and start playing instantly. No
          downloads, no lag, just pure fun on Game Sphere.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button className="px-8 py-3.5 bg-gradient-to-br from-sky-400 to-sky-500 text-white font-bold text-sm rounded-xl shadow-lg hover:-translate-y-0.5 transition flex items-center gap-2">
            Play Multiplayer 👥
          </button>

          <button className="px-8 py-3.5 bg-white text-gray-900 font-bold text-sm border border-gray-200 rounded-xl hover:-translate-y-0.5 transition flex items-center gap-2">
            Play Solo 👤
          </button>
        </div>

        <div className="flex justify-center gap-7 mt-12 text-3xl text-blue-400">
          <FaReact />
          <FaBolt />
          <FaShieldAlt />
          <FaGlobe />
        </div>
      </section>

      {/* MULTIPLAYER */}
      <section className="px-8 py-14 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
                Multiplayer Games
              </h2>
              <p className="text-slate-500 text-sm">
                Compete with friends or strangers globally
              </p>
            </div>
          </div>

          <div className="flex gap-5 flex-wrap">
            {MULTIPLAYER_GAMES.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => handleOpenModal(game)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SINGLE PLAYER */}
      <section className="px-8 py-5 pb-14 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
              Single Player
            </h2>
            <p className="text-slate-500 text-sm">
              Perfect your skills in solo mode
            </p>
          </div>

          <div className="flex gap-5 flex-wrap">
            {SOLO_GAMES.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => handleOpenModal(game)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-8 py-14 bg-gradient-to-b from-blue-100 to-blue-50 text-center">
        <div className="flex justify-center gap-20 flex-wrap max-w-5xl mx-auto">
          {[
            { value: "250k+", label: "Active Players" },
            { value: "12M+", label: "Games Played" },
            { value: "50+", label: "Unique Rooms" },
            { value: "4.9/5", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-extrabold text-slate-900">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white px-8 pt-14 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-14 flex-wrap pb-10 border-b border-slate-800">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center"></div>
                <span className="font-extrabold text-base">Game Sphere</span>
              </div>
              <p className="text-slate-400 text-sm leading-6 max-w-[240px]">
                The world's most humanistic gaming platform. Play, compete, and
                connect in real-time.
              </p>
            </div>

            <div className="flex-1 min-w-[140px]">
              <div className="font-bold text-sm mb-4">Platform</div>
              {["Browse Games", "Leaderboards", "Tournament Hub"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-slate-400 text-sm mb-2.5"
                >
                  {l}
                </a>
              ))}
            </div>

            <div className="flex-1 min-w-[140px]">
              <div className="font-bold text-sm mb-4">Support</div>
              {["Help Center", "Community Guidelines", "Contact Us"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-slate-400 text-sm mb-2.5"
                  >
                    {l}
                  </a>
                )
              )}
            </div>

            <div className="flex-1 min-w-[140px]">
              <div className="font-bold text-sm mb-4">Social</div>
              <div className="flex gap-2.5">
                {[<FaTwitter />, <FaDiscord />, <FaTwitch />].map((icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <p className="text-slate-500 text-xs mb-2">
              © 2024 Game Sphere Inc. All rights reserved.
            </p>
            <div className="flex gap-5 justify-center">
              {["Privacy Policy", "Terms of Service"].map((l) => (
                <a key={l} href="#" className="text-slate-500 text-xs">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}