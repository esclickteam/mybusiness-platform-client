import jwtDecode from "jwt-decode";

// Checks if the token is expired
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    // Compare the current time to the expiration time (exp) in milliseconds
    return Date.now() >= exp * 1000;
  } catch {
    return true; // In case of token decoding error, treat as expired
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
      const response = await fetch(`/refresh-token`, {
        method: "POST",
        credentials: "include", // Automatically sends the refreshToken cookie
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        token = data.accessToken;
      } else {
        return null;
      }
    } catch {
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
    let role = decoded.role || null;

    // Adjust for special role in business dashboard
    if (role === "business" && window.location.pathname.includes("/dashboard")) {
      return "business-dashboard";
    }

    return role;
  } catch {
    return null;
  }
}
