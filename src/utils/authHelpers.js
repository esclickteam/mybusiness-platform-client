import jwtDecode from "jwt-decode";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.bizuply.com/api";

// Checks if the token is expired
export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

// Returns the access token from localStorage
export function getAccessToken() {
  return localStorage.getItem("token");
}

// Returns the business ID from localStorage, if it exists
export function getBusinessId() {
  try {
    const biz = JSON.parse(localStorage.getItem("businessDetails") || "{}");
    return biz._id || biz.businessId || null;
  } catch {
    return null;
  }
}

// Returns a valid access token, refreshes it if expired
export async function getValidAccessToken() {
  let token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        return null;
      }

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        token = data.accessToken;
      } else {
        localStorage.removeItem("token");
        return null;
      }
    } catch (err) {
      console.error("❌ Failed to refresh access token:", err);
      localStorage.removeItem("token");
      return null;
    }
  }

  return token;
}

// Returns the user role from the token
export function getUserRole() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role || null;

    if (role === "business" && window.location.pathname.includes("/dashboard")) {
      return "business-dashboard";
    }

    return role;
  } catch {
    return null;
  }
}