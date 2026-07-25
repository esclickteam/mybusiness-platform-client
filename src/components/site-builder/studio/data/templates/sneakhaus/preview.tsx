import React from "react";
import SneakhausPages from "./pages";

export default function SneakhausPreview() {
  return (
    <div dir="rtl" data-template-id="sneakhaus-preview" className="min-h-screen w-full overflow-x-hidden">
      <SneakhausPages initialPage="home" mode="preview" />
    </div>
  );
}
