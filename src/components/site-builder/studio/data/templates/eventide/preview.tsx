import React from "react";
import EventidePages from "./pages";

export default function EventidePreview() {
  return (
    <div dir="rtl" data-template-id="eventide" className="min-h-screen w-full overflow-x-hidden">
      <EventidePages initialPage="home" mode="preview" />
    </div>
  );
}
