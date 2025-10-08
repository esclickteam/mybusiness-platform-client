// src/pages/ClientMessagesPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import ClientChatSection from "../components/ClientChatSection";

export default function ClientMessagesPage() {
  const { user } = useAuth();

  if (!user) return <div>טוען...</div>;

  return (
    <div style={{ margin: "32px auto", maxWidth: 1020 }}>
      <h2 style={{ textAlign: "right", color: "#5a4be7", marginBottom: 24 }}>ההודעות שלי</h2>
      <ClientChatSection userId={user.id} />
    </div>
  );
}
