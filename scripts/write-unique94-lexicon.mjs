/**
 * unique94 — leftover automation email preview chrome and gallery thumbnail copy.
 * Skip personal names and place-only strings.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  חולצה: r("Shirt", "Camisa", "Camisa", "قميص"),
  "מקור:": r("Source:", "Origen:", "Origem:", "المصدر:"),
  תספורת: r("Haircut", "Corte", "Corte", "قصة شعر"),
  "נשלח לכתובת": r("Ships to", "Envío a", "Enviado para", "يُرسل إلى"),
  "הנחה: 20.00 ₪": r("Discount: ₪20.00", "Descuento: ₪20.00", "Desconto: ₪20.00", "خصم: ₪20.00"),
  "משלוח: 25.00 ₪": r("Shipping: ₪25.00", "Envío: ₪25.00", "Frete: ₪25.00", "شحن: ₪25.00"),
  "נא לשלוח עד הצהריים": r("Please send by noon", "Enviad antes del mediodía", "Envie até o meio-dia", "يُرجى الإرسال حتى الظهر"),
  "סה״כ שולם: 185.00 ₪": r("Total paid: ₪185.00", "Total pagado: ₪185.00", "Total pago: ₪185.00", "الإجمالي المدفوع: ₪185.00"),
  "סכום ביניים: 180.00 ₪": r("Subtotal: ₪180.00", "Subtotal: ₪180.00", "Subtotal: ₪180.00", "المجموع الفرعي: ₪180.00"),
  "כמות: 2 · מחיר ליחידה: 60.00 ₪": r("Qty: 2 · unit price: ₪60.00", "Cant.: 2 · precio ud.: ₪60.00", "Qtd.: 2 · preço unitário: ₪60.00", "الكمية: 2 · سعر الوحدة: ₪60.00"),
  ". קיבלנו את פנייתך ונחזור אליך בהקדם.": r(". We received your inquiry and will get back to you soon.", ". Recibimos vuestra consulta y os responderemos pronto.", ". Recebemos seu contato e retornaremos em breve.", ". تلقّينا تواصلكم وسنعود إليكم قريباً."),
  "המייל נשלח מ-{{store.name}} באמצעות BizUply.": r("This email was sent from {{store.name}} via BizUply.", "Este correo se envió desde {{store.name}} a través de BizUply.", "Este e-mail foi enviado de {{store.name}} via BizUply.", "أُرسل هذا البريد من {{store.name}} عبر BizUply."),
  "העסק שלי": r("My business", "Mi negocio", "Meu negócio", "عملي"),
  "החנות שלי": r("My store", "Mi tienda", "Minha loja", "متجري"),
  "דמו חי": r("Live demo", "Demo en vivo", "Demo ao vivo", "عرض حي"),
  "ערב שף": r("Chef evening", "Noche de chef", "Noite de chef", "أمسية شيف"),
  "תגיעו.": r("Show up.", "Llegad.", "Chegue.", "احضروا."),
  "תדלקו.": r("Fuel up.", "Cargad.", "Abasteça.", "تزوّدوا."),
  "תפרצו.": r("Break through.", "Romped.", "Avance.", "انطلقوا."),
  אנטריקוט: r("Entrecôte", "Entrecot", "Entrecôte", "أنتركوت"),
  "מסעדת שף": r("Chef restaurant", "Restaurante de chef", "Restaurante de chef", "مطعم شيف"),
  "קו ראשון": r("First line", "Primera línea", "Primeira linha", "الخط الأول"),
  "וילה אחת.": r("One villa.", "Una villa.", "Uma villa.", "فيلا واحدة."),
  "משרד מסחרי": r("Commercial firm", "Despacho comercial", "Escritório comercial", "مكتب تجاري"),
  "פיד מפתחים": r("Dev feed", "Feed de desarrollo", "Feed de devs", "خلاصة المطوّرين"),
  "בוטיק אופנה": r("Fashion boutique", "Boutique de moda", "Boutique de moda", "بوتيك أزياء"),
  "מגורי יוקרה": r("Luxury living", "Vivienda de lujo", "Moradia de luxo", "سكن فاخر"),
  "מרפאה פרטית": r("Private clinic", "Clínica privada", "Clínica particular", "عيادة خاصة"),
  "סטודיו יוגה": r("Yoga studio", "Estudio de yoga", "Estúdio de ioga", "استوديو يوغا"),
  "סטודיו יופי": r("Beauty studio", "Estudio de belleza", "Estúdio de beleza", "استوديو تجميل"),
  "בודקים קרקע.": r("We check the land.", "Revisamos el terreno.", "Checamos o terreno.", "نفحص الأرض."),
  "לפני כל צעד.": r("Before every step.", "Antes de cada paso.", "Antes de cada passo.", "قبل كل خطوة."),
  "סטודיו פרחים": r("Flower studio", "Estudio floral", "Estúdio de flores", "استوديو ورود"),
  "פריימים חדים": r("Sharp frames", "Fotogramas nítidos", "Frames nítidos", "إطارات حادة"),
  "רפואת שיניים": r("Dentistry", "Odontología", "Odontologia", "طب الأسنان"),
  "שמתחילה נכון": r("That starts right", "Que empieza bien", "Que começa certo", "تبدأ بشكل صحيح"),
  "תכנון חתונות": r("Wedding planning", "Planificación de bodas", "Planejamento de casamentos", "تخطيط أعراس"),
  "החלטות שקטות.": r("Quiet decisions.", "Decisiones serenas.", "Decisões serenas.", "قرارات هادئة."),
  "חוויית מגורים": r("Living experience", "Experiencia de vivienda", "Experiência de morar", "تجربة سكن"),
  "למותגים חיים.": r("For living brands.", "Para marcas vivas.", "Para marcas vivas.", "لعلامات حيّة."),
  "פלטפורמת SaaS": r("SaaS platform", "Plataforma SaaS", "Plataforma SaaS", "منصة SaaS"),
  "מסעדת שף • יין": r("Chef restaurant • wine", "Restaurante de chef • vino", "Restaurante de chef • vinho", "مطعم شيف • نبيذ"),
  "אסטרטגיה משפטית": r("Legal strategy", "Estrategia jurídica", "Estratégia jurídica", "استراتيجية قانونية"),
  "לחיות מעל העיר.": r("Live above the city.", "Vivir sobre la ciudad.", "Viver acima da cidade.", "عيشوا فوق المدينة."),
  "מספרים מסודרים.": r("Numbers in order.", "Números en orden.", "Números em ordem.", "أرقام مرتّبة."),
  "חיוך בביטחון מלא.": r("A smile with full confidence.", "Una sonrisa con plena confianza.", "Um sorriso com confiança plena.", "ابتسامة بثقة كاملة."),
  "מותגים בלתי נשכחים.": r("Unforgettable brands.", "Marcas inolvidables.", "Marcas inesquecíveis.", "علامات لا تُنسى."),
  "מרפאת שיניים ובריאות": r("Dental and health clinic", "Clínica dental y de salud", "Clínica dental e de saúde", "عيادة أسنان وصحة"),
  "ייצוג משפטי חד וברור.": r("Sharp, clear legal representation.", "Representación jurídica nítida y clara.", "Representação jurídica nítida e clara.", "تمثيل قانوني حاد وواضح."),
  "מטבח עונתי וטעם שנשאר": r("Seasonal kitchen and flavor that stays", "Cocina de temporada y sabor que permanece", "Cozinha sazonal e sabor que fica", "مطبخ موسمي وطعم يبقى"),
  "“הבית שלא צריך לשכנע.”": r("“The home that needs no selling.”", "“La casa que no necesita convencer.”", "“A casa que não precisa convencer.”", "«البيت الذي لا يحتاج إلى إقناع.»"),
  "עיצוב · מיתוג · דיגיטל": r("Design · branding · digital", "Diseño · marca · digital", "Design · marca · digital", "تصميم · علامة · رقمي"),
  "ליווי שאפשר לסמוך עליו.": r("Guidance you can trust.", "Un acompañamiento en el que se puede confiar.", "Um acompanhamento em que se pode confiar.", "مرافقة يمكن الوثوق بها."),
  "בתים שנבחרו בדיוק כמוכם.": r("Homes chosen exactly like you.", "Casas elegidas exactamente como vosotros.", "Casas escolhidas exatamente como vocês.", "بيوت اختيرت تماماً مثلكم."),
  "מרחב רגוע לצמיחה ושינוי.": r("A calm space for growth and change.", "Un espacio sereno para crecer y cambiar.", "Um espaço calmo para crescer e mudar.", "مساحة هادئة للنمو والتغيير."),
  "מטפלים בבית בלי רעש מיותר.": r("We treat the home without extra noise.", "Cuidamos la casa sin ruido de más.", "Cuidamos a casa sem barulho extra.", "نعالج البيت بلا ضوضاء زائدة."),
  "מגלים מה קורה עכשיו בפיתוח.": r("See what is happening in development now.", "Descubrid qué pasa ahora en desarrollo.", "Veja o que acontece agora no desenvolvimento.", "اكتشفوا ما يحدث الآن في التطوير."),
  "התוכנה שמריצה את העסק קדימה.": r("Software that runs the business forward.", "El software que empuja el negocio adelante.", "O software que leva o negócio adiante.", "البرمجيات التي تدفع العمل إلى الأمام."),
  "יופי נקי. נוכחות בלתי נשכחת.": r("Clean beauty. Unforgettable presence.", "Belleza limpia. Presencia inolvidable.", "Beleza limpa. Presença inesquecível.", "جمال نظيف. حضور لا يُنسى."),
  "משרד עורכי דין • ייעוץ משפטי": r("Law firm • legal counsel", "Despacho de abogados • asesoría jurídica", "Escritório de advocacia • consultoria jurídica", "مكتب محاماة • استشارة قانونية"),
  "רפואה רגועה, מדויקת ואנושית.": r("Calm, precise, human medicine.", "Medicina serena, precisa y humana.", "Medicina calma, precisa e humana.", "طب هادئ ودقيق وإنساني."),
  "820 מ״ר · מגורים א׳ · חזית דרומית": r("820 m² · residence A · south facade", "820 m² · vivienda A · fachada sur", "820 m² · residência A · fachada sul", "820 م² · سكن أ · واجهة جنوبية"),
  "יום חתונה שמרגיש קל, אישי ויפהפה.": r("A wedding day that feels light, personal, and beautiful.", "Un día de boda que se siente ligero, personal y hermoso.", "Um dia de casamento leve, pessoal e bonito.", "يوم زفاف يشعر خفيفاً وشخصياً وجميلاً."),
  "ניאון, במה, מורים וגלריית סטריפים": r("Neon, a stage, teachers, and a strip gallery", "Neón, escenario, profesores y una galería de tiras", "Néon, palco, professores e uma galeria de tiras", "نيون ومنصة ومعلمون ومعرض شرائط"),
  "הפקת וידאו וצילום למותגים מודרניים": r("Video production and photography for modern brands", "Producción de vídeo y foto para marcas modernas", "Produção de vídeo e foto para marcas modernas", "إنتاج فيديو وتصوير لعلامات حديثة"),
  "מנוע AI שמחבר דאטה, החלטות ואוטומציות.": r("An AI engine that joins data, decisions, and automations.", "Un motor de IA que une datos, decisiones y automatizaciones.", "Um motor de IA que une dados, decisões e automações.", "محرك ذكاء يربط البيانات والقرارات والأتمتة."),
  "זרים שנראים כאילו נקטפו מתוך מכתב אהבה.": r("Bouquets that look picked from a love letter.", "Ramos que parecen cortados de una carta de amor.", "Buquês que parecem colhidos de uma carta de amor.", "باقات تبدو كأنها قُطفت من رسالة حب."),
  "סלון יופי בוטיק בשפה נקייה, מקצועית ומעודנת.": r("A boutique beauty salon in a clean, professional, refined voice.", "Un salón boutique con un lenguaje limpio, profesional y refinado.", "Um salão boutique com linguagem limpa, profissional e refinada.", "صالون تجميل بوتيك بلغة نظيفة ومهنية وراقية."),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique94.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique94 rows`);
