// src/pages/ClientMessagesPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import ClientChatSection from "../components/ClientChatSection";

export default function ClientMessagesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return <div>{t("leftover.profile.loading")}</div>;

  return (
    <div style={{ margin: "32px auto", maxWidth: 1020 }}>
      <h2 style={{ textAlign: "right", color: "#5a4be7", marginBottom: 24 }}>{t("leftover.profile.myMessages")}</h2>
      <ClientChatSection userId={user.id} />
    </div>
  );
}
