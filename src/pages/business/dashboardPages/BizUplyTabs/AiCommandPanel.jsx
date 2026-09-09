import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AiCommandPanel({ businessId, token, profile }) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendCommand() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBaseUrl}/chat/ai-command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ businessId, prompt, profile }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || t("leftover.aiPartnerChrome.sendFailed"));

      setResponse(data);
      setPrompt("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        direction: "ltr",
        textAlign: "left",
      }}
    >
      <h2>{t("leftover.aiPartnerChrome.title")}</h2>

      <textarea
        rows={4}
        style={{
          width: "100%",
          fontSize: 16,
          padding: 8,
          borderRadius: 4,
          border: "1px solid #ccc",
          resize: "vertical",
        }}
        placeholder={t("leftover.aiPartnerChrome.placeholder")}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
        aria-label={t("leftover.aiPartnerChrome.ariaRequest")}
      />

      <button
        style={{
          marginTop: 10,
          padding: "8px 16px",
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#ccc" : "#6200ee",
          color: "white",
          border: "none",
          borderRadius: 4,
          transition: "background-color 0.3s ease",
        }}
        onClick={sendCommand}
        disabled={loading || !prompt.trim()}
        aria-disabled={loading || !prompt.trim()}
        aria-busy={loading}
      >
        {loading ? t("leftover.aiPartnerChrome.sending") : t("leftover.aiPartnerChrome.send")}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 10 }} role="alert" aria-live="assertive">
          {t("leftover.aiPartnerChrome.errorPrefix", { detail: error })}
        </p>
      )}

      {response && (
        <div
          style={{
            marginTop: 20,
            backgroundColor: "#f0f0f0",
            padding: 10,
            borderRadius: 6,
            whiteSpace: "pre-wrap",
            fontSize: 16,
            userSelect: "text",
          }}
          aria-live="polite"
        >
          <h3>{t("leftover.aiPartnerChrome.response")}</h3>
          <p>{response.answer}</p>

          {response.action && (
            <>
              <h4>{t("leftover.aiPartnerChrome.recommendedAction")}</h4>
              <pre
                style={{
                  backgroundColor: "#ddd",
                  padding: 10,
                  borderRadius: 4,
                  overflowX: "auto",
                  userSelect: "text",
                }}
              >
                {JSON.stringify(response.action, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
