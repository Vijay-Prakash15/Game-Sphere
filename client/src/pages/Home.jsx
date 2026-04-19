import { useState } from "react";
import Navbar from "../components/Navbar";

// ─── Avatar SVG Component (replaces boy image) ───────────────────────────────
const Avatar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#6C63FF" />
    <circle cx="20" cy="15" r="7" fill="#FFD1A9" />
    <ellipse cx="20" cy="32" rx="10" ry="7" fill="#4A90D9" />
    <circle cx="20" cy="15" r="7" fill="#FFD1A9" />
  </svg>
);

// ─── Navbar Icons ─────────────────────────────────────────────────────────────
const ExpandIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ─── Logo Icon ────────────────────────────────────────────────────────────────
const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="12" fill="white" fillOpacity="0.2" />
    <circle cx="14" cy="9" r="3.5" fill="white" />
    <circle cx="9" cy="18" r="3.5" fill="white" />
    <circle cx="19" cy="18" r="3.5" fill="white" />
  </svg>
);

// ─── Tech Stack Icons ─────────────────────────────────────────────────────────
const ReactIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.2">
    <circle cx="12" cy="12" r="2" fill="#94a3b8" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
  </svg>
);

const BoltIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#94a3b8">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#94a3b8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ─── Social Icons ─────────────────────────────────────────────────────────────
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

const TwitchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <circle cx="12" cy="12" r="10" fill="#6C63FF" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── Game Card Component ──────────────────────────────────────────────────────
const GameCard = ({ icon, title, difficulty, diffColor, buttonText, bgColor }) => (
  <div style={{
    background: "white",
    borderRadius: "16px",
    padding: "28px 24px 20px",
    minWidth: "220px",
    flex: "1",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }}>
    {/* Icon Box */}
    <div style={{
      width: "52px",
      height: "52px",
      borderRadius: "12px",
      background: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      marginBottom: "8px"
    }}>
      {icon}
    </div>
    <div style={{ fontWeight: "700", fontSize: "17px", color: "#111827" }}>{title}</div>
    <div style={{ fontSize: "13px", fontWeight: "600", color: diffColor }}>{difficulty}</div>
    <button style={{
      marginTop: "10px",
      padding: "12px 0",
      width: "100%",
      background: "white",
      border: "1.5px solid #e5e7eb",
      borderRadius: "10px",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
      color: "#111827",
      transition: "background 0.15s"
    }}
      onMouseEnter={e => e.target.style.background = "#f3f4f6"}
      onMouseLeave={e => e.target.style.background = "white"}
    >
      {buttonText}
    </button>
  </div>
);

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  const [roomId, setRoomId] = useState("");

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f0f6ff", minHeight: "100vh" }}>

      {/* ── NAVBAR SECTION ── */}
      <Navbar />
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "64px",
        background: "white",
        borderBottom: "1px solid #e8f0fe",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "linear-gradient(135deg, #38bdf8, #6C63FF)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <LogoIcon />
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "16px", color: "#111827", lineHeight: "1" }}>Game Sphere</div>
            <div style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "0.08em", fontWeight: "600" }}>PLAY TOGETHER</div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "32px" }}>
          {["Home", "Games", "Leaderboard"].map(link => (
            <a key={link} href="#" style={{
              color: "#374151", fontWeight: "500", fontSize: "15px",
              textDecoration: "none", transition: "color 0.15s"
            }}
              onMouseEnter={e => e.target.style.color = "#38bdf8"}
              onMouseLeave={e => e.target.style.color = "#374151"}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: Room Join + Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            placeholder="Room ID..."
            style={{
              padding: "8px 14px", borderRadius: "8px",
              border: "1.5px solid #e5e7eb", outline: "none",
              fontSize: "14px", color: "#374151", width: "120px"
            }}
          />
          <button style={{
            padding: "8px 20px", borderRadius: "8px",
            background: "#111827", color: "white",
            fontWeight: "700", fontSize: "14px",
            border: "none", cursor: "pointer"
          }}>
            Join
          </button>
          {/* Avatar (replaces boy image) */}
          <Avatar />
          <LogoutIcon />
          <ExpandIcon />
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        background: "linear-gradient(180deg, #e8f4fd 0%, #f0f6ff 100%)",
        padding: "80px 32px 60px",
        textAlign: "center"
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-block",
          background: "white",
          border: "1px solid #c7e2f5",
          borderRadius: "20px",
          padding: "6px 18px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#4b6cb7",
          letterSpacing: "0.05em",
          marginBottom: "28px"
        }}>
          NEW: SIMON GAME ADDED
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "900", color: "#0f172a", lineHeight: "1.1", margin: "0 0 8px" }}>
          Play Real-Time Games
        </h1>
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "900", lineHeight: "1.1", margin: "0 0 28px",
          background: "linear-gradient(90deg, #38bdf8, #818cf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          with Friends
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: "17px", color: "#64748b", maxWidth: "520px", margin: "0 auto 40px", lineHeight: "1.7" }}>
          Create a room, share a code, and start playing instantly. No downloads, no lag, just pure fun on Game Sphere.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            padding: "14px 32px",
            background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
            color: "white", fontWeight: "700", fontSize: "15px",
            border: "none", borderRadius: "10px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 14px rgba(56,189,248,0.4)",
            transition: "transform 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Play Multiplayer 👥
          </button>
          <button style={{
            padding: "14px 32px",
            background: "white", color: "#111827",
            fontWeight: "700", fontSize: "15px",
            border: "1.5px solid #e5e7eb", borderRadius: "10px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
            transition: "transform 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Play Solo 👤
          </button>
        </div>

        {/* Tech Stack Icons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "28px", marginTop: "48px" }}>
          <ReactIcon /><BoltIcon /><ShieldIcon /><GlobeIcon />
        </div>
      </section>

      {/* ── MULTIPLAYER GAMES SECTION ── */}
      <section style={{ padding: "60px 32px 40px", background: "#f0f6ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Multiplayer Games</h2>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Compete with friends or strangers globally</p>
            </div>
            <a href="#" style={{ color: "#4b6cb7", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
              View all games →
            </a>
          </div>

          {/* Game Cards Grid */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <GameCard
              icon="✖️"
              title="Tic Tac Toe"
              difficulty="Beginner"
              diffColor="#22c55e"
              buttonText="Play Now"
              bgColor="#dbeafe"
            />
            <GameCard
              icon="✊"
              title="Rock Paper Scissors"
              difficulty="Beginner"
              diffColor="#22c55e"
              buttonText="Play Now"
              bgColor="#fef3c7"
            />
            <GameCard
              icon="🧠"
              title="Simon Game"
              difficulty="Intermediate"
              diffColor="#f59e0b"
              buttonText="Play Now"
              bgColor="#ede9fe"
            />
            <GameCard
              icon="#"
              title="Guess the Number"
              difficulty="Intermediate"
              diffColor="#f59e0b"
              buttonText="Play Now"
              bgColor="#d1fae5"
            />
          </div>
        </div>
      </section>

      {/* ── SINGLE PLAYER SECTION ── */}
      <section style={{ padding: "20px 32px 60px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Single Player</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Perfect your skills in solo mode</p>
          </div>

          {/* Solo Game Cards */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <GameCard
              icon="🐛"
              title="Snake"
              difficulty="Intermediate"
              diffColor="#f59e0b"
              buttonText="Play Solo"
              bgColor="#dcfce7"
            />
            <GameCard
              icon="💡"
              title="Trivia Quiz"
              difficulty="Advanced"
              diffColor="#ef4444"
              buttonText="Play Solo"
              bgColor="#dbeafe"
            />
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section style={{
        padding: "60px 32px",
        background: "linear-gradient(180deg, #e8f4fd 0%, #f0f6ff 100%)",
        textAlign: "center"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          flexWrap: "wrap",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {[
            { value: "250k+", label: "Active Players" },
            { value: "12M+", label: "Games Played" },
            { value: "50+", label: "Unique Rooms" },
            { value: "4.9/5", label: "User Rating" },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: "40px", fontWeight: "800", color: "#0f172a" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "#64748b", marginTop: "6px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER SECTION ── */}
      <footer style={{ background: "#0f172a", color: "white", padding: "56px 32px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Footer Grid */}
          <div style={{ display: "flex", gap: "60px", flexWrap: "wrap", paddingBottom: "40px", borderBottom: "1px solid #1e293b" }}>

            {/* Brand Column */}
            <div style={{ flex: "1.5", minWidth: "200px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #38bdf8, #6C63FF)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <LogoIcon />
                </div>
                <span style={{ fontWeight: "800", fontSize: "16px" }}>Game Sphere</span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7", maxWidth: "240px" }}>
                The world's most humanistic gaming platform. Play, compete, and connect in real-time.
              </p>
            </div>

            {/* Platform Column */}
            <div style={{ flex: "1", minWidth: "140px" }}>
              <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "16px" }}>Platform</div>
              {["Browse Games", "Leaderboards", "Tournament Hub"].map(l => (
                <a key={l} href="#" style={{ display: "block", color: "#94a3b8", fontSize: "14px", marginBottom: "10px", textDecoration: "none" }}>{l}</a>
              ))}
            </div>

            {/* Support Column */}
            <div style={{ flex: "1", minWidth: "140px" }}>
              <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "16px" }}>Support</div>
              {["Help Center", "Community Guidelines", "Contact Us"].map(l => (
                <a key={l} href="#" style={{ display: "block", color: "#94a3b8", fontSize: "14px", marginBottom: "10px", textDecoration: "none" }}>{l}</a>
              ))}
            </div>

            {/* Social Column */}
            <div style={{ flex: "1", minWidth: "140px" }}>
              <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "16px" }}>Social</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {[<TwitterIcon />, <DiscordIcon />, <TwitchIcon />].map((icon, i) => (
                  <button key={i} style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "#1e293b", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#334155"}
                    onMouseLeave={e => e.currentTarget.style.background = "#1e293b"}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ textAlign: "center", paddingTop: "24px" }}>
            <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 8px" }}>© 2024 Game Sphere Inc. All rights reserved.</p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
              {["Privacy Policy", "Terms of Service"].map(l => (
                <a key={l} href="#" style={{ color: "#64748b", fontSize: "13px", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING HELP BUTTON ── */}
      <button style={{
        position: "fixed", bottom: "24px", right: "24px",
        width: "44px", height: "44px", borderRadius: "50%",
        background: "linear-gradient(135deg, #6C63FF, #38bdf8)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 14px rgba(108,99,255,0.4)",
        zIndex: 999
      }}>
        <HelpIcon />
      </button>

    </div>
  );
}