import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function FavoritesPage() {
  /* -------------------- context -------------------- */
  const { user, token, initialized, setUser } = useAuth();
  const navigate = useNavigate();

  /* -------------------- state ---------------------- */
  const [favorites, setFavorites] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  /* -------------------- effect --------------------- */
  useEffect(() => {
    if (!initialized) return;              // מחכים שה-AuthProvider יסיים טעינה

    const controller = new AbortController();

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get("/auth/me", {
          signal: controller.signal,
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        /* ---------- אם אין משתמש → Login ---------- */
        if (!res.data?._id) {
          navigate("/login", { replace: true });
          return;
        }

        /* ---------- עדכון Context (פעם ראשונה) ---- */
        if (!user?._id) setUser?.(res.data);

        /* ---------- שמירת מועדפים ------------------ */
        setFavorites(Array.isArray(res.data.favorites) ? res.data.favorites : []);

      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login", { replace: true });
        } else if (err.name !== "CanceledError") {
          console.error(err);
          setError("שגיאה בטעינת המועדפים");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
    return () => controller.abort();

  }, [initialized, user?._id, token, setUser, navigate]);

  /* -------------------- UI ------------------------- */
  if (loading)  return <div>טוען מועדפים...</div>;
  if (error)    return <div style={{ color: "red" }}>{error}</div>;
  if (!favorites.length)
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
