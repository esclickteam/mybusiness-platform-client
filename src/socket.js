// src/socket.js
import { io } from "socket.io-client";
import { getAccessToken, getBusinessId } from "./utils/authHelpers";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export function createSocket() {
  const token      = getAccessToken();
  const businessId = getBusinessId();

  return io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    auth: { token, role: "business", businessId },
    autoConnect: false,    // לא להתחבר עד שנקרא ל־.connect()
  });
}

export default createSocket;
