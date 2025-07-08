import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFavorites() {
      console.log("🔄 fetchFavorites started");
      setLoading(true);
      setError(null);

      const hasLocalUser = !!user?._id;
      console.log("👤 hasLocalUser:", hasLocalUser, "user:", user);

      let res;
      try {
        if (hasLocalUser) {
          console.log("🚀 Sending request with Bearer token");
          res = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          });
        } else {
          console.log("🌐 No local token, trying cookie-based auth");
          res = await API.get("/auth/me", { withCredentials: true });

          if (res.data?._id) {
            console.log("✅ Cookie auth succeeded, setting user in context:", res.data);
            setUser(res.data);
          }
        }

        console.log("📥 /auth/me response data:", res.data);
        if (res.data?.favorites) {
          console.log("⭐ Favorites loaded:", res.data.favorites);
          setFavorites(res.data.favorites);
        } else if (!hasLocalUser) {
          console.warn("⚠️ User not authenticated, throwing login error");
          throw new Error("אנא התחבר כדי לראות את המועדפים שלך.");
        } else {
          console.log("ℹ️ No favorites found");
          setFavorites([]);
        }
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
        setError(err.message || "שגיאה בטעינת המועדפים");
      } finally {
        console.log("✅ fetchFavorites finished");
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user, setUser]);

  if (loading) return <div>טוען מועדפים...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (favorites.length === 0) return <div>אין לך עסקים במועדפים כרגע.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ המועדפים שלי</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {favorites.map((biz) => (
          <li
            key={biz._id}
            onClick={() => {
              console.log("➡️ Navigating to business:", biz._id);
              navigate(`/business/${biz._id}`);
            }}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
            title={`לחץ לפרופיל העסק ${biz.businessName}`}
          >
            <strong>{biz.businessName}</strong>
            <p>{biz.description?.slice(0, 100) || "אין תיאור"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
