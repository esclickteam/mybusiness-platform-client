import React from "react";
import BagoraPages from "./pages";

export default function BagoraPreview() {
  return (
    <div dir="rtl" data-template-id="bagora-preview" className="min-h-screen w-full overflow-x-hidden">
      <BagoraPages initialPage="home" mode="preview" />
    </div>
  );
}
