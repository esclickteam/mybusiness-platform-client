import React from "react";
import GleamoraPages from "./pages";

export default function GleamoraPreview() {
  return (
    <div dir="rtl" data-template-id="gleamora" className="min-h-screen w-full overflow-x-hidden">
      <GleamoraPages initialPage="home" mode="preview" />
    </div>
  );
}
