import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles = [], requiredPackage = null }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // אם טעינה בגרסה, אל תבצע שום דבר.
    
    // 1. אם אין משתמש, הפנייה לדף הבית
    if (!user) {
      navigate("/", { replace: true });
    } 
    
    // 2. אם אין תפקיד למשתמש, הפנייה לדף הבית
    if (!user.role) {
      navigate("/", { replace: true });
    }
    
    // 3. אם התפקיד לא מתאים
    if (roles.length > 0 && !roles.includes(user.role)) {
      const redirectMap = {
        customer: `/client/dashboard`,
        business: `/business/${user.businessId}/dashboard`,
        worker: `/staff/dashboard`,
        manager: `/manager/dashboard`,
        admin: `/admin/dashboard`,
      };

      const target = redirectMap[user.role] || "/";
      navigate(target, { replace: true });
    }
    
    // 4. אם נדרשת חבילה (סאבסקריפשן) שלא קיימת, הפנייה לדף החבילות
    if (requiredPackage && user.subscriptionPlan !== requiredPackage) {
      navigate("/plans", { replace: true });
    }
    
    // 5. אם משתמש עסקי ואין לו businessId, הפנייה ליצור עסק חדש
    if (
      roles.includes("business") &&
      user.role === "business" &&
      !user.businessId
    ) {
      navigate("/create-business", { replace: true });
    }
  }, [user, loading, navigate, roles, requiredPackage]);

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        🔄 טוען נתונים...
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
