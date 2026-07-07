import React from "react";
import LaunchoraPages from "./pages";

export default function LaunchoraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="launchora-preview"
      data-launchora-scroll-root="true"
      className="h-screen min-h-screen w-full bg-[#fbfbfa] text-neutral-950"
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <LaunchoraPages initialPage="home" mode="preview" />
    </div>
  );
}