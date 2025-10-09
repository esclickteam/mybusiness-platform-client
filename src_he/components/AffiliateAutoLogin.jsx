import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AffiliateAutoLogin() {
  const { publicToken } = useParams();
  const navigate = useNavigate();
  const { affiliateLogin } = useAuth();

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  useEffect(() => {
    const performLogin = async () => {
      if (!publicToken) {
        setStatus("error");
        setMessage("Missing affiliate token");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        setStatus("loading");
        await affiliateLogin(publicToken);
        setStatus("success");
        setMessage("Affiliate login successful");
        navigate("/affiliate/dashboard", { replace: true });
      } catch (err) {
        console.error("Affiliate login failed:", err);
        setStatus("error");
        setMessage(err?.message || "Error logging in as an affiliate");
        // Navigate back after a short delay
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    performLogin();
  }, [publicToken, affiliateLogin, navigate]);

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        color: status === "error" ? "red" : "#444",
      }}
    >
      {status === "loading" && <h2>Loading affiliate account…</h2>}
      {status === "success" && <h2>{message}</h2>}
      {status === "error" && (
        <>
          <h2>{message}</h2>
          <p>You will be redirected shortly.</p>
        </>
      )}
    </div>
  );
}
