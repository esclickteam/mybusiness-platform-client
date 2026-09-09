/**
 * unique58 — leftover Lotera through Vespera seed/hardcoded chrome.
 * Skip personal names, place-only cities/regions, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Lotera
  "בית חוף שדות ים": r(
    "Sdot Yam beach house",
    "Casa de playa en Sdot Yam",
    "Casa de praia em Sdot Yam",
    "بيت شاطئ سدوت يام",
  ),
  "שלחו בקשת סיור": r("Send a tour request", "Enviad una petición de visita", "Enviem um pedido de tour", "أرسلوا طلب جولة"),
  "קו מים נבחר": r("A chosen waterline", "Una línea de agua elegida", "Uma linha de água escolhida", "خط ماء مختار"),
  "נכסים שנראים כמו אופק פתוח.": r(
    "Properties that look like an open horizon.",
    "Inmuebles que parecen un horizonte abierto.",
    "Imóveis que parecem um horizonte aberto.",
    "عقارات تبدو كأفق مفتوح.",
  ),
  "מסילה אופקית עם עומק, מחיר ותחושת מקום - לא רשימת כרטיסים רגילה.": r(
    "A horizontal track with depth, price, and a sense of place — not a regular card list.",
    "Un raíl horizontal con profundidad, precio y sentido de lugar — no una lista de tarjetas habitual.",
    "Um trilho horizontal com profundidade, preço e senso de lugar — não uma lista de cartões comum.",
    "مسار أفقي بعمق وسعر وإحساس مكان — وليس قائمة بطاقات عادية.",
  ),
  "עוגנים שיחה": r("Anchors a conversation", "Ancla una conversación", "Ancora uma conversa", "يرسي محادثة"),
  "מה חשוב לכם לראות מהחלון?": r(
    "What matters for you to see from the window?",
    "¿Qué os importa ver desde la ventana?",
    "O que importa vocês verem da janela?",
    "ماذا يهمكم أن تروا من النافذة؟",
  ),

  // Estateo
  "אחוזת כרמל": r("Carmel estate", "Finca Carmel", "Propriedade Carmel", "ضيعة الكرمل"),
  "וילה הרצליה פיתוח": r(
    "Herzliya Pituach villa",
    "Villa en Herzliya Pituach",
    "Villa em Herzliya Pituach",
    "فيلا هرتسليا بيتواح",
  ),
  "הזמנה לשיחה פרטית": r(
    "An invitation to a private call",
    "Una invitación a una llamada privada",
    "Um convite para uma chamada privada",
    "دعوة لمكالمة خاصة",
  ),
  "שלחו בקשת גישה": r("Send an access request", "Enviad una petición de acceso", "Enviem um pedido de acesso", "أرسلوا طلب وصول"),
  "טלפון פרטי": r("Private phone", "Teléfono privado", "Telefone privado", "هاتف خاص"),
  "טווח רכישה": r("Purchase range", "Rango de compra", "Faixa de compra", "نطاق شراء"),

  // Homara
  "בית רמת השרון": r("Ramat Hasharon home", "Casa en Ramat Hasharon", "Casa em Ramat Hasharon", "بيت رمات هشارون"),
  "קוטג׳ הוד השרון": r("Hod Hasharon cottage", "Cottage en Hod Hasharon", "Chalé em Hod Hasharon", "كوخ هود هشارون"),
  "בית גן כפר סבא": r(
    "Kfar Saba garden house",
    "Casa jardín en Kfar Saba",
    "Casa jardim em Kfar Saba",
    "بيت حديقة كفار سابا",
  ),
  "ספרו איך נראה הבית שלכם": r(
    "Tell us what your home looks like",
    "Contadnos cómo se ve vuestra casa",
    "Contem como é a casa de vocês",
    "أخبرونا كيف يبدو بيتكم",
  ),
  "בתים עם מקום לשגרה טובה.": r(
    "Homes with room for a good routine.",
    "Casas con sitio para una buena rutina.",
    "Casas com espaço para uma rotina boa.",
    "بيوت فيها مكان لروتين جيد.",
  ),
  "אזור ושכונה": r("Area and neighborhood", "Zona y barrio", "Região e bairro", "منطقة وحي"),
  "כמה חדרים?": r("How many rooms?", "¿Cuántas habitaciones?", "Quantos quartos?", "كم غرفة؟"),

  // Urbanix
  "נדל״ן בקצב העיר.": r(
    "Real estate at the city's pace.",
    "Inmobiliaria al ritmo de la ciudad.",
    "Imobiliário no ritmo da cidade.",
    "عقارات بإيقاع المدينة.",
  ),
  "סטודיו פלורנטין": r("Florentin studio", "Estudio Florentin", "Estúdio Florentin", "استوديو فلورنتين"),
  "לופט יפו": r("Jaffa loft", "Loft en Jaffa", "Loft em Jaffa", "لوفت يافا"),
  "רוצים דירה עכשיו?": r("Want an apartment now?", "¿Queréis un piso ahora?", "Querem um apartamento agora?", "تريدون شقة الآن؟"),
  "דירות לפי קצב ומחיר.": r(
    "Apartments by pace and price.",
    "Pisos según ritmo y precio.",
    "Apartamentos por ritmo e preço.",
    "شقق حسب الإيقاع والسعر.",
  ),
  "מחירון טיפוגרפי חד: שם, קו מקווקו, מחיר. בלי כרטיסים.": r(
    "A sharp typographic price list: name, dashed line, price. No cards.",
    "Una tarifa tipográfica nítida: nombre, línea de puntos, precio. Sin tarjetas.",
    "Uma tabela tipográfica nítida: nome, linha tracejada, preço. Sem cartões.",
    "قائمة أسعار طباعية حادة: اسم، خط متقطع، سعر. بلا بطاقات.",
  ),
  שכונה: r("Neighborhood", "Barrio", "Bairro", "حي"),
  "מה הדדליין לכניסה?": r(
    "What is the move-in deadline?",
    "¿Cuál es el plazo de entrada?",
    "Qual é o prazo de entrada?",
    "ما الموعد النهائي للدخول؟",
  ),

  // Rivara (skip region-only strip)
  מים: r("Water", "Agua", "Água", "ماء"),
  אור: r("Light", "Luz", "Luz", "ضوء"),
  שקט: r("Quiet", "Silencio", "Silêncio", "هدوء"),
  "5 חדרים · מרפסת מים": r(
    "5 rooms · water terrace",
    "5 habitaciones · terraza de agua",
    "5 quartos · terraço de água",
    "5 غرف · شرفة ماء",
  ),
  "6 חדרים · בריכה שקטה": r(
    "6 rooms · a quiet pool",
    "6 habitaciones · piscina quieta",
    "6 quartos · piscina quieta",
    "6 غرف · مسبح هادئ",
  ),
  צל: r("Shade", "Sombra", "Sombra", "ظل"),
  שביל: r("Path", "Sendero", "Trilha", "درب"),
  אופק: r("Horizon", "Horizonte", "Horizonte", "أفق"),
  "שליחת בקשה שקטה": r("Send a quiet request", "Enviar una petición quieta", "Enviar um pedido quieto", "إرسال طلب هادئ"),
  "טבע קרוב": r("Nearby nature", "Naturaleza cerca", "Natureza perto", "طبيعة قريبة"),
  "שיחה רגועה": r("A calm conversation", "Una conversación calmada", "Uma conversa calma", "محادثة هادئة"),
  "מים, פארק, פרטיות - מה חשוב לכם?": r(
    "Water, park, privacy — what matters to you?",
    "Agua, parque, privacidad — ¿qué os importa?",
    "Água, parque, privacidade — o que importa para vocês?",
    "ماء، حديقة، خصوصية — ماذا يهمكم؟",
  ),

  // Villaire
  "7 חדרים": r("7 rooms", "7 habitaciones", "7 quartos", "7 غرف"),
  "6 חדרים": r("6 rooms", "6 habitaciones", "6 quartos", "6 غرف"),
  "8 חדרים": r("8 rooms", "8 habitaciones", "8 quartos", "8 غرف"),
  "פרטים בשיחה": r("Details on a call", "Detalles en una llamada", "Detalhes numa chamada", "تفاصيل في مكالمة"),
  "צפייה בתיק": r("View the dossier", "Ver el dossier", "Ver o dossiê", "عرض الملف"),
  "אור לפני שטח": r("Light before land", "Luz antes que solar", "Luz antes de terreno", "ضوء قبل المساحة"),
  "איזו וילה אתם מדמיינים?": r(
    "Which villa are you imagining?",
    "¿Qué villa imagináis?",
    "Qual villa vocês imaginam?",
    "أي فيلا تتخيلون؟",
  ),

  // Parcel
  "מ״ר": r("sqm", "m²", "m²", "م²"),
  "שולי תכנון": r("Planning margins", "Márgenes de planificación", "Margens de planejamento", "هوامش تخطيط"),
  "בקשת סקר": r("Survey request", "Petición de estudio", "Pedido de levantamento", "طلب مسح"),
  "גודל רצוי במ״ר": r("Desired size in sqm", "Tamaño deseado en m²", "Tamanho desejado em m²", "حجم مرغوب بالم²"),
  "ייעוד, תקציב, הערות תכנון": r(
    "Use, budget, planning notes",
    "Uso, presupuesto, notas de planificación",
    "Uso, orçamento, notas de planejamento",
    "استخدام، ميزانية، ملاحظات تخطيط",
  ),

  // Skylara
  "פנטהאוז קו ים": r("Sea-line penthouse", "Ático en línea de mar", "Cobertura na linha do mar", "بنتهاوس خط بحر"),
  "4 חדרים · שתי חזיתות": r(
    "4 rooms · two facades",
    "4 habitaciones · dos fachadas",
    "4 quartos · duas fachadas",
    "4 غرف · واجهتان",
  ),
  "3 חדרים · לובי פרטי": r(
    "3 rooms · private lobby",
    "3 habitaciones · vestíbulo privado",
    "3 quartos · saguão privado",
    "3 غرف · ردهة خاصة",
  ),
  "חדר כושר גבוה": r("A high gym", "Gimnasio alto", "Academia alta", "صالة رياضة عالية"),
  "שליחת בקשת קומה": r("Send a floor request", "Enviar una petición de planta", "Enviar um pedido de andar", "إرسال طلب طابق"),
  "קומה רצויה": r("Desired floor", "Planta deseada", "Andar desejado", "طابق مرغوب"),
  "אזור / מגדל": r("Area / tower", "Zona / torre", "Região / torre", "منطقة / برج"),
  "נוף, מרפסת, שירותי בניין": r(
    "View, terrace, building amenities",
    "Vista, terraza, servicios del edificio",
    "Vista, terraço, serviços do prédio",
    "إطلالة، شرفة، خدمات المبنى",
  ),

  // Nestora
  "5 חדרים · חצר פנימית": r(
    "5 rooms · inner courtyard",
    "5 habitaciones · patio interior",
    "5 quartos · pátio interno",
    "5 غرف · فناء داخلي",
  ),
  "המכתב שלנו": r("Our letter", "Nuestra carta", "Nossa carta", "رسالتنا"),
  "פתק אישי": r("A personal note", "Una nota personal", "Um recado pessoal", "ملاحظة شخصية"),
  "מה יהיה בית מדויק עבורכם?": r(
    "What would be a precise home for you?",
    "¿Qué sería una casa precisa para vosotros?",
    "O que seria uma casa precisa para vocês?",
    "ما الذي سيكون بيتاً دقيقاً لكم؟",
  ),

  // Meridian
  "מלון בוטיק · תל אביב": r(
    "Boutique hotel · Tel Aviv",
    "Hotel boutique · Tel Aviv",
    "Hotel boutique · Tel Aviv",
    "فندق بوتيك · تل أبيب",
  ),
  "מרידיאן.": r("Meridian.", "Meridian.", "Meridian.", "Meridian."),
  "בחרו את הקצב שלכם": r("Choose your pace", "Elegid vuestro ritmo", "Escolham o ritmo de vocês", "اختاروا إيقاعكم"),
  "חדר ים": r("Sea room", "Habitación mar", "Quarto mar", "غرفة بحر"),
  "28 מ״ר": r("28 sqm", "28 m²", "28 m²", "28 م²"),
  "42 מ״ר": r("42 sqm", "42 m²", "42 m²", "42 م²"),
  "68 מ״ר": r("68 sqm", "68 m²", "68 m²", "68 م²"),
  פנטהאוז: r("Penthouse", "Ático", "Cobertura", "بنتهاوس"),
  "תבנית Meridian · Bizuply Studio": r(
    "Meridian template · Bizuply Studio",
    "Plantilla Meridian · Bizuply Studio",
    "Modelo Meridian · Bizuply Studio",
    "قالب Meridian · Bizuply Studio",
  ),

  // Cinder
  "בית קלייה · יפו": r("Roastery · Jaffa", "Tostadero · Jaffa", "Torrefação · Jaffa", "محمصة · يافا"),
  "קלייה קטנה. טעם גדול.": r(
    "A small roast. A big taste.",
    "Tueste pequeño. Sabor grande.",
    "Torra pequena. Sabor grande.",
    "تحميص صغير. طعم كبير.",
  ),
  פילטר: r("Filter", "Filtro", "Filtro", "فلتر"),
  "תבנית Cinder · Bizuply Studio": r(
    "Cinder template · Bizuply Studio",
    "Plantilla Cinder · Bizuply Studio",
    "Modelo Cinder · Bizuply Studio",
    "قالب Cinder · Bizuply Studio",
  ),

  // Vespera
  "אולם תרבות · ירושלים": r(
    "Culture hall · Jerusalem",
    "Sala de cultura · Jerusalén",
    "Sala de cultura · Jerusalém",
    "قاعة ثقافة · القدس",
  ),
  וספרה: r("Vespera", "Vespera", "Vespera", "Vespera"),
  "ערב שנבנה כמו יצירה": r(
    "An evening built like a work",
    "Una noche construida como una obra",
    "Uma noite construída como uma obra",
    "مساء يُبنى كعمل فني",
  ),
  "תרבות בלי רעש מיותר": r(
    "Culture without extra noise",
    "Cultura sin ruido de más",
    "Cultura sem ruído extra",
    "ثقافة بلا ضجيج زائد",
  ),
  "בקשת כרטיסים": r("Ticket request", "Petición de entradas", "Pedido de ingressos", "طلب تذاكر"),
  "חמישי 21:00": r("Thursday 21:00", "Jueves 21:00", "Quinta 21:00", "الخميس 21:00"),
  "שישי 20:30": r("Friday 20:30", "Viernes 20:30", "Sexta 20:30", "الجمعة 20:30"),
  "שבת 19:00": r("Saturday 19:00", "Sábado 19:00", "Sábado 19:00", "السبت 19:00"),
  "תבנית Vespera · Bizuply Studio": r(
    "Vespera template · Bizuply Studio",
    "Plantilla Vespera · Bizuply Studio",
    "Modelo Vespera · Bizuply Studio",
    "قالب Vespera · Bizuply Studio",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique58.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique58 rows`);
