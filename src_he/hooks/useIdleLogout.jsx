import { useEffect, useRef, useCallback } from "react";

function useIdleLogout(logout, timeout = 10 * 60 * 1000) {
  const timer = useRef(null);

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      logout();
    }, timeout);
  }, [logout, timeout]);

  useEffect(() => {
    resetTimer();
    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);
}

export default useIdleLogout;
