import React from "react";
import HomecraftPages from "./pages";

export default function HomecraftPreview() {
  return (
    <div dir="rtl" data-template-id="homecraft-preview" className="min-h-screen w-full overflow-x-hidden">
      <HomecraftPages initialPage="home" mode="preview" />
    </div>
  );
}
