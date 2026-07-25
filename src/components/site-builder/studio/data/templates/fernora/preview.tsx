import React from "react";
import FernoraPages from "./pages";

export default function FernoraPreview() {
  return (
    <div dir="rtl" data-template-id="fernora-preview" className="min-h-screen w-full overflow-x-hidden">
      <FernoraPages initialPage="home" mode="preview" />
    </div>
  );
}
