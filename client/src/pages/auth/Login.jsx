import { useState } from "react";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const icons = [
    {
      id: "gamepad",
      label: "Gamepad",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M7 12h2v-2h2v2h2v2h-2v2H9v-2H7v-2zm12-6H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3zm1 9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6zm-3-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      ),
    },
    {
      id: "trophy",
      label: "Trophy",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.86 10.4 5 9.3 5 8zm14 0c0 1.3-.86 2.4-2 2.82V7h2v1z" />
        </svg>
      ),
    },
    {
      id: "vr",
      label: "VR",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20.5 7h-17A1.5 1.5 0 0 0 2 8.5v7A1.5 1.5 0 0 0 3.5 17h3.86l1.5-2.5h6.28l1.5 2.5H20.5A1.5 1.5 0 0 0 22 15.5v-7A1.5 1.5 0 0 0 20.5 7zM9 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
        </svg>
      ),
    },
    {
      id: "headset",
      label: "Headset",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 3a9 9 0 0 0-9 9v3.5C3 17 4 18 5.5 18H7v-7H5.07A7.01 7.01 0 0 1 12 5a7.01 7.01 0 0 1 6.93 6H17v7h1.5C20 18 21 17 21 15.5V12a9 9 0 0 0-9-9z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-3/5 relative bg-gradient-to-br from-[#0a0f2e] via-[#0d1b3e] to-[#1a0a3e] text-white overflow-hidden">
        {/* Starfield dots */}
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.6 + 0.1,
                animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Glow orb */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)",
            top: "30%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            filter: "blur(10px)",
          }}
        />

        {/* Content */}
        <div className="absolute w-full flex flex-col items-center justify-center top-[68%] -translate-y-1/2 z-10">
          {/* GameSphere title with float animation */}
          <div style={{ animation: "float 3s ease-in-out infinite" }}>
            <h1 className="font-game text-[5rem] font-extrabold leading-none text-center tracking-tight">
              <span className="text-white">Game</span>
              <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
  Sphere
</span>
            </h1>

            <p
              className="mt-3 tracking-[0.3em] text-base text-center font-medium"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              PLAY. COMPETE. CONQUER.
            </p>
          </div>

          {/* 4 Icons below */}
          <div className="flex gap-8 mt-10">
            {icons.map((icon) => (
              <div
                key={icon.id}
                onMouseEnter={() => setHoveredIcon(icon.id)}
                onMouseLeave={() => setHoveredIcon(null)}
                className="cursor-pointer transition-all duration-300"
                style={{
                  color:
                    hoveredIcon === icon.id
                      ? "#38bdf8"
                      : "rgba(255,255,255,0.35)",
                  transform:
                    hoveredIcon === icon.id
                      ? "translateY(-6px) scale(1.2)"
                      : "translateY(0) scale(1)",
                  filter:
                    hoveredIcon === icon.id
                      ? "drop-shadow(0 0 8px rgba(56,189,248,0.7))"
                      : "none",
                }}
                title={icon.label}
              >
                {icon.svg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/5 flex items-center justify-center bg-white">
        
        <form onSubmit={handleSubmit} className="w-[450px] space-y-4 px-6 py-8">
          
          <h2 className="text-4xl font-bold text-gray-900">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 leading-relaxed">
            Login to continue your gaming journey.
          </p>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Login →
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Login;