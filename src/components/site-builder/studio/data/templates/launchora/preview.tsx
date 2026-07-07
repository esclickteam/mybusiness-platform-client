import React from "react";
import LaunchoraPages from "./pages";

export default function LaunchoraPreview() {
  return (
    <div
      dir="ltr"
      data-template-id="launchora-preview"
      className="h-screen min-h-screen w-full bg-[#fbfbfa] text-neutral-950"
      style={{
        overflow: "auto",
        position: "relative",
      }}
    >
      <LaunchoraPages initialPage="home" mode="preview" />
    </div>
  );
}