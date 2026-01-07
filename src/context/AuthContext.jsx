import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { setAuthToken } from "../api";
import createSocket from "../socket";

/* ===========================
   🧩 Normalize User
=========================== */
function normalizeUser(user) {
  if (!user) return null;

  const now = new Date();
  let computedIsValid = false;

  if (user.subscriptionStart && user.subscriptionEnd) {
    computedIsValid = new Date(user.subscriptionEnd) > now;
  }

  const isTrialing = user.subscriptionPlan === "trial" && computedIsValid;
  const isPendingActivation = user.status === "pending_activation";

  // ✅ זיהוי אדמין שמתחזה לעסק
  const isAdminImpersonating =
  user.isImpersonating === true ||
  (user.role === "admin" && Boolean(user.businessId));

  const isSubscriptionValid =
    typeof user?.isSubscriptionValid === "boolean"
      ? user.isSubscriptionValid
      : computedIsValid;

  return {
    ...user,

     isImpersonating: isAdminImpersonating, 

    // 🔐 תשלומים / גישה
    hasPaid: isAdminImpersonating ? true : Boolean(user?.hasPaid),
    hasAccess: isAdminImpersonating
      ? true
      : isTrialing || Boolean(user?.hasPaid) || isPendingActivation,

    subscriptionCancelled: Boolean(user?.subscriptionCancelled),

    // 📦 סטטוס מנוי
    isSubscriptionValid: isAdminImpersonating
      ? true
      : isSubscriptionValid,

    subscriptionStatus: isAdminImpersonating
      ? user.subscriptionPlan
      : user.status || user.subscriptionPlan || "free",

    // 📅 ימים שנותרו
    daysLeft:
      user.subscriptionEnd &&
      (isAdminImpersonating || isSubscriptionValid)
        ? Math.ceil(
            (new Date(user.subscriptionEnd) - now) /
              (1000 * 60 * 60 * 24)
          )
        : 0,
  };
}


/* ===========================
   🔁 Token refresh (single flight)
=========================== */
let ongoingRefresh = null;

export async function singleFlightRefresh() {
  const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

  // ⛔ אין refresh בזמן impersonation
  if (isImpersonating) {
    throw new Error("Refresh disabled during impersonation");
  }

  if (!ongoingRefresh) {
    ongoingRefresh = API.post(
      "/auth/refresh-token",
      null,
      { withCredentials: true }
    )
      .then((res) => {
        const { accessToken, user: refreshedUser } = res.data;
        if (!accessToken) throw new Error("No new token");

        localStorage.setItem("token", accessToken);
        setAuthToken(accessToken);

        if (refreshedUser) {
          const normalized = normalizeUser(refreshedUser);
          localStorage.setItem(
            "businessDetails",
            JSON.stringify(normalized)
          );
        }

        return accessToken;
      })
      .finally(() => {
        ongoingRefresh = null;
      });
  }

  return ongoingRefresh;
}


/* ===========================
   ⚙ Context
=========================== */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("businessDetails");
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /* ===========================
     👤 Refresh user
  =========================== */
  const refreshUser = async (force = false) => {
  const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

  // 🔒 נעילה מוחלטת – גם אם מישהו קרא עם force=true
  if (isImpersonating) {
    const stored = localStorage.getItem("businessDetails");
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  }

  try {
    const { data } = await API.get(
      `/auth/me${force ? "?forceRefresh=1" : ""}`,
      { withCredentials: true }
    );


    const normalized = normalizeUser(data);
    setUser(normalized);
    localStorage.setItem("businessDetails", JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    console.error("Failed to refresh user", err);
    return null;
  }
};


  const loginWithToken = (userFromServer, accessToken, { skipRedirect = false } = {}) => {
  // שמירת token
  localStorage.setItem("token", accessToken);
  setAuthToken(accessToken);
  setToken(accessToken);

  // שמירת user
  const normalizedUser = normalizeUser(userFromServer);
  setUser(normalizedUser);
  localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

  // סימון impersonation
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    if (payload.impersonatedBy) {
      localStorage.setItem("impersonatedBy", payload.impersonatedBy);
    } else {
      localStorage.removeItem("impersonatedBy");
    }
  } catch {
    localStorage.removeItem("impersonatedBy");
  }

  // בדיקה אם זה impersonation
const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

// ⛔ בזמן impersonation או skipRedirect – לא מנווטים אוטומטית
if (skipRedirect || isImpersonating) return;

// מעבר לדשבורד של המשתמש
if (normalizedUser.role === "business" && normalizedUser.businessId) {
  navigate(
    `/business/${normalizedUser.businessId}/dashboard`,
    { replace: true }
  );
  return;
}

// משתמש רגיל
navigate("/dashboard", { replace: true });
};



  /* ===========================
     🔐 Login
  =========================== */
  const login = async (email, password, { skipRedirect = false } = {}) => {
    setLoading(true);
    setError(null);

    


    try {
      const { data } = await API.post(
        "/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      const { accessToken, user: loggedInUser, redirectUrl } = data;

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const normalizedUser = normalizeUser(loggedInUser);
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

      document.body.style.background =
        "linear-gradient(to bottom, #f6f7fb, #e8ebf8)";

      if (!localStorage.getItem("impersonatedBy")) {
  refreshUser(true).catch(() => {});
}

      /* ⭐️⭐️⭐️ NEW — PRIORITY REDIRECT FROM URL ⭐️⭐️⭐️ */
      const urlRedirect = new URLSearchParams(window.location.search).get("redirect");
      if (urlRedirect) {
        navigate(urlRedirect, { replace: true });
        setLoading(false);
        return { user: normalizedUser, redirectUrl: urlRedirect };
      }
      /* ⭐️⭐️⭐️ END NEW CODE ⭐️⭐️⭐️ */

      // Existing redirect flow
      if (!skipRedirect) {

  // 👑 ADMIN — תמיד לדשבורד אדמין
  const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

if (normalizedUser.role === "admin" && !isImpersonating) {
  navigate("/admin/dashboard", { replace: true });
  setLoading(false);
  return;
}

  if (normalizedUser.role !== "admin" && normalizedUser.hasAccess) {
  sessionStorage.setItem("justRegistered", "true");

  if (normalizedUser.role === "business" && normalizedUser.businessId) {
    navigate(`/business/${normalizedUser.businessId}/dashboard`, {
      replace: true,
    });
  } else {
    navigate("/dashboard", { replace: true });
  }
}
}


      setLoading(false);
      return { user: normalizedUser, redirectUrl };
    } catch (err) {
      setError(
        err.response?.status >= 400 && err.response?.status < 500
          ? "❌ אימייל או סיסמה שגויים"
          : "❌ שגיאת שרת"
      );
      setLoading(false);
      throw err;
    }
  };

  /* ===========================
     🧑‍💼 Staff login
  =========================== */
  const staffLogin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.post(
        "/auth/staff-login",
        { username: username.trim(), password },
        { withCredentials: true }
      );

      const { accessToken, user: staffUser } = data;

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const normalized = normalizeUser(staffUser);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));

      if (!localStorage.getItem("impersonatedBy")) {
  refreshUser(true).catch(() => {});
}


      setLoading(false);

      return normalized;
    } catch (err) {
      setError("❌ שם משתמש או סיסמה שגויים");
      setLoading(false);
      throw err;
    }
  };

  /* ===========================
     🤝 Affiliate login
  =========================== */
  const affiliateLogin = async (publicToken) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.get(`/affiliate/login/${publicToken}`, {
        withCredentials: true,
      });

      const normalized = normalizeUser(data);
      setUser(normalized);
      localStorage.setItem("businessDetails", JSON.stringify(normalized));

      setToken(null);

      if (!localStorage.getItem("impersonatedBy")) {
  refreshUser(true).catch(() => {});
}

      setLoading(false);
      return normalized;
    } catch (err) {
      setError(err.message || "שגיאה");
      setLoading(false);
      throw err;
    }
  };

  /* ===========================
     🚪 Logout
  =========================== */
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
    } catch {}

    setAuthToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("businessDetails");
    localStorage.removeItem("dashboardStats");
    localStorage.removeItem("impersonatedBy");

    setToken(null);
    setUser(null);

    socket?.disconnect();
    setSocket(null);

    setLoading(false);
    navigate("/login", { replace: true });
  };

  /* ===========================
     🔥 Initialize
  =========================== */
  useEffect(() => {
    if (!token) {
      socket?.disconnect();
      setSocket(null);
      setUser(null);
      localStorage.removeItem("businessDetails");
      setInitialized(true);
      return;
    }

    setLoading(true);
    setAuthToken(token);

    (async () => {
      try {

        const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));
const storedUser = localStorage.getItem("businessDetails");

let freshUser = null;

if (isImpersonating) {
  const stored = localStorage.getItem("businessDetails");
  if (!stored) throw new Error("Missing impersonated user");
  freshUser = normalizeUser(JSON.parse(stored));
} else {
  freshUser = await refreshUser(true);
}

if (!freshUser) throw new Error("Missing user");

setUser(freshUser);

const isInAdminArea = location.pathname.startsWith("/admin");



        const newSocket = await createSocket(
          singleFlightRefresh,
          logout,
          freshUser.businessId
        );
        setSocket(newSocket);

        const justRegistered = sessionStorage.getItem("justRegistered");
        if (justRegistered) {
  sessionStorage.removeItem("justRegistered");

  // 👑 ADMIN
  if (
  freshUser.role === "admin" &&
  !isImpersonating &&
  location.pathname.startsWith("/admin")
) {
  navigate("/admin/dashboard", { replace: true });
  return;
}


  if (freshUser.role === "business" && freshUser.businessId) {
    navigate(`/business/${freshUser.businessId}/dashboard`, {
      replace: true,
    });
  } else {
    navigate("/dashboard", { replace: true });
  }
  return;
}


        const savedRedirect = sessionStorage.getItem("postLoginRedirect");
        if (savedRedirect) {
          const isPlans = savedRedirect === "/plans";
          const shouldSkip = isPlans && freshUser.hasAccess;

          if (!shouldSkip) {
            navigate(savedRedirect, { replace: true });
          }

          sessionStorage.removeItem("postLoginRedirect");
          return;
        }

        if (
          freshUser.role === "business" &&
          freshUser.businessId &&
          location.pathname === "/"
        ) {
          navigate(`/business/${freshUser.businessId}/dashboard`, {
            replace: true,
          });
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    })();
  }, [token, navigate, location.pathname, location]);



  /* ===========================
     Toast timeout
  =========================== */
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  /* ===========================
     Context value
  =========================== */
  const ctx = {
    token,
    user,
    loading,
    initialized,
    error,

    login,
    loginWithToken,
    logout,
    staffLogin,
    affiliateLogin,

    isImpersonating: user?.isImpersonating === true,



    fetchWithAuth: async (fn) => {
      try {
        return await fn();
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          await logout();
          setError("❌ יש להתחבר מחדש");
        }
        throw err;
      }
    },

    refreshAccessToken: singleFlightRefresh,
    refreshUser,
    socket,
    setUser,
  };

  /* ===========================
     Loader while initializing
  =========================== */
  if (loading && !initialized) {
    return (
      <div
        style={{
          background: "linear-gradient(to bottom, #f6f7fb, #e8ebf8)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  /* ===========================
     Render
  =========================== */
  return (
    <AuthContext.Provider value={ctx}>
      {successMessage && (
        <div className="global-success-toast">{successMessage}</div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

/* ===========================
   Hook
=========================== */
export function useAuth() {
  return useContext(AuthContext);
}
