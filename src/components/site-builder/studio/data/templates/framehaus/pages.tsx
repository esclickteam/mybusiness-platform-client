import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { framehausDefaultData } from "./defaultData";
import { framehausEditorCss } from "./editorCss";

export const framehausPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "גלריה", slug: "/work" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#fafafa",
  surface: "#fff",
  text: "#111111",
  muted: "#666",
  accent: "#ff3b30",
  border: "#11111118",
  dark: "#111",
  light: "#fff",
};

export default createRectTemplatePages({
  id: "framehaus",
  variant: "framehaus",
  theme,
  pages: framehausPages,
  defaultData: framehausDefaultData,
  editorCss: framehausEditorCss,
  
});
