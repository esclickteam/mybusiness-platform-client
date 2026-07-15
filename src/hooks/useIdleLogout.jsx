import { useEffect, useRef, useCallback } from "react";

/**
 * Optional idle logout helper.
 * Not mounted globally anymore — sessions stay alive via token refresh.
 * Keep this for callers that want an explicit inactivity policy.
 */
function useIdleLogout(logout, timeout = 8 * 60 * 60 * 1000) {
  const timer = useRef(null);

  const resetTimer = useCallback(() => {
    if (!logout || typeof logout !== "function") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      logout({ callServer: true, redirect: true });
    }, timeout);
  }, [logout, timeout]);

  useEffect(() => {
    resetTimer();

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "pointerdown",
      "visibilitychange",
    ];

    const onActivity = () => {
      if (document.visibilityState === "hidden") return;
      resetTimer();
    };

    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [resetTimer]);
}

export default useIdleLogout;
