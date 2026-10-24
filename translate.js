// Offline Node script only — not part of the Vite browser bundle.
// Use a dedicated local OpenAI key named "Bizuply Development". Never reuse production.
import 'dotenv/config';
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === הגדרות בסיס ===
const SRC_DIR = path.resolve("src");
const DEST_DIR = path.resolve("src_en");
const FILE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// === פונקציה שמתרגמת טקסטים ===
async function translateText(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // מומלץ יותר כלכלי ומהיר
      messages: [
        {
          role: "system",
          content:
            "Translate only Hebrew text to fluent English. Do NOT change or remove any code, JSX, or logic. Keep structure identical.",
        },
        { role: "user", content: text },
      ],
      temperature: 0,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("❌ Translation error:", err.message);
    return text; // אם יש בעיה - מחזיר את הקובץ כמו שהוא
  }
}

// === פונקציה שמטפלת בקובץ יחיד ===
async function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (!/[א-ת]/.test(content)) return; // אם אין עברית - מדלג

  console.log("🔤 Translating:", filePath);
  const translated = await translateText(content);

  const newPath = filePath.replace(SRC_DIR, DEST_DIR);
  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  fs.writeFileSync(newPath, translated, "utf8");
}

// === מעבר רקורסיבי על כל התיקיות ===
async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
      await processFile(fullPath);
    }
  }
}

// === התחלה ===
(async () => {
  console.log("🚀 Starting translation...");
  await walk(SRC_DIR);
  console.log("✅ Translation complete! All files saved in:", DEST_DIR);
})();
