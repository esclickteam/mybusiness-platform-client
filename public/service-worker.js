/* eslint-disable no-restricted-globals */

// Bump when push delivery / ack behavior changes — forces clients to refresh SW.
const SW_VERSION = "bizuply-sw-delivery-ack-v9";

// Activate updated service workers immediately.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Never unsubscribe here. v7 did that on activate and orphaned the
      // Apple endpoint in Mongo when the page missed PUSH_SUBSCRIPTION_CHANGED.
      await self.clients.claim();
      let sub = null;
      try {
        sub = await self.registration.pushManager.getSubscription();
      } catch (err) {
        console.error("[sw] getSubscription failed", err);
      }
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of clientsList) {
        client.postMessage({ type: "SW_ACTIVATED", version: SW_VERSION });
        if (!sub) {
          client.postMessage({ type: "PUSH_SUBSCRIPTION_NEEDED" });
        }
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

function isIosUa() {
  const ua = (self.navigator && self.navigator.userAgent) || "";
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  // iOS SW sometimes reports a desktop Safari UA.
  return (
    /mac/i.test(ua) &&
    self.navigator &&
    Number(self.navigator.maxTouchPoints || 0) > 1
  );
}

function unwrapPushPayload(raw) {
  const nested =
    raw && raw.data && typeof raw.data === "object" && !Array.isArray(raw.data)
      ? raw.data
      : {};
  // Title/body live only under data so Safari does not auto-display the JSON.
  return {
    title: nested.title || "",
    body: nested.body || "",
    tag: nested.tag || "",
    url: nested.url || "/",
    leadId: nested.leadId || null,
    kind: nested.kind || "",
    claimKey: nested.claimKey || "",
    correlationId: nested.correlationId || "",
    fromNumber: nested.fromNumber || "",
    contactName: nested.contactName || "",
    callSid: nested.callSid || "",
    callId: nested.callId || "",
    icon: nested.icon || "",
    badge: nested.badge || "",
    actions: Array.isArray(nested.actions) ? nested.actions : undefined,
  };
}

async function ackPushDelivery(payload, shown) {
  const claimKey = payload.claimKey || "";
  const correlationId = payload.correlationId || "";
  if (!claimKey && !correlationId) return;
  let endpoint = "";
  try {
    const sub = await self.registration.pushManager.getSubscription();
    endpoint = (sub && sub.endpoint) || "";
  } catch (err) {
    console.error("[sw] getSubscription for ack failed", err);
  }
  let host = "";
  try {
    host = endpoint ? new URL(endpoint).host : "";
  } catch {
    host = "";
  }
  try {
    await fetch("/api/push/delivery-ack", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        claimKey,
        correlationId,
        notificationId: payload.tag || claimKey || "",
        swVersion: SW_VERSION,
        shown: Boolean(shown),
        endpoint,
        host,
      }),
      keepalive: true,
    });
  } catch (err) {
    console.error("[sw] delivery-ack failed", err);
  }
}

async function showPushNotification(title, options) {
  const tag = options.tag;
  if (tag && self.registration.getNotifications) {
    try {
      const existing = await self.registration.getNotifications({ tag });
      await Promise.all((existing || []).map((note) => note.close()));
    } catch (err) {
      console.error("[sw] getNotifications failed", err);
    }
  }

  const showOptions = isIosUa()
    ? {
        body: options.body,
        tag: options.tag,
        data: options.data,
        renotify: false,
      }
    : options;

  await self.registration.showNotification(title, showOptions);
  return true;
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
  let raw = {};

  try {
    raw = event.data ? event.data.json() : {};
  } catch (err) {
    raw = {};
  }

  const payload = unwrapPushPayload(raw);
  const title = payload.title || "BizUply";
  const targetUrl = payload.url || "/";
  const leadId = payload.leadId || null;
  const kind = payload.kind || "";
  const isSoftphone = kind === "softphone-incoming";

  const fromNumber = payload.fromNumber || "";
  const contactName = payload.contactName || "";
  const callSid = payload.callSid || "";
  const callId = payload.callId || "";

  const softphoneUrl = isSoftphone
    ? buildSoftphoneUrl(
        { fromNumber, contactName, callSid, callId },
        "incoming"
      )
    : targetUrl;

  const actions = isSoftphone
    ? [
        { action: "answer", title: "ענה לשיחה" },
        { action: "reject", title: "דחה" },
      ]
    : Array.isArray(payload.actions)
      ? payload.actions
          .filter((a) => a && a.action && a.title)
          .slice(0, 2)
          .map((a) => ({
            action: String(a.action),
            title: String(a.title),
          }))
      : undefined;

  const claimKey = payload.claimKey || "";
  const correlationId = payload.correlationId || "";
  const uniqueTag =
    payload.tag ||
    (isSoftphone
      ? "softphone-incoming"
      : claimKey
        ? "bizuply-" + String(claimKey).slice(-24)
        : "bizuply-" + Date.now());

  const options = {
    body: payload.body || "יש לך התראה חדשה",
    icon: absoluteAsset(payload.icon || "/android-chrome-192x192.png"),
    badge: absoluteAsset(payload.badge || "/favicon-v2.png"),
    tag: uniqueTag,
    renotify: false,
    requireInteraction: isSoftphone,
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
      claimKey: claimKey || null,
      correlationId: correlationId || null,
      tag: uniqueTag,
    },
  };

  if (isIosUa()) {
    delete options.icon;
    delete options.badge;
    delete options.requireInteraction;
  }

  if (actions && actions.length && !isIosUa()) {
    options.actions = actions;
  }

  event.waitUntil(
    (async () => {
      if (isSoftphone) {
        try {
          await postToClients({
            type: "SOFTPHONE_PREPARE",
            fromNumber,
            contactName,
            callSid,
            callId,
          });
        } catch (err) {
          console.error("[sw] softphone prepare failed", err);
        }
      }
      let shown = false;
      try {
        shown = await showPushNotification(title, options);
      } catch (err) {
        console.error("[sw] showNotification failed", err);
        shown = false;
      }
      await ackPushDelivery({ ...payload, tag: uniqueTag }, shown);
    })()
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
