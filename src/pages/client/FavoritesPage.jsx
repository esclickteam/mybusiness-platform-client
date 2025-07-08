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

      // משתמש מקומי מאומת אם יש user.userId
      let gotUser = !!user?.userId;
      console.log("👤 gotUser:", gotUser, "user:", user);

      let res;
      try {
        if (gotUser) {
          console.log("🚀 שולח /auth/me עם טוקן");
          res = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          });
        } else {
          console.log("🌐 אין טוקן במרחב, מנסה auth דרך cookie");
          res = await API.get("/auth/me", { withCredentials: true });
          // השרת מחזיר userId (ולא _id)
          if (res.data?.userId) {
            console.log("✅ Cookie auth הצליח, setUser:", res.data);
            setUser(res.data);
            gotUser = true;
          }
        }

        console.log("📥 /auth/me response data:", res.data);

        // נניח שה-favorites מוחזרים עכשיו במפתח favorites
        if (gotUser && Array.isArray(res.data.favorites)) {
          console.log("⭐ Loaded favorites:", res.data.favorites);
          setFavorites(res.data.favorites);
        } else if (!gotUser) {
          console.warn("⚠️ לא מזוהה, זורק שגיאת התחברות");
          throw new Error("אנא התחבר כדי לראות את המועדפים שלך.");
        } else {
          console.log("ℹ️ אין מועדפים להציג");
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
  if (error)
    return (
      <div style={{ color: "red" }}>
        {error}
        <br />
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </div>
    );
  if (!favorites.length) return <div>אין לך עסקים במועדפים כרגע.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ המועדפים שלי</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {favorites.map((biz) => (
          <li
            key={biz._id}
            onClick={() => {
              console.log("➡️ navigating to business:", biz._id);
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
