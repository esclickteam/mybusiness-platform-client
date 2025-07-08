import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

function useFavorites() {
  const { user, setUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
        const res = await API.get("/users/favorites", {
          headers,
          withCredentials: true,
        });

        if (isMounted) {
          setFavorites(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "שגיאה בטעינת המועדפים");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return { favorites, setFavorites, loading, error };
}

export default function FavoritesPage() {
  const { favorites, setFavorites, loading, error } = useFavorites();
  const navigate = useNavigate();
  const { setUser, user } = useAuth();
  const [removingId, setRemovingId] = useState(null);

  const handleRemoveFavorite = async (businessId) => {
    if (removingId) return; // מונע לחיצות כפולות
    setRemovingId(businessId);
    try {
      await API.delete(`/users/favorites/${businessId}`, { withCredentials: true });
      // רענון מועדפים אחרי הסרה
      const updatedUser = await API.get("/auth/me", { withCredentials: true });
      setUser(updatedUser.data);
      // עדכון רשימת המועדפים מקומית
      setFavorites((prev) => prev.filter((biz) => biz._id !== businessId));
    } catch (err) {
      alert("שגיאה בהסרת המועדף, נסה שוב");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <div>טוען מועדפים...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        {error}
        <br />
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </div>
    );

  if (favorites.length === 0) return <div>אין לך עסקים במועדפים כרגע.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ המועדפים שלי</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {favorites.map((biz) => (
          <li
            key={biz._id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "8px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "default",
            }}
            title={`לחץ לפרופיל העסק ${biz.businessName}`}
          >
            <div
              style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate(`/business/${biz._id}`)}
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
            </div>
            <button
              onClick={() => handleRemoveFavorite(biz._id)}
              disabled={removingId === biz._id}
              style={{
                backgroundColor: "#ff4d4d",
                border: "none",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
              aria-label={`הסר את ${biz.businessName} מהמועדפים`}
            >
              {removingId === biz._id ? "מוסר..." : "הסר"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
