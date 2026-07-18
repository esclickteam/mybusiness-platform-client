import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export default function CollabLegacyRedirect() {
  const { tab } = useParams();
  const { user } = useAuth() as { user?: { businessId?: string } | null };

  if (!user?.businessId) {
    return <Navigate to="/login" replace />;
  }

  const suffix = tab ? `/${tab}` : "/profile";

  return (
    <Navigate
      to={`/business/${user.businessId}/dashboard/collab${suffix}`}
      replace
    />
  );
}
