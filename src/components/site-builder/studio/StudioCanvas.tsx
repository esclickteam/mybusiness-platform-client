import React from "react";

type Props = {
  editorRefContainer: React.RefObject<HTMLDivElement | null>;
  publicUrl: string;
  layersRef: React.RefObject<HTMLDivElement | null>;
};

export default function StudioCanvas({
  editorRefContainer,
  publicUrl,
  layersRef,
}: Props) {
  return (
    <main
      className="relative min-h-0 overflow-hidden bg-white"
      aria-label={`תצוגת אתר חיה ${publicUrl}`}
    >
      <div
        ref={editorRefContainer}
        className="absolute inset-0 h-full w-full overflow-hidden bg-white"
      />

      <div className="hidden">
        <div ref={layersRef} />
      </div>
    </main>
  );
}