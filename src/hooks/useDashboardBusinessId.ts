import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { normalizeBusinessId } from "../utils/notificationNavigation";

/**
 * Prefer URL businessId (admin cross-tenant), fall back to the logged-in user's business.
 */
export function useDashboardBusinessId(): string {
  const { businessId: urlBusinessId } = useParams<{ businessId?: string }>();
  const { user } = useAuth() as { user?: { businessId?: string } | null };

  return (
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId)
  );
}

export default useDashboardBusinessId;
