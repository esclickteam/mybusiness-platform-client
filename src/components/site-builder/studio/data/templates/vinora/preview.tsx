import React from "react";
import VinoraPages from "./pages";

export default function VinoraPreview() {
  return (
    <div dir="rtl" data-template-id="vinora" className="min-h-screen w-full overflow-x-hidden">
      <VinoraPages initialPage="home" mode="preview" />
    </div>
  );
}
