import React from "react";
import FranchoraPages from "./pages";

export default function FranchoraPreview() {
  return (
    <div dir="rtl" data-template-id="franchora-preview" className="min-h-screen w-full overflow-x-hidden">
      <FranchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
