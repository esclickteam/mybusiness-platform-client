```javascript
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
        setError(err.message || "Error logging in as an affiliate");
        // You can also navigate to the login page after a second, if you want:
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
      <h2>Loading the affiliate page…</h2>
    </div>
  );
}
```