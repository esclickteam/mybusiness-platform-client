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

export function loadFacebookSdk(appId: string, version = "v21.0") {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Facebook SDK requires a browser"));
  }

  if (window.FB) {
    return Promise.resolve(window.FB);
  }

  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Timed out loading Facebook SDK"));
    }, 20000);

    window.fbAsyncInit = () => {
      try {
        window.FB?.init({
          appId,
          cookie: true,
          xfbml: false,
          version,
        });
        window.clearTimeout(timeout);
        if (window.FB) resolve(window.FB);
        else reject(new Error("Facebook SDK failed to initialize"));
      } catch (error) {
        window.clearTimeout(timeout);
        reject(error);
      }
    };

    if (document.getElementById("facebook-jssdk")) {
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
