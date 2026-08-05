import React from "react";
import BreworaPages from "./pages";

export default function BreworaPreview() {
  return (
    <div dir="rtl" data-template-id="brewora" className="min-h-screen w-full overflow-x-hidden">
      <BreworaPages initialPage="home" mode="preview" />
    </div>
  );
}
