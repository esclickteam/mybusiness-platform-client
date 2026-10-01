import { useEffect, useState } from "react";

export function useVisualViewportFrame(active: boolean) {
  const [frame, setFrame] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    if (!active || typeof window === "undefined") {
      setFrame(null);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const apply = () => {
      setFrame({
        top: vv.offsetTop,
        height: vv.height,
      });
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
    };
  }, [active]);

  return frame;
}
