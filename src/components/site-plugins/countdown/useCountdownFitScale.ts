import { useEffect, useState, type RefObject } from "react";

export function useCountdownFitScale(
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return undefined;

    const update = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;

      if (!width || !height || !contentWidth || !contentHeight) {
        setScale(1);
        return;
      }

      const nextScale = Math.min(1, width / contentWidth, height / contentHeight);
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, [containerRef, contentRef]);

  return scale;
}
