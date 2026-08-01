/** Session + durable cache so Answer does not re-prompt every call. */
const MIC_OK_KEY = "bizuply_softphone_mic_ok";

let micPermissionGranted = false;

function readCachedMicOk() {
  if (micPermissionGranted) return true;
  try {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(MIC_OK_KEY) === "1") {
      micPermissionGranted = true;
      return true;
    }
    if (typeof localStorage !== "undefined" && localStorage.getItem(MIC_OK_KEY) === "1") {
      micPermissionGranted = true;
      return true;
    }
  } catch {
    /* private mode */
  }
  return false;
}

function persistMicOk() {
  micPermissionGranted = true;
  try {
    sessionStorage?.setItem(MIC_OK_KEY, "1");
    localStorage?.setItem(MIC_OK_KEY, "1");
  } catch {
    /* ignore */
  }
}

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
  if (readCachedMicOk()) {
    const state = await queryMicrophonePermission();
    if (state === "denied") return "denied" as const;
    if (state === "granted") {
      persistMicOk();
      return "granted" as const;
    }
    // Cached + unknown/prompt → treat as already allowed for this site.
    return "granted" as const;
  }
  return queryMicrophonePermission();
}

/**
 * Warm mic once when opening the softphone. Do NOT call this on every Answer —
 * Telnyx answer() requests the mic once; a second getUserMedia can re-prompt.
 */
export async function ensureMicrophoneAccess() {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return;
  }
  if (readCachedMicOk()) {
    const state = await queryMicrophonePermission();
    if (state === "denied") {
      const err = new Error(
        "הגישה למיקרופון חסומה. בהגדרות האתר של bizuply.com בחרו מיקרופון → אפשר (לא בהגדרות התראות)"
      );
      (err as Error & { code?: string }).code = "MIC_DENIED";
      throw err;
    }
    if (state === "granted") persistMicOk();
    return;
  }

  const state = await queryMicrophonePermission();
  if (state === "granted") {
    persistMicOk();
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
  persistMicOk();
  stream.getTracks().forEach((track) => {
    try {
      track.stop();
    } catch {
      /* ignore */
    }
  });
}

/** Fail fast if site mic is blocked — without opening a second getUserMedia prompt. */
export async function assertMicrophoneNotDenied() {
  const state = await getMicrophonePermissionState();
  if (state === "denied") {
    const err = new Error(
      "הגישה למיקרופון חסומה. בהגדרות האתר של bizuply.com בחרו מיקרופון → אפשר (לא בהגדרות התראות)"
    );
    (err as Error & { code?: string }).code = "MIC_DENIED";
    throw err;
  }
}

export function markMicrophoneGranted() {
  persistMicOk();
}
