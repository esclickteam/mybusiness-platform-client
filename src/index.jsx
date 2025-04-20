import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css"; // עדכון הנתיב
import { AuthProvider } from "./context/AuthContext"; // ייבוא ההקשר של האימות

// בדיקה שה-root קיים לפני טעינת האפליקציה
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("❌ שגיאה: האלמנט root לא נמצא ב-HTML.");
} else {
  const root = ReactDOM.createRoot(rootElement);
  
  try {
    root.render(
      <React.StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
    console.log("🚀 האפליקציה נטענה בהצלחה!");
  } catch (error) {
    console.error("❌ שגיאה בהפעלת האפליקציה:", error);
  }
}
