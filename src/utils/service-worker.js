/* eslint-disable no-restricted-globals */

// מאזין לאירוע פוש שנשלח מהשרת
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
    icon: data.icon || "/icons/logo.png", // אייקון שיוצג בהתראה
    badge: "/icons/badge.png",            // אייקון קטן (לא חובה)
    data: {
      url: data.data?.url || "/tasks",    // לאן לפתוח בלחיצה
    },
  };

  // מציג את הנוטיפיקציה
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// מאזין ללחיצה על הנוטיפיקציה
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  // פותח טאב חדש או מביא לפוקוס אם כבר פתוח
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
