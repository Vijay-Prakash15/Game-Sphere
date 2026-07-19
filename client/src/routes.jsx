import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import GameRoom from "./pages/GameRoom"; // ✅ ADD THIS
import Quiz from "./pages/Quiz";
import Snake from "./pages/Snake";
import Result from "./pages/Result";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lobby/:code"
        element={
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        }
      />

      {/* 🔥 NEW ROUTE */}
      <Route
        path="/room/:code"
        element={<ProtectedRoute>{/* <GameRoom /> */}</ProtectedRoute>}
      />
    </Routes>
  );
};

export default AppRoutes;
