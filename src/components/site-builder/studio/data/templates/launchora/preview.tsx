import React from "react";
import LaunchoraPages from "./pages";

export default function LaunchoraPreview() {
  return (
    <div dir="rtl" data-template-id="launchora-preview" className="min-h-screen w-full overflow-x-hidden">
      <LaunchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
