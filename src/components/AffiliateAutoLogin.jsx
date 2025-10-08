import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AffiliateAutoLogin() {
  const { publicToken } = useParams();
  const navigate = useNavigate();
  const { affiliateLogin } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function doLogin() {
      if (!publicToken) {
        navigate("/login");
        return;
      }

      try {
        await affiliateLogin(publicToken);
        navigate("/affiliate/dashboard");
      } catch (err) {
        setError(err.message || "שגיאה בכניסה כמשווק");
        // אפשר גם לנווט אחרי שנייה לדף login, אם רוצים:
        // setTimeout(() => navigate("/login"), 2000);
      }
    }
    doLogin();
  }, [publicToken, navigate, affiliateLogin]);

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>טוען את דף המשווק…</h2>
    </div>
  );
}
