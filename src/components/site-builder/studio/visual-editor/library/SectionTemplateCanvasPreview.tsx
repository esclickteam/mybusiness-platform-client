import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import type {
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";

const CANVAS_WIDTH = 1100;

function numericHeight(value: string | number | undefined) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value || ""));
  return Number.isFinite(parsed) ? parsed : 520;
}

function nodeLayoutStyle(node: VisualLibraryNodeTemplate): CSSProperties {
  const layout = node.layout || {};
  const x = Number(layout.translateX ?? layout.x ?? 0);
  const y = Number(layout.translateY ?? layout.y ?? 0);
  const rotate = Number(layout.rotate || 0);
  const scaleX = Number(layout.scaleX ?? 1);
  const scaleY = Number(layout.scaleY ?? 1);

  return {
    ...(node.style as CSSProperties),
    position: (layout.position || "absolute") as CSSProperties["position"],
    left: layout.left ?? 0,
    top: layout.top ?? 0,
    right: layout.right ?? "auto",
    bottom: layout.bottom ?? "auto",
    width: layout.width,
    height: layout.height,
    minWidth: layout.minWidth,
    maxWidth: layout.maxWidth,
    minHeight: layout.minHeight,
    maxHeight: layout.maxHeight,
    zIndex: layout.zIndex,
    overflow: layout.overflow as CSSProperties["overflow"],
    display: layout.display,
    flexDirection: layout.flexDirection as CSSProperties["flexDirection"],
    justifyContent: layout.justifyContent,
    alignItems: layout.alignItems,
    gap: layout.gap,
    gridTemplateColumns: layout.gridTemplateColumns,
    gridTemplateRows: layout.gridTemplateRows,
    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scaleX}, ${scaleY})`,
    transformOrigin: "top left",
    boxSizing: "border-box",
  } as CSSProperties;
}

function NodePreview({
  node,
  children,
}: {
  node: VisualLibraryNodeTemplate;
  children?: React.ReactNode;
}) {
  const content = node.content || {};
  const style = nodeLayoutStyle(node);
  const text = String(content.text || node.label || "");

  if (node.type === "image") {
    return (
      <img
        src={String(content.src || content.secureUrl || content.url || "")}
        alt=""
        draggable={false}
        style={style}
      />
    );
  }

  if (node.type === "video") {
    return (
      <div
        style={{
          ...style,
          background:
            "linear-gradient(135deg, #111827 0%, #334155 55%, #0f172a 100%)",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "grid",
            width: 64,
            height: 64,
            placeItems: "center",
            borderRadius: "50%",
            background: "rgba(255,255,255,.92)",
            color: "#0f172a",
            fontSize: 24,
          }}
        >
          ▶
        </span>
      </div>
    );
  }

  if (node.type === "button") {
    return (
      <span style={style}>
        {text}
        {children}
      </span>
    );
  }

  if (node.type === "icon") {
    return (
      <div style={style}>
        {String(content.iconText || content.iconName || "✦")}
        {children}
      </div>
    );
  }

  return (
    <div style={style}>
      {node.type === "text" ? text : null}
      {children}
    </div>
  );
}

export default function SectionTemplateCanvasPreview({
  section,
}: {
  section: VisualLibrarySectionTemplate;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameSize, setFrameSize] = useState({ width: 320, height: 190 });
  const [isVisible, setIsVisible] = useState(false);
  const canvasHeight = numericHeight(section.minHeight);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !isVisible) return;

    const updateSize = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width && rect.height) {
        setFrameSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [isVisible]);

  const childNodes = useMemo(() => {
    const grouped = new Map<string, VisualLibraryNodeTemplate[]>();
    section.nodes.forEach((node) => {
      const parentKey = String(node.parentKey || "");
      grouped.set(parentKey, [...(grouped.get(parentKey) || []), node]);
    });
    return grouped;
  }, [section.nodes]);

  const renderNode = (node: VisualLibraryNodeTemplate): React.ReactNode => (
    <NodePreview key={node.key} node={node}>
      {(childNodes.get(node.key) || []).map(renderNode)}
    </NodePreview>
  );

  const scale = Math.min(
    frameSize.width / CANVAS_WIDTH,
    frameSize.height / canvasHeight,
  );

  return (
    <div
      ref={frameRef}
      className="relative h-full w-full overflow-hidden bg-white"
      aria-hidden="true"
    >
      {isVisible ? (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 overflow-hidden"
          style={{
            width: CANVAS_WIDTH,
            height: canvasHeight,
            backgroundColor: section.backgroundColor || "#ffffff",
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          {(childNodes.get("") || []).map(renderNode)}
        </div>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      )}
    </div>
  );
}
