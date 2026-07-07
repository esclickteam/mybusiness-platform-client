import React from "react";
import NovastraPages from "./pages";

export default function NovastraPreview() {
  return (
    <div
      dir="ltr"
      data-template-id="novastra-preview"
      className="min-h-screen w-full bg-zinc-950 text-white"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <NovastraPages initialPage="home" mode="preview" />
    </div>
  );
}