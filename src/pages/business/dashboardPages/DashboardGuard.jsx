import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardGuard({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading) {
      if (!user || !user.hasPaid) {
        navigate("/checkout");
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user || !user.hasPaid) return null;

  return children;
}
