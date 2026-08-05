import React from "react";
import ContentraPages from "./pages";

export default function ContentraPreview() {
  return (
    <div dir="rtl" data-template-id="contentra" className="min-h-screen w-full overflow-x-hidden">
      <ContentraPages initialPage="home" mode="preview" />
    </div>
  );
}
