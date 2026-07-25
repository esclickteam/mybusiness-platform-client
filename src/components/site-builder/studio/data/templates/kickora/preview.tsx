import React from "react";
import KickoraPages from "./pages";

export default function KickoraPreview() {
  return (
    <div dir="rtl" data-template-id="kickora-preview" className="min-h-screen w-full overflow-x-hidden">
      <KickoraPages initialPage="home" mode="preview" />
    </div>
  );
}
