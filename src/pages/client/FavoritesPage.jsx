// src/hooks/useFavorites.js
import { useState, useEffect } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export function useFavorites() {
  const { user, setUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      console.log("🔄 load favorites started");
      setLoading(true);
      setError(null);

      try {
        // Include token header if available
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        const res = await API.get("/auth/me", {
          headers,
          withCredentials: true,
        });
        console.log("📥 /auth/me response data:", res.data);

        // Update context on cookie-based auth
        if (!user?.userId && res.data?.userId) {
          console.log("✅ setting user from cookie:", res.data);
          setUser(res.data);
        }

        // Validate authentication
        if (!res.data?.userId) {
          throw new Error("אנא התחבר כדי לראות את המועדפים שלך.");
        }

        // Load favorites array from response
        const favs = Array.isArray(res.data.favorites) ? res.data.favorites : [];
        console.log("⭐ favorites loaded:", favs);
        isMounted && setFavorites(favs);
      } catch (err) {
        console.error("❌ error loading favorites:", err);
        isMounted && setError(err.message || "שגיאה בטעינת המועדפים");
      } finally {
        console.log("✅ load favorites finished");
        isMounted && setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [user, setUser]);

  return { favorites, loading, error };
}


// src/pages/client/FavoritesPage.jsx
import React from "react";
import { useFavorites } from "../../hooks/useFavorites";
import { useNavigate } from "react-router-dom";

export default function FavoritesPage() {
  const { favorites, loading, error } = useFavorites();
  const navigate = useNavigate();

  if (loading) return <div>טוען מועדפים...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        {error}
        <br />
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </div>
    );

  if (favorites.length === 0)
    return <div>אין לך עסקים במועדפים כרגע.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ המועדפים שלי</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {favorites.map((biz) => (
          <li
            key={biz._id}
            onClick={() => navigate(`/business/${biz._id}`)}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              alignItems: "center"
            }}
            title={`לחץ לפרופיל העסק ${biz.businessName}`}
          >
            {biz.logo && (
              <img
                src={biz.logo}
                alt={`${biz.businessName} logo`}
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
            )}
            <div>
              <strong>{biz.businessName}</strong>
              <p>{biz.description?.slice(0, 100) || "אין תיאור"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
