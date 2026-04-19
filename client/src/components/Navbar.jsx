import { useState } from "react";

// Avatar
const Avatar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#6C63FF" />
    <circle cx="20" cy="15" r="7" fill="#FFD1A9" />
    <ellipse cx="20" cy="32" rx="10" ry="7" fill="#4A90D9" />
  </svg>
);

// Icons
const LogoutIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12" fill="white" fillOpacity="0.2" />
    <circle cx="14" cy="9" r="3.5" fill="white" />
    <circle cx="9" cy="18" r="3.5" fill="white" />
    <circle cx="19" cy="18" r="3.5" fill="white" />
  </svg>
);

export default function Navbar() {
  const [roomId, setRoomId] = useState("");

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm px-4 md:px-8 h-16 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
          <LogoIcon />
        </div>
        <div>
          <div className="font-extrabold text-gray-900 text-sm md:text-base">
            Game Sphere
          </div>
          <div className="text-[10px] text-gray-400 font-semibold tracking-wider">
            PLAY TOGETHER
          </div>
        </div>
      </div>

      {/* Nav Links (hidden on mobile) */}
      <div className="hidden md:flex gap-8">
        {["Home", "Games", "Leaderboard"].map(link => (
          <a
            key={link}
            href="#"
            className="text-gray-700 font-medium text-sm hover:text-sky-400 transition"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Input (hide on very small screens) */}
        <input
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          placeholder="Room ID..."
          className="hidden sm:block px-3 py-1.5 rounded-md border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sky-300 w-24 md:w-32"
        />

        {/* Button */}
        <button className="px-3 md:px-5 py-1.5 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition">
          Join
        </button>

        {/* Avatar */}
        <div className="hidden sm:block">
          <Avatar />
        </div>

        {/* Logout */}
        <button className="p-1 hover:text-red-500 transition">
          <LogoutIcon />
        </button>

      </div>
    </nav>
  );
}