import { useEffect, useRef, type PointerEvent } from "react";

type Props = {
  label: string;
  clearLabel: string;
  onChange: (value: string) => void;
};

export function SignaturePad({ label, clearLabel, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ink = useRef(false);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#1a0b33";
    context.lineWidth = 2.2;
    context.lineCap = "round";
  }, []);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const box = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) / box.width) * canvas.width,
      y: ((event.clientY - box.top) / box.height) * canvas.height,
    };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    canvas?.setPointerCapture(event.pointerId);
    const next = point(event);
    context.beginPath();
    context.moveTo(next.x, next.y);
    drawing.current = true;
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const next = point(event);
    context.lineTo(next.x, next.y);
    context.stroke();
    ink.current = true;
  }

  function end() {
    drawing.current = false;
    const canvas = canvasRef.current;
    onChange(ink.current && canvas ? canvas.toDataURL("image/png") : "");
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    ink.current = false;
    onChange("");
  }

  return (
    <div className="scan-sign">
      <span>{label}</span>
      <canvas
        ref={canvasRef}
        width={640}
        height={160}
        aria-label={label}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      <button type="button" onClick={clear}>{clearLabel}</button>
    </div>
  );
}
