import jwtDecode from "jwt-decode";

// בודק אם ה-token פג תוקף
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    // משווים את הזמן הנוכחי לזמן הפקיעה (exp) ב־milliseconds
    return Date.now() >= exp * 1000;
  } catch {
    return true; // במקרה של שגיאה בפענוח הטוקן, נחשב לפג תוקף
  }
}

// מחזיר את access token מה-localStorage
export function getAccessToken() {
  return localStorage.getItem("token");
}

// מחזירה מזהה עסק מ-localStorage, אם קיים
export function getBusinessId() {
  try {
    const biz = JSON.parse(localStorage.getItem("businessDetails") || "{}");
    return biz._id || biz.businessId || null;
  } catch {
    return null;
  }
}

// מחזירה access token תקף, מרעננת אותו אם פג תוקף
export async function getValidAccessToken() {
  let token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    try {
      const response = await fetch(`/refresh-token`, {
        method: "POST",
        credentials: "include", // שולח את עוגיית ה-refreshToken אוטומטית
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

// מחזיר את תפקיד המשתמש מתוך ה-token
export function getUserRole() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    let role = decoded.role || null;

    // התאמה לתפקיד מיוחד בדשבורד העסקי
    if (role === "business" && window.location.pathname.includes("/dashboard")) {
      return "business-dashboard";
    }

    return role;
  } catch {
    return null;
  }
}
