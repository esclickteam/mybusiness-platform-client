// src/pages/client/FavoritesPage.jsx
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

  return { favorites, loading, error };
}

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
              display: "flex",
              alignItems: "center",
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
