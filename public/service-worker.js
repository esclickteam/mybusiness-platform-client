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

function postToClients(message) {
  return self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clientList) => {
      for (const client of clientList) {
        client.postMessage(message);
      }
      return clientList;
    });
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
  const kind = (data.data && data.data.kind) || data.kind || "";
  const isSoftphone = kind === "softphone-incoming";

  const actions = Array.isArray(data.actions)
    ? data.actions
        .filter((a) => a && a.action && a.title)
        .slice(0, 2)
        .map((a) => ({
          action: String(a.action),
          title: String(a.title),
        }))
    : isSoftphone
      ? [
          { action: "answer", title: "ענה" },
          { action: "dismiss", title: "דחה" },
        ]
      : undefined;

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
    tag: data.tag || (isSoftphone ? "softphone-incoming" : "bizuply-notification"),
    renotify: data.renotify === true || isSoftphone,
    requireInteraction:
      data.requireInteraction === true || isSoftphone || Boolean(actions),
    vibrate: data.vibrate || (isSoftphone ? [300, 120, 300, 120, 300] : [200, 100, 200]),
    silent: false,
    data: {
      url: targetUrl,
      leadId,
      kind,
      softphoneAction:
        (data.data && data.data.softphoneAction) ||
        data.softphoneAction ||
        null,
      fromNumber:
        (data.data && data.data.fromNumber) || data.fromNumber || "",
      contactName:
        (data.data && data.data.contactName) || data.contactName || "",
      callSid: (data.data && data.data.callSid) || data.callSid || "",
      callId: (data.data && data.data.callId) || data.callId || "",
    },
  };

  if (actions && actions.length) {
    options.actions = actions;
  }

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

// Click / action on a notification → focus app; softphone Answer opens dialer
self.addEventListener("notificationclick", (event) => {
  const action = event.action || "";
  const noteData = (event.notification && event.notification.data) || {};

  if (action === "dismiss") {
    event.notification.close();
    event.waitUntil(
      postToClients({
        type: "SOFTPHONE_REJECT",
        fromNumber: noteData.fromNumber || "",
        callSid: noteData.callSid || "",
        callId: noteData.callId || "",
      })
    );
    return;
  }

  event.notification.close();

  const isSoftphoneAnswer =
    action === "answer" ||
    noteData.kind === "softphone-incoming" ||
    noteData.softphoneAction === "answer";

  let absoluteUrl = new URL(
    noteData.url || (isSoftphoneAnswer ? "/admin/dashboard?softphone=answer" : "/"),
    self.location.origin
  );

  if (noteData.leadId && !absoluteUrl.searchParams.get("leadId")) {
    absoluteUrl.searchParams.set("leadId", String(noteData.leadId));
  }

  if (isSoftphoneAnswer) {
    absoluteUrl.searchParams.set("softphone", "answer");
    if (noteData.fromNumber) {
      absoluteUrl.searchParams.set("from", String(noteData.fromNumber));
    }
    if (noteData.contactName) {
      absoluteUrl.searchParams.set("name", String(noteData.contactName));
    }
    if (noteData.callSid) {
      absoluteUrl.searchParams.set("callSid", String(noteData.callSid));
    }
    if (noteData.callId) {
      absoluteUrl.searchParams.set("callId", String(noteData.callId));
    }
  }

  const pathUrl = `${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList) => {
        const softphoneMessage = isSoftphoneAnswer
          ? {
              type: "SOFTPHONE_ANSWER",
              url: pathUrl,
              fromNumber: noteData.fromNumber || "",
              contactName: noteData.contactName || "",
              callSid: noteData.callSid || "",
              callId: noteData.callId || "",
            }
          : {
              type: "NOTIFICATION_NAVIGATE",
              url: pathUrl,
            };

        if (clientList.length > 0) {
          for (const client of clientList) {
            client.postMessage(softphoneMessage);
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
