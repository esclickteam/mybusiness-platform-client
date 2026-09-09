import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BooknookPages from "./pages";

export default function BooknookPreview() {
  return (
    <div dir={templateDir()} data-template-id="booknook" className="min-h-screen w-full overflow-x-hidden">
      <BooknookPages initialPage="home" mode="preview" />
    </div>
  );
}
