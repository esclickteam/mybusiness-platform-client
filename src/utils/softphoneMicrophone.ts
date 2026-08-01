/** Cached for this page session — browser site setting still persists across visits. */
let micPermissionGranted = false;

async function queryMicrophonePermission(): Promise<
  PermissionState | "unknown"
> {
  try {
    const permissions = navigator.permissions;
    if (!permissions?.query) return "unknown";
    const status = await permissions.query({
      name: "microphone" as PermissionName,
    });
    return status.state;
  } catch {
    // Safari / some WebViews throw on microphone permission query.
    return "unknown";
  }
}

export async function getMicrophonePermissionState() {
  if (micPermissionGranted) return "granted" as const;
  return queryMicrophonePermission();
}

/**
 * Ask for microphone once. Notifications permission is separate — mic must be
 * allowed under site settings (not notification settings).
 */
export async function ensureMicrophoneAccess() {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return;
  }
  if (micPermissionGranted) return;

  const state = await queryMicrophonePermission();
  if (state === "granted") {
    micPermissionGranted = true;
    return;
  }
  if (state === "denied") {
    const err = new Error(
      "הגישה למיקרופון חסומה. בהגדרות האתר של bizuply.com בחרו מיקרופון → אפשר (לא בהגדרות התראות)"
    );
    (err as Error & { code?: string }).code = "MIC_DENIED";
    throw err;
  }

  // "prompt" or unknown — one browser dialog; afterward the site stays allowed.
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  micPermissionGranted = true;
  stream.getTracks().forEach((track) => {
    try {
      track.stop();
    } catch {
      /* ignore */
    }
  });
}
