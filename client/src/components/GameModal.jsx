import { useState } from "react";

// ─── GameModal Component ──────────────────────────────────────────────────────
// Props:
//   game     → { icon, title, bgColor } — game info to display in modal
//   onClose  → function to close the modal
//   onCreateRoom → function called when "CREATE ROOM" is clicked
//   onJoinRoom   → function called when "JOIN ROOM" is clicked
// Usage: <GameModal game={selectedGame} onClose={() => setOpen(false)} />

export function GameModal({ game, onClose, onCreateRoom, onJoinRoom }) {
  if (!game) return null;

  return (
    // ── OVERLAY ──
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* ── MODAL CARD ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "36px 32px 32px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          position: "relative",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* ── CLOSE BUTTON ── */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "#f1f5f9",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
        >
          ✕
        </button>

        {/* ── GAME ICON + TITLE ── */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: game.bgColor || "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              margin: "0 auto 16px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          >
            {game.icon}
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            {game.title}
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            What would you like to do?
          </p>
        </div>

        {/* ── CREATE A ROOM CARD ── */}
        <div
          style={{
            background: "#eff6ff",
            border: "1.5px solid #bfdbfe",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "13px",
              letterSpacing: "0.06em",
              color: "#1e40af",
              marginBottom: "4px",
            }}
          >
            CREATE A ROOM
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            Get unique code &amp; invite friends
          </div>
          <button
            onClick={onCreateRoom}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "white",
              fontWeight: "700",
              fontSize: "14px",
              letterSpacing: "0.06em",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(59,130,246,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.35)";
            }}
          >
            CREATE ROOM
          </button>
        </div>

        {/* ── JOIN A ROOM CARD ── */}
        <div
          style={{
            background: "#faf5ff",
            border: "1.5px solid #e9d5ff",
            borderRadius: "14px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "13px",
              letterSpacing: "0.06em",
              color: "#7e22ce",
              marginBottom: "4px",
            }}
          >
            JOIN A ROOM
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            Have a code from a friend?
          </div>
          <button
            onClick={onJoinRoom}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              color: "white",
              fontWeight: "700",
              fontSize: "14px",
              letterSpacing: "0.06em",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(168,85,247,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(168,85,247,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(168,85,247,0.35)";
            }}
          >
            JOIN ROOM
          </button>
        </div>
      </div>

      {/* ── CSS ANIMATIONS ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}


// ─── DEMO: How to use GameModal inside your Home.jsx ─────────────────────────
// Below is a self-contained demo that shows exactly how to wire GameModal
// into your existing Home page. Copy the GameModal export above into its
// own file, then use the pattern shown here inside Home.jsx.

const GAMES = [
  { id: 1, icon: "✖️",  title: "Tic Tac Toe",          difficulty: "Beginner",     diffColor: "#22c55e", bgColor: "#dbeafe" },
  { id: 2, icon: "✊",  title: "Rock Paper Scissors",   difficulty: "Beginner",     diffColor: "#22c55e", bgColor: "#fef3c7" },
  { id: 3, icon: "🧠",  title: "Simon Game",            difficulty: "Intermediate", diffColor: "#f59e0b", bgColor: "#ede9fe" },
  { id: 4, icon: "#",   title: "Guess the Number",      difficulty: "Intermediate", diffColor: "#f59e0b", bgColor: "#d1fae5" },
];

export default function GameModalDemo() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f0f6ff", minHeight: "100vh", padding: "48px 32px" }}>

      {/* ── PAGE TITLE ── */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>
          Multiplayer Games
        </h2>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
          Compete with friends or strangers globally
        </p>
      </div>

      {/* ── GAME CARDS GRID ── */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {GAMES.map((game) => (
          <div
            key={game.id}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px 24px 20px",
              minWidth: "200px",
              flex: "1",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* Icon */}
            <div style={{
              width: "52px", height: "52px", borderRadius: "12px",
              background: game.bgColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", marginBottom: "8px",
            }}>
              {game.icon}
            </div>

            <div style={{ fontWeight: "700", fontSize: "17px", color: "#111827" }}>{game.title}</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: game.diffColor }}>{game.difficulty}</div>

            {/* ── PLAY NOW triggers the modal ── */}
            <button
              onClick={() => setSelectedGame(game)}
              style={{
                marginTop: "10px", padding: "12px 0", width: "100%",
                background: "white", border: "1.5px solid #e5e7eb",
                borderRadius: "10px", fontWeight: "700", fontSize: "14px",
                cursor: "pointer", color: "#111827", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
            >
              Play Now
            </button>
          </div>
        ))}
      </div>

      {/* ── MODAL — rendered when a game is selected ── */}
      {selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onCreateRoom={() => {
            alert(`Creating room for ${selectedGame.title}!`);
            setSelectedGame(null);
          }}
          onJoinRoom={() => {
            alert(`Joining room for ${selectedGame.title}!`);
            setSelectedGame(null);
          }}
        />
      )}
    </div>
  );
}