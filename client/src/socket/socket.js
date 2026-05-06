import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],   // 🔥 IMPORTANT
  withCredentials: false       // 🔥 VERY IMPORTANT FIX
});

export default socket;