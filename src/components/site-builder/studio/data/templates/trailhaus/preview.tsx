import React from "react";
import TrailhausPages from "./pages";

export default function TrailhausPreview() {
  return (
    <div dir="rtl" data-template-id="trailhaus-preview" className="min-h-screen w-full overflow-x-hidden">
      <TrailhausPages initialPage="home" mode="preview" />
    </div>
  );
}
