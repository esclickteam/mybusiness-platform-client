import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loginWithPublicToken } from "./affiliateService";


export default function AffiliateAutoLogin() {
  const { publicToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function doLogin() {
      if (!publicToken) {
        navigate("/login");
        return;
      }

      try {
        const token = await loginWithPublicToken(publicToken);
        if (token) {
          // אפשר גם להגדיר כאן מצב גלובלי של משתמש מחובר אם יש צורך
          navigate("/affiliate/dashboard");
        } else {
          alert("לא הצלחנו להתחבר עם publicToken");
          navigate("/login");
        }
      } catch (err) {
        alert(err.message || "שגיאה בכניסה");
        navigate("/login");
      }
    }
    doLogin();
  }, [publicToken, navigate]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>טוען את דף המשווק...</h2>
    </div>
  );
}
