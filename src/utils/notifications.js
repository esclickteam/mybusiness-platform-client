// src/utils/notifications.js

/**
 * מבקש הרשאה מהמשתמש לקבלת נוטיפיקציות
 */
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (err) {
    console.error("❌ שגיאה בבקשת הרשאת נוטיפיקציות:", err);
    return false;
  }
}

/**
 * רושם Service Worker ושולח את ה־subscription לשרת
 */
export async function subscribeUser() {
  try {
    // רישום service worker
    const registration = await navigator.serviceWorker.register("/service-worker.js");

    // שליפת המפתח הציבורי מהשרת
    const keyRes = await fetch("/api/config/public-vapid-key");
    if (!keyRes.ok) throw new Error("❌ לא הצלחתי להביא VAPID_PUBLIC_KEY מהשרת");

    const { publicKey } = await keyRes.json();

    // יצירת subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // ניסיון לשמור subscription בשרת
    await saveSubscription(subscription);
    console.log("✅ Push subscription נשמר בהצלחה");
  } catch (err) {
    console.error("❌ שגיאה בהרשמת המשתמש לנוטיפיקציות:", err);
  }
}

/**
 * שומר את ה־subscription בשרת
 */
async function saveSubscription(subscription) {
  const token = localStorage.getItem("token");

  let res = await fetch("/api/users/subscription", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // שולח גם cookies (refreshToken)
    body: JSON.stringify({ pushSubscription: subscription }),
  });

  // אם ה־access token לא תקף (401) → ננסה לחדש ע"י refresh
  if (res.status === 401) {
    console.warn("⚠️ Token לא תקף, מנסה לרענן...");
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = localStorage.getItem("token");
      res = await fetch("/api/users/subscription", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ pushSubscription: subscription }),
      });
    }
  }

  if (!res.ok) {
    throw new Error("❌ שגיאה בשמירת subscription בשרת");
  }
}

/**
 * מנסה לחדש Access Token בעזרת refreshToken (cookie)
 */
async function refreshAccessToken() {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include", // שולח refreshToken ב־cookie
    });

    if (!res.ok) {
      console.error("❌ רענון טוקן נכשל");
      return false;
    }

    const data = await res.json();
    if (data?.accessToken) {
      localStorage.setItem("token", data.accessToken);
      console.log("🔄 Access Token חודש בהצלחה");
      return true;
    }

    return false;
  } catch (err) {
    console.error("❌ שגיאה ברענון הטוקן:", err);
    return false;
  }
}

/**
 * ממיר מפתח base64 (VAPID key) ל־Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
