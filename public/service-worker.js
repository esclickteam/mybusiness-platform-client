/* eslint-disable no-restricted-globals */

// Listener for push event sent from the server
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (err) {
    console.error("❌ Error parsing Push data:", err);
    return;
  }

  const title = data.title || "📌 New Notification";
  const options = {
    body: data.body || "You have a new message",
    icon: data.icon || "/icons/logo.png", // Update if you have a custom icon
    badge: "/icons/badge.png",            // Optional
    data: {
      url: data.data?.url || "/",         // Page to open when clicked
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listener for notification click
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
