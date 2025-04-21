// src/index.jsx
-import React from "react";
-import ReactDOM from "react-dom/client";
-import App from "./App";
-
-ReactDOM.createRoot(document.getElementById("root")).render(
-  <React.StrictMode>
-    <App />
-  </React.StrictMode>
-);
+import React from "react";
+import ReactDOM from "react-dom/client";
+import { BrowserRouter } from "react-router-dom";
+import App from "./App";
+import { AuthProvider } from "./context/AuthContext";
+
+ReactDOM.createRoot(document.getElementById("root")).render(
+  <React.StrictMode>
+    <AuthProvider>
+      <BrowserRouter>
+        <App />
+      </BrowserRouter>
+    </AuthProvider>
+  </React.StrictMode>
+);
