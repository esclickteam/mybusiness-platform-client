import React from "react";
import PlayoraPages from "./pages";

export default function PlayoraPreview() {
  return (
    <div dir="rtl" data-template-id="playora" className="min-h-screen w-full overflow-x-hidden">
      <PlayoraPages initialPage="home" mode="preview" />
    </div>
  );
}
