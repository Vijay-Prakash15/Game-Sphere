import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(socketUrl, {
  transports: ["websocket"],
  autoConnect: false, // Don't connect automatically until we have auth token
  auth: {
    token: localStorage.getItem("token") || ""
  },
  withCredentials: true
});

// Helper to ensure authenticated connection
export const connectSocket = () => {
  const token = localStorage.getItem("token");
  socket.auth = { token };
  if (socket.disconnected) {
    socket.connect();
  }
  return socket;
};

export default socket;