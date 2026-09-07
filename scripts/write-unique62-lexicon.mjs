/**
 * unique62 — leftover Growthly through Franchora agency preview chrome.
 * Skip personal names, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "קולנוע של עבודה שמתקדמת": r(
    "Cinema of work that moves forward",
    "Cine de un trabajo que avanza",
    "Cinema de um trabalho que avança",
    "سينما عمل يتقدم",
  ),
  "צוות אמון שמכיר פוליסות, תביעות ואנשים — ומחזיק את התיק עד שיש תשובה ברורה.": r(
    "A trust team that knows policies, claims, and people — and holds the file until there is a clear answer.",
    "Un equipo de confianza que conoce pólizas, siniestros y personas — y sostiene el expediente hasta una respuesta clara.",
    "Uma equipe de confiança que conhece apólices, sinistros e pessoas — e segura o dossiê até haver uma resposta clara.",
    "فريق ثقة يعرف وثائق وتأمينات وأشخاصاً — ويمسك الملف حتى تكون هناك إجابة واضحة.",
  ),
  "משרד ושטח": r("Office and field", "Oficina y terreno", "Escritório e campo", "مكتب وميدان"),
  "מרחבי שירות וביטחון": r(
    "Service and coverage areas",
    "Áreas de servicio y cobertura",
    "Áreas de serviço e cobertura",
    "مناطق خدمة وتغطية",
  ),
  "ארבעה רגעים לפני סגירה": r(
    "Four moments before close",
    "Cuatro momentos antes del cierre",
    "Quatro momentos antes do fechamento",
    "أربع لحظات قبل الإغلاق",
  ),
  פרסים: r("Awards", "Premios", "Prêmios", "جوائز"),
  "פריימים שמחזיקים קמפיין": r(
    "Frames that hold a campaign",
    "Fotogramas que sostienen una campaña",
    "Frames que sustentam uma campanha",
    "إطارات تمسك حملة",
  ),
  "מיפוי מועמדים לפי מוטיבציה, כישורים וקצב גיוס.": r(
    "Mapping candidates by motivation, skills, and hiring pace.",
    "Mapeo de candidatos por motivación, habilidades y ritmo de contratación.",
    "Mapeamento de candidatos por motivação, habilidades e ritmo de contratação.",
    "تعيين مرشحين حسب الدافع والمهارات ووتيرة التوظيف.",
  ),
  "רשימות קצרות שמרגישות כמו צוות, לא כמו מאגר.": r(
    "Shortlists that feel like a team, not a database.",
    "Listas cortas que se sienten como un equipo, no como un archivo.",
    "Listas curtas que parecem uma equipe, não um banco.",
    "قوائم قصيرة تشبه فريقاً لا مخزناً.",
  ),
  "מועמדים חתומים, צוות מגייס רגוע ותהליך שקוף.": r(
    "Signed candidates, a calm hiring team, and a transparent process.",
    "Candidatos firmados, un equipo de hiring calmado y un proceso transparente.",
    "Candidatos assinados, uma equipe de contratação calma e um processo transparente.",
    "مرشحون موقعون وفريق توظيف هادئ وعملية شفافة.",
  ),
  "דברו עם מגייס/ת": r(
    "Talk with a recruiter",
    "Hablad con un reclutador/a",
    "Falem com um recrutador/a",
    "تحدثوا مع مسؤول توظيف",
  ),
  "תפקיד / חברה": r("Role / company", "Puesto / empresa", "Cargo / empresa", "دور / شركة"),
  "הכירו את הצוות": r("Meet the team", "Conoced al equipo", "Conheçam a equipe", "تعرّفوا على الفريق"),
  ענפים: r("Verticals", "Verticales", "Verticais", "قطاعات"),
  "מערכת מסרים, דוברות ויחסי עיתונות שנבנים סביב קו editorial אחד.": r(
    "A message system, spokesperson work, and press relations built around one editorial line.",
    "Un sistema de mensajes, portavocía y relaciones de prensa construido alrededor de una línea editorial.",
    "Um sistema de mensagens, porta-voz e relações de imprensa construído em torno de uma linha editorial.",
    "نظام رسائل ومتحدث وعلاقات صحافة يُبنى حول خط تحريري واحد.",
  ),
  "כל לקוח מקבל זווית, לוח פרסום וקצב עבודה ברור מול המדיה.": r(
    "Every client gets an angle, a publication board, and a clear working pace with the media.",
    "Cada cliente recibe un ángulo, un tablero de publicación y un ritmo de trabajo claro con los medios.",
    "Cada cliente recebe um ângulo, um quadro de publicação e um ritmo de trabalho claro com a mídia.",
    "كل عميل يحصل على زاوية ولوح نشر ووتيرة عمل واضحة أمام الإعلام.",
  ),
  "שלחו נושא לכתבה": r(
    "Send a story topic",
    "Enviad un tema para un artículo",
    "Enviem um tema para uma matéria",
    "أرسلوا موضوعاً لمقال",
  ),
  "נושא / ארגון": r("Topic / organization", "Tema / organización", "Tema / organização", "موضوع / مؤسسة"),
  "מה הסיפור שצריך להגיע לעיתונות?": r(
    "What is the story that needs to reach the press?",
    "¿Cuál es la historia que tiene que llegar a la prensa?",
    "Qual é a história que precisa chegar à imprensa?",
    "ما القصة التي يجب أن تصل إلى الصحافة؟",
  ),
  "נכסי מסירה": r("Delivery assets", "Activos de entrega", "Ativos de entrega", "أصول تسليم"),
  "1.9ש׳": r("1.9h", "1.9h", "1.9h", "1.9س"),
  "פתחו דוח": r("Open a report", "Abrid un informe", "Abram um relatório", "افتحوا تقريراً"),
  "שיפור תפוקה": r("Throughput improvement", "Mejora de rendimiento", "Melhora de produtividade", "تحسين إنتاجية"),
  "מסגרת עבודה, בעלות ברורה וקצב החלטות שבועי.": r(
    "A working frame, clear ownership, and a weekly decision pace.",
    "Un marco de trabajo, ownership claro y un ritmo semanal de decisiones.",
    "Um quadro de trabalho, ownership claro e um ritmo semanal de decisões.",
    "إطار عمل وملكية واضحة ووتيرة قرارات أسبوعية.",
  ),
  "מה נרצה לפתור בפגישה?": r(
    "What do we want to solve in the meeting?",
    "¿Qué queremos resolver en la reunión?",
    "O que queremos resolver na reunião?",
    "ماذا نريد حلّه في الاجتماع؟",
  ),
  "שם האירוע": r("Event name", "Nombre del evento", "Nome do evento", "اسم المناسبة"),
  "כמה אורחים ומה הקצב?": r(
    "How many guests, and what is the pace?",
    "¿Cuántos invitados y cuál es el ritmo?",
    "Quantos convidados e qual é o ritmo?",
    "كم ضيفاً وما الوتيرة؟",
  ),
  "איך לקרוא SERP": r("How to read a SERP", "Cómo leer un SERP", "Como ler um SERP", "كيف تقرأون SERP"),
  "מילות מפתח": r("Keywords", "Palabras clave", "Palavras-chave", "كلمات مفتاحية"),
  "ציוני Core Web": r("Core Web scores", "Puntuaciones Core Web", "Pontuações Core Web", "درجات Core Web"),
  "UI כראיה": r("UI as evidence", "UI como evidencia", "UI como evidência", "واجهة كدليل"),
  "שיפור המרה": r("Conversion lift", "Mejora de conversión", "Melhora de conversão", "تحسين تحويل"),
  "רגע שיא": r("Peak moment", "Momento álgido", "Momento de pico", "لحظة ذروة"),
  "שיפור מדיד": r("Measurable improvement", "Mejora medible", "Melhora mensurável", "تحسين قابل للقياس"),
  במאים: r("Directors", "Directores", "Diretores", "مخرجون"),
  סדרות: r("Series", "Series", "Séries", "مسلسلات"),
  "6.2ח׳": r("6.2mo", "6.2 mes", "6.2 mes.", "6.2 شهر"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique62.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique62 rows`);
