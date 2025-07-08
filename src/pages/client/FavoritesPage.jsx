import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // וודא שה־API מוגדר נכון
import { useAuth } from "../../context/AuthContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFavorites() {
      if (!user || !user.token) {
        setError("אנא התחבר כדי לראות את המועדפים שלך.");
        setLoading(false);
        return;
      }
      try {
        // קריאה ישירה ל-API של המועדפים עם הטוקן
        const res = await API.get("/business/favorites", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const favBusinesses = res.data.favorites || [];
        setFavorites(favBusinesses);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת המועדפים");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

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
            onClick={() => navigate(`/business/${biz._id}`)}
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
