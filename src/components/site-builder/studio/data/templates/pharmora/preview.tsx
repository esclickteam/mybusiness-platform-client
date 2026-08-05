import React from "react";
import PharmoraPages from "./pages";

export default function PharmoraPreview() {
  return (
    <div dir="rtl" data-template-id="pharmora" className="min-h-screen w-full overflow-x-hidden">
      <PharmoraPages initialPage="home" mode="preview" />
    </div>
  );
}
