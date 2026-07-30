type FacebookSdk = {
  init: (options: Record<string, unknown>) => void;
  login: (
    callback: (response: {
      authResponse?: { code?: string; accessToken?: string };
      status?: string;
    }) => void,
    options?: Record<string, unknown>
  ) => void;
  AppEvents?: { logPageView?: () => void };
};

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

let loadingPromise: Promise<FacebookSdk> | null = null;

function initFacebookSdk(appId: string, version: string) {
  if (!window.FB) {
    throw new Error("Facebook SDK is not available");
  }
  window.FB.init({
    appId,
    cookie: true,
    xfbml: false,
    version,
  });
  return window.FB;
}

export function loadFacebookSdk(appId: string, version = "v21.0") {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Facebook SDK requires a browser"));
  }

  if (!appId) {
    return Promise.reject(new Error("Missing Meta App ID"));
  }

  if (window.FB) {
    try {
      return Promise.resolve(initFacebookSdk(appId, version));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      loadingPromise = null;
      reject(new Error("Timed out loading Facebook SDK"));
    }, 20000);

    const finish = () => {
      try {
        const fb = initFacebookSdk(appId, version);
        window.clearTimeout(timeout);
        resolve(fb);
      } catch (error) {
        window.clearTimeout(timeout);
        loadingPromise = null;
        reject(error);
      }
    };

    window.fbAsyncInit = finish;

    const existing = document.getElementById("facebook-jssdk");
    if (existing) {
      if (window.FB) finish();
      return;
    }

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.onerror = () => {
      window.clearTimeout(timeout);
      loadingPromise = null;
      reject(new Error("Failed to load Facebook SDK script"));
    };
    document.body.appendChild(script);
  });

  return loadingPromise;
}
