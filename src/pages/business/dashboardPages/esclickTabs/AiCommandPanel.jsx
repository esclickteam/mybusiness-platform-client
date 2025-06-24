import React, { useState } from "react";

export default function AiCommandPanel({ businessId, token, profile }) {
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
      const res = await fetch("/api/chat/ai-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ businessId, prompt, profile }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "שגיאה בשליחת הפקודה");

      setResponse(data);
      setPrompt("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>שותף AI - בקש פעולה או תשובה</h2>

      <textarea
        rows={4}
        style={{ width: "100%", fontSize: 16, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        placeholder="כתוב כאן את הבקשה שלך לשותף AI..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
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
        }}
        onClick={sendCommand}
        disabled={loading || !prompt.trim()}
      >
        {loading ? "שולח..." : "שלח"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          שגיאה: {error}
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
          }}
        >
          <h3>תשובת AI:</h3>
          <p>{response.answer}</p>

          {response.action && (
            <>
              <h4>פעולה שמומלצת לביצוע:</h4>
              <pre
                style={{
                  backgroundColor: "#ddd",
                  padding: 10,
                  borderRadius: 4,
                  overflowX: "auto",
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
