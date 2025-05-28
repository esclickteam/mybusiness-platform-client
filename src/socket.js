// src/socket.js
import { io } from "socket.io-client";
import { getAccessToken, getBusinessId } from "./utils/authHelpers"; // Helpers you create to read from your auth context or localStorage

const socketUrl = import.meta.env.VITE_SOCKET_URL;

// פונקציה לאתחול socket עם auth עדכני
export function createSocket() {
  const accessToken = getAccessToken();
  const businessId = getBusinessId();

  console.log("🌐 Connecting socket with:", { accessToken, businessId });

  return io(socketUrl, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      token: accessToken,
      role: accessToken && businessId ? "business" : "client",
      businessId,
    },
    autoConnect: false, // לא להתחבר אוטומטית — תתחבר במקומות המתאימים
  });
}

// ייצוא ברירת מחדל של פונקציה ליצירת הסוקט
export default createSocket;
