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

 
  /* ============================
     🔐 Subscription (paid)
  ============================ */
  let computedIsValid = false;
  if (user.subscriptionStart && user.subscriptionEnd) {
    computedIsValid = new Date(user.subscriptionEnd) > now;
  }

  const isPendingActivation = user.status === "pending_activation";

  /* ============================
     ⏳ Trial
  ============================ */
  const TRIAL_DAYS = 14; // אותו מספר כמו ב־backend

let trialEndsAt = user.trialEndsAt
  ? new Date(user.trialEndsAt)
  : null;

// 🛟 Fallback למשתמשים ישנים / cache
if (
  !trialEndsAt &&
  user.subscriptionPlan === "trial" &&
  user.trialStartedAt
) {
  const start = new Date(user.trialStartedAt);
  trialEndsAt = new Date(start);
  trialEndsAt.setDate(start.getDate() + TRIAL_DAYS);
}


  const DAY = 1000 * 60 * 60 * 24;

const diffMs =
  user.subscriptionPlan === "trial" && trialEndsAt
    ? trialEndsAt.getTime() - now.getTime()
    : 0;

const trialDaysLeft =
  diffMs > 0
    ? Math.floor(diffMs / DAY) + 1
    : 0;

    const isTrialEndingToday =
  diffMs > 0 && diffMs < DAY;


    const isTrialActive =
  !hasPaid &&
  trialEndsAt &&
  trialEndsAt > now;

/* ============================
   🎁 Early Bird (48h)
============================ */
const earlyBirdExpiresAt = user.earlyBirdExpiresAt
  ? new Date(user.earlyBirdExpiresAt)
  : null;

const hasPaid = Boolean(
  user?.hasPaid === true ||
  user?.paymentStatus === "active" ||
  user?.paymentStatus === "paid" ||
  user?.subscriptionStatus === "active"
);

const isEarlyBirdActive = Boolean(
  !hasPaid &&
    earlyBirdExpiresAt &&
    earlyBirdExpiresAt > now &&
    user?.earlyBirdUsed !== true
);




  return {
  ...user,

  /* =====================
     ⏳ Trial / Early Bird
  ===================== */
  trialEndsAt,
  trialDaysLeft,
  isTrialEndingToday,
  paymentStatus: user.paymentStatus,
  isTrialActive,
  isEarlyBirdActive,

  earlyBirdHoursLeft: isEarlyBirdActive
    ? Math.ceil(
        (earlyBirdExpiresAt.getTime() - now.getTime()) /
          (1000 * 60 * 60)
      )
    : 0,

  /* =====================
     💳 Payment
  ===================== */
  hasPaid,

  subscriptionCancelled: Boolean(user?.subscriptionCancelled),

  /* =====================
     🔐 Subscription validity
  ===================== */
  isSubscriptionValid:
    typeof user?.isSubscriptionValid === "boolean"
      ? user.isSubscriptionValid
      : computedIsValid,

  subscriptionStatus:
  user?.subscriptionStatus || user?.status || "free",

  /* =====================
     🚪 Access
  ===================== */
  hasAccess:
    isTrialActive ||
    hasPaid ||
    isPendingActivation,
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
  try {
    const { data } = await API.get(`/auth/me${force ? "?forceRefresh=1" : ""}`, {
      withCredentials: true,
    });

    console.log("RAW /auth/me response:", data);

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

console.log("RAW /auth/login response:", data);

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setToken(accessToken);

      const normalizedUser = normalizeUser(loggedInUser);
      setUser(normalizedUser);
      localStorage.setItem("businessDetails", JSON.stringify(normalizedUser));

      document.body.style.background =
        "linear-gradient(to bottom, #f6f7fb, #e8ebf8)";

      refreshUser(true).then((freshUser) => {
  if (freshUser) {
    localStorage.setItem(
      "businessDetails",
      JSON.stringify(freshUser)
    );
    setUser(freshUser);
  }
}).catch(() => {});


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

      refreshUser(true).catch(() => {});
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
      refreshUser(true).catch(() => {});

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
   🔥 Initialize (Fixed – no infinite refresh)
=========================== */
useEffect(() => {
  // ✅ אם אין token — ננקה הכל ונצא
  if (!token) {
    socket?.disconnect();
    setSocket(null);
    setUser(null);
    localStorage.removeItem("businessDetails");
    setInitialized(true);
    return;
  }

  // ✅ אם כבר אותחל — לא לרוץ שוב
  if (initialized) return;

  setLoading(true);
  setAuthToken(token);

  (async () => {
    try {
      const isImpersonating = Boolean(localStorage.getItem("impersonatedBy"));

      // ⬇️ חשוב: בלי forceRefresh כדי לא לשבור cache
      const freshUser = await refreshUser();

      if (!freshUser) throw new Error("Missing user");


      // 👑 ניתוב אדמין אם צריך
      if (
        freshUser.role === "admin" &&
        !isImpersonating &&
        !location.pathname.startsWith("/admin")
      ) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // 🎧 יצירת socket
      const newSocket = await createSocket(
        singleFlightRefresh,
        logout,
        freshUser.businessId
      );
      setSocket(newSocket);

      // 📦 ניתוב משתמש חדש שנרשם
      const justRegistered = sessionStorage.getItem("justRegistered");
      if (justRegistered) {
        sessionStorage.removeItem("justRegistered");
        if (freshUser.role === "business" && freshUser.businessId) {
          navigate(`/business/${freshUser.businessId}/dashboard`, {
            replace: true,
          });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      // 🔁 ניתוב מ־postLoginRedirect אם יש
      const savedRedirect = sessionStorage.getItem("postLoginRedirect");
      if (savedRedirect) {
         const isPricing = savedRedirect === "/pricing";
        const shouldSkip = isPricing && freshUser.hasAccess;

        if (!shouldSkip) navigate(savedRedirect, { replace: true });
        sessionStorage.removeItem("postLoginRedirect");
        return;
      }

      // 🏠 ניתוב ברירת מחדל
      if (
  freshUser.role === "business" &&
  freshUser.businessId &&
  !location.pathname.startsWith("/business/")
) {
  navigate(`/business/${freshUser.businessId}/dashboard`, {
    replace: true,
  });
}

    } catch (err) {
  console.error("❌ Auth init failed:", err);
  await logout();
  return;
} finally {
      setLoading(false);
      setInitialized(true);
    }
  })();
}, [token, initialized]);






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

    isImpersonating: Boolean(localStorage.getItem("impersonatedBy")),


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
