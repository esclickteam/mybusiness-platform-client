 // src/socket.js
import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const socket = io(socketUrl, {
  auth: {
    token: localStorage.getItem("token"),
    role: "business",
    businessId: localStorage.getItem("businessId"),
  },
  path: "/socket.io",
});

export default socket;