import React from "react";
import LobbyhausPages from "./pages";

export default function LobbyhausPreview() {
  return (
    <div dir="rtl" data-template-id="lobbyhaus-preview" className="min-h-screen w-full overflow-x-hidden">
      <LobbyhausPages initialPage="home" mode="preview" />
    </div>
  );
}
