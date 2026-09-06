import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NotelinePages from "./pages";

export default function NotelinePreview() {
  return (
    <div dir={templateDir()} data-template-id="noteline" className="min-h-screen w-full" style={{ background: "#1C1917", overflowX: "hidden" }}>
      <NotelinePages initialPage="home" mode="preview" />
    </div>
  );
}
