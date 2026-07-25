import React from "react";
import ToolhausPages from "./pages";

export default function ToolhausPreview() {
  return (
    <div dir="rtl" data-template-id="toolhaus-preview" className="min-h-screen w-full overflow-x-hidden">
      <ToolhausPages initialPage="home" mode="preview" />
    </div>
  );
}
