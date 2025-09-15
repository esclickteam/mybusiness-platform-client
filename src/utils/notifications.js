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

    // יצירת subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY
      ),
    });

    // שליחה לשרת (נשמר בשדה pushSubscription של המשתמש המחובר)
    const res = await fetch("/api/users/subscription", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 👈 כדי לשלוח JWT ב־cookie
      body: JSON.stringify({ pushSubscription: subscription }),
    });

    if (!res.ok) {
      throw new Error("❌ שגיאה בשמירת subscription בשרת");
    }

    console.log("✅ Push subscription נשמר בהצלחה");
  } catch (err) {
    console.error("❌ שגיאה בהרשמת המשתמש לנוטיפיקציות:", err);
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
