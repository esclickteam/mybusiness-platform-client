// src/utils/notifications.js

/**
 * Empty file after disabling Push Notifications support.
 * I kept dummy functions so existing code calls won’t break.
 * They simply do nothing and won’t request browser permission.
 */

export async function requestNotificationPermission() {
  console.log("🔔 Push Notifications have been disabled - no permission requested");
  return false;
}

export async function subscribeUser() {
  console.log("🔔 Push Notifications have been disabled - not subscribing to the service");
  return;
}
