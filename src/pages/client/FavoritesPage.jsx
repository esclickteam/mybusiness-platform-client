import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth(); // הוסף setUser מהקונטקסט!
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      setError(null);

      // בדיקה האם יש token מקומי (user?.token)
      let gotUser = !!user?._id;
      let favoritesData = [];

      try {
        let res;
        if (gotUser) {
          // יש token – שלח בבקשה
          res = await API.get("/auth/me", {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          });
        } else {
          // אין token, ננסה לקרוא מהמושב (cookie)
          res = await API.get("/auth/me", { withCredentials: true });
          if (res.data && res.data._id) {
            // אם חוזר משתמש, נעדכן את ה־context
            setUser && setUser(res.data);
            gotUser = true;
          }
        }

        if (gotUser && res.data && res.data.favorites) {
          favoritesData = res.data.favorites;
        } else if (!gotUser) {
          setError("אנא התחבר כדי לראות את המועדפים שלך.");
        }

        setFavorites(favoritesData);
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת המועדפים");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
    // *** הוספתי תלות גם ב-setUser
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
