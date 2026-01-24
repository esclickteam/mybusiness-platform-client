import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./FavoritesPage.css";

function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        const res = await API.get("/users/favorites", {
          headers,
          withCredentials: true,
        });

        if (isMounted) setFavorites(res.data || []);
      } catch (err) {
        if (isMounted) setError("Error loading favorites");
      } finally {
        if (isMounted) setLoading(false);
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
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const handleRemoveFavorite = async (businessId) => {
    if (removingId) return;
    setRemovingId(businessId);

    try {
      await API.delete(`/users/favorites/${businessId}`, {
        withCredentials: true,
      });

      const updatedUser = await API.get("/auth/me", {
        withCredentials: true,
      });
      setUser(updatedUser.data);

      setFavorites((prev) => prev.filter((b) => b._id !== businessId));
    } catch {
      alert("Error removing favorite");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <div className="favorites-loading">Loading favorites…</div>;
  if (error) return <div className="favorites-error">{error}</div>;

  if (favorites.length === 0)
    return (
      <div className="favorites-empty">
        <h3>No favorites yet</h3>
        <p>Save businesses to quickly find them later.</p>
      </div>
    );

  return (
    <div className="favorites-page">
      <h2 className="favorites-title">⭐ My Favorites</h2>

      <ul className="favorites-list">
        {favorites.map((biz) => (
          <li key={biz._id} className="favorite-card">
            <div
              className="favorite-card__main"
              onClick={() => navigate(`/business/${biz._id}`)}
            >
              {biz.logo && (
                <img
                  src={biz.logo}
                  alt={`${biz.businessName} logo`}
                  className="favorite-card__logo"
                />
              )}

              <div className="favorite-card__content">
                <strong className="favorite-card__name">
                  {biz.businessName}
                </strong>
                <p className="favorite-card__desc">
                  {biz.description || "No description"}
                </p>
              </div>
            </div>

            <button
              className="favorite-card__remove"
              onClick={() => handleRemoveFavorite(biz._id)}
              disabled={removingId === biz._id}
              aria-label={`Remove ${biz.businessName} from favorites`}
            >
              {removingId === biz._id ? "Removing…" : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
