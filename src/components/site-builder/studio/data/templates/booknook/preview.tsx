import React from "react";
import BooknookPages from "./pages";

export default function BooknookPreview() {
  return (
    <div dir="rtl" data-template-id="booknook-preview" className="min-h-screen w-full overflow-x-hidden">
      <BooknookPages initialPage="home" mode="preview" />
    </div>
  );
}
