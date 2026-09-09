/**
 * unique57 — leftover Vowline through Florique seed/hardcoded chrome.
 * Skip personal names, streets, cities, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Vowline (skip couple names)
  סיפורים: r("Stories", "Historias", "Histórias", "قصص"),
  "חבילות תכנון": r("Planning packages", "Packs de planificación", "Pacotes de planejamento", "باقات تخطيط"),
  "בחרו את רמת הליווי": r(
    "Choose the guidance level",
    "Elegid el nivel de acompañamiento",
    "Escolham o nível de acompanhamento",
    "اختاروا مستوى المرافقة",
  ),
  "ניהול ביום": r("Day-of management", "Gestión el día", "Gestão no dia", "إدارة في اليوم"),
  "ספקים ושותפים": r("Vendors and partners", "Proveedores y socios", "Fornecedores e parceiros", "موردون وشركاء"),
  "חתונת שישי בשרון": r(
    "A Friday wedding in the Sharon",
    "Boda de viernes en el Sharon",
    "Casamento de sexta no Sharon",
    "زفاف جمعة في الشارون",
  ),
  "חתונת ערב ביפו": r(
    "An evening wedding in Jaffa",
    "Boda de noche en Jaffa",
    "Casamento à noite em Jaffa",
    "زفاف مسائي في يافا",
  ),
  "שאלות רכות": r("Soft questions", "Preguntas suaves", "Perguntas suaves", "أسئلة لطيفة"),
  "מתי כדאי להתחיל לתכנן?": r(
    "When should you start planning?",
    "¿Cuándo conviene empezar a planificar?",
    "Quando vale começar a planejar?",
    "متى يستحسن بدء التخطيط؟",
  ),
  "האם אתם עובדים עם ספקים קבועים?": r(
    "Do you work with regular vendors?",
    "¿Trabajáis con proveedores fijos?",
    "Vocês trabalham com fornecedores fixos?",
    "هل تعملون مع موردين ثابتين؟",
  ),
  "אפשר לקבל רק ליווי ביום האירוע?": r(
    "Can we get day-of guidance only?",
    "¿Se puede recibir solo acompañamiento el día del evento?",
    "Dá para ter só acompanhamento no dia do evento?",
    "هل يمكن الحصول على مرافقة يوم المناسبة فقط؟",
  ),
  "ספרו לנו על היום שלכם": r(
    "Tell us about your day",
    "Contadnos sobre vuestro día",
    "Contem sobre o dia de vocês",
    "أخبرونا عن يومكم",
  ),
  "תל אביב · חתונות בכל הארץ": r(
    "Tel Aviv · weddings nationwide",
    "Tel Aviv · bodas en todo el país",
    "Tel Aviv · casamentos em todo o país",
    "تل أبيب · أعراس في كل البلاد",
  ),

  // Archora
  "מגדלי בוטיק": r("Boutique towers", "Torres boutique", "Torres boutique", "أبراج بوتيك"),
  "בית קנטילבר / הרצליה": r(
    "Cantilever house / Herzliya",
    "Casa voladiza / Herzliya",
    "Casa em balanço / Herzliya",
    "بيت كابولي / هرتسليا",
  ),
  "מטה פיננסי / תל אביב": r(
    "Finance HQ / Tel Aviv",
    "Sede financiera / Tel Aviv",
    "Sede financeira / Tel Aviv",
    "مقر مالي / تل أبيب",
  ),
  "גלריית מגורים / יפו": r(
    "Residential gallery / Jaffa",
    "Galería residencial / Jaffa",
    "Galeria residencial / Jaffa",
    "معرض سكني / يافا",
  ),
  "01 / קריאת אתר": r("01 / Reading the site", "01 / Lectura del solar", "01 / Leitura do terreno", "01 / قراءة الموقع"),
  "03 / מערכת פרטים": r("03 / Detail system", "03 / Sistema de detalles", "03 / Sistema de detalhes", "03 / نظام تفاصيل"),
  "מספרים עם הד.": r("Numbers with echo.", "Números con eco.", "Números com eco.", "أرقام بصدى."),
  "סוג הנכס / מיקום": r(
    "Property type / location",
    "Tipo de inmueble / ubicación",
    "Tipo de imóvel / local",
    "نوع العقار / موقع",
  ),
  "ספרו לנו מה חייב לקרות בחלל": r(
    "Tell us what must happen in the space",
    "Contadnos qué tiene que ocurrir en el espacio",
    "Contem o que precisa acontecer no espaço",
    "أخبرونا ماذا يجب أن يحدث في الفراغ",
  ),

  // Dentelle (skip doctor name)
  חוויה: r("Experience", "Experiencia", "Experiência", "تجربة"),
  "שעות למענה תורים": r(
    "Hours for appointment replies",
    "Horario de respuesta a citas",
    "Horário de resposta a horários",
    "ساعات للرد على المواعيد",
  ),
  "החל מ-₪3,400 לשן": r(
    "From ₪3,400 per tooth",
    "Desde ₪3,400 por diente",
    "A partir de ₪3.400 por dente",
    "بدءاً من ₪3,400 للسن",
  ),
  "חדר טיפול שקט": r("A quiet treatment room", "Sala de tratamiento silenciosa", "Sala de tratamento silenciosa", "غرفة علاج هادئة"),
  "טיפול שמעניין אתכם": r(
    "A treatment that interests you",
    "Un tratamiento que os interesa",
    "Um tratamento que interessa vocês",
    "علاج يهمكم",
  ),
  "מה חשוב לנו לדעת לפני השיחה?": r(
    "What should we know before the call?",
    "¿Qué necesitamos saber antes de la llamada?",
    "O que precisamos saber antes da chamada?",
    "ماذا يجب أن نعرف قبل المكالمة؟",
  ),

  // Aurayoga (skip names and quiet-street address)
  "שיעורים רכים ומדויקים": r(
    "Soft, precise classes",
    "Clases suaves y precisas",
    "Aulas suaves e precisas",
    "حصص لطيفة ودقيقة",
  ),
  "בוקר / 60 דק׳": r("Morning / 60 min", "Mañana / 60 min", "Manhã / 60 min", "صباح / 60 د"),
  "ערב / 75 דק׳": r("Evening / 75 min", "Noche / 75 min", "Noite / 75 min", "مساء / 75 د"),
  "צהריים / 60 דק׳": r("Noon / 60 min", "Mediodía / 60 min", "Meio-dia / 60 min", "ظهر / 60 د"),
  "אישי / 50 דק׳": r("Private / 50 min", "Personal / 50 min", "Particular / 50 min", "خاص / 50 د"),
  "שינה רגועה יותר": r("Calmer sleep", "Un sueño más calmo", "Sono mais calmo", "نوم أهدأ"),
  "Slow Flow לפני העבודה": r(
    "Slow Flow before work",
    "Slow Flow antes del trabajo",
    "Slow Flow antes do trabalho",
    "Slow Flow قبل العمل",
  ),
  "צוות Aura": r("Aura team", "Equipo Aura", "Equipe Aura", "فريق Aura"),
  "קולות מהסטודיו": r("Voices from the studio", "Voces del estudio", "Vozes do estúdio", "أصوات من الاستوديو"),
  "נשימה אחת מספיקה כדי להתחיל.": r(
    "One breath is enough to start.",
    "Una respiración basta para empezar.",
    "Uma respiração basta para começar.",
    "نفس واحد يكفي للبدء.",
  ),
  "מה תרצו לתרגל": r("What would you like to practice", "Qué os gustaría practicar", "O que vocês querem praticar", "ماذا تريدون التمرّن عليه"),
  "מה תרצו לתרגל?": r(
    "What would you like to practice?",
    "¿Qué os gustaría practicar?",
    "O que vocês querem praticar?",
    "ماذا تريدون التمرّن عليه؟",
  ),

  // Soundline (skip names and Florentin address)
  "כלים ושירותים": r("Instruments and services", "Instrumentos y servicios", "Instrumentos e serviços", "آلات وخدمات"),
  "קול / במה": r("Voice / stage", "Voz / escenario", "Voz / palco", "صوت / خشبة"),
  מסלול: r("Track", "Itinerario", "Percurso", "مسار"),
  "גיטרה / בס": r("Guitar / bass", "Guitarra / bajo", "Guitarra / baixo", "غيتار / باص"),
  "פסנתר / קלידים": r("Piano / keys", "Piano / teclados", "Piano / teclados", "بيانو / مفاتيح"),
  "הפקה אלקטרונית": r("Electronic production", "Producción electrónica", "Produção eletrônica", "إنتاج إلكتروني"),

  // Pawhaus (skip names and Hashmonaim address)
  "פתוח 7 ימים בשבוע": r(
    "Open 7 days a week",
    "Abierto 7 días a la semana",
    "Aberto 7 dias por semana",
    "مفتوح 7 أيام في الأسبوع",
  ),
  "כולל מצלמות": r("Includes cameras", "Incluye cámaras", "Inclui câmeras", "يشمل كاميرات"),
  "לפי גודל": r("By size", "Según tamaño", "Por tamanho", "حسب الحجم"),
  "מספרים שמרגיעים": r("Numbers that calm", "Números que calman", "Números que acalmam", "أرقام تهدّئ"),
  "תיאום ביקור": r("Book a visit", "Coordinar una visita", "Agendar uma visita", "تنسيق زيارة"),
  "מקום חם מתחיל בהיכרות קטנה.": r(
    "A warm place starts with a small hello.",
    "Un lugar cálido empieza con un saludo pequeño.",
    "Um lugar quente começa com um olá pequeno.",
    "مكان دافئ يبدأ بتعارف صغير.",
  ),
  "שם החיה": r("Pet name", "Nombre de la mascota", "Nome do pet", "اسم الحيوان"),
  "סוג וגיל": r("Type and age", "Tipo y edad", "Tipo e idade", "نوع وعمر"),
  "כלב / חתול וגיל": r("Dog / cat and age", "Perro / gato y edad", "Cão / gato e idade", "كلب / قط وعمر"),
  "מה חשוב לדעת": r("What we should know", "Qué es importante saber", "O que é importante saber", "ما المهم معرفته"),
  "מה חשוב לנו לדעת לפני ההגעה?": r(
    "What should we know before you arrive?",
    "¿Qué necesitamos saber antes de la llegada?",
    "O que precisamos saber antes da chegada?",
    "ماذا يجب أن نعرف قبل الوصول؟",
  ),

  // Atelier X
  סטורי: r("Story", "Story", "Story", "ستوري"),
  מידות: r("Sizes", "Tallas", "Tamanhos", "مقاسات"),
  "45 דקות של בניית לוקים למדידה": r(
    "45 minutes of look-building for a fitting",
    "45 minutos de construcción de looks para prueba",
    "45 minutos de montagem de looks para prova",
    "45 دقيقة لبناء إطلالات للتجربة",
  ),
  שמירה: r("Hold", "Reserva", "Reserva", "حفظ"),
  "מה כתבו על Atelier X": r(
    "What they wrote about Atelier X",
    "Qué escribieron sobre Atelier X",
    "O que escreveram sobre Atelier X",
    "ماذا كتبوا عن Atelier X",
  ),
  "מה מחפשים": r("What you are looking for", "Qué buscáis", "O que vocês procuram", "ماذا تبحثون"),

  // Brewline
  אתיופיה: r("Ethiopia", "Etiopía", "Etiópia", "إثيوبيا"),
  קולומביה: r("Colombia", "Colombia", "Colômbia", "كولومبيا"),
  ברזיל: r("Brazil", "Brasil", "Brasil", "البرازيل"),
  טחינה: r("Tahini", "Tahini", "Tahine", "طحينة"),
  "כיול יומי לפי לחות, קלייה וקצב הזמנות.": r(
    "Daily calibration by humidity, roast, and order pace.",
    "Calibración diaria según humedad, tueste y ritmo de pedidos.",
    "Calibração diária conforme umidade, torra e ritmo de pedidos.",
    "معايرة يومية حسب الرطوبة والتحميص وإيقاع الطلبات.",
  ),
  חליטה: r("Brew", "Infusión", "Infusão", "نقع"),
  מרקם: r("Texture", "Textura", "Textura", "قوام"),
  "בר ערב": r("Evening bar", "Bar de noche", "Bar noturno", "بار مسائي"),
  "שליחה ובניית תפריט": r(
    "Send and build a menu",
    "Enviar y construir un menú",
    "Enviar e montar um cardápio",
    "إرسال وبناء قائمة",
  ),
  מקור: r("Origin", "Origen", "Origem", "مصدر"),
  "אירוע / כמות אורחים": r(
    "Event / guest count",
    "Evento / cantidad de invitados",
    "Evento / quantidade de convidados",
    "مناسبة / عدد الضيوف",
  ),
  "ספרו לנו על הקייטרינג או הביקור שתרצו": r(
    "Tell us about the catering or the visit you want",
    "Contadnos sobre el catering o la visita que queréis",
    "Contem sobre o catering ou a visita que vocês querem",
    "أخبرونا عن الضيافة أو الزيارة التي تريدونها",
  ),

  // Autovolt (skip Holon street address)
  "שירותים חדים": r("Sharp services", "Servicios nítidos", "Serviços nítidos", "خدمات حادة"),
  "פנים עמוק": r("Deep interior", "Interior profundo", "Interior profundo", "داخل عميق"),
  ניקוי: r("Cleaning", "Limpieza", "Limpeza", "تنظيف"),
  "לפני / אחרי": r("Before / after", "Antes / después", "Antes / depois", "قبل / بعد"),
  "שתי חבילות גדולות": r("Two large packages", "Dos packs grandes", "Dois pacotes grandes", "باقتان كبيرتان"),
  "יום עבודה אחד": r("One work day", "Un día de trabajo", "Um dia de trabalho", "يوم عمل واحد"),
  "72 שעות סטודיו": r("72 studio hours", "72 horas de estudio", "72 horas de estúdio", "72 ساعة استوديو"),
  "תור בסטודיו": r("Studio appointment", "Cita en el estudio", "Horário no estúdio", "موعد في الاستوديو"),
  "שליחה לאבחון": r("Send for diagnosis", "Enviar a diagnóstico", "Enviar para diagnóstico", "إرسال للتشخيص"),
  "דגם הרכב": r("Car model", "Modelo del coche", "Modelo do carro", "طراز السيارة"),
  "מה מצב הצבע ומה חשוב לכם?": r(
    "What is the paint condition, and what matters to you?",
    "¿Cómo está la pintura y qué os importa?",
    "Como está a pintura e o que importa para vocês?",
    "ما حالة الطلاء وما الذي يهمكم؟",
  ),

  // Neuralis (skip names and Azrieli address)
  דמו: r("Demo", "Demo", "Demo", "عرض"),
  "זמינות מערכת": r("System availability", "Disponibilidad del sistema", "Disponibilidade do sistema", "توافر النظام"),
  "מחירים מרובעים לצמיחה מהירה.": r(
    "Square prices for fast growth.",
    "Precios cuadrados para un crecimiento rápido.",
    "Preços quadrados para crescimento rápido.",
    "أسعار مربعة لنمو سريع.",
  ),
  מותאם: r("Tailored", "Adaptado", "Sob medida", "مخصّص"),
  "דמו מותאם": r("A tailored demo", "Una demo adaptada", "Um demo sob medida", "عرض مخصّص"),
  "שליחת בקשה לדמו": r(
    "Send a demo request",
    "Enviar una petición de demo",
    "Enviar um pedido de demo",
    "إرسال طلب عرض",
  ),
  "הסוכן איתר חריגה, יצר הסבר והכין פעולה לאישור.": r(
    "The agent found an anomaly, wrote an explanation, and prepared an action for approval.",
    "El agente detectó una anomalía, redactó una explicación y preparó una acción para aprobar.",
    "O agente achou uma anomalia, escreveu uma explicação e preparou uma ação para aprovar.",
    "رصد الوكيل انحرافاً، كتب شرحاً وأعدّ إجراءً للموافقة.",
  ),
  "חברה ותפקיד": r("Company and role", "Empresa y cargo", "Empresa e cargo", "شركة ومنصب"),
  "איזה תהליך הייתם רוצים להפוך לחכם?": r(
    "Which process would you like to make smarter?",
    "¿Qué proceso os gustaría volver más inteligente?",
    "Qual processo vocês querem tornar mais inteligente?",
    "أي عملية تريدون جعلها أذكى؟",
  ),

  // Florique (skip couple names)
  זרים: r("Bouquets", "Ramos", "Buquês", "باقات"),
  "לכל רגע": r("For every moment", "Para cada momento", "Para cada momento", "لكل لحظة"),
  "תהליך עדין, מסודר ויפה בכל שלב.": r(
    "A gentle process, ordered and beautiful at every stage.",
    "Un proceso suave, ordenado y bello en cada etapa.",
    "Um processo suave, ordenado e bonito em cada etapa.",
    "عملية لطيفة، مرتبة وجميلة في كل مرحلة.",
  ),
  סקיצה: r("Sketch", "Boceto", "Esboço", "مسودة"),
  ליקוט: r("Gathering", "Recolección", "Colheita", "قطف"),
  "הפרחים נבחרים בבוקר לפי טריות ועונה.": r(
    "Flowers are chosen in the morning by freshness and season.",
    "Las flores se eligen por la mañana según frescura y temporada.",
    "As flores são escolhidas de manhã por frescor e estação.",
    "تُختار الأزهار صباحاً حسب الطزاجة والموسم.",
  ),
  קשירה: r("Tying", "Atado", "Amarração", "ربط"),
  "פרחים קבועים": r("Standing flowers", "Flores fijas", "Flores fixas", "ورود ثابتة"),
  "חתונת אביב": r("A spring wedding", "Una boda de primavera", "Um casamento de primavera", "زفاف ربيع"),
  "שליחת הזמנה": r("Send an order", "Enviar un pedido", "Enviar um pedido", "إرسال طلب"),
  "תקציב וגוונים מועדפים": r(
    "Budget and preferred tones",
    "Presupuesto y tonos preferidos",
    "Orçamento e tons preferidos",
    "ميزانية ودرجات مفضلة",
  ),
  "ברכה, כתובת ושעה רצויה": r(
    "A note, address, and preferred time",
    "Dedicatoria, dirección y hora deseada",
    "Mensagem, endereço e horário desejado",
    "بطاقة وعنوان ووقت مرغوب",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique57.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique57 rows`);
