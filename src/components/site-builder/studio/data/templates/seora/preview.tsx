import React from "react";
import SeoraPages from "./pages";

export default function SeoraPreview() {
  return (
    <div dir="rtl" data-template-id="seora" className="min-h-screen w-full overflow-x-hidden">
      <SeoraPages initialPage="home" mode="preview" />
    </div>
  );
}
