import React from "react";
import LinenhausPages from "./pages";

export default function LinenhausPreview() {
  return (
    <div dir="rtl" data-template-id="linenhaus" className="min-h-screen w-full overflow-x-hidden">
      <LinenhausPages initialPage="home" mode="preview" />
    </div>
  );
}
