```javascript
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
          setError(err.message || "Error loading favorites");
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
    if (removingId) return; // Prevents double clicks
    setRemovingId(businessId);
    try {
      await API.delete(`/users/favorites/${businessId}`, { withCredentials: true });
      // Refresh favorites after removal
      const updatedUser = await API.get("/auth/me", { withCredentials: true });
      setUser(updatedUser.data);
      // Update local favorites list
      setFavorites((prev) => prev.filter((biz) => biz._id !== businessId));
    } catch (err) {
      alert("Error removing favorite, please try again");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <div>Loading favorites...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        {error}
        <br />
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );

  if (favorites.length === 0) return <div>You currently have no businesses in favorites.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ My Favorites</h2>
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
            title={`Click for the business profile ${biz.businessName}`}
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
                <p>{biz.description?.slice(0, 100) || "No description"}</p>
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
              aria-label={`Remove ${biz.businessName} from favorites`}
            >
              {removingId === biz._id ? "Removing..." : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```