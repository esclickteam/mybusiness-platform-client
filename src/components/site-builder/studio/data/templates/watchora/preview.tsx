import React from "react";
import WatchoraPages from "./pages";

export default function WatchoraPreview() {
  return (
    <div dir="rtl" data-template-id="watchora-preview" className="min-h-screen w-full overflow-x-hidden">
      <WatchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
