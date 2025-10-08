// src/utils/useOnceLogger.js
import { useRef, useEffect } from "react";

export function useOnceLogger(label, value) {
  const hasLogged = useRef(false);
  const prevValue = useRef();

  useEffect(() => {
    if (!hasLogged.current || prevValue.current !== value) {
      console.log(label, value);
      hasLogged.current = true;
      prevValue.current = value;
    }
  }, [label, value]);
}
