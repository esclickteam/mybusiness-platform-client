// src/utils/notifications.js

/**
 * קובץ ריק לאחר ביטול התמיכה ב-Push Notifications
 * השארתי פונקציות דמה כדי שלא יישברו קריאות קיימות בקוד.
 * הן פשוט לא עושות כלום ולא יבקשו הרשאה מהדפדפן.
 */

export async function requestNotificationPermission() {
  console.log("🔔 Push Notifications בוטלו - לא מבקשים הרשאה");
  return false;
}

export async function subscribeUser() {
  console.log("🔔 Push Notifications בוטלו - לא נרשמים לשירות");
  return;
}
