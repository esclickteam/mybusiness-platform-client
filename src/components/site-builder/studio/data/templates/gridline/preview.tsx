import React from "react";
import GridlinePages from "./pages";

export default function GridlinePreview() {
  return (
    <div
      dir="ltr"
      data-template-id="gridline-preview"
      className="min-h-screen w-full overflow-x-hidden bg-white"
    >
      <GridlinePages initialPage="home" mode="preview" />
    </div>
  );
}
