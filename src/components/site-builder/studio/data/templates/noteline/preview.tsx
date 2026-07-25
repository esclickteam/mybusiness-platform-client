import React from "react";
import NotelinePages from "./pages";

export default function NotelinePreview() {
  return (
    <div dir="rtl" data-template-id="noteline-preview" className="min-h-screen w-full" style={{ background: "#1C1917", overflowX: "hidden" }}>
      <NotelinePages initialPage="home" mode="preview" />
    </div>
  );
}
