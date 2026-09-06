#!/usr/bin/env node
/**
 * Deep-merge Business/Partner i18n keys into the five product catalogs.
 * Does not replace existing trees — only adds/updates the listed leaves.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { extraLocaleObject } from "./i18n-batch-site-studio-faqs.mjs";
import { extraPanelsLocaleObject } from "./i18n-batch-panels-faqs.mjs";
import { extraAiHelpStudioLocaleObject } from "./i18n-batch-ai-help-studio.mjs";
import { extraChromeELocaleObject } from "./i18n-batch-chrome-e.mjs";
import { extraPartnerBillingLocaleObject } from "./i18n-batch-partner-billing.mjs";
import { extraAutomationsRestLocaleObject } from "./i18n-batch-automations-rest.mjs";
import { extraStudioRestLocaleObject } from "./i18n-batch-studio-rest.mjs";
import { extraBusinessRestLocaleObject } from "./i18n-batch-business-rest.mjs";
import { extraBusinessLeftoverLocaleObject } from "./i18n-batch-business-leftover.mjs";
import { extraGrapesChromeLocaleObject } from "./i18n-batch-grapes-chrome.mjs";
import { extraPublicWidgetsLocaleObject } from "./i18n-batch-public-widgets.mjs";
import { extraTemplateMetaLocaleObject } from "./i18n-batch-template-meta.mjs";
import { extraFinalChromeLocaleObject } from "./i18n-batch-final-chrome.mjs";
import { extraStudioLeftoverLocaleObject } from "./i18n-batch-studio-leftover.mjs";

const require = createRequire(import.meta.url);
const { categoryNamesCatalog } = require("../src/i18n/businessCategoryLabels.js");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function deepMerge(target, source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return source;
  const out = target && typeof target === "object" && !Array.isArray(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

const STUDIO_CATEGORIES = {
  text: row("Text", "טקסט", "Texto", "Texto", "نص"),
  image: row("Image", "תמונה", "Imagen", "Imagem", "صورة"),
  button: row("Button", "כפתור", "Botón", "Botão", "زر"),
  strip: row("Section", "סקציה", "Sección", "Seção", "قسم"),
  decorative: row("Decor", "עיצוב", "Decoración", "Decoração", "تصميم"),
  box: row("Box", "קופסה", "Caja", "Caixa", "صندوق"),
  gallery: row("Gallery", "גלריה", "Galería", "Galeria", "معرض"),
  menu: row("Menu", "תפריט", "Menú", "Menu", "قائمة"),
  forms: row("Forms", "טפסים", "Formularios", "Formulários", "نماذج"),
  video: row("Video", "וידאו", "Video", "Vídeo", "فيديو"),
  interactive: row("Interactive", "אינטראקטיבי", "Interactivo", "Interativo", "تفاعلي"),
  list: row("Lists", "רשימות", "Listas", "Listas", "قوائم"),
  embed: row("Embed", "Embed", "Embed", "Embed", "تضمين"),
  social: row("Social", "סושיאל", "Social", "Social", "تواصل"),
  payments: row("Payments", "תשלומים", "Pagos", "Pagamentos", "مدفوعات"),
  store: row("Store", "חנות", "Tienda", "Loja", "متجر"),
  bookings: row("Bookings", "תורים", "Citas", "Agendamentos", "مواعيد"),
  bizuply: row("Bizuply", "Bizuply", "Bizuply", "Bizuply", "Bizuply"),
};

const KIND_HINTS = {
  header: row("Top menu, logo, navigation, buttons, and sign-in/out", "תפריט עליון, לוגו, ניווט, כפתורים וכניסה/יציאה", "Menú superior, logo, navegación, botones y acceso", "Menu superior, logo, navegação, botões e entrada", "قائمة علوية وشعار وتنقل وأزرار وتسجيل دخول"),
  hero: row("Site opening, hero, main headline, and atmosphere image", "פתיחת אתר, Hero, כותרת ראשית ותמונת אווירה", "Apertura, hero, titular e imagen de ambiente", "Abertura, hero, título e imagem de atmosfera", "افتتاح الموقع وعنوان وصورة أجواء"),
  welcome: row("Soft opening, greeting, business intro, and a call to action", "פתיחה רכה, ברכה, הצגת העסק והנעה לפעולה", "Apertura suave, saludo, presentación y llamada a la acción", "Abertura suave, saudação, apresentação e chamada", "افتتاح لطيف وترحيب وعرض للعمل ودعوة"),
  about: row("Business story, values, experience, and a photo", "סיפור העסק, ערכים, ניסיון ותמונה", "Historia, valores, experiencia y foto", "História, valores, experiência e foto", "قصة العمل والقيم والخبرة وصورة"),
  team: row("Team members, owner, profiles, and roles", "אנשי צוות, בעל העסק, פרופילים ותפקידים", "Equipo, dueño, perfiles y roles", "Equipe, dono, perfis e funções", "فريق المالك وملفات وأدوار"),
  services: row("Service cards, price list, packages, and descriptions", "כרטיסי שירותים, מחירון, חבילות ותיאור שירות", "Tarjetas de servicio, precios y paquetes", "Cartões de serviço, preços e pacotes", "بطاقات خدمات وأسعار وباقات"),
  gallery: row("Photos, work, carousel, grid, and media", "תמונות, עבודות, קרוסלה, גריד ומדיה", "Fotos, trabajos, carrusel y media", "Fotos, trabalhos, carrossel e mídia", "صور وأعمال ومعرض ووسائط"),
  contact: row("Forms, WhatsApp, phone, map, and business details", "טפסים, וואטסאפ, טלפון, מפה ופרטי עסק", "Formularios, WhatsApp, teléfono y mapa", "Formulários, WhatsApp, telefone e mapa", "نماذج وواتساب وهاتف وخريطة"),
  promotion: row("Promos, coupons, banners, and purchase prompts", "מבצעים, קופונים, באנרים והנעה לרכישה", "Promos, cupones y banners", "Promoções, cupons e banners", "عروض وكوبونات ولافتات"),
  subscribe: row("Newsletter, waitlist, coupon, and updates signup", "ניוזלטר, רשימת המתנה, קופון והרשמה לעדכונים", "Newsletter, lista de espera y cupón", "Newsletter, lista de espera e cupom", "نشرة وقائمة انتظار وكوبون"),
  testimonials: row("Customer quotes and social proof", "המלצות לקוחות, ציטוטים וסושיאל פרוף", "Testimonios y prueba social", "Depoimentos e prova social", "شهادات ودليل اجتماعي"),
  reviews: row("Reviews, ratings, stars, and a review form", "ביקורות, דירוגים, כוכבים וטופס ביקורת", "Reseñas, valoraciones y formulario", "Avaliações, notas e formulário", "مراجعات وتقييمات ونموذج"),
  clients: row("Logos, clients, brands, and partners", "לוגואים, לקוחות, מותגים ושותפים", "Logos, clientes y socios", "Logos, clientes e parceiros", "شعارات وعملاء وشركاء"),
  store: row("Products, price, buy button, collections, and ecommerce", "מוצרים, מחיר, כפתור רכישה, קולקציות ו־Ecommerce", "Productos, precio y comercio", "Produtos, preço e e-commerce", "منتجات وسعر وتجارة"),
  booking: row("Appointment calendar connected to CRM hours and services", "יומן פגישות — מחובר אוטומטית ליומן, שירותים ושעות מה-CRM", "Calendario de citas conectado al CRM", "Agenda de horários ligada ao CRM", "تقويم مواعيد متصل بنظام CRM"),
  bookings: row("Legacy bookings name support", "תמיכה בשם הישן bookings", "Compatibilidad con el nombre bookings", "Compatibilidade com o nome bookings", "دعم الاسم القديم bookings"),
  events: row("Events, schedule, talks, workshops, and signup", "אירועים, לו״ז, הרצאות, סדנאות והרשמה", "Eventos, agenda y talleres", "Eventos, agenda e oficinas", "فعاليات وجدول وورش"),
  club: row("VIP, coupons, benefits, and customer signup", "VIP, קופונים, הטבות והרשמת לקוחות", "VIP, cupones y registro", "VIP, cupons e cadastro", "VIP وكوبونات وتسجيل"),
  bot: row("AI assistant, chat, leads, WhatsApp, and bookings", "AI Assistant, צ׳אט, לידים, וואטסאפ ותורים", "Asistente IA, chat y citas", "Assistente IA, chat e horários", "مساعد ذكي ودردشة ومواعيد"),
  social: row("Instagram, Facebook, TikTok, YouTube, LinkedIn, and WhatsApp", "אינסטגרם, פייסבוק, טיקטוק, יוטיוב, לינקדאין ווואטסאפ", "Instagram, Facebook y más", "Instagram, Facebook e mais", "إنستغرام وفيسبوك والمزيد"),
  course: row("Courses, lessons, content, pricing, and syllabus", "קורסים, שיעורים, תוכן, מחירון וסילבוס", "Cursos, clases y temario", "Cursos, aulas e ementa", "دورات ودروس ومنهج"),
  miniSaas: row("Small business system, dashboard, login, and payment", "מערכת קטנה לעסק, דשבורד, התחברות ותשלום", "Mini sistema, panel y pago", "Mini sistema, painel e pagamento", "نظام صغير ولوحة ودفع"),
  basic: row("Basic, empty, numbers, CTA, and text sections", "סקשנים בסיסיים, ריקים, מספרים, CTA וטקסט", "Secciones básicas, CTA y texto", "Seções básicas, CTA e texto", "أقسام أساسية ودعوة ونص"),
  text: row("Headings, paragraphs, quotes, and text content", "כותרות, פסקאות, ציטוטים ותוכן טקסטואלי", "Títulos, párrafos y citas", "Títulos, parágrafos e citações", "عناوين وفقرات واقتباسات"),
  list: row("Lists, steps, benefits, FAQ, and price lists", "רשימות, שלבים, יתרונות, FAQ ומחירון", "Listas, pasos, FAQ y precios", "Listas, etapas, FAQ e preços", "قوائم وخطوات وأسئلة وأسعار"),
  form: row("Lead, contact, signup, request, and support forms", "טפסי ליד, יצירת קשר, הרשמה, בקשה ותמיכה", "Formularios de contacto y registro", "Formulários de contato e cadastro", "نماذج تواصل وتسجيل"),
  forms: row("Legacy forms name support", "תמיכה בשם הישן forms", "Compatibilidad con el nombre forms", "Compatibilidade com o nome forms", "دعم الاسم القديم forms"),
};

const STUDIO_ELEMENTS = {
  "text-h1": { label: row("Giant H1 heading", "כותרת H1 ענקית", "Título H1 gigante", "Título H1 enorme", "عنوان H1 ضخم"), description: row("Large, impressive main heading", "כותרת ראשית גדולה ומרשימה", "Titular principal grande e impactante", "Título principal grande e marcante", "عنوان رئيسي كبير ومميز") },
  "text-h2": { label: row("H2 heading", "כותרת H2", "Título H2", "Título H2", "عنوان H2"), description: row("Large section heading", "כותרת גדולה לסקשן", "Título grande de sección", "Título grande de seção", "عنوان قسم كبير") },
  "text-h3": { label: row("Card heading", "כותרת כרטיס", "Título de tarjeta", "Título de cartão", "عنوان بطاقة"), description: row("Heading for a service, product, or benefit", "כותרת לשירות, מוצר או יתרון", "Título para servicio, producto o ventaja", "Título para serviço, produto ou vantagem", "عنوان لخدمة أو منتج أو ميزة") },
  "text-paragraph": { label: row("Paragraph", "פסקה", "Párrafo", "Parágrafo", "فقرة"), description: row("Professional explanation text", "טקסט הסבר מקצועי", "Texto explicativo profesional", "Texto explicativo profissional", "نص شرح احترافي") },
  "text-kicker": { label: row("Small heading", "כותרת קטנה", "Título pequeño", "Título pequeno", "عنوان صغير"), description: row("Tag above a heading", "תגית מעל כותרת", "Etiqueta sobre el título", "Etiqueta acima do título", "وسم فوق العنوان") },
  "text-pill": { label: row("Pill tag", "תגית Pill", "Etiqueta pastilla", "Etiqueta pílula", "وسم حبة"), description: row("Rounded tag for a promo or status", "תגית מעוגלת למבצע או סטטוס", "Etiqueta redondeada para oferta o estado", "Etiqueta arredondada para oferta ou status", "وسم دائري لعرض أو حالة") },
  "text-highlight": { label: row("Highlighted sentence", "משפט מודגש", "Frase destacada", "Frase em destaque", "جملة بارزة"), description: row("A large sentence that draws attention", "משפט גדול שמושך תשומת לב", "Una frase grande que atrae la atención", "Uma frase grande que chama atenção", "جملة كبيرة تلفت الانتباه") },
  "text-quote": { label: row("Quote", "ציטוט", "Cita", "Citação", "اقتباس"), description: row("Customer quote or inspirational line", "ציטוט לקוח או משפט השראה", "Cita de cliente o frase inspiradora", "Citação de cliente ou frase inspiradora", "اقتباس عميل أو جملة ملهمة") },
  "text-stat-row": { label: row("Trust numbers", "מספרי אמון", "Números de confianza", "Números de confiança", "أرقام ثقة"), description: row("Three short stats", "שלושה נתונים קצרים", "Tres datos cortos", "Três dados curtos", "ثلاثة أرقام قصيرة") },
  "text-marquee": { label: row("Scrolling text", "טקסט נע", "Texto en movimiento", "Texto em movimento", "نص متحرك"), description: row("Moving promo line", "שורת פרסום נעה", "Línea promocional en movimiento", "Linha promocional em movimento", "سطر إعلان متحرك") },
  "image-basic": { label: row("Image", "תמונה", "Imagen", "Imagem", "صورة"), description: row("Image with a premium frame", "תמונה עם מסגרת פרימיום", "Imagen con marco premium", "Imagem com moldura premium", "صورة بإطار فاخر") },
  "image-rounded": { label: row("Round image", "תמונה עגולה", "Imagen redonda", "Imagem redonda", "صورة دائرية"), description: row("Image for a profile / business owner", "תמונה לפרופיל / בעל עסק", "Imagen de perfil / dueño", "Imagem de perfil / dono", "صورة للملف / صاحب العمل") },
  "image-wide": { label: row("Wide image", "תמונה רחבה", "Imagen ancha", "Imagem larga", "صورة عريضة"), description: row("Wide image for a section header", "תמונה רחבה לראש סקשן", "Imagen ancha para cabecera", "Imagem larga para cabeçalho", "صورة عريضة لرأس القسم") },
  "image-background-card": { label: row("Background image", "תמונת רקע", "Imagen de fondo", "Imagem de fundo", "صورة خلفية"), description: row("Card with background image and text", "כרטיס עם תמונה כרקע וטקסט", "Tarjeta con imagen de fondo y texto", "Cartão com imagem de fundo e texto", "بطاقة بصورة خلفية ونص") },
  "image-before-after": { label: row("Before / after", "לפני / אחרי", "Antes / después", "Antes / depois", "قبل / بعد"), description: row("Compare two images", "השוואת שתי תמונות", "Compara dos imágenes", "Compare duas imagens", "مقارنة صورتين") },
  "image-stack": { label: row("Stacked images", "שתי תמונות מדורגות", "Dos imágenes superpuestas", "Duas imagens sobrepostas", "صورتان متداخلتان"), description: row("Premium image display", "תצוגת תמונות יוקרתית", "Visualización de imágenes premium", "Exibição premium de imagens", "عرض صور فاخر") },
  "button-primary": { label: row("Primary button", "כפתור ראשי", "Botón principal", "Botão principal", "زر رئيسي"), description: row("Main action button", "כפתור פעולה מרכזי", "Botón de acción principal", "Botão de ação principal", "زر الإجراء الرئيسي") },
  "button-secondary": { label: row("Secondary button", "כפתור משני", "Botón secundario", "Botão secundário", "زر ثانوي"), description: row("A calmer button", "כפתור רגוע יותר", "Un botón más suave", "Um botão mais suave", "زر أكثر هدوءاً") },
  "button-double": { label: row("Two buttons", "שני כפתורים", "Dos botones", "Dois botões", "زرّان"), description: row("Two action buttons together", "שני כפתורי פעולה יחד", "Dos botones de acción juntos", "Dois botões de ação juntos", "زرّا إجراء معاً") },
  "button-whatsapp": { label: row("WhatsApp button", "כפתור וואטסאפ", "Botón de WhatsApp", "Botão do WhatsApp", "زر واتساب"), description: row("Quick WhatsApp link", "קישור מהיר לוואטסאפ", "Enlace rápido a WhatsApp", "Link rápido para o WhatsApp", "رابط سريع لواتساب") },
  "button-phone": { label: row("Call button", "כפתור שיחה", "Botón de llamada", "Botão de chamada", "زر اتصال"), description: row("Click-to-call link", "קישור להתקשרות", "Enlace para llamar", "Link para ligar", "رابط للاتصال") },
  "button-floating": { label: row("Floating button", "כפתור צף", "Botón flotante", "Botão flutuante", "زر عائم"), description: row("Floating button at the bottom of the site", "כפתור צף בתחתית האתר", "Botón flotante al pie del sitio", "Botão flutuante no rodapé do site", "زر عائم أسفل الموقع") },
  "strip-light": { label: row("Light section", "סקציה בהירה", "Sección clara", "Seção clara", "قسم فاتح"), description: row("Clean section", "סקציה נקייה", "Sección limpia", "Seção limpa", "قسم نظيف") },
  "strip-soft": { label: row("Soft section", "סקציה רכה", "Sección suave", "Seção suave", "قسم ناعم"), description: row("Section with a soft background and shadow", "סקציה עם רקע רך וצל", "Sección con fondo suave y sombra", "Seção com fundo suave e sombra", "قسم بخلفية ناعمة وظل") },
  "strip-dark": { label: row("Dark section", "סקציה כהה", "Sección oscura", "Seção escura", "قسم داكن"), description: row("Luxury dark section", "סקציה כהה יוקרתית", "Sección oscura de lujo", "Seção escura sofisticada", "قسم داكن فاخر") },
  "strip-background-image": { label: row("Section with background image", "סקציה עם תמונת רקע", "Sección con imagen de fondo", "Seção com imagem de fundo", "قسم بصورة خلفية"), description: row("Section with overlay", "סקציה עם Overlay", "Sección con superposición", "Seção com sobreposição", "قسم مع طبقة تغطية") },
  "strip-split": { label: row("Split section", "סקציה חצויה", "Sección dividida", "Seção dividida", "قسم مقسوم"), description: row("Text on one side and image on the other", "טקסט בצד ותמונה בצד", "Texto a un lado e imagen al otro", "Texto de um lado e imagem do outro", "نص في جانب وصورة في الآخر") },
  "strip-cta": { label: row("Wide CTA", "CTA רחב", "CTA amplio", "CTA amplo", "دعوة عريضة"), description: row("Call-to-action area", "אזור הנעה לפעולה", "Área de llamada a la acción", "Área de chamada para ação", "منطقة دعوة لاتخاذ إجراء") },
  "decor-divider": { label: row("Divider", "קו מפריד", "Separador", "Divisor", "فاصل"), description: row("Subtle transition line", "קו מעבר עדין", "Línea de transición sutil", "Linha de transição sutil", "خط انتقال خفيف") },
  "decor-spacer": { label: row("Spacer", "רווח", "Espacio", "Espaço", "مسافة"), description: row("Vertical space", "רווח אנכי", "Espacio vertical", "Espaço vertical", "مسافة رأسية") },
  "decor-gradient-orb": { label: row("Gradient orb", "עיגול גרדיאנט", "Orbe degradado", "Orbe em degradê", "كرة تدرج"), description: row("Decorative element", "אלמנט דקורטיבי", "Elemento decorativo", "Elemento decorativo", "عنصر زخرفي") },
  "decor-badge": { label: row("Floating badge", "תגית צפה", "Insignia flotante", "Selo flutuante", "شارة عائمة"), description: row("Promo badge", "תגית מבצע", "Insignia de oferta", "Selo de promoção", "شارة عرض") },
  "decor-wave": { label: row("Transition wave", "גל מעבר", "Ola de transición", "Onda de transição", "موجة انتقال"), description: row("Decorative transition between areas", "מעבר דקורטיבי בין אזורים", "Transición decorativa entre zonas", "Transição decorativa entre áreas", "انتقال زخرفي بين المناطق") },
  "box-card": { label: row("Info card", "כרטיס מידע", "Tarjeta de información", "Cartão de informação", "بطاقة معلومات"), description: row("Basic card", "כרטיס בסיסי", "Tarjeta básica", "Cartão básico", "بطاقة أساسية") },
  "box-price": { label: row("Price card", "כרטיס מחיר", "Tarjeta de precio", "Cartão de preço", "بطاقة سعر"), description: row("Service with a price", "שירות עם מחיר", "Servicio con precio", "Serviço com preço", "خدمة مع سعر") },
  "box-feature": { label: row("Benefit card", "כרטיס יתרון", "Tarjeta de ventaja", "Cartão de vantagem", "بطاقة ميزة"), description: row("A benefit that builds trust", "יתרון לבניית אמון", "Una ventaja que genera confianza", "Uma vantagem que gera confiança", "ميزة تبني الثقة") },
  "box-contact": { label: row("Contact card", "כרטיס קשר", "Tarjeta de contacto", "Cartão de contato", "بطاقة تواصل"), description: row("Phone, WhatsApp, and contact details", "טלפון, וואטסאפ ופרטי קשר", "Teléfono, WhatsApp y datos", "Telefone, WhatsApp e dados", "هاتف وواتساب وبيانات") },
  "box-testimonial": { label: row("Review card", "כרטיס ביקורת", "Tarjeta de reseña", "Cartão de avaliação", "بطاقة مراجعة"), description: row("Customer review", "ביקורת לקוח", "Reseña de cliente", "Avaliação de cliente", "مراجعة عميل") },
  "box-team": { label: row("Team card", "כרטיס איש צוות", "Tarjeta de equipo", "Cartão de equipe", "بطاقة فريق"), description: row("Team member profile", "פרופיל איש צוות", "Perfil de miembro del equipo", "Perfil de membro da equipe", "ملف عضو فريق") },
  "gallery-grid": { label: row("Grid gallery", "גלריית גריד", "Galería en cuadrícula", "Galeria em grade", "معرض شبكي"), description: row("Four arranged images", "ארבע תמונות מסודרות", "Cuatro imágenes ordenadas", "Quatro imagens organizadas", "أربع صور مرتبة") },
  "gallery-carousel": { label: row("Image carousel", "קרוסלת תמונות", "Carrusel de imágenes", "Carrossel de imagens", "شريط صور"), description: row("Horizontally scrolling gallery", "גלריה נגללת לרוחב", "Galería de desplazamiento horizontal", "Galeria com rolagem horizontal", "معرض أفقي") },
  "gallery-featured": { label: row("Featured gallery", "גלריה Featured", "Galería destacada", "Galeria em destaque", "معرض مميز"), description: row("One large image beside smaller ones", "תמונה גדולה לצד קטנות", "Una imagen grande junto a otras pequeñas", "Uma imagem grande ao lado de menores", "صورة كبيرة بجانب أصغر") },
  "gallery-masonry": { label: row("Masonry gallery", "גלריית Masonry", "Galería masonry", "Galeria masonry", "معرض متدرج"), description: row("Tall/short gallery", "גלריה גבוהה/נמוכה", "Galería alta/baja", "Galeria alta/baixa", "معرض بارتفاعات مختلفة") },
  "menu-simple": { label: row("Simple menu", "תפריט פשוט", "Menú simple", "Menu simples", "قائمة بسيطة"), description: row("Navigation links", "קישורי ניווט", "Enlaces de navegación", "Links de navegação", "روابط تنقل") },
  "menu-header": { label: row("Full header", "Header מלא", "Encabezado completo", "Cabeçalho completo", "ترويسة كاملة"), description: row("Logo, business name, and menu", "לוגו, שם עסק ותפריט", "Logo, nombre y menú", "Logo, nome e menu", "شعار واسم وقائمة") },
  "menu-footer": { label: row("Footer", "Footer", "Pie de página", "Rodapé", "تذييل"), description: row("Full site footer", "פוטר מלא לאתר", "Pie de página completo", "Rodapé completo do site", "تذييل كامل للموقع") },
  "form-lead": { label: row("Lead form", "טופס ליד", "Formulario de lead", "Formulário de lead", "نموذج عميل محتمل"), description: row("Inquiry form to CRM", "טופס פנייה ל־CRM", "Formulario de consulta al CRM", "Formulário de consulta para o CRM", "نموذج استفسار إلى CRM") },
  "form-newsletter": { label: row("Newsletter", "ניוזלטר", "Boletín", "Newsletter", "نشرة"), description: row("Sign up for updates", "הרשמה לעדכונים", "Registro para novedades", "Inscrição para novidades", "التسجيل للتحديثات") },
  "form-booking-request": { label: row("Appointment request", "בקשת תור", "Solicitud de cita", "Pedido de horário", "طلب موعد"), description: row("Appointment request form", "טופס בקשת תור", "Formulario de solicitud de cita", "Formulário de pedido de horário", "نموذج طلب موعد") },
  "video-youtube": { label: row("YouTube video", "וידאו YouTube", "Video de YouTube", "Vídeo do YouTube", "فيديو يوتيوب"), description: row("Embed a video", "הטמעת סרטון", "Insertar un video", "Incorporar um vídeo", "تضمين فيديو") },
  "video-background": { label: row("Background video", "וידאו רקע", "Video de fondo", "Vídeo de fundo", "فيديو خلفية"), description: row("Section that looks like a background video", "סקשן שנראה כמו וידאו רקע", "Sección con aspecto de video de fondo", "Seção com aparência de vídeo de fundo", "قسم يبدو كفيديو خلفية") },
  "interactive-accordion": { label: row("Expandable questions", "שאלות נפתחות", "Preguntas desplegables", "Perguntas expansíveis", "أسئلة قابلة للفتح"), description: row("FAQ", "FAQ", "FAQ", "FAQ", "أسئلة شائعة") },
  "interactive-tabs": { label: row("Tabs", "Tabs", "Pestañas", "Abas", "تبويبات"), description: row("Tabs for showing content", "טאבים להצגת תוכן", "Pestañas para mostrar contenido", "Abas para mostrar conteúdo", "تبويبات لعرض المحتوى") },
  "interactive-counters": { label: row("Counting numbers", "מספרים עולים", "Números animados", "Números animados", "أرقام متحركة"), description: row("Numbers that build trust", "מספרים ליצירת אמון", "Números que generan confianza", "Números que geram confiança", "أرقام تبني الثقة") },
  "interactive-popup-box": { label: row("Popup / coupon", "פופאפ / קופון", "Popup / cupón", "Popup / cupom", "نافذة / كوبون"), description: row("Message or coupon card", "כרטיס הודעה או קופון", "Tarjeta de mensaje o cupón", "Cartão de mensagem ou cupom", "بطاقة رسالة أو كوبون") },
  "list-checks": { label: row("Benefits list", "רשימת יתרונות", "Lista de ventajas", "Lista de vantagens", "قائمة ميزات"), description: row("List with check marks", "רשימה עם סימוני וי", "Lista con marcas de verificación", "Lista com marcas de verificação", "قائمة بعلامات صح") },
  "list-steps": { label: row("Process steps", "שלבי תהליך", "Pasos del proceso", "Etapas do processo", "خطوات العملية"), description: row("3 clear steps", "3 שלבים ברורים", "3 pasos claros", "3 etapas claras", "3 خطوات واضحة") },
  "list-pricing": { label: row("Price list", "מחירון", "Lista de precios", "Lista de preços", "قائمة أسعار"), description: row("Services and prices list", "רשימת שירותים ומחירים", "Lista de servicios y precios", "Lista de serviços e preços", "قائمة خدمات وأسعار") },
  "embed-map": { label: row("Map", "מפה", "Mapa", "Mapa", "خريطة"), description: row("Google Maps", "Google Maps", "Google Maps", "Google Maps", "خرائط Google") },
  "embed-html": { label: row("Embed HTML", "Embed HTML", "Embed HTML", "Embed HTML", "تضمين HTML"), description: row("Place for external code", "מקום לקוד חיצוני", "Espacio para código externo", "Espaço para código externo", "مكان لكود خارجي") },
  "social-row": { label: row("Social links", "קישורי סושיאל", "Enlaces sociales", "Links sociais", "روابط تواصل"), description: row("Instagram, Facebook, and TikTok", "אינסטגרם, פייסבוק וטיקטוק", "Instagram, Facebook y TikTok", "Instagram, Facebook e TikTok", "إنستغرام وفيسبوك وتيك توك") },
  "social-card": { label: row("Social card", "כרטיס סושיאל", "Tarjeta social", "Cartão social", "بطاقة تواصل"), description: row("Follow on social networks", "מעקב ברשתות", "Seguir en redes", "Seguir nas redes", "متابعة على الشبكات") },
  "social-icons": { label: row("Social icons", "אייקוני סושיאל", "Iconos sociales", "Ícones sociais", "أيقونات تواصل"), description: row("Row of round icons", "שורת אייקונים עגולים", "Fila de iconos redondos", "Linha de ícones redondos", "صف أيقونات دائرية") },
  "payments-box": { label: row("Payment", "תשלום", "Pago", "Pagamento", "دفع"), description: row("Secure payment block", "בלוק תשלום מאובטח", "Bloque de pago seguro", "Bloco de pagamento seguro", "كتلة دفع آمنة") },
  "payments-deposit": { label: row("Appointment deposit", "מקדמה לתור", "Seña de cita", "Sinal de horário", "عربون موعد"), description: row("Collect a deposit before the appointment", "גביית מקדמה לפני תור", "Cobrar seña antes de la cita", "Cobrar sinal antes do horário", "تحصيل عربون قبل الموعد") },
  "payments-pricing-table": { label: row("Package table", "טבלת חבילות", "Tabla de paquetes", "Tabela de pacotes", "جدول باقات"), description: row("3 payment packages", "3 חבילות תשלום", "3 paquetes de pago", "3 pacotes de pagamento", "3 باقات دفع") },
  "store-product-card": { label: row("Product", "מוצר", "Producto", "Produto", "منتج"), description: row("Single product card", "כרטיס מוצר בודד", "Tarjeta de un producto", "Cartão de um produto", "بطاقة منتج واحد") },
  "store-products-grid": { label: row("Products grid", "גריד מוצרים", "Cuadrícula de productos", "Grade de produtos", "شبكة منتجات"), description: row("3 products for purchase", "3 מוצרים לרכישה", "3 productos para comprar", "3 produtos para compra", "3 منتجات للشراء") },
  "store-featured-product": { label: row("Featured product", "מוצר מוביל", "Producto destacado", "Produto em destaque", "منتج مميز"), description: row("One large product", "מוצר אחד גדול", "Un producto grande", "Um produto grande", "منتج واحد كبير") },
  "booking-times": { label: row("Available hours", "שעות פנויות", "Horas disponibles", "Horários disponíveis", "ساعات متاحة"), description: row("Pick an available time", "בחירת שעה פנויה", "Elegir una hora disponible", "Escolher um horário disponível", "اختيار وقت متاح") },
  "booking-dark": { label: row("Dark booking", "תיאום תורים כהה", "Reserva oscura", "Agendamento escuro", "حجز داكن"), description: row("Booking in a dark design", "תיאום תורים בעיצוב כהה", "Reservas con diseño oscuro", "Agendamento com visual escuro", "حجز بتصميم داكن") },
  "booking-calendar-card": { label: row("Calendar card", "כרטיס יומן", "Tarjeta de calendario", "Cartão de agenda", "بطاقة تقويم"), description: row("Professional calendar view", "תצוגת יומן מקצועית", "Vista profesional del calendario", "Visualização profissional da agenda", "عرض تقويم احترافي") },
  "bizuply-services": { label: row("Business services", "שירותים מהעסק", "Servicios del negocio", "Serviços do negócio", "خدمات العمل"), description: row("Later replaced with the business services", "יוחלף בהמשך בשירותי העסק", "Luego se reemplaza por los servicios del negocio", "Depois será trocado pelos serviços do negócio", "يُستبدل لاحقاً بخدمات العمل") },
  "bizuply-booking": { label: row("Book appointments", "תיאום תורים", "Reservar citas", "Agendar horários", "تنسيق مواعيد"), description: row("Smart booking block", "בלוק תורים חכם", "Bloque inteligente de citas", "Bloco inteligente de horários", "كتلة مواعيد ذكية") },
  "bizuply-products": { label: row("Store products", "מוצרים מהחנות", "Productos de la tienda", "Produtos da loja", "منتجات المتجر"), description: row("Later replaced with the business products", "יוחלף במוצרי העסק", "Luego se reemplaza por los productos del negocio", "Depois será trocado pelos produtos do negócio", "يُستبدل بمنتجات العمل") },
  "bizuply-lead-form": { label: row("CRM form", "טופס ל־CRM", "Formulario CRM", "Formulário CRM", "نموذج CRM"), description: row("Every lead enters the system", "כל ליד ייכנס למערכת", "Cada lead entra al sistema", "Cada lead entra no sistema", "كل عميل محتمل يدخل النظام") },
  "bizuply-reviews": { label: row("System reviews", "ביקורות מהמערכת", "Reseñas del sistema", "Avaliações do sistema", "مراجعات النظام"), description: row("Customer reviews", "ביקורות לקוחות", "Reseñas de clientes", "Avaliações de clientes", "مراجعات العملاء") },
  "bizuply-club": { label: row("Customer club", "מועדון לקוחות", "Club de clientes", "Clube de clientes", "نادي العملاء"), description: row("Signup and coupons", "הרשמה וקופונים", "Registro y cupones", "Cadastro e cupons", "تسجيل وكوبونات") },
};

const STUDIO_ITEMS = {
  "text-display-xl": { title: row("Giant heading", "כותרת ענקית", "Título gigante", "Título enorme", "عنوان ضخم"), description: row("Large, bold hero heading", "כותרת Hero גדולה ובולטת", "Titular hero grande y destacado", "Título hero grande e destacado", "عنوان بطل كبير وبارز") },
  "text-heading-lg": { title: row("Main heading", "כותרת ראשית", "Título principal", "Título principal", "عنوان رئيسي"), description: row("Professional H1 heading", "כותרת H1 מקצועית", "Título H1 profesional", "Título H1 profissional", "عنوان H1 احترافي") },
  "text-heading-gradient": { title: row("Color-mix heading", "כותרת מיקס צבעים", "Título degradado", "Título em degradê", "عنوان متدرج"), description: row("Colorful gradient text", "Gradient צבעוני לטקסט", "Texto degradado de color", "Texto em degradê colorido", "نص متدرج الألوان") },
  "text-subtitle": { title: row("Subtitle", "כותרת משנה", "Subtítulo", "Subtítulo", "عنوان فرعي"), description: row("Medium heading for sections", "כותרת בינונית לסקשנים", "Título medio para secciones", "Título médio para seções", "عنوان متوسط للأقسام") },
  "button-outline": { title: row("Outline button", "כפתור מסגרת", "Botón con borde", "Botão com borda", "زر بإطار"), description: row("Clean button with a border", "כפתור נקי עם מסגרת", "Botón limpio con borde", "Botão limpo com borda", "زر نظيف بإطار") },
  "button-gradient": { title: row("Gradient button", "כפתור Gradient", "Botón degradado", "Botão em degradê", "زر متدرج"), description: row("Button with a color mix", "כפתור עם מיקס צבעים", "Botón con mezcla de color", "Botão com mistura de cores", "زر بمزيج ألوان") },
  "button-icon": { title: row("Button with arrow", "כפתור עם חץ", "Botón con flecha", "Botão com seta", "زر بسهم"), description: row("Text and icon in one layer", "טקסט ואייקון בשכבה אחת", "Texto e icono en una capa", "Texto e ícone em uma camada", "نص وأيقونة في طبقة واحدة") },
  "shape-card": { title: row("White card", "כרטיס לבן", "Tarjeta blanca", "Cartão branco", "بطاقة بيضاء"), description: row("Box with shadow and corners", "קופסה עם צל ופינות", "Caja con sombra y esquinas", "Caixa com sombra e cantos", "صندوق بظل وزوايا") },
  "shape-gradient": { title: row("Gradient box", "קופסת Gradient", "Caja degradada", "Caixa em degradê", "صندوق متدرج"), description: row("Colorful background for layers", "רקע צבעוני לשכבות", "Fondo de color para capas", "Fundo colorido para camadas", "خلفية ملونة للطبقات") },
  "shape-circle": { title: row("Circle", "עיגול", "Círculo", "Círculo", "دائرة"), description: row("Colorful round shape", "צורה עגולה צבעונית", "Forma redonda de color", "Forma redonda colorida", "شكل دائري ملون") },
  "image-caption": { title: row("Image with caption", "תמונה עם כיתוב", "Imagen con texto", "Imagem com legenda", "صورة مع تعليق"), description: row("Image and a title on top", "תמונה וכותרת בשכבה מעליה", "Imagen y título encima", "Imagem e título por cima", "صورة وعنوان فوقها") },
  "video-standard": { title: row("Video", "סרטון", "Video", "Vídeo", "فيديو"), description: row("Replaceable autoplay video", "סרטון אוטומטי שניתן להחלפה", "Video automático reemplazable", "Vídeo automático substituível", "فيديو تلقائي قابل للاستبدال") },
  "video-overlay": { title: row("Video with text", "וידאו עם טקסט", "Video con texto", "Vídeo com texto", "فيديو مع نص"), description: row("Caption and button over the video", "כיתוב וכפתור מעל הסרטון", "Texto y botón sobre el video", "Legenda e botão sobre o vídeo", "تعليق وزر فوق الفيديو") },
  "graphic-badge": { title: row("Badge", "תגית", "Insignia", "Selo", "شارة"), description: row("Badge with icon and text", "Badge עם אייקון וטקסט", "Insignia con icono y texto", "Selo com ícone e texto", "شارة بأيقونة ونص") },
  "graphic-rating": { title: row("Star rating", "דירוג כוכבים", "Valoración de estrellas", "Avaliação em estrelas", "تقييم نجوم"), description: row("Five stars and a recommendation", "חמישה כוכבים והמלצה", "Cinco estrellas y una recomendación", "Cinco estrelas e uma recomendação", "خمس نجوم وتوصية") },
  "form-contact": { title: row("Contact form", "טופס יצירת קשר", "Formulario de contacto", "Formulário de contato", "نموذج تواصل"), description: row("Name, phone, and send button", "שם, טלפון וכפתור שליחה", "Nombre, teléfono y botón enviar", "Nome, telefone e botão enviar", "اسم وهاتف وزر إرسال") },
  "button-dark-pill": { title: row("Dark rounded button", "כפתור כהה מעוגל", "Botón oscuro redondeado", "Botão escuro arredondado", "زر داكن دائري"), description: row("Elegant dark CTA", "CTA כהה ואלגנטי", "CTA oscuro y elegante", "CTA escuro e elegante", "دعوة داكنة أنيقة") },
  "button-soft-rose": { title: row("Soft pink button", "כפתור ורוד רך", "Botón rosa suave", "Botão rosa suave", "زر وردي ناعم"), description: row("Gentle pink accent", "הדגשה עדינה בגוון ורוד", "Acento rosa suave", "Destaque rosa suave", "تمييز وردي لطيف") },
  "button-glass": { title: row("Glass button", "כפתור זכוכית", "Botón de cristal", "Botão de vidro", "زر زجاجي"), description: row("Transparent with a light border", "שקוף עם מסגרת בהירה", "Transparente con borde claro", "Transparente com borda clara", "شفاف بإطار فاتح") },
  "social-floating-round": { title: row("Floating round social", "סושיאל צף עגול", "Social flotante redondo", "Social flutuante redondo", "تواصل عائم دائري"), description: row("Round icons floating on the side", "אייקונים עגולים צפים בצד", "Iconos redondos flotando al lado", "Ícones redondos flutuando ao lado", "أيقونات دائرية عائمة على الجانب") },
  "social-bar-inline": { title: row("Social row", "שורת סושיאל", "Fila social", "Linha social", "صف تواصل"), description: row("Horizontal row of icons", "שורה אופקית של אייקונים", "Fila horizontal de iconos", "Linha horizontal de ícones", "صف أفقي من الأيقونات") },
};

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

function pickNested(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([id, fields]) => [
      id,
      Object.fromEntries(
        Object.entries(fields).map(([field, value]) => [field, value[locale] || value.en])
      ),
    ])
  );
}

const PRICING_SHARED = {
  choosePurchase: row("Choose purchase", "לבחירת רכישה", "Elegir compra", "Escolher compra", "اختيار الشراء"),
  categories: {
    all: row("All", "הכול", "Todo", "Tudo", "الكل"),
    setup: row("Setup & implementation", "הקמה והטמעה", "Puesta en marcha e implementación", "Implantação e implementação", "إعداد وتطبيق"),
    growth: row("Marketing & growth", "שיווק וצמיחה", "Marketing y crecimiento", "Marketing e crescimento", "تسويق ونمو"),
    agents: row("Agents & human service", "נציגים ושירות אנושי", "Agentes y servicio humano", "Agentes e atendimento humano", "مندوبون وخدمة بشرية"),
    support: row("Monthly support", "תמיכה חודשית", "Soporte mensual", "Suporte mensal", "دعم شهري"),
  },
  websiteAddon: {
    label: row("₪550 one-time — self-serve website as a business-plan add-on", "550₪ חד־פעמי — בניית אתר עצמאי כתוספת לחבילה העסקית", "₪550 único — sitio de autoservicio como extra del plan", "₪550 único — site self-serve como extra do plano", "₪550 لمرة واحدة — موقع ذاتي كإضافة للخطة"),
    hint: row("One-time payment, no auto-renewal · templates and visual editor, linked to CRM — includes free domain for 1 year", "תשלום חד־פעמי, ללא חידוש אוטומטי · תבניות ועורך ויזואלי, מקושר ל-CRM — כולל דומיין חינם לשנה", "Pago único, sin renovación automática · plantillas y editor visual, vinculado al CRM — dominio gratis 1 año", "Pagamento único, sem renovação automática · modelos e editor visual, ligado ao CRM — domínio grátis por 1 ano", "دفعة واحدة دون تجديد تلقائي · قوالب ومحرر مرئي مرتبط بـ CRM — نطاق مجاني لسنة"),
  },
};

const PARTNERSHIP_AGREEMENT = {
  badge: row("Collaboration", "שיתוף פעולה", "Colaboración", "Colaboração", "تعاون"),
  title: row("Partnership agreement", "הסכם שיתוף פעולה", "Acuerdo de colaboración", "Acordo de parceria", "اتفاقية شراكة"),
  subtitle: row("Review the agreement details and sign digitally.", "בדוק את פרטי ההסכם וחתום עליו דיגיטלית.", "Revisa los detalles y firma digitalmente.", "Revise os detalhes e assine digitalmente.", "راجع التفاصيل ووقّع رقمياً."),
  youSigned: row("You signed", "חתמת", "Firmaste", "Você assinou", "وقّعت"),
  details: row("Agreement details", "פרטי ההסכם", "Detalles del acuerdo", "Detalhes do acordo", "تفاصيل الاتفاقية"),
  agreementId: row("Agreement ID: {{id}}", "מזהה הסכם: {{id}}", "ID del acuerdo: {{id}}", "ID do acordo: {{id}}", "معرّف الاتفاقية: {{id}}"),
  fromBusiness: row("From business", "מעסק", "Desde el negocio", "Do negócio", "من العمل"),
  toBusiness: row("To business", "לעסק", "Hacia el negocio", "Para o negócio", "إلى العمل"),
  contactName: row("Contact person", "איש קשר", "Persona de contacto", "Pessoa de contato", "جهة اتصال"),
  phone: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"),
  collabType: row("Collaboration type", "סוג שיתוף פעולה", "Tipo de colaboración", "Tipo de colaboração", "نوع التعاون"),
  payment: row("Payment / commission", "תשלום / עמלה", "Pago / comisión", "Pagamento / comissão", "دفع / عمولة"),
  amount: row("Amount", "סכום", "Importe", "Valor", "المبلغ"),
  period: row("Agreement period", "תקופת ההסכם", "Periodo del acuerdo", "Período do acordo", "مدة الاتفاقية"),
  cancelAnytime: row("Can be cancelled anytime", "ניתן לביטול בכל זמן", "Se puede cancelar en cualquier momento", "Pode ser cancelado a qualquer momento", "يمكن الإلغاء في أي وقت"),
  confidentiality: row("Confidentiality clause", "סעיף סודיות", "Cláusula de confidencialidad", "Cláusula de confidencialidade", "بند السرية"),
  description: row("Description", "תיאור", "Descripción", "Descrição", "الوصف"),
  giving: row("What you provide", "מה אתה מספק", "Lo que aportas", "O que você oferece", "ما تقدمه"),
  receiving: row("What you receive", "מה אתה מקבל", "Lo que recibes", "O que você recebe", "ما تتلقاه"),
  signatures: row("Signatures", "חתימות", "Firmas", "Assinaturas", "التوقيعات"),
  sender: row("Agreement sender", "שולח ההסכם", "Remitente del acuerdo", "Remetente do acordo", "مرسل الاتفاقية"),
  receiver: row("Agreement recipient", "מקבל ההסכם", "Destinatario del acuerdo", "Destinatário do acordo", "مستلم الاتفاقية"),
  signingAs: row("You are signing as", "אתה חותם בתור", "Firmas como", "Você assina como", "أنت توقّع بصفة"),
  preparingPdf: row("Preparing PDF...", "מכין PDF...", "Preparando PDF...", "Preparando PDF...", "جارٍ إعداد PDF..."),
  downloadPdf: row("Download PDF", "הורד PDF", "Descargar PDF", "Baixar PDF", "تنزيل PDF"),
  signCta: row("Sign the agreement", "חתום על ההסכם", "Firmar el acuerdo", "Assinar o acordo", "توقيع الاتفاقية"),
  alreadySigned: row("You already signed this agreement.", "כבר חתמת על ההסכם הזה.", "Ya firmaste este acuerdo.", "Você já assinou este acordo.", "لقد وقّعت هذه الاتفاقية بالفعل."),
  addSignature: row("Add a signature", "הוסף חתימה", "Añadir firma", "Adicionar assinatura", "إضافة توقيع"),
  drawHint: row("Draw your signature below and then save it.", "צייר את החתימה שלך למטה ולאחר מכן שמור אותה.", "Dibuja tu firma abajo y luego guárdala.", "Desenhe sua assinatura abaixo e salve.", "ارسم توقيعك أدناه ثم احفظه."),
  loadingPad: row("Loading signature pad...", "טוען משטח חתימה...", "Cargando el área de firma...", "Carregando a área de assinatura...", "جارٍ تحميل لوحة التوقيع..."),
  clear: row("Clear", "נקה", "Borrar", "Limpar", "مسح"),
  saving: row("Saving...", "שומר...", "Guardando...", "Salvando...", "جارٍ الحفظ..."),
  saveSignature: row("Save signature", "שמור חתימה", "Guardar firma", "Salvar assinatura", "حفظ التوقيع"),
  notSignedYet: row("Not signed yet", "טרם נחתם", "Aún no firmado", "Ainda não assinado", "لم يُوقَّع بعد"),
  signatureAlt: row("Signature of {{title}}", "חתימת {{title}}", "Firma de {{title}}", "Assinatura de {{title}}", "توقيع {{title}}"),
  noSignature: row("No signature yet", "עדיין אין חתימה", "Todavía no hay firma", "Ainda sem assinatura", "لا يوجد توقيع بعد"),
  signedOn: row("Signed on: {{date}}", "נחתם בתאריך: {{date}}", "Firmado el: {{date}}", "Assinado em: {{date}}", "وُقّع في: {{date}}"),
  loading: row("Loading the agreement...", "טוען את ההסכם...", "Cargando el acuerdo...", "Carregando o acordo...", "جارٍ تحميل الاتفاقية..."),
  status: {
    approved: row("Approved", "מאושר", "Aprobado", "Aprovado", "موافق عليه"),
    pending: row("Pending approval", "ממתין לאישור", "Pendiente de aprobación", "Aguardando aprovação", "بانتظار الموافقة"),
    rejected: row("Rejected", "נדחה", "Rechazado", "Recusado", "مرفوض"),
    signed: row("Signed", "נחתם", "Firmado", "Assinado", "موقَّع"),
    draft: row("Draft", "טיוטה", "Borrador", "Rascunho", "مسودة"),
  },
  type: {
    twoSided: row("Two-sided", "דו־צדדי", "Bilateral", "Bilateral", "ثنائي الجانب"),
    oneSided: row("One-sided", "חד־צדדי", "Unilateral", "Unilateral", "أحادي الجانب"),
  },
  errors: {
    missingId: row("Agreement ID is missing", "חסר מזהה הסכם", "Falta el ID del acuerdo", "Falta o ID do acordo", "معرّف الاتفاقية مفقود"),
    load: row("Could not load the agreement", "שגיאה בטעינת ההסכם", "No se pudo cargar el acuerdo", "Não foi possível carregar o acordo", "تعذّر تحميل الاتفاقية"),
    noPermission: row("You do not have permission to sign this agreement", "אין לך הרשאה לחתום על ההסכם הזה", "No tienes permiso para firmar este acuerdo", "Você não tem permissão para assinar este acordo", "ليست لديك صلاحية لتوقيع هذه الاتفاقية"),
    signFirst: row("Please sign before saving", "יש לחתום לפני השמירה", "Firma antes de guardar", "Assine antes de salvar", "يرجى التوقيع قبل الحفظ"),
    saveSignature: row("Could not save the signature", "שגיאה בשמירת החתימה", "No se pudo guardar la firma", "Não foi possível salvar a assinatura", "تعذّر حفظ التوقيع"),
    contentMissing: row("Agreement content was not found", "תוכן ההסכם לא נמצא", "No se encontró el contenido del acuerdo", "O conteúdo do acordo não foi encontrado", "لم يتم العثور على محتوى الاتفاقية"),
    pdf: row("Could not download the PDF", "שגיאה בהורדת PDF", "No se pudo descargar el PDF", "Não foi possível baixar o PDF", "تعذّر تنزيل PDF"),
    notFound: row("Agreement not found", "ההסכם לא נמצא", "Acuerdo no encontrado", "Acordo não encontrado", "الاتفاقية غير موجودة"),
    proposalMissing: row("Proposal data is missing", "נתוני ההצעה חסרים", "Faltan los datos de la propuesta", "Faltam os dados da proposta", "بيانات العرض مفقودة"),
  },
};

function localeObject(locale) {
  return {
    partnershipAgreement: Object.fromEntries(
      Object.entries(PARTNERSHIP_AGREEMENT).map(([key, value]) => {
        if (value.en) return [key, value[locale] || value.en];
        return [key, pickLocaleMap(value, locale)];
      })
    ),
    business: { categoryNames: categoryNamesCatalog(locale) },
    pricing: {
      choosePurchase: PRICING_SHARED.choosePurchase[locale],
      categories: pickLocaleMap(PRICING_SHARED.categories, locale),
      websiteAddon: pickLocaleMap(PRICING_SHARED.websiteAddon, locale),
    },
    studio: {
      kindHint: pickLocaleMap(KIND_HINTS, locale),
      library: {
        categories: pickLocaleMap(STUDIO_CATEGORIES, locale),
        elements: pickNested(STUDIO_ELEMENTS, locale),
        items: pickNested(STUDIO_ITEMS, locale),
      },
      readyTemplates: {
        apply: {
          en: "Apply ready website",
          he: "החל אתר מוכן",
          es: "Aplicar sitio listo",
          "pt-BR": "Aplicar site pronto",
          ar: "تطبيق موقع جاهز",
        }[locale],
        category: {
          en: "Category",
          he: "קטגוריה",
          es: "Categoría",
          "pt-BR": "Categoria",
          ar: "الفئة",
        }[locale],
        layout: {
          en: "Layout",
          he: "מבנה",
          es: "Estructura",
          "pt-BR": "Estrutura",
          ar: "الهيكل",
        }[locale],
        blockCount: {
          en: "{{count}} blocks",
          he: "{{count}} בלוקים",
          es: "{{count}} bloques",
          "pt-BR": "{{count}} blocos",
          ar: "{{count}} كتل",
        }[locale],
      },
    },
  };
}

for (const locale of LOCALES) {
  const file = path.join(ROOT, "src/i18n/locales", `${locale}.json`);
  const current = JSON.parse(fs.readFileSync(file, "utf8"));
  const beforePartner = current?.partner?.register?.title;
  const merged = [
    localeObject(locale),
    extraLocaleObject(locale),
    extraPanelsLocaleObject(locale),
    extraAiHelpStudioLocaleObject(locale),
    extraChromeELocaleObject(locale),
    extraPartnerBillingLocaleObject(locale),
    extraAutomationsRestLocaleObject(locale),
    extraStudioRestLocaleObject(locale),
    extraBusinessRestLocaleObject(locale),
    extraBusinessLeftoverLocaleObject(locale),
    extraTemplateMetaLocaleObject(locale),
    extraPublicWidgetsLocaleObject(locale),
    extraGrapesChromeLocaleObject(locale),
    extraFinalChromeLocaleObject(locale),
    extraStudioLeftoverLocaleObject(locale),
  ].reduce((acc, patch) => deepMerge(acc, patch), current);
  const afterPartner = merged?.partner?.register?.title;
  if (beforePartner && beforePartner !== afterPartner) {
    throw new Error(`Refusing to write ${locale}.json — partner.register.title changed`);
  }
  if (!afterPartner) {
    throw new Error(`Refusing to write ${locale}.json — partner.register.title missing`);
  }
  fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
  console.log(`merged ${locale}.json (partner.register.title ok)`);
}
