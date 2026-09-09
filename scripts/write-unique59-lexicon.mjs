/**
 * unique59 — leftover Arbora, Solenne, Fortiva, and Vitalis seed/hardcoded chrome.
 * Skip personal names, streets, cities, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Arbora
  "אדריכלות נוף": r("Landscape architecture", "Arquitectura del paisaje", "Arquitetura da paisagem", "عمارة مناظر"),
  "צפו בפרויקטים": r("See the projects", "Ved los proyectos", "Veja os projetos", "شاهدوا المشاريع"),
  "חצר רמת השרון": r(
    "Ramat Hasharon courtyard",
    "Patio en Ramat Hasharon",
    "Pátio em Ramat Hasharon",
    "فناء رمات هشارون",
  ),
  מגורים: r("Homes", "Viviendas", "Residências", "سكن"),
  "גג תל אביב": r("Tel Aviv roof", "Azotea en Tel Aviv", "Terraço em Tel Aviv", "سطح تل أبيب"),
  "פארק שכונתי": r("A neighborhood park", "Parque de barrio", "Parque de bairro", "حديقة حي"),
  "תבנית Arbora · Bizuply Studio": r(
    "Arbora template · Bizuply Studio",
    "Plantilla Arbora · Bizuply Studio",
    "Modelo Arbora · Bizuply Studio",
    "قالب Arbora · Bizuply Studio",
  ),

  // Solenne
  "הפקת אירועים": r("Event production", "Producción de eventos", "Produção de eventos", "إنتاج مناسبات"),
  סולן: r("Solenne", "Solenne", "Solenne", "Solenne"),
  "שקט ביום הגדול": r("Quiet on the big day", "Quietud el día grande", "Silêncio no dia grande", "هدوء في اليوم الكبير"),
  "בואו נדבר על האירוע": r(
    "Let's talk about the event",
    "Hablemos del evento",
    "Vamos falar sobre o evento",
    "لنتحدث عن المناسبة",
  ),
  "עיצוב, ספקים וניהול יום האירוע.": r(
    "Design, vendors, and day-of management.",
    "Diseño, proveedores y gestión el día del evento.",
    "Design, fornecedores e gestão no dia do evento.",
    "تصميم وموردون وإدارة يوم المناسبة.",
  ),
  "אירוע פרטי": r("A private event", "Un evento privado", "Um evento privado", "مناسبة خاصة"),
  "ייעוץ עיצובי": r("Design consulting", "Consultoría de diseño", "Consultoria de design", "استشارة تصميم"),
  "כיוון עיצובי ותקציב מדויק.": r(
    "A design direction and a precise budget.",
    "Una dirección de diseño y un presupuesto preciso.",
    "Uma direção de design e um orçamento preciso.",
    "اتجاه تصميم وميزانية دقيقة.",
  ),
  "תבנית Solenne · Bizuply Studio": r(
    "Solenne template · Bizuply Studio",
    "Plantilla Solenne · Bizuply Studio",
    "Modelo Solenne · Bizuply Studio",
    "قالب Solenne · Bizuply Studio",
  ),

  // Fortiva (skip lawyer names and Berkovich address)
  פורטיבה: r("Fortiva", "Fortiva", "Fortiva", "Fortiva"),
  "זמינות אמיתית": r("Real availability", "Disponibilidad real", "Disponibilidade real", "توافر حقيقي"),
  "פגישת אבחון": r("A diagnostic meeting", "Una reunión de diagnóstico", "Uma reunião de diagnóstico", "اجتماع تشخيص"),
  "ליווי וביצוע": r("Guidance and execution", "Acompañamiento y ejecución", "Acompanhamento e execução", "مرافقة وتنفيذ"),
  מיסוי: r("Tax", "Fiscalidad", "Tributação", "ضرائب"),
  "א׳–ה׳ 09:00–19:00": r(
    "Sun–Thu 09:00–19:00",
    "Dom–jue 09:00–19:00",
    "Dom–qui 09:00–19:00",
    "الأحد–الخميس 09:00–19:00",
  ),
  "החלטות גדולות מתחילות בייעוץ נכון.": r(
    "Big decisions start with the right advice.",
    "Las decisiones grandes empiezan con un consejo correcto.",
    "Decisões grandes começam com o conselho certo.",
    "قرارات كبيرة تبدأ باستشارة صحيحة.",
  ),
  "פגישת ייעוץ דיסקרטית.": r(
    "A discreet consultation.",
    "Una consulta discreta.",
    "Uma consulta discreta.",
    "استشارة سرية.",
  ),
  "תחום הפנייה": r("Inquiry field", "Área de la consulta", "Área do contato", "مجال الطلب"),
  "שנות מצוינות": r("Years of excellence", "Años de excelencia", "Anos de excelência", "سنوات تميّز"),
  "צוות רב-תחומי של עורכי דין ויועצים": r(
    "A multidisciplinary team of lawyers and advisors",
    "Un equipo multidisciplinar de abogados y asesores",
    "Uma equipe multidisciplinar de advogados e consultores",
    "فريق متعدد التخصصات من محامين ومستشارين",
  ),
  "ליווי אישי מהפגישה הראשונה ועד לתוצאה": r(
    "Personal guidance from the first meeting through the result",
    "Acompañamiento personal desde la primera reunión hasta el resultado",
    "Acompanhamento pessoal da primeira reunião até o resultado",
    "مرافقة شخصية من الاجتماع الأول حتى النتيجة",
  ),
  "ניסיון מוכח מול הרשויות ובתי המשפט": r(
    "Proven experience with authorities and courts",
    "Experiencia demostrada ante autoridades y tribunales",
    "Experiência comprovada perante autoridades e tribunais",
    "خبرة مثبتة أمام السلطات والمحاكم",
  ),
  "קרא עוד ←": r("Read more ←", "Leer más ←", "Ler mais ←", "اقرأ المزيد ←"),
  "תבנית Fortiva · Bizuply Studio": r(
    "Fortiva template · Bizuply Studio",
    "Plantilla Fortiva · Bizuply Studio",
    "Modelo Fortiva · Bizuply Studio",
    "قالب Fortiva · Bizuply Studio",
  ),

  // Vitalis (skip doctor/patient names)
  ויטליס: r("Vitalis", "Vitalis", "Vitalis", "Vitalis"),
  "ציוד דיגיטלי מתקדם": r(
    "Advanced digital equipment",
    "Equipo digital avanzado",
    "Equipamento digital avançado",
    "معدات رقمية متقدمة",
  ),
  הטיפולים: r("The treatments", "Los tratamientos", "Os tratamentos", "العلاجات"),
  "טיפולי ילדים": r("Children's treatments", "Tratamientos infantiles", "Tratamentos infantis", "علاجات أطفال"),
  "אבחון וייעוץ": r("Diagnosis and consulting", "Diagnóstico y consulta", "Diagnóstico e consulta", "تشخيص واستشارة"),
  "טיפול ומעקב": r("Treatment and follow-up", "Tratamiento y seguimiento", "Tratamento e acompanhamento", "علاج ومتابعة"),
  "כל מה שחשוב לדעת לפני הביקור.": r(
    "Everything that matters to know before the visit.",
    "Todo lo importante que hay que saber antes de la visita.",
    "Tudo o que importa saber antes da visita.",
    "كل ما يهم معرفته قبل الزيارة.",
  ),
  "האם אתם עובדים עם ביטוחים?": r(
    "Do you work with insurance?",
    "¿Trabajáis con seguros?",
    "Vocês trabalham com convênios?",
    "هل تعملون مع التأمين؟",
  ),
  "א׳–ה׳ 08:00–20:00 · ו׳ 08:00–13:00": r(
    "Sun–Thu 08:00–20:00 · Fri 08:00–13:00",
    "Dom–jue 08:00–20:00 · Vie 08:00–13:00",
    "Dom–qui 08:00–20:00 · Sex 08:00–13:00",
    "الأحد–الخميس 08:00–20:00 · الجمعة 08:00–13:00",
  ),
  "סוג הטיפול": r("Treatment type", "Tipo de tratamiento", "Tipo de tratamento", "نوع العلاج"),
  "בדיקה כללית": r("A general exam", "Revisión general", "Exame geral", "فحص عام"),
  השתלות: r("Implants", "Implantes", "Implantes", "زراعة"),
  "טיפול חירום": r("Emergency care", "Tratamiento de urgencia", "Tratamento de emergência", "علاج طارئ"),
  "סביבה נקייה, מודרנית ורגועה": r(
    "A clean, modern, calm setting",
    "Un entorno limpio, moderno y calmo",
    "Um ambiente limpo, moderno e calmo",
    "بيئة نظيفة وحديثة وهادئة",
  ),
  "הסבר מלא לכל שלב בטיפול": r(
    "A full explanation for every treatment step",
    "Una explicación completa en cada etapa del tratamiento",
    "Uma explicação completa em cada etapa do tratamento",
    "شرح كامل لكل مرحلة في العلاج",
  ),
  "צוות שמקשיב ומלווה באמת": r(
    "A team that actually listens and stays with you",
    "Un equipo que escucha de verdad y acompaña",
    "Uma equipe que escuta de verdade e acompanha",
    "فريق يستمع ويرافق حقاً",
  ),
  "תבנית Vitalis · Bizuply Studio": r(
    "Vitalis template · Bizuply Studio",
    "Plantilla Vitalis · Bizuply Studio",
    "Modelo Vitalis · Bizuply Studio",
    "قالب Vitalis · Bizuply Studio",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique59.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique59 rows`);
