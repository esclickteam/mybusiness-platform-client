/**
 * unique36 — leftover newly-inserted section/element chrome after unique35.
 * Skip personal names, streets, cities, Admin/Staff, hybrids, and smash-hazard singles.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "החל מ־": r("From", "Desde", "A partir de", "ابتداءً من"),
  "החל מ-": r("From", "Desde", "A partir de", "ابتداءً من"),
  "וידאו הסבר": r("Explainer video", "Vídeo explicativo", "Vídeo explicativo", "فيديو شرح"),
  "מהיר להתחלה": r("Quick to start", "Rápido para empezar", "Rápido para começar", "سريع للبداية"),
  "מותאם לנייד": r("Mobile-ready", "Adaptado al móvil", "Adaptado ao celular", "متوافق مع الجوال"),
  "שליטה מלאה": r("Full control", "Control total", "Controle total", "سيطرة كاملة"),
  "מוכן לקידום": r("SEO-ready", "Listo para SEO", "Pronto para SEO", "جاهز للترويج"),
  "עיצוב ממותג": r("Branded design", "Diseño de marca", "Design da marca", "تصميم بعلامتكم"),
  "תמיכה בעברית": r("Hebrew support", "Soporte en hebreo", "Suporte em hebraico", "دعم العبرية"),
  "מעלים אתר מקצועי תוך זמן קצר.": r(
    "Launch a professional site in a short time.",
    "Publicad una web profesional en poco tiempo.",
    "Publiquem um site profissional em pouco tempo.",
    "أطلقوا موقعاً احترافياً في وقت قصير.",
  ),
  "כל סקשן נראה מעולה גם במובייל.": r(
    "Every section looks great on mobile too.",
    "Cada sección se ve genial también en el móvil.",
    "Cada seção fica ótima também no celular.",
    "كل قسم يبدو ممتازاً أيضاً على الجوال.",
  ),
  "מבנה נקי שעוזר להופיע בגוגל.": r(
    "A clean structure that helps you show up on Google.",
    "Una estructura limpia que ayuda a aparecer en Google.",
    "Uma estrutura limpa que ajuda a aparecer no Google.",
    "بنية نظيفة تساعد على الظهور في Google.",
  ),
  "RTL מלא ותוכן בעברית מההתחלה.": r(
    "Full RTL and Hebrew content from the start.",
    "RTL completo y contenido en hebreo desde el inicio.",
    "RTL completo e conteúdo em hebraico desde o início.",
    "اتجاه RTL كامل ومحتوى بالعبرية من البداية.",
  ),
  "עמוד בסיס": r("A base page", "Una página base", "Uma página base", "صفحة أساسية"),
  "עריכה מלאה": r("Full editing", "Edición completa", "Edição completa", "تحرير كامل"),
  "תמיכה במייל": r("Email support", "Soporte por email", "Suporte por e-mail", "دعم بالبريد"),
  "עד 5 עמודים": r("Up to 5 pages", "Hasta 5 páginas", "Até 5 páginas", "حتى 5 صفحات"),
  "ספריית סקשנים": r("Section library", "Biblioteca de secciones", "Biblioteca de seções", "مكتبة أقسام"),
  "AI מובנה": r("Built-in AI", "IA integrada", "IA integrada", "ذكاء اصطناعي مدمج"),
  "ללא הגבלה": r("Unlimited", "Sin límite", "Sem limite", "بلا حد"),
  "דומיין מותאם": r("Custom domain", "Dominio personalizado", "Domínio personalizado", "نطاق مخصّص"),
  "עדיפות בתמיכה": r("Priority support", "Soporte prioritario", "Suporte prioritário", "أولوية في الدعم"),
  "עמוד בסיס\nעריכה מלאה\nתמיכה במייל": r(
    "A base page\nFull editing\nEmail support",
    "Una página base\nEdición completa\nSoporte por email",
    "Uma página base\nEdição completa\nSuporte por e-mail",
    "صفحة أساسية\nتحرير كامل\nدعم بالبريد",
  ),
  "עד 5 עמודים\nספריית סקשנים\nAI מובנה": r(
    "Up to 5 pages\nSection library\nBuilt-in AI",
    "Hasta 5 páginas\nBiblioteca de secciones\nIA integrada",
    "Até 5 páginas\nBiblioteca de seções\nIA integrada",
    "حتى 5 صفحات\nمكتبة أقسام\nذكاء اصطناعي مدمج",
  ),
  "ללא הגבלה\nדומיין מותאם\nעדיפות בתמיכה": r(
    "Unlimited\nCustom domain\nPriority support",
    "Sin límite\nDominio personalizado\nSoporte prioritario",
    "Sem limite\nDomínio personalizado\nSuporte prioritário",
    "بلا حد\nنطاق مخصّص\nأولوية في الدعم",
  ),
  "עבודות חשמל מסודרות ומקצועיות": r(
    "Tidy, professional electrical work",
    "Trabajos eléctricos ordenados y profesionales",
    "Serviços elétricos organizados e profissionais",
    "أعمال كهرباء مرتّبة واحترافية",
  ),
  "תיאור קצר של החבילה או השירות.": r(
    "A short description of the pack or service.",
    "Una descripción breve del pack o el servicio.",
    "Uma descrição curta do pacote ou serviço.",
    "وصف قصير للباقة أو الخدمة.",
  ),
  "כותרת חזקה, מסר ברור וכפתור אחד שמוביל לפעולה.": r(
    "A strong headline, a clear message, and one button that leads to action.",
    "Un titular fuerte, un mensaje claro y un botón que lleva a la acción.",
    "Um título forte, uma mensagem clara e um botão que leva à ação.",
    "عنوان قوي ورسالة واضحة وزر واحد يقود إلى الإجراء.",
  ),
  "בונים נוכחות דיגיטלית שמביאה לקוחות": r(
    "Build a digital presence that brings customers",
    "Construid una presencia digital que trae clientes",
    "Construam uma presença digital que traz clientes",
    "ابنوا حضوراً رقمياً يجلب العملاء",
  ),
  "אתר מקצועי בעברית, עם סקשנים מוכנים שמותאמים בדיוק לעסק שלכם.": r(
    "A professional Hebrew site, with ready sections tailored to your business.",
    "Una web profesional en hebreo, con secciones listas adaptadas a vuestro negocio.",
    "Um site profissional em hebraico, com seções prontas alinhadas ao seu negócio.",
    "موقع احترافي بالعبرية، مع أقسام جاهزة مكيّفة لنشاطكم.",
  ),
  "אישי לפי לקוח מחובר": r(
    "Personal for the signed-in client",
    "Personal según el cliente conectado",
    "Pessoal conforme o cliente conectado",
    "شخصي حسب العميل المسجّل",
  ),
  "כמות טיפולים - ערך מה-CRM של הלקוח המחובר": r(
    "Treatments left - a value from the signed-in client's CRM",
    "Tratamientos restantes - un valor del CRM del cliente conectado",
    "Tratamentos restantes - um valor do CRM do cliente conectado",
    "جلسات متبقية - قيمة من CRM للعميل المسجّل",
  ),
  "משקל אחרון ממעקב CRM (תאריך/שעה/ערך) של הלקוח המחובר": r(
    "Latest weight from CRM tracking (date/time/value) for the signed-in client",
    "Último peso del seguimiento CRM (fecha/hora/valor) del cliente conectado",
    "Último peso do acompanhamento CRM (data/hora/valor) do cliente conectado",
    "آخر وزن من تتبع CRM (تاريخ/وقت/قيمة) للعميل المسجّل",
  ),
  "מפגשים שבוצעו - ערך מה-CRM של הלקוח המחובר": r(
    "Sessions completed - a value from the signed-in client's CRM",
    "Sesiones realizadas - un valor del CRM del cliente conectado",
    "Sessões realizadas - um valor do CRM do cliente conectado",
    "جلسات منفّذة - قيمة من CRM للعميل المسجّل",
  ),
  "יתרה - ערך מה-CRM של הלקוח המחובר": r(
    "Balance - a value from the signed-in client's CRM",
    "Saldo - un valor del CRM del cliente conectado",
    "Saldo - um valor do CRM do cliente conectado",
    "رصيد - قيمة من CRM للعميل المسجّل",
  ),
  "סיכום - ערך מהתיק ב-CRM": r(
    "Summary - a value from the CRM file",
    "Resumen - un valor del expediente CRM",
    "Resumo - um valor do dossiê no CRM",
    "ملخص - قيمة من ملف CRM",
  ),
  "תכנית טיפול - מה-CRM": r(
    "Treatment plan - from the CRM",
    "Plan de tratamiento - del CRM",
    "Plano de tratamento - do CRM",
    "خطة علاج - من CRM",
  ),
  "תוכנית המשך - מה-CRM": r(
    "Follow-on plan - from the CRM",
    "Plan de continuación - del CRM",
    "Plano de continuação - do CRM",
    "خطة متابعة - من CRM",
  ),
  "תכנית מעקב - מה-CRM": r(
    "Tracking plan - from the CRM",
    "Plan de seguimiento - del CRM",
    "Plano de acompanhamento - do CRM",
    "خطة تتبّع - من CRM",
  ),
  "שם הלקוח מהאזור האישי / CRM": r(
    "Client name from the personal area / CRM",
    "Nombre del cliente del área personal / CRM",
    "Nome do cliente da área pessoal / CRM",
    "اسم العميل من المنطقة الشخصية / CRM",
  ),
  "טלפון הלקוח מה-CRM": r(
    "Client phone from the CRM",
    "Teléfono del cliente del CRM",
    "Telefone do cliente no CRM",
    "هاتف العميل من CRM",
  ),
  "כתובת המייל של הלקוח מה-CRM": r(
    "Client email from the CRM",
    "Email del cliente del CRM",
    "E-mail do cliente no CRM",
    "بريد العميل من CRM",
  ),
  "הפגישה הבאה - מהיומן": r(
    "Next appointment - from the calendar",
    "Próxima cita - del calendario",
    "Próximo agendamento - do calendário",
    "الموعد التالي - من التقويم",
  ),
  "ברכה אישית — אחרי התחברות מוצג שם הלקוח מהאזור האישי / CRM": r(
    "A personal greeting — after sign-in the client name from the personal area / CRM is shown",
    "Un saludo personal — tras iniciar sesión se muestra el nombre del cliente del área personal / CRM",
    "Uma saudação pessoal — depois do login aparece o nome do cliente da área pessoal / CRM",
    "تحية شخصية — بعد تسجيل الدخول يظهر اسم العميل من المنطقة الشخصية / CRM",
  ),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/i18n/templateExactLexicon.unique36.json");
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique36 rows`);
