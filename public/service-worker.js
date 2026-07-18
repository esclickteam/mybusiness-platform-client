/* eslint-disable no-restricted-globals */

// Activate updated service workers immediately.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Push event sent from the server (Web Push / VAPID)
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "BizUply";
  const options = {
    body: data.body || "יש לך התראה חדשה",
    icon: data.icon || "/android-chrome-192x192.png",
    badge: data.badge || "/favicon-32x32.png",
    dir: "rtl",
    lang: "he",
    tag: data.tag || undefined,
    renotify: Boolean(data.tag),
    data: {
      url: (data.data && data.data.url) || data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click on a notification → focus an open tab or open a new one at the target
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();

            if ("navigate" in client && targetUrl) {
              return client.navigate(targetUrl).catch(() => client);
            }

            return client;
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }

        return undefined;
      })
  );
});
