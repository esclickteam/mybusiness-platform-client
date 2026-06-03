import type { ThemePalette } from "../types";

export const themePalettes: ThemePalette[] = [
  {
    id: "luxury-purple",
    name: "Luxury Purple",
    description: "יוקרתי, מודרני, מתאים לעסקי יופי ופרימיום",
    colors: {
      primary: "#8B5CF6",
      secondary: "#F3E8FF",
      accent: "#EC4899",
      background: "#FFF7FD",
      text: "#1F1B2E",
      muted: "#64748B",
    },
    font: {
      heading: "Heebo",
      body: "Assistant",
    },
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    description: "נשי, יוקרתי, רך ומכירתי",
    colors: {
      primary: "#BE185D",
      secondary: "#FFE4EF",
      accent: "#D97706",
      background: "#FFF7F9",
      text: "#2A1825",
      muted: "#7C6A72",
    },
    font: {
      heading: "Heebo",
      body: "Assistant",
    },
  },
  {
    id: "black-gold",
    name: "Black & Gold",
    description: "אלגנטי, דרמטי ויוקרתי במיוחד",
    colors: {
      primary: "#B45309",
      secondary: "#FEF3C7",
      accent: "#F59E0B",
      background: "#0B0B10",
      text: "#FFFFFF",
      muted: "#D6D3D1",
    },
    font: {
      heading: "Heebo",
      body: "Assistant",
    },
  },
  {
    id: "nude-elegant",
    name: "Nude Elegant",
    description: "נקי, עדין ומקצועי",
    colors: {
      primary: "#A16207",
      secondary: "#F7E7D4",
      accent: "#C08457",
      background: "#FFFBF6",
      text: "#241B17",
      muted: "#7C6F67",
    },
    font: {
      heading: "Heebo",
      body: "Assistant",
    },
  },
  {
    id: "ocean-modern",
    name: "Ocean Modern",
    description: "מודרני, נקי וטכנולוגי",
    colors: {
      primary: "#0F766E",
      secondary: "#CCFBF1",
      accent: "#14B8A6",
      background: "#F0FDFA",
      text: "#0F172A",
      muted: "#64748B",
    },
    font: {
      heading: "Rubik",
      body: "Assistant",
    },
  },
  {
    id: "minimal-mono",
    name: "Minimal Monochrome",
    description: "מינימליסטי, נקי ואלגנטי",
    colors: {
      primary: "#111827",
      secondary: "#F3F4F6",
      accent: "#6B7280",
      background: "#FFFFFF",
      text: "#111827",
      muted: "#6B7280",
    },
    font: {
      heading: "Heebo",
      body: "Assistant",
    },
  },
];

export const fontOptions = [
  "Heebo",
  "Assistant",
  "Rubik",
  "Alef",
  "Varela Round",
  "Noto Sans Hebrew",
  "Poppins",
  "Inter",
  "DM Sans",
  "Playfair Display",
  "Lora",
  "Libre Baskerville",
];