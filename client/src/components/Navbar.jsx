import { useState } from "react";
import { useNavigate, NavLink , Link} from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import AvatarImg from "../assets/Avatar.jpg";

// Avatar
const Avatar = () => (
  <img
    src={AvatarImg}
    alt="Avatar"
    className="w-10 h-10 rounded-full object-cover border border-gray-200 hover:scale-105 transition"
  />
);

// Icons
const MenuIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
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
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Join Room
  const handleJoin = () => {
    if (!roomId.trim()) {
      alert("Please enter Room ID");
      return;
    }
    navigate(`/room/${roomId}`);
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm px-4 md:px-8 h-16 flex items-center justify-between">
        <NavLink  to="/home" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
            <LogoIcon />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-sm md:text-base">
              Game Sphere
            </div>
            <div className="text-[10px] text-gray-400 tracking-wider font-bold">
              PLAY TOGETHER
            </div>
          </div>
        </NavLink >

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-8">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              isActive
                ? "text-sky-500 font-semibold"
                : "text-gray-700 font-medium hover:text-sky-400 transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/games"
            className={({ isActive }) =>
              isActive
                ? "text-sky-500 font-semibold"
                : "text-gray-700 font-medium hover:text-sky-400 transition"
            }
          >
            Games
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive
                ? "text-sky-500 font-semibold"
                : "text-gray-700 font-medium hover:text-sky-400 transition"
            }
          >
            Leaderboard
          </NavLink>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Join Room */}
          <div className="hidden sm:flex items-center gap-2">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Room ID..."
              className="px-3 py-1.5 rounded-md border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sky-300 w-24 md:w-32"
            />
            <button
              onClick={handleJoin}
              className="px-4 py-1.5 rounded-md bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
            >
              Join
            </button>
          </div>

          {/* Avatar */}
          <Avatar />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center justify-center p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded-md transition"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-white border-b border-gray-200 px-4 space-y-4 shadow-sm overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <NavLink
          to="/home"
          end
          className={({ isActive }) =>
            isActive
              ? "block text-sky-500 font-semibold"
              : "block text-gray-700 font-medium"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/games"
          className={({ isActive }) =>
            isActive
              ? "block text-sky-500 font-semibold"
              : "block text-gray-700 font-medium"
          }
        >
          Games
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            isActive
              ? "block text-sky-500 font-semibold"
              : "block text-gray-700 font-medium"
          }
        >
          Leaderboard
        </NavLink>

        {/* Mobile Join */}
        <div className="flex gap-2">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="Room ID..."
            className="flex-1 px-3 py-2 rounded-md border border-gray-200 text-sm"
          />
          <button
            onClick={handleJoin}
            className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm font-semibold"
          >
            Join
          </button>
        </div>

        {/* Mobile Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-blue-500 font-medium"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </>
  );
}
