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
    // Haptic feedback on phones (Android). The device plays its default
    // notification sound automatically.
    vibrate: data.vibrate || [200, 100, 200],
    silent: false,
    data: {
      url: (data.data && data.data.url) || data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click on a notification → focus an open tab or open a new one at the target
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = (event.notification.data && event.notification.data.url) || "/";
  const absoluteUrl = new URL(rawUrl, self.location.origin).href;
  const pathUrl = `${new URL(absoluteUrl).pathname}${new URL(absoluteUrl).search}${new URL(absoluteUrl).hash}`;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          for (const client of clientList) {
            client.postMessage({
              type: "NOTIFICATION_NAVIGATE",
              url: pathUrl,
            });

            if ("focus" in client) {
              return client.focus();
            }
          }

          return undefined;
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(absoluteUrl);
        }

        return undefined;
      })
  );
});
