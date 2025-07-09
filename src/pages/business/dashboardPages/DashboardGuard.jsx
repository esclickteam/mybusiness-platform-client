import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardGuard({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // נרמול hasPaid
  const normalizedHasPaid =
    user?.hasPaid === true || user?.hasPaid === "true" || user?.hasPaid === 1;

  React.useEffect(() => {
    if (!loading) {
      if (!user || !normalizedHasPaid) {
        navigate("/checkout");
      }
    }
  }, [user, loading, navigate, normalizedHasPaid]);

  if (loading || !user || !normalizedHasPaid) return null;

  return children;
}
