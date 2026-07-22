import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

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

  if (loading || !user || !normalizedHasPaid) {
    return <BizuplyLoader fullScreen label="Loading..." />;
  }

  return children;
}
