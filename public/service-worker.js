/* eslint-disable no-restricted-globals */

// Bump when softphone notification behavior changes — forces clients to refresh SW.
const SW_VERSION = "bizuply-sw-softphone-v5";

// Activate updated service workers immediately.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of clientsList) {
        client.postMessage({ type: "SW_ACTIVATED", version: SW_VERSION });
      }
    })()
  );
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

function buildSoftphoneUrl(noteData, softphoneAction) {
  const params = new URLSearchParams();
  params.set("softphone", softphoneAction);
  if (noteData.fromNumber) params.set("from", String(noteData.fromNumber));
  if (noteData.contactName) params.set("name", String(noteData.contactName));
  if (noteData.callSid) params.set("callSid", String(noteData.callSid));
  if (noteData.callId) params.set("callId", String(noteData.callId));
  return `/admin/dashboard?${params.toString()}`;
}

async function focusOrOpenSoftphone(pathUrl, message) {
  const absoluteUrl = new URL(pathUrl, self.location.origin);
  const clientList = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  if (clientList.length > 0) {
    for (const client of clientList) {
      client.postMessage(message);
      if ("focus" in client) {
        return client.focus();
      }
    }
  }

  if (self.clients.openWindow) {
    return self.clients.openWindow(absoluteUrl.href);
  }

  return undefined;
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
  const targetUrl = (data.data && data.data.url) || data.url || "/";
  const leadId = (data.data && data.data.leadId) || data.leadId || null;
  const kind = (data.data && data.data.kind) || data.kind || "";
  const isSoftphone = kind === "softphone-incoming";

  const fromNumber =
    (data.data && data.data.fromNumber) || data.fromNumber || "";
  const contactName =
    (data.data && data.data.contactName) || data.contactName || "";
  const callSid = (data.data && data.data.callSid) || data.callSid || "";
  const callId = (data.data && data.data.callId) || data.callId || "";

  const softphoneUrl = isSoftphone
    ? buildSoftphoneUrl(
        { fromNumber, contactName, callSid, callId },
        "incoming"
      )
    : targetUrl;

  // WhatsApp-style action buttons on the notification itself (Android/Chrome).
  // iOS Web Push may only support tapping the notification body.
  const actions = isSoftphone
    ? [
        { action: "answer", title: "ענה לשיחה" },
        { action: "reject", title: "דחה" },
      ]
    : Array.isArray(data.actions)
      ? data.actions
          .filter((a) => a && a.action && a.title)
          .slice(0, 2)
          .map((a) => ({
            action: String(a.action),
            title: String(a.title),
          }))
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
      url: softphoneUrl,
      leadId,
      kind,
      softphoneAction: isSoftphone ? "open" : null,
      fromNumber,
      contactName,
      callSid,
      callId,
      swVersion: SW_VERSION,
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

// Click / action on a notification.
// Softphone: ענה → answer intent; דחה → reject; body click → open incoming UI.
self.addEventListener("notificationclick", (event) => {
  const action = event.action || "";
  const noteData = (event.notification && event.notification.data) || {};
  const isSoftphone = noteData.kind === "softphone-incoming";

  if (action === "dismiss" || action === "reject") {
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

  if (isSoftphone && (action === "answer" || action === "open-answer")) {
    const pathUrl = buildSoftphoneUrl(noteData, "answer");
    event.waitUntil(
      focusOrOpenSoftphone(pathUrl, {
        type: "SOFTPHONE_ANSWER",
        url: pathUrl,
        fromNumber: noteData.fromNumber || "",
        contactName: noteData.contactName || "",
        callSid: noteData.callSid || "",
        callId: noteData.callId || "",
      })
    );
    return;
  }

  if (isSoftphone) {
    const pathUrl = buildSoftphoneUrl(noteData, "incoming");
    event.waitUntil(
      focusOrOpenSoftphone(pathUrl, {
        type: "SOFTPHONE_OPEN_INCOMING",
        url: pathUrl,
        fromNumber: noteData.fromNumber || "",
        contactName: noteData.contactName || "",
        callSid: noteData.callSid || "",
        callId: noteData.callId || "",
      })
    );
    return;
  }

  let absoluteUrl = new URL(noteData.url || "/", self.location.origin);
  if (noteData.leadId && !absoluteUrl.searchParams.get("leadId")) {
    absoluteUrl.searchParams.set("leadId", String(noteData.leadId));
  }
  const pathUrl = `${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList) => {
        const message = {
          type: "NOTIFICATION_NAVIGATE",
          url: pathUrl,
        };

        if (clientList.length > 0) {
          for (const client of clientList) {
            client.postMessage(message);
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
