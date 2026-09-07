/**
 * unique55 — leftover Fluxora, Verdant, Savory, Luminelle, Vitalcare,
 * Handcraft, and Advisora seed/hardcoded chrome.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff, and place-only labels.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Fluxora seed leftover
  "קהילות מקצועיות": r(
    "Professional communities",
    "Comunidades profesionales",
    "Comunidades profissionais",
    "مجتمعات مهنية",
  ),
  "מצב קריירה": r("Career mode", "Modo carrera", "Modo carreira", "وضع مهنة"),
  "אירועי למידה": r("Learning events", "Eventos de aprendizaje", "Eventos de aprendizado", "فعاليات تعلّم"),
  פלוס: r("Plus", "Plus", "Plus", "Plus"),
  "VP הנדסה, Northline": r(
    "VP of engineering, Northline",
    "VP de ingeniería, Northline",
    "VP de engenharia, Northline",
    "نائب رئيس الهندسة، Northline",
  ),
  "מפתחת Full-Stack": r(
    "Full-stack developer",
    "Desarrolladora full-stack",
    "Desenvolvedora full-stack",
    "مطوّرة Full-Stack",
  ),
  "מאיפה מגיע התוכן?": r(
    "Where does the content come from?",
    "¿De dónde llega el contenido?",
    "De onde vem o conteúdo?",
    "من أين يأتي المحتوى؟",
  ),
  "רוצים Fluxora לצוות שלכם?": r(
    "Want Fluxora for your team?",
    "¿Queréis Fluxora para vuestro equipo?",
    "Querem Fluxora para a equipe de vocês?",
    "تريدون Fluxora لفريقكم؟",
  ),
  "בואו נפתח לכם את Fluxora.": r(
    "Let us open Fluxora for you.",
    "Os abrimos Fluxora.",
    "Vamos abrir a Fluxora para vocês.",
    "دعونا نفتح لكم Fluxora.",
  ),
  "שם החברה / הצוות": r(
    "Company / team name",
    "Nombre de la empresa / el equipo",
    "Nome da empresa / equipe",
    "اسم الشركة / الفريق",
  ),
  "הפיד שלי": r("My feed", "Mi feed", "Meu feed", "خلاصتـي"),
  "תוסף דפדפן": r("Browser extension", "Extensión de navegador", "Extensão de navegador", "إضافة متصفح"),
  "קהילות בסיסיות": r(
    "Basic communities",
    "Comunidades básicas",
    "Comunidades básicas",
    "مجتمعات أساسية",
  ),
  "סינון מתקדם": r("Advanced filtering", "Filtrado avanzado", "Filtro avançado", "تصفية متقدمة"),
  "סיכומים שבועיים": r("Weekly summaries", "Resúmenes semanales", "Resumos semanais", "ملخصات أسبوعية"),
  "ללא פרסומות": r("No ads", "Sin anuncios", "Sem anúncios", "بدون إعلانات"),
  "הכול בפלוס": r("Everything in Plus", "Todo en Plus", "Tudo no Plus", "كل شيء في Plus"),
  "שיתוף צוותי": r("Team sharing", "Compartir en equipo", "Compartilhamento em equipe", "مشاركة فريق"),
  "דוחות למנהלים": r("Manager reports", "Informes para managers", "Relatórios para gestores", "تقارير للمديرين"),
  "SSO והרשאות": r("SSO and permissions", "SSO y permisos", "SSO e permissões", "SSO وصلاحيات"),
  "תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.": r(
    "Thank you! We received the inquiry and will get back to you soon.",
    "¡Gracias! Recibimos la consulta y volveremos pronto.",
    "Obrigado! Recebemos o contato e voltamos em breve.",
    "شكراً! استلمنا الطلب وسنعود إليكم قريباً.",
  ),
  "תבנית Fluxora · Bizuply Studio": r(
    "Fluxora template · Bizuply Studio",
    "Plantilla Fluxora · Bizuply Studio",
    "Modelo Fluxora · Bizuply Studio",
    "قالب Fluxora · Bizuply Studio",
  ),

  // Verdant leftover (skip names; Latin place names inside titles)
  "מספרים שמספרים אמת": r(
    "Numbers that tell the truth",
    "Números que cuentan la verdad",
    "Números que contam a verdade",
    "أرقام تروي الحقيقة",
  ),
  "מה הלקוחות מספרים": r(
    "What clients say",
    "Lo que cuentan los clientes",
    "O que os clientes contam",
    "ماذا يقول العملاء",
  ),
  "פנטהאוז הרצליה פיתוח": r(
    "Herzliya Pituach penthouse",
    "Ático en Herzliya Pituach",
    "Cobertura em Herzliya Pituach",
    "بنتهاوس هرتسليا بيتواح",
  ),
  "5 חדרים · 210 מ״ר · מרפסת 360° עם נוף לים.": r(
    "5 rooms · 210 sqm · a 360° terrace with a sea view.",
    "5 habitaciones · 210 m² · terraza 360° con vistas al mar.",
    "5 quartos · 210 m² · terraço 360° com vista para o mar.",
    "5 غرف · 210 م² · شرفة 360° بإطلالة على البحر.",
  ),
  "וילה כפר שמריהו": r(
    "Kfar Shmaryahu villa",
    "Villa en Kfar Shmaryahu",
    "Villa em Kfar Shmaryahu",
    "فيلا كفار شمرياهو",
  ),
  "דירת גן תל אביב": r(
    "Tel Aviv garden apartment",
    "Piso jardín en Tel Aviv",
    "Apartamento jardim em Tel Aviv",
    "شقة حديقة في تل أبيب",
  ),
  "רוכשת, תל אביב": r("Buyer, Tel Aviv", "Compradora, Tel Aviv", "Compradora, Tel Aviv", "مشترية، تل أبيب"),
  "משקיע נדל״ן": r(
    "Real-estate investor",
    "Inversor inmobiliario",
    "Investidor imobiliário",
    "مستثمر عقاري",
  ),
  "שליחת פנייה": r("Send inquiry", "Enviar consulta", "Enviar contato", "إرسال طلب"),
  "מבינים תקציב, אזור וסגנון חיים.": r(
    "We understand budget, area, and lifestyle.",
    "Entendemos presupuesto, zona y estilo de vida.",
    "Entendemos orçamento, região e estilo de vida.",
    "نفهم الميزانية والمنطقة ونمط الحياة.",
  ),
  "רק נכסים שבאמת מתאימים — בלי בזבוז זמן.": r(
    "Only properties that truly fit — no wasted time.",
    "Solo inmuebles que encajan de verdad — sin perder tiempo.",
    "Só imóveis que realmente cabem — sem perder tempo.",
    "عقارات تناسب فعلاً فقط — دون إضاعة وقت.",
  ),
  "ליווי עד חתימה": r(
    "Guidance through signing",
    "Acompañamiento hasta la firma",
    "Acompanhamento até a assinatura",
    "مرافقة حتى التوقيع",
  ),
  "משא ומתן, בדיקות, וסגירה רגועה.": r(
    "Negotiation, checks, and a calm close.",
    "Negociación, comprobaciones y un cierre tranquilo.",
    "Negociação, verificações e um fechamento calmo.",
    "تفاوض وفحوصات وإغلاق هادئ.",
  ),
  "התחלת סיור": r("Start a tour", "Empezar una visita", "Começar um tour", "بدء جولة"),
  "סוכנת בכירה · תל אביב": r(
    "Senior agent · Tel Aviv",
    "Agente sénior · Tel Aviv",
    "Agente sênior · Tel Aviv",
    "وكيلة أولى · تل أبيب",
  ),
  "מומחה יוקרה · הרצליה": r(
    "Luxury specialist · Herzliya",
    "Especialista de lujo · Herzliya",
    "Especialista em luxo · Herzliya",
    "أخصائي فاخر · هرتسليا",
  ),
  "ליווי משקיעים · מרכז": r(
    "Investor guidance · Center",
    "Acompañamiento a inversores · Centro",
    "Acompanhamento a investidores · Centro",
    "مرافقة مستثمرين · المركز",
  ),

  // Savory leftover (skip chef/guest names and street address)
  "אירוח עסקי": r("Business hosting", "Hospitalidad de empresa", "Hospitalidade empresarial", "ضيافة أعمال"),
  "אירועים פרטיים": r("Private events", "Eventos privados", "Eventos privados", "مناسبات خاصة"),
  "חדר פרטי עד 22 אורחים": r(
    "Private room for up to 22 guests",
    "Sala privada para hasta 22 invitados",
    "Sala privada para até 22 convidados",
    "غرفة خاصة حتى 22 ضيفاً",
  ),
  "תפריט טעימות, התאמת יין ושירות צמוד סביב שולחן אחד.": r(
    "A tasting menu, wine pairing, and close service around one table.",
    "Menú degustación, maridaje de vino y servicio cercano en una mesa.",
    "Menu degustação, harmonização de vinhos e serviço próximo em uma mesa.",
    "قائمة تذوّق ومواءمة نبيذ وخدمة قريبة حول طاولة واحدة.",
  ),
  "ערבי יין ושף": r("Wine and chef evenings", "Veladas de vino y chef", "Noites de vinho e chef", "أمسيات نبيذ وطاهٍ"),
  "ראשון-חמישי · 18:00-23:30": r(
    "Sunday–Thursday · 18:00-23:30",
    "Domingo–jueves · 18:00-23:30",
    "Domingo–quinta · 18:00-23:30",
    "الأحد–الخميس · 18:00-23:30",
  ),
  "שישי · 12:30-16:00": r(
    "Friday · 12:30-16:00",
    "Viernes · 12:30-16:00",
    "Sexta · 12:30-16:00",
    "الجمعة · 12:30-16:00",
  ),
  "שבת · 19:00-23:30": r(
    "Saturday · 19:00-23:30",
    "Sábado · 19:00-23:30",
    "Sábado · 19:00-23:30",
    "السبت · 19:00-23:30",
  ),
  "חניה בחניון גרוזנברג וחניון בית הדר": r(
    "Parking at Grozenberg lot and Beit Hadar lot",
    "Aparcamiento en el parking Grozenberg y Beit Hadar",
    "Estacionamento no pátio Grozenberg e Beit Hadar",
    "موقف في موقف غروزنبرغ وموقف بيت هدار",
  ),
  "הערב הבא שלכם מתחיל ב-Savory.": r(
    "Your next evening starts at Savory.",
    "Vuestra próxima noche empieza en Savory.",
    "A próxima noite de vocês começa no Savory.",
    "مساؤكم التالي يبدأ في Savory.",
  ),
  "בקשת אירוע": r("Request an event", "Pedir un evento", "Pedir um evento", "طلب مناسبة"),
  "שעות ומיקום": r("Hours and location", "Horario y ubicación", "Horário e local", "ساعات وموقع"),
  "סגירת חלון": r("Close window", "Cerrar ventana", "Fechar janela", "إغلاق النافذة"),

  // Luminelle leftover (skip names and Rothschild address)
  "שיער רך עם ברק טבעי": r(
    "Soft hair with a natural shine",
    "Cabello suave con brillo natural",
    "Cabelo macio com brilho natural",
    "شعر ناعم بلمعان طبيعي",
  ),
  "פרוטוקולים פעילים ומדויקים": r(
    "Active, precise protocols",
    "Protocolos activos y precisos",
    "Protocolos ativos e precisos",
    "بروتوكولات نشطة ودقيقة",
  ),
  "פגישת אבחון, טיפול פנים ממוקד ועיצוב גבות עדין.": r(
    "A diagnostic visit, a focused facial, and a gentle brow shape.",
    "Una visita de diagnóstico, un facial enfocado y un diseño de cejas suave.",
    "Uma visita de diagnóstico, um facial focado e um design de sobrancelhas suave.",
    "زيارة تشخيص وعلاج وجه مركّز وتصميم حواجب لطيف.",
  ),
  "אבחון עור אישי": r(
    "Personal skin diagnosis",
    "Diagnóstico de piel personal",
    "Diagnóstico de pele pessoal",
    "تشخيص بشرة شخصي",
  ),
  "טיפול חידוש עדין": r(
    "A gentle renewal treatment",
    "Un tratamiento de renovación suave",
    "Um tratamento de renovação suave",
    "علاج تجديد لطيف",
  ),
  "טיפול פנים מתקדם": r(
    "Advanced facial treatment",
    "Tratamiento facial avanzado",
    "Tratamento facial avançado",
    "علاج وجه متقدم",
  ),
  "ברק וגוון לשיער": r(
    "Shine and tone for hair",
    "Brillo y tono para el cabello",
    "Brilho e tom para o cabelo",
    "لمعان ودرجة للشعر",
  ),
  "3 טיפולי עומק": r(
    "3 depth treatments",
    "3 tratamientos de profundidad",
    "3 tratamentos de profundidade",
    "3 علاجات عمق",
  ),
  "מעקב עור ושיער": r(
    "Skin and hair follow-up",
    "Seguimiento de piel y cabello",
    "Acompanhamento de pele e cabelo",
    "متابعة بشرة وشعر",
  ),
  "כמה זמן מראש כדאי לקבוע תור?": r(
    "How far ahead should you book?",
    "¿Con cuánta antelación conviene reservar?",
    "Com quanta antecedência vale marcar?",
    "كم مسبقاً يستحسن حجز موعد؟",
  ),
  "ראשון-חמישי 09:00-20:00 · שישי 09:00-14:00": r(
    "Sunday–Thursday 09:00-20:00 · Friday 09:00-14:00",
    "Domingo–jueves 09:00-20:00 · Viernes 09:00-14:00",
    "Domingo–quinta 09:00-20:00 · Sexta 09:00-14:00",
    "الأحد–الخميس 09:00-20:00 · الجمعة 09:00-14:00",
  ),
  "יופי שמרגיש שקט, מדויק ושלך.": r(
    "Beauty that feels quiet, precise, and yours.",
    "Belleza que se siente quieta, precisa y tuya.",
    "Beleza que parece quieta, precisa e sua.",
    "جمال يشعر بالهدوء والدقة وبأنه لك.",
  ),
  "לקביעת תור אישי": r(
    "Book a personal appointment",
    "Reservar una cita personal",
    "Marcar um horário pessoal",
    "لحجز موعد شخصي",
  ),

  // Vitalcare leftover (skip doctor/patient names and street address)
  "רפואת ילדים": r("Pediatrics", "Pediatría", "Pediatria", "طب أطفال"),
  "שביעות רצון לאחר ביקור": r(
    "Satisfaction after a visit",
    "Satisfacción después de la visita",
    "Satisfação após a visita",
    "رضا بعد الزيارة",
  ),
  "כללית מושלם": r("Clalit Mushlam", "Clalit Mushlam", "Clalit Mushlam", "Clalit Mushlam"),
  "מכבי שלי": r("Maccabi Sheli", "Maccabi Sheli", "Maccabi Sheli", "Maccabi Sheli"),
  "מאוחדת עדיף": r("Meuhedet Adif", "Meuhedet Adif", "Meuhedet Adif", "Meuhedet Adif"),
  "לאומית זהב": r("Leumit Zahav", "Leumit Zahav", "Leumit Zahav", "Leumit Zahav"),
  הראל: r("Harel", "Harel", "Harel", "Harel"),
  מגדל: r("Migdal", "Migdal", "Migdal", "Migdal"),
  "מידע חשוב לפני שמגיעים": r(
    "Important information before you arrive",
    "Información importante antes de llegar",
    "Informação importante antes de chegar",
    "معلومات مهمة قبل الوصول",
  ),
  "האם אפשר לקבל סיכום ביקור דיגיטלי?": r(
    "Can you get a digital visit summary?",
    "¿Se puede recibir un resumen digital de la visita?",
    "Dá para receber um resumo digital da visita?",
    "هل يمكن الحصول على ملخص زيارة رقمي؟",
  ),
  "קבעו תור ב-Vitalcare": r(
    "Book an appointment at Vitalcare",
    "Reservad cita en Vitalcare",
    "Marquem horário na Vitalcare",
    "احجزوا موعداً في Vitalcare",
  ),
  "ראשון-חמישי 08:00-20:00 · שישי 08:00-13:00": r(
    "Sunday–Thursday 08:00-20:00 · Friday 08:00-13:00",
    "Domingo–jueves 08:00-20:00 · Viernes 08:00-13:00",
    "Domingo–quinta 08:00-20:00 · Sexta 08:00-13:00",
    "الأحد–الخميس 08:00-20:00 · الجمعة 08:00-13:00",
  ),
  "טלפון לחזרה": r("Callback phone", "Teléfono de retorno", "Telefone para retorno", "هاتف للرد"),
  "תחום רפואי מבוקש": r(
    "Requested medical field",
    "Área médica solicitada",
    "Área médica pedida",
    "تخصص طبي مطلوب",
  ),

  // Handcraft leftover (skip names; skip place-only area titles)
  "למה Handcraft": r("Why Handcraft", "Por qué Handcraft", "Por que Handcraft", "لماذا Handcraft"),
  "ביקור ואבחון": r("Visit and diagnosis", "Visita y diagnóstico", "Visita e diagnóstico", "زيارة وتشخيص"),
  "תיקון ממוקד": r("Focused repair", "Reparación puntual", "Reparo pontual", "إصلاح مركّز"),
  "כולל לוח זמנים וחומרים": r(
    "Includes a schedule and materials",
    "Incluye calendario y materiales",
    "Inclui cronograma e materiais",
    "يشمل جدولاً ومواد",
  ),
  פריסה: r("Coverage", "Cobertura", "Cobertura", "تغطية"),
  "שליחת קריאה": r("Send a call-out", "Enviar un aviso", "Enviar um chamado", "إرسال بلاغ"),
  "דירה בגבעתיים": r(
    "Apartment in Givatayim",
    "Piso en Givatayim",
    "Apartamento em Givatayim",
    "شقة في جفعتايم",
  ),
  "משרד קטן בתל אביב": r(
    "Small office in Tel Aviv",
    "Oficina pequeña en Tel Aviv",
    "Escritório pequeno em Tel Aviv",
    "مكتب صغير في تل أبيب",
  ),
  "בית פרטי ברעננה": r(
    "Private home in Ra'anana",
    "Casa particular en Ra'anana",
    "Casa particular em Ra'anana",
    "منزل خاص في رعنانا",
  ),
  "אינסטלציה · חשמל · שיפוצים · תחזוקת נכסים": r(
    "Plumbing · electrical · renovations · property upkeep",
    "Fontanería · electricidad · reformas · mantenimiento",
    "Encanamento · elétrica · reformas · manutenção de imóveis",
    "سباكة · كهرباء · ترميم · صيانة عقارات",
  ),
  "מה התקלה?": r("What's the issue?", "¿Cuál es la avería?", "Qual é o problema?", "ما العطل؟"),

  // Advisora leftover (skip names and Rothschild address)
  "תחומי עומק": r("Depth areas", "Áreas de profundidad", "Áreas de profundidade", "مجالات عمق"),
  "שגרות הנהלה": r(
    "Leadership routines",
    "Rutinas de dirección",
    "Rotinas de direção",
    "روتينات إدارة",
  ),
  "מדידה שבועית": r("Weekly measurement", "Medición semanal", "Medição semanal", "قياس أسبوعي"),
  "מספרים שמחזיקים החלטות.": r(
    "Numbers that hold decisions.",
    "Números que sostienen decisiones.",
    "Números que sustentam decisões.",
    "أرقام تمسك القرارات.",
  ),
  "קול לקוח": r("Client voice", "Voz de cliente", "Voz do cliente", "صوت العميل"),
  "בעלים, רשת שירותים": r(
    "Owner, services network",
    "Propietario, red de servicios",
    "Dono, rede de serviços",
    "مالك، شبكة خدمات",
  ),
  "שאלות לפני שיחה": r(
    "Questions before a call",
    "Preguntas antes de una llamada",
    "Perguntas antes de uma chamada",
    "أسئلة قبل مكالمة",
  ),
  "מה כדאי לדעת לפני שמתחילים?": r(
    "What should you know before you start?",
    "¿Qué conviene saber antes de empezar?",
    "O que vale saber antes de começar?",
    "ماذا يستحسن معرفته قبل البدء؟",
  ),
  "בואו נדבר על העסק": r(
    "Let's talk about the business",
    "Hablemos del negocio",
    "Vamos falar sobre o negócio",
    "لنتحدث عن العمل",
  ),
  "שיחת אבחון": r("Diagnostic call", "Llamada de diagnóstico", "Chamada de diagnóstico", "مكالمة تشخيص"),
  "שליחה ותיאום": r("Send and schedule", "Enviar y coordinar", "Enviar e agendar", "إرسال وتنسيق"),
  "בואו נהפוך רעש\nלכיוון ניהולי.": r(
    "Let's turn noise\ninto a management direction.",
    "Convirtamos el ruido\nen una dirección de gestión.",
    "Vamos transformar ruído\nem direção de gestão.",
    "لنحوّل الضجيج\nإلى اتجاه إداري.",
  ),
  "מה האתגר העסקי המרכזי?": r(
    "What is the main business challenge?",
    "¿Cuál es el reto empresarial central?",
    "Qual é o desafio empresarial central?",
    "ما التحدي التجاري المركزي؟",
  ),
  עדות: r("Testimonial", "Testimonio", "Depoimento", "شهادة"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique55.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique55 rows`);
