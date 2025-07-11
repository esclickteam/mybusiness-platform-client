/* components/AffiliateAutoLogin.jsx */
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AffiliateAutoLogin() {
  const { publicToken } = useParams();
  const navigate = useNavigate();
  const { affiliateLogin } = useAuth();

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
        alert(err.message || "שגיאה בכניסה כמשווק");
        navigate("/login");
      }
    }
    doLogin();
  }, [publicToken, navigate, affiliateLogin]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>טוען את דף המשווק…</h2>
    </div>
  );
}
