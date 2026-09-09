/**
 * unique65 — leftover Lectora through Masterly education chrome, plus
 * Chromabar/Bridaluxe beauty leftover. Skip names, streets, Admin/Staff.
 * Do not add ו׳ / א׳ / ש׳ (day shorthands) — remap those at render.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Lectora
  פרימיירה: r("Premiere", "Estreno", "Estreia", "عرض أول"),
  "· קורס חי": r("· live course", "· curso en vivo", "· curso ao vivo", "· دورة مباشرة"),
  "פתיחה וקונספט": r("Opening and concept", "Apertura y concepto", "Abertura e conceito", "افتتاح ومفهوم"),
  "תרגול מודרך": r("Guided practice", "Práctica guiada", "Prática guiada", "تمرين موجَّه"),
  "פרויקט גמר": r("Final project", "Proyecto final", "Projeto final", "مشروع تخرج"),
  "משוב ומנטורינג": r("Feedback and mentoring", "Feedback y mentoría", "Feedback e mentoria", "ملاحظات وإرشاد"),
  "שיעורים מוקלטים + מפגש חי שבועי עם המנחה.": r(
    "Recorded lessons + a weekly live session with the instructor.",
    "Clases grabadas + un encuentro en vivo semanal con el/la mentor/a.",
    "Aulas gravadas + um encontro ao vivo semanal com o/a mentor/a.",
    "دروس مسجّلة + لقاء مباشر أسبوعي مع المرشد.",
  ),

  // Mentora
  הטמעה: r("Implementation", "Implantación", "Implantação", "تثبيت"),
  "ליווי שמשנה מסלול.": r(
    "Guidance that changes the path.",
    "Acompañamiento que cambia el recorrido.",
    "Acompanhamento que muda o percurso.",
    "مرافقة تغيّر المسار.",
  ),
  מיפוי: r("Mapping", "Mapeo", "Mapeamento", "تعيين"),
  "12 מנטורים פעילים · התאמה אישית": r(
    "12 active mentors · personal matching",
    "12 mentores activos · encaje personal",
    "12 mentores ativos · combinação pessoal",
    "12 مرشداً نشطاً · ملاءمة شخصية",
  ),

  // Polyglota
  "הרשמה ←": r("Enroll ←", "Inscripción ←", "Inscrição ←", "تسجيل ←"),
  "מילים ראשונות וביטחון": r(
    "First words and confidence",
    "Primeras palabras y confianza",
    "Primeiras palavras e confiança",
    "كلمات أولى وثقة",
  ),
  תרגול: r("Practice", "Práctica", "Prática", "تمرين"),
  "שיחה חיה פעמיים בשבוע": r(
    "A live conversation twice a week",
    "Una conversación en vivo dos veces por semana",
    "Uma conversa ao vivo duas vezes por semana",
    "محادثة مباشرة مرتين في الأسبوع",
  ),
  שטף: r("Fluency", "Fluidez", "Fluência", "طلاقة"),
  "פרויקט דיבור אישי": r(
    "A personal speaking project",
    "Un proyecto de habla personal",
    "Um projeto de fala pessoal",
    "مشروع كلام شخصي",
  ),
  ציטוט: r("Quote", "Cita", "Citação", "اقتباس"),
  לוז: r("Schedule", "Horario", "Horário", "جدول"),
  שפות: r("Languages", "Idiomas", "Idiomas", "لغات"),
  ערבית: r("Arabic", "Árabe", "Árabe", "العربية"),

  // Codehaus
  "סטטיסטיקות ASCII": r("ASCII stats", "Estadísticas ASCII", "Estatísticas ASCII", "إحصائيات ASCII"),
  "FAQ בקונסול": r("FAQ in the console", "FAQ en consola", "FAQ no console", "أسئلة في الكونسول"),
  "README שמגייס": r("A README that recruits", "Un README que recluta", "Um README que recruta", "README يوظّف"),

  // Noteline
  אימפרוביזציה: r("Improvisation", "Improvisación", "Improvisação", "ارتجال"),
  מוזיקלי: r("Musical", "Musical", "Musical", "موسيقي"),
  "כלי / תחום": r("Instrument / field", "Instrumento / área", "Instrumento / área", "آلة / مجال"),

  // Kidwise
  "מדע קטן": r("Little science", "Ciencia pequeña", "Ciência pequena", "علم صغير"),
  מדעים: r("Sciences", "Ciencias", "Ciências", "علوم"),
  סקרנות: r("Curiosity", "Curiosidad", "Curiosidade", "فضول"),
  ידיים: r("Hands", "Manos", "Mãos", "يدان"),
  גאווה: r("Pride", "Orgullo", "Orgulho", "فخر"),
  מגלים: r("Discover", "Descubren", "Descobrem", "يكتشفون"),
  מנסים: r("Try", "Prueban", "Tentam", "يجرّبون"),
  יוצרים: r("Create", "Crean", "Criam", "يبتكرون"),
  משתפים: r("Share", "Comparten", "Compartilham", "يشاركون"),
  "מורה חברותי/ת": r("A friendly teacher", "Un/a docente cercano/a", "Um/a professor/a amigável", "معلم/ة ودود/ة"),
  הורה: r("Parent", "Madre/padre", "Pai/mãe", "ولي أمر"),
  "להורים — נחזור אליכם במהירות": r(
    "For parents — we'll get back to you quickly",
    "Para madres y padres — os responderemos rápido",
    "Para pais — voltamos rápido",
    "للأهل — نعود إليكم بسرعة",
  ),
  "שם ההורה": r("Parent name", "Nombre del padre/madre", "Nome do pai/mãe", "اسم ولي الأمر"),
  "גיל הילד/ה": r("Child's age", "Edad del niño/a", "Idade da criança", "عمر الطفل/ة"),

  // Craftora
  "תוצר שנשאר": r("Work that stays", "Una pieza que queda", "Um trabalho que fica", "نتاج يبقى"),
  גימור: r("Finish", "Acabado", "Acabamento", "تشطيب"),
  "חומר גלם": r("Raw material", "Materia prima", "Matéria-prima", "مادة خام"),
  "תרגול באטלייה": r("Studio practice", "Práctica en el atelier", "Prática no ateliê", "تمرين في الأتيليه"),
  "תערוכה קטנה": r("A small exhibition", "Una exposición pequeña", "Uma exposição pequena", "معرض صغير"),
  אטלייה: r("Atelier", "Atelier", "Ateliê", "أتيليه"),
  "ו׳ · 09:00–13:00": r("Fri · 09:00–13:00", "Vie · 09:00–13:00", "Sex · 09:00–13:00", "الجمعة · 09:00–13:00"),

  // Skillforge
  "FAQ עם מסמרות": r("FAQ with rivets", "FAQ con remaches", "FAQ com rebites", "أسئلة بمسامير"),
  חימום: r("Warm-up", "Calentamiento", "Aquecimento", "إحماء"),
  קירור: r("Cool-down", "Enfriamiento", "Resfriamento", "تبريد"),
  "אבחון חום": r("Heat diagnosis", "Diagnóstico de calor", "Diagnóstico de calor", "تشخيص حرارة"),
  "חישול ליבה": r("Core forging", "Forja del núcleo", "Forja do núcleo", "طرق النواة"),
  "צינון תרגול": r("Practice cool-down", "Enfriamiento de práctica", "Resfriamento de prática", "تبريد تمرين"),
  "הקשחה בשטח": r("Field hardening", "Temple en campo", "Têmpera em campo", "تقسية في الميدان"),
  מיומנויות: r("Skills", "Habilidades", "Habilidades", "مهارات"),

  // Campusly
  מקצוע: r("Subject", "Materia", "Matéria", "مادة"),
  רמה: r("Level", "Nivel", "Nível", "مستوى"),
  "ש״ס": r("Weekly hours", "Horas semanales", "Horas semanais", "ساعات أسبوعية"),
  "5 יח׳": r("5 units", "5 uds.", "5 unid.", "5 وحدات"),
  "סמסטר א׳": r("Semester A", "Semestre A", "Semestre A", "فصل أ"),
  "סמסטר ב׳": r("Semester B", "Semestre B", "Semestre B", "فصل ب"),
  קבלה: r("Admissions", "Admisión", "Admissão", "قبول"),
  "בחרו מקצוע": r("Choose a subject", "Elegid una materia", "Escolham uma matéria", "اختاروا مادة"),

  // Masterly
  "פתיחה והקשר": r("Opening and context", "Apertura y contexto", "Abertura e contexto", "افتتاح وسياق"),
  "עומק ותרגול": r("Depth and practice", "Profundidad y práctica", "Profundidade e prática", "عمق وتمرين"),
  "שיא ובמה": r("Peak and stage", "Cima y escenario", "Pico e palco", "ذروة ومنصة"),

  // Beauty leftover
  "שורש וגוון": r("Root and tone", "Raíz y tono", "Raiz e tom", "جذر ودرجة"),
  מלוות: r("Companions", "Acompañantes", "Acompanhantes", "مرافقات"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique65.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique65 rows`);
