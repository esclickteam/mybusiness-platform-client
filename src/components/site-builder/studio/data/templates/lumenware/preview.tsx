import React from "react";
import LumenwarePages from "./pages";

export default function LumenwarePreview() {
  return (
    <div dir="rtl" data-template-id="lumenware-preview" className="min-h-screen w-full overflow-x-hidden">
      <LumenwarePages initialPage="home" mode="preview" />
    </div>
  );
}
