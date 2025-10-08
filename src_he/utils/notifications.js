// src/utils/notifications.js

/**
 * This file is empty after the support for Push Notifications was canceled.
 * I left dummy functions so that existing calls in the code won't break.
 * They simply do nothing and won't request permission from the browser.
 */

export async function requestNotificationPermission() {
  console.log("🔔 Push Notifications have been canceled - not requesting permission");
  return false;
}

export async function subscribeUser() {
  console.log("🔔 Push Notifications have been canceled - not subscribing to the service");
  return;
}