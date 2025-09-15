/* eslint-disable no-restricted-globals */

// מאזין לפוש שנשלח מהשרת
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (err) {
    console.error("❌ שגיאה בפענוח נתוני Push:", err);
    return;
  }

  const title = data.title || "📌 התראה חדשה";
  const options = {
    body: data.body || "יש לך הודעה חדשה",
    icon: data.icon || "/icons/logo.png", // תעדכן אם יש לך אייקון
    badge: "/icons/badge.png",            // לא חובה
    data: {
      url: data.data?.url || "/",         // עמוד שייפתח בלחיצה
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// מאזין ללחיצה על ההתראה
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
