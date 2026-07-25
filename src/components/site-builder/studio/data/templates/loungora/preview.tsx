import React from "react";
import LoungoraPages from "./pages";

export default function LoungoraPreview() {
  return (
    <div dir="rtl" data-template-id="loungora-preview" className="min-h-screen w-full overflow-x-hidden">
      <LoungoraPages initialPage="home" mode="preview" />
    </div>
  );
}
