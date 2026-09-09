/**
 * unique46 — leftover Aeline testimonial quotes and Business #N labels.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "הפסקנו לאבד פניות. כל ליד מקבל טיפול מסודר וברור.": r(
    "We stopped losing inquiries. Every lead gets clear, organized handling.",
    "Dejamos de perder consultas. Cada lead recibe un trato ordenado y claro.",
    "Paramos de perder consultas. Cada lead recebe um atendimento organizado e claro.",
    "توقفنا عن ضياع الاستفسارات. كل عميل محتمل يحصل على معالجة مرتّبة وواضحة.",
  ),
  "הצוות יודע בדיוק מה השלב הבא, בלי לרדוף אחרי הודעות.": r(
    "The team knows exactly what the next step is, without chasing messages.",
    "El equipo sabe exactamente cuál es el siguiente paso, sin perseguir mensajes.",
    "A equipe sabe exatamente qual é o próximo passo, sem correr atrás de mensagens.",
    "الفريق يعرف بالضبط ما هي الخطوة التالية دون ملاحقة الرسائل.",
  ),
  "הדשבורד עזר לנו להבין מאיפה מגיעות המכירות הכי טובות.": r(
    "The dashboard helped us see where the best sales come from.",
    "El dashboard nos ayudó a entender de dónde llegan las mejores ventas.",
    "O dashboard nos ajudou a entender de onde vêm as melhores vendas.",
    "ساعدتنا اللوحة على فهم من أين تأتي أفضل المبيعات.",
  ),
  "המערכת מרגישה כאילו היא נבנתה בדיוק בשביל דרך העבודה שלנו.": r(
    "The system feels as if it was built exactly for our way of working.",
    "El sistema se siente como si se hubiera construido justo para nuestra forma de trabajar.",
    "O sistema parece ter sido feito exatamente para o nosso jeito de trabalhar.",
    "المنظومة تشعر كأنها بُنيت بالضبط لطريقة عملنا.",
  ),
  "עסק #1": r("Business #1", "Negocio #1", "Negócio #1", "عمل #1"),
  "עסק #2": r("Business #2", "Negocio #2", "Negócio #2", "عمل #2"),
  "עסק #3": r("Business #3", "Negocio #3", "Negócio #3", "عمل #3"),
  "עסק #4": r("Business #4", "Negocio #4", "Negócio #4", "عمل #4"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique46.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique46 rows`);
