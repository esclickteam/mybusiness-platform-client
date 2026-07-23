/* eslint-disable no-restricted-globals */

// Activate updated service workers immediately.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function absoluteAsset(path) {
  try {
    return new URL(path, self.location.origin).href;
  } catch {
    return path;
  }
}

// Push event sent from the server (Web Push / VAPID)
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "BizUply";
  const targetUrl =
    (data.data && data.data.url) || data.url || "/";
  const leadId =
    (data.data && data.data.leadId) || data.leadId || null;
  const options = {
    body: data.body || "יש לך התראה חדשה",
    icon: absoluteAsset(
      (data.icon && String(data.icon)) || "/android-chrome-192x192.png"
    ),
    badge: absoluteAsset(
      (data.badge && String(data.badge)) || "/favicon-v2.png"
    ),
    dir: "rtl",
    lang: "he",
    tag: data.tag || "bizuply-notification",
    renotify: data.renotify === true,
    requireInteraction: false,
    vibrate: data.vibrate || [200, 100, 200],
    silent: false,
    data: {
      url: targetUrl,
      leadId,
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options).catch((err) => {
      console.error("[sw] showNotification failed", err);
    })
  );
});

// Browser rotated/expired the push subscription — ask open clients to re-bind.
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsList) {
        client.postMessage({ type: "PUSH_SUBSCRIPTION_CHANGED" });
      }
    })()
  );
});

// Click on a notification → focus an open tab or open a new one at the target
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = (event.notification.data && event.notification.data.url) || "/";
  const leadId =
    (event.notification.data && event.notification.data.leadId) || null;
  let absoluteUrl = new URL(rawUrl, self.location.origin);

  if (leadId && !absoluteUrl.searchParams.get("leadId")) {
    absoluteUrl.searchParams.set("leadId", String(leadId));
  }

  const pathUrl = `${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`;

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
          return self.clients.openWindow(absoluteUrl.href);
        }

        return undefined;
      })
  );
});
