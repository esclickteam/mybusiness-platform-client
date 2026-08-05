import React from "react";
import PanoraPages from "./pages";

export default function PanoraPreview() {
  return (
    <div dir="rtl" data-template-id="panora" className="min-h-screen w-full overflow-x-hidden">
      <PanoraPages initialPage="home" mode="preview" />
    </div>
  );
}
