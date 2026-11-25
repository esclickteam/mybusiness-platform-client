import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import { PRICING_PAGE_PACKAGES } from "../../data/pricingPackagesData";
import "./livingHome.css";

const MEDIA = "/demo-media/home/screens";
const GUIDES = ["what-is-a-crm", "meta-lead-ads-to-crm", "whatsapp-cloud-api-cost"];

type Pack = {
  crmT: string; crmD: string; crmA: string;
  waT: string; waD: string; waA: string;
  autoT: string; autoD: string; autoA: string;
  metaT: string; metaD: string; metaA: string;
  calT: string; calD: string; calA: string;
  siteT: string; siteD: string; siteA: string;
  aiT: string; aiD: string; aiA: string;
  biziT: string; biziD: string; biziA: string;
  stackT: string; stackD: string;
  solT: string; solD: string;
  journeyT: string; journeyD: string;
  pathT: string; pathD: string;
  integT: string;
  benefitT: string;
  priceT: string; priceD: string;
  partnerT: string; partnerD: string; partnerA: string;
  knowT: string; knowD: string; knowA: string;
  faqT: string; faqA: string;
  endT: string; endD: string; start: string; demo: string;
  sample: string;
  sols: [string, string][];
  steps: string[];
  self: string[];
  guided: string[];
  benefits: [string, string][];
};

const EN: Pack = {
  crmT: "Every lead is an opportunity. Don’t miss it.",
  crmD: "Keep leads and customers in one place, follow the sales stages, and see the next action.",
  crmA: "Explore the CRM",
  waT: "Every conversation is an opportunity. Every customer matters.",
  waD: "Run WhatsApp Business from the same workspace, with approved templates and a link to the next step.",
  waA: "Explore WhatsApp Business",
  autoT: "Less manual work. More time to grow.",
  autoD: "Connect business steps and turn repeated actions into one workflow.",
  autoA: "Explore automations",
  metaT: "From the first click to the next opportunity.",
  metaD: "Connect advertising to customer management and follow campaigns and the leads that come in.",
  metaA: "Explore the marketing tools",
  calT: "Fewer back-and-forths. More time for the business.",
  calD: "Manage meetings, services and availability in one calendar.",
  calA: "Explore meetings",
  siteT: "A good-looking site is only the start. Connect it to the business.",
  siteD: "Build a site with the visual editor and templates. A form on that site can be received in the CRM.",
  siteA: "Explore the website builder",
  aiT: "Artificial intelligence. Inside the working day.",
  aiD: "The business plan includes the business advisor and AI automations, alongside tasks and records.",
  aiA: "Explore the AI tools",
  biziT: "Meet Bizi. Your business advisor.",
  biziD: "Not sure which published package fits? Bizi uses the existing Bizuply chat, the approved catalog, and can save an enquiry only with consent.",
  biziA: "Let’s talk",
  stackT: "Everything the business needs. In the right place.",
  stackD: "Open a product layer. Each one keeps its own screen and its own page.",
  solT: "The business is specific. The workspace should be too.",
  solD: "Choose a type of business and see the part of Bizuply that matches the daily work.",
  journeyT: "From the first moment. All the way through.",
  journeyD: "A lead can arrive from Meta Lead Ads, a Google Ads lead form, or a form on a Bizuply site. The next steps stay in the CRM.",
  pathT: "Your way. Your pace.",
  pathD: "Start on your own, or talk to the team. Both paths use the pages that already exist.",
  integT: "The connections that already exist.",
  benefitT: "More order. More control. More room to grow.",
  priceT: "The right fit. At the published price.",
  priceD: "These are the packages and prices already published. Nothing here is discounted or added.",
  partnerT: "Grow better together.",
  partnerD: "The partner program stays on the terms already published.",
  partnerA: "Partner program",
  knowT: "Knowledge that helps the business move.",
  knowD: "These are published guides. No new articles were invented for this page.",
  knowA: "All guides",
  faqT: "What people ask before they start.",
  faqA: "Didn’t find an answer? Ask Bizi",
  endT: "It’s time to connect the whole business.",
  endD: "Customers, marketing, conversations and workflows — on one platform.",
  start: "Start for free",
  demo: "Schedule a personal demo",
  sample: "Sample",
  sols: [
    ["Small businesses", "Leads, tasks and conversations in one place."],
    ["Service providers", "Customers, meetings and the day’s work."],
    ["Marketing agencies", "Campaigns, incoming leads and the next step."],
    ["Growing teams", "Shared records, tasks and workflows."],
  ],
  steps: ["Enquiry", "Lead", "CRM", "Conversation", "Follow-up", "Meeting", "Progress"],
  self: ["Choose a published package", "Create an account", "Work in the product"],
  guided: ["Contact the team", "Schedule a demo", "Continue with the existing setup conversation"],
  benefits: [
    ["Order", "Records stay on one customer."],
    ["Control", "The next action is visible."],
    ["Growth", "A lead can move through the stages you already use."],
  ],
};

const HE: Pack = {
  ...EN,
  crmT: "כל ליד הוא הזדמנות. אל תפספסו אותה.",
  crmD: "נהלו את הלידים והלקוחות במקום אחד, עקבו אחר שלבי המכירה ודעו מה הפעולה הבאה.",
  crmA: "גלו את מערכת ה־CRM",
  waT: "כל שיחה היא הזדמנות. כל לקוח חשוב.",
  waD: "נהלו שיחות WhatsApp Business מתוך סביבת העבודה, עם תבניות מאושרות וחיבור להמשך הטיפול.",
  waA: "גלו את WhatsApp Business",
  autoT: "פחות עבודה ידנית. יותר זמן לצמוח.",
  autoD: "חברו בין תהליכים עסקיים והפכו פעולות שחוזרות על עצמן לתהליך אחד.",
  autoA: "גלו את האוטומציות",
  metaT: "מהקליק הראשון ועד ההזדמנות הבאה.",
  metaD: "חברו את פעילות הפרסום לניהול הלקוחות ועקבו אחר הקמפיינים והלידים שנכנסים.",
  metaA: "גלו את כלי השיווק",
  calT: "פחות תיאומים. יותר זמן לעסק.",
  calD: "נהלו פגישות, שירותים וזמינות ביומן אחד.",
  calA: "גלו את מערכת הפגישות",
  siteT: "אתר יפה הוא רק ההתחלה. חברו אותו לעסק.",
  siteD: "צרו אתר בעורך החזותי ובתבניות. טופס באתר יכול להיקלט ב־CRM.",
  siteA: "גלו את מערכת בניית האתרים",
  aiT: "בינה מלאכותית. בתוך יום העבודה.",
  aiD: "בחבילה העסקית קיימים היועץ העסקי ואוטומציות AI, לצד משימות ותיעוד.",
  aiA: "גלו את כלי ה־AI",
  biziT: "תכירו את Bizi. היועצת העסקית החכמה שלכם.",
  biziD: "לא בטוחים איזו חבילה מפורסמת מתאימה? Bizi משתמשת בצ'אט הקיים, בקטלוג המאושר, ושומרת פנייה רק בהסכמה.",
  biziA: "בואו להתייעץ איתי",
  stackT: "כל מה שהעסק צריך. בדיוק במקום הנכון.",
  stackD: "פתחו שכבת מוצר. לכל שכבה יש מסך משלה ועמוד משלה.",
  solT: "העסק שלכם ייחודי. גם סביבת העבודה שלו צריכה להיות.",
  solD: "בחרו סוג עסק וראו את החלק ב־Bizuply שמתאים לעבודה היומית.",
  journeyT: "מהרגע הראשון. כל הדרך.",
  journeyD: "ליד יכול להגיע ממודעות לידים של Meta, מטופס לידים של Google Ads, או מטופס באתר שנבנה ב־Bizuply. ההמשך נשאר ב־CRM.",
  pathT: "בדרך שלכם. בקצב שלכם.",
  pathD: "מתחילים לבד, או מדברים עם הצוות. שני המסלולים משתמשים בעמודים שכבר קיימים.",
  integT: "החיבורים שכבר קיימים.",
  benefitT: "יותר סדר. יותר שליטה. יותר מקום לצמוח.",
  priceT: "הפתרון הנכון. במחיר שמתאים לעסק.",
  priceD: "אלה החבילות והמחירים שכבר מפורסמים. לא נוספה כאן הנחה ולא נוסף מחיר.",
  partnerT: "צומחים טוב יותר ביחד.",
  partnerD: "תוכנית השותפים נשארת לפי התנאים שכבר מפורסמים.",
  partnerA: "לתוכנית השותפים",
  knowT: "ידע שעוזר לעסק להתקדם.",
  knowD: "אלה מדריכים שכבר פורסמו. לא הומצאו כאן כתבות חדשות.",
  knowA: "לכל המדריכים",
  faqT: "כל מה שרציתם לדעת.",
  faqA: "לא מצאתם תשובה? שאלו את Bizi",
  endT: "הגיע הזמן לחבר את כל העסק שלכם.",
  endD: "כלים לניהול לקוחות, שיווק, תקשורת ותהליכי עבודה — בפלטפורמה אחת.",
  start: "התחילו בחינם",
  demo: "קבעו הדגמה אישית",
  sample: "דוגמה",
  sols: [
    ["עסקים קטנים", "לידים, משימות ושיחות במקום אחד."],
    ["נותני שירות", "לקוחות, פגישות וסדר היום."],
    ["סוכנויות שיווק", "קמפיינים, לידים שנכנסים והפעולה הבאה."],
    ["צוותים בצמיחה", "רשומות, משימות ותהליכים משותפים."],
  ],
  steps: ["פנייה", "ליד", "CRM", "שיחה", "המשך טיפול", "פגישה", "מעקב"],
  self: ["בוחרים חבילה מפורסמת", "פותחים חשבון", "עובדים בתוך המוצר"],
  guided: ["פונים לצוות", "קובעים הדגמה", "ממשיכים בשיחת ההקמה הקיימת"],
  benefits: [
    ["סדר", "המידע נשאר על אותו לקוח."],
    ["שליטה", "הפעולה הבאה גלויה."],
    ["צמיחה", "ליד יכול לעבור בין השלבים שכבר קיימים במערכת."],
  ],
};

const ES: Pack = { ...EN,
  crmT: "Cada prospecto es una oportunidad.",
  crmD: "Lleven prospectos y clientes en un solo lugar y vean la siguiente acción.",
  crmA: "Ver el CRM",
  waT: "Cada conversación es una oportunidad.",
  waD: "Gestionen WhatsApp Business desde el mismo espacio de trabajo.",
  waA: "Ver WhatsApp Business",
  autoT: "Menos trabajo manual. Más tiempo para crecer.",
  autoD: "Conecten pasos del negocio y conviertan lo repetido en un flujo.",
  autoA: "Ver automatizaciones",
  metaT: "Del primer clic a la siguiente oportunidad.",
  metaD: "Conecten la publicidad con la gestión de clientes.",
  metaA: "Ver las herramientas de marketing",
  calT: "Menos idas y vueltas. Más tiempo para el negocio.",
  calD: "Gestionen reuniones, servicios y disponibilidad en un calendario.",
  calA: "Ver las reuniones",
  siteT: "Un sitio atractivo es solo el comienzo.",
  siteD: "Creen un sitio con el editor visual. Un formulario puede llegar al CRM.",
  siteA: "Ver el creador de sitios",
  aiT: "Inteligencia artificial. Dentro de la jornada.",
  aiD: "El plan de negocio incluye el asesor y las automatizaciones de IA, junto con tareas y registros.",
  aiA: "Ver las herramientas de IA",
  biziT: "Conozcan a Bizi. Su asesora de negocio.",
  biziD: "Bizi usa el chat existente, el catálogo aprobado, y guarda una consulta solo con consentimiento.",
  biziA: "Hablemos",
  stackT: "Todo lo que el negocio necesita.",
  stackD: "Abran una capa de producto. Cada una tiene su pantalla y su página.",
  solT: "El negocio es específico. El espacio de trabajo también.",
  solD: "Elijan un tipo de negocio y vean la parte de Bizuply que encaja.",
  journeyT: "Desde el primer momento.",
  journeyD: "Un prospecto puede llegar desde Meta Lead Ads, un formulario de Google Ads o un formulario de un sitio Bizuply.",
  pathT: "A su manera. A su ritmo.",
  pathD: "Empiecen solos o hablen con el equipo. Los dos caminos usan páginas que ya existen.",
  integT: "Las conexiones que ya existen.",
  benefitT: "Más orden. Más control. Más espacio para crecer.",
  priceT: "La opción adecuada. Al precio publicado.",
  priceD: "Estos son los paquetes y precios ya publicados.",
  partnerT: "Crecer mejor juntos.",
  partnerD: "El programa de socios se mantiene en las condiciones ya publicadas.",
  partnerA: "Programa de socios",
  knowT: "Conocimiento que ayuda al negocio.",
  knowD: "Estas son guías ya publicadas.",
  knowA: "Todas las guías",
  faqT: "Lo que suelen preguntar antes de empezar.",
  faqA: "¿No está la respuesta? Pregunten a Bizi",
  endT: "Es hora de conectar todo el negocio.",
  endD: "Clientes, marketing, conversaciones y flujos en una plataforma.",
  start: "Empiecen gratis",
  demo: "Agenden una demostración",
  sample: "Ejemplo",
  sols: EN.sols,
  steps: ["Consulta", "Prospecto", "CRM", "Conversación", "Seguimiento", "Reunión", "Avance"],
  self: ["Elegir un paquete publicado", "Crear una cuenta", "Trabajar en el producto"],
  guided: ["Contactar al equipo", "Agendar una demostración", "Seguir con la conversación de puesta en marcha"],
  benefits: [["Orden", "Los datos quedan en el mismo cliente."], ["Control", "La siguiente acción está a la vista."], ["Crecimiento", "Un prospecto puede avanzar por las etapas que ya existen."]],
};

const PT: Pack = { ...EN,
  crmT: "Cada lead é uma oportunidade.",
  crmD: "Mantenham leads e clientes em um só lugar e vejam a próxima ação.",
  crmA: "Ver o CRM",
  waT: "Cada conversa é uma oportunidade.",
  waD: "Conduzam o WhatsApp Business no mesmo espaço de trabalho.",
  waA: "Ver o WhatsApp Business",
  autoT: "Menos trabalho manual. Mais tempo para crescer.",
  autoD: "Liguem etapas do negócio e transformem o que se repete em um fluxo.",
  autoA: "Ver automações",
  metaT: "Do primeiro clique à próxima oportunidade.",
  metaD: "Liguem a publicidade à gestão de clientes.",
  metaA: "Ver as ferramentas de marketing",
  calT: "Menos idas e vindas. Mais tempo para o negócio.",
  calD: "Gerenciem reuniões, serviços e disponibilidade em um calendário.",
  calA: "Ver as reuniões",
  siteT: "Um site bonito é só o começo.",
  siteD: "Criem um site no editor visual. Um formulário pode chegar ao CRM.",
  siteA: "Ver o construtor de sites",
  aiT: "Inteligência artificial. Dentro do dia de trabalho.",
  aiD: "O plano de negócios inclui o consultor e as automações de IA, junto com tarefas e registros.",
  aiA: "Ver as ferramentas de IA",
  biziT: "Conheçam a Bizi. A consultora do negócio.",
  biziD: "A Bizi usa o chat existente, o catálogo aprovado, e salva um contato só com consentimento.",
  biziA: "Vamos conversar",
  stackT: "Tudo o que o negócio precisa.",
  stackD: "Abram uma camada de produto. Cada uma tem a própria tela e a própria página.",
  solT: "O negócio é específico. O espaço de trabalho também.",
  solD: "Escolham um tipo de negócio e vejam a parte da Bizuply que combina.",
  journeyT: "Desde o primeiro momento.",
  journeyD: "Um lead pode chegar de anúncios de lead da Meta, de um formulário do Google Ads ou de um formulário em um site Bizuply.",
  pathT: "Do jeito de vocês. No ritmo de vocês.",
  pathD: "Comecem sozinhos ou falem com a equipe. Os dois caminhos usam páginas que já existem.",
  integT: "As conexões que já existem.",
  benefitT: "Mais ordem. Mais controle. Mais espaço para crescer.",
  priceT: "A opção certa. No preço publicado.",
  priceD: "Estes são os pacotes e preços já publicados.",
  partnerT: "Crescer melhor juntos.",
  partnerD: "O programa de parceiros permanece nas condições já publicadas.",
  partnerA: "Programa de parceiros",
  knowT: "Conhecimento que ajuda o negócio.",
  knowD: "Estes são guias já publicados.",
  knowA: "Todos os guias",
  faqT: "O que costumam perguntar antes de começar.",
  faqA: "Não acharam a resposta? Perguntem à Bizi",
  endT: "É hora de conectar o negócio todo.",
  endD: "Clientes, marketing, conversas e fluxos em uma plataforma.",
  start: "Comecem grátis",
  demo: "Agendem uma demonstração",
  sample: "Exemplo",
  steps: ["Contato", "Lead", "CRM", "Conversa", "Continuidade", "Reunião", "Acompanhamento"],
  self: ["Escolher um pacote publicado", "Criar uma conta", "Trabalhar no produto"],
  guided: ["Falar com a equipe", "Agendar uma demonstração", "Seguir na conversa de implantação existente"],
  benefits: [["Ordem", "Os dados ficam no mesmo cliente."], ["Controle", "A próxima ação fica visível."], ["Crescimento", "Um lead pode avançar pelas etapas que já existem."]],
};

const AR: Pack = { ...EN,
  crmT: "كل عميل محتمل فرصة.",
  crmD: "أدروا العملاء المحتملين في مكان واحد وتابعوا المرحلة التالية.",
  crmA: "اكتشفوا نظام CRM",
  waT: "كل محادثة فرصة.",
  waD: "أدروا WhatsApp Business من مساحة العمل نفسها.",
  waA: "اكتشفوا WhatsApp Business",
  autoT: "عمل يدوي أقل. وقت أكثر للنمو.",
  autoD: "صلوا خطوات العمل وحوّلوا التكرار إلى مسار واحد.",
  autoA: "اكتشفوا الأتمتة",
  metaT: "من النقرة الأولى إلى الفرصة التالية.",
  metaD: "صلوا الإعلان بإدارة العملاء.",
  metaA: "اكتشفوا أدوات التسويق",
  calT: "تنسيق أقل. وقت أكثر للعمل.",
  calD: "أدروا الاجتماعات والخدمات والتوفر في تقويم واحد.",
  calA: "اكتشفوا المواعيد",
  siteT: "الموقع الجميل هو البداية فقط.",
  siteD: "أنشئوا موقعاً بالمحرر المرئي. يمكن أن يصل النموذج إلى CRM.",
  siteA: "اكتشفوا بناء المواقع",
  aiT: "ذكاء اصطناعي. داخل يوم العمل.",
  aiD: "تشمل الباقة التجارية المستشار وأتمتة الذكاء الاصطناعي، إلى جانب المهام والسجلات.",
  aiA: "اكتشفوا أدوات الذكاء الاصطناعي",
  biziT: "تعرّفوا على Bizi. مستشارتكم للأعمال.",
  biziD: "تستخدم Bizi الدردشة الحالية والكتالوج المعتمد، ولا تحفظ طلباً إلا بالموافقة.",
  biziA: "لنستشر معاً",
  stackT: "كل ما يحتاجه النشاط.",
  stackD: "افتحوا طبقة منتج. لكل طبقة شاشتها وصفحتها.",
  solT: "نشاطكم مميز. مساحة العمل يجب أن تكون كذلك.",
  solD: "اختاروا نوع النشاط وشاهدوا الجزء المناسب من Bizuply.",
  journeyT: "من اللحظة الأولى.",
  journeyD: "قد يصل العميل المحتمل من إعلانات Meta أو نموذج Google Ads أو نموذج في موقع بُني في Bizuply.",
  pathT: "بطريقتكم. بوتيرتكم.",
  pathD: "ابدأوا وحدكم أو تحدثوا مع الفريق. المساران يستخدمان صفحات موجودة.",
  integT: "الروابط الموجودة فعلاً.",
  benefitT: "نظام أكثر. تحكم أكثر. مجال للنمو.",
  priceT: "الخيار المناسب. بالسعر المنشور.",
  priceD: "هذه الباقات والأسعار المنشورة.",
  partnerT: "ننمو بشكل أفضل معاً.",
  partnerD: "يبقى برنامج الشركاء وفق الشروط المنشورة.",
  partnerA: "برنامج الشركاء",
  knowT: "معرفة تساعد النشاط على التقدم.",
  knowD: "هذه أدلة منشورة.",
  knowA: "كل الأدلة",
  faqT: "ما يُسأل عادة قبل البدء.",
  faqA: "لم تجدوا الإجابة؟ اسألوا Bizi",
  endT: "حان وقت ربط النشاط كله.",
  endD: "العملاء والتسويق والمحادثات ومسارات العمل في منصة واحدة.",
  start: "ابدأوا مجاناً",
  demo: "حددوا عرضاً",
  sample: "مثال",
  steps: ["طلب", "عميل محتمل", "CRM", "محادثة", "متابعة", "اجتماع", "تقدم"],
  self: ["اختيار باقة منشورة", "إنشاء حساب", "العمل داخل المنتج"],
  guided: ["التواصل مع الفريق", "تحديد عرض", "المتابعة في حديث التجهيز الحالي"],
  benefits: [["نظام", "تبقى البيانات على العميل نفسه."], ["تحكم", "الإجراء التالي ظاهر."], ["نمو", "يمكن أن ينتقل العميل المحتمل بين المراحل الموجودة."]],
};

function packFor(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return HE;
  if (value.startsWith("es")) return ES;
  if (value.startsWith("pt")) return PT;
  if (value.startsWith("ar")) return AR;
  return EN;
}

function localeOf(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return "he";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("pt")) return "pt-BR";
  if (value.startsWith("ar")) return "ar";
  return "en";
}

function openBizi() {
  window.dispatchEvent(new CustomEvent("bizuply:openSupportChat"));
}

const LAYERS = [
  ["CRM", "/crm", "crm-list"],
  ["WhatsApp", "/whatsapp-api", "whatsapp"],
  ["automations", "/automations", "automation"],
  ["marketing", "/meta-campaigns", "campaigns"],
  ["AI", "/agents", "ai"],
  ["calendar", "/appointments", "campaigns"],
  ["websites", "/website-builder", "dashboard"],
] as const;

export default function LivingHome({ language }: { language: string }) {
  const root = useRef<HTMLDivElement>(null);
  const copy = packFor(language);
  const locale = localeOf(language);
  const lang = locale === "he" ? "he" : "en";
  const he = locale === "he";
  const [solution, setSolution] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);
  const faqs = ((HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en).slice(0, 6);
  const guides = GUIDES.map((slug) => ({ slug, article: getGuide(slug, locale) })).filter((item) => item.article?.h1);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      frame = 0;
      node.querySelectorAll<HTMLElement>("[data-track]").forEach((section) => {
        if (reduced) {
          section.style.setProperty("--p", "1");
          return;
        }
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight - window.innerHeight;
        const progress = total > 8
          ? Math.min(1, Math.max(0, -rect.top / total))
          : rect.top < window.innerHeight * 0.75 ? 1 : 0;
        section.style.setProperty("--p", progress.toFixed(4));
        const layers = Number(section.dataset.layers || 0);
        if (layers) section.dataset.layer = String(Math.min(layers - 1, Math.floor(progress * layers)));
      });
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <div ref={root}>
      <section className="lv-track lv-track--pin lv-track--yellow" data-track>
        <div className="lv-pin lv-stage">
          <div>
            <h2>{copy.crmT}</h2>
            <p>{copy.crmD}</p>
            <Link className="lv-go" to="/crm">{copy.crmA}</Link>
          </div>
          <div className="lv-crm" aria-label={copy.sample}>
            <div className="lv-cols">
              {["New", "Contacted", "Converted"].map((stage, index) => (
                <div className="lv-col" key={stage}>
                  <strong>{stage}</strong>
                  {index === 0 ? <article className="lv-lead"><b>Northwind</b><br />{copy.sample}</article> : null}
                </div>
              ))}
            </div>
            <p className="lv-task">{copy.sample}: follow-up</p>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--pin lv-track--pink" data-track>
        <div className="lv-pin lv-stage">
          <div className="lv-wa">
            <p className="lv-bubble">{copy.sample}: hello</p>
            <p className="lv-bubble lv-bubble--in">{copy.sample}: reply</p>
            <p className="lv-template">{copy.sample}: approved template</p>
          </div>
          <div>
            <h2>{copy.waT}</h2>
            <p>{copy.waD}</p>
            <video src="/demo-media/home/whatsapp.mp4" poster="/demo-media/home/whatsapp.jpg" muted playsInline controls />
            <Link className="lv-go" to="/whatsapp-api">{copy.waA}</Link>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--pin lv-track--navy" data-track>
        <div className="lv-pin">
          <h2>{copy.autoT}</h2>
          <p>{copy.autoD}</p>
          <div className="lv-flow">
            <svg viewBox="0 0 100 20" aria-hidden="true"><path pathLength="1" d="M2 10 H98" /></svg>
            <div className="lv-nodes">
              <span className="lv-node">Trigger</span>
              <span className="lv-node">Condition</span>
              <span className="lv-node">Action</span>
              <span className="lv-node">Record</span>
            </div>
          </div>
          <Link className="lv-go" to="/automations">{copy.autoA}</Link>
        </div>
      </section>

      <section className="lv-track lv-track--pin" data-track>
        <div className="lv-pin lv-stage">
          <div>
            <div className="lv-bars" aria-hidden="true">
              <span style={{ ["--h" as string]: "70%" }} />
              <span style={{ ["--h" as string]: "45%" }} />
              <span style={{ ["--h" as string]: "88%" }} />
              <span style={{ ["--h" as string]: "60%" }} />
            </div>
            <p className="lv-campaign">{copy.sample}: campaign → CRM</p>
          </div>
          <div>
            <h2>{copy.metaT}</h2>
            <p>{copy.metaD}</p>
            <img src={`${MEDIA}/${lang}-desktop-campaigns.webp`} alt="" />
            <Link className="lv-go" to="/meta-campaigns">{copy.metaA}</Link>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--pin lv-track--blue" data-track>
        <div className="lv-pin lv-stage">
          <div>
            <h2>{copy.calT}</h2>
            <p>{copy.calD}</p>
            <Link className="lv-go" to="/appointments">{copy.calA}</Link>
          </div>
          <div className="lv-week">
            {["1", "2", "3", "4", "5"].map((day) => (
              <div className="lv-day" key={day}>{day}{day === "3" ? <div className="lv-meet">{copy.sample}</div> : null}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--pin lv-track--blush" data-track>
        <div className="lv-pin">
          <h2>{copy.siteT}</h2>
          <p>{copy.siteD}</p>
          <div className="lv-site">
            <div className="lv-canvas"><strong>{copy.sample}</strong><img src="/demo-media/home/websites.jpg" alt="" /></div>
            <div className="lv-phone">{copy.sample}</div>
          </div>
          <Link className="lv-go" to="/website-builder">{copy.siteA}</Link>
        </div>
      </section>

      <section className="lv-track lv-track--pin lv-track--navy" data-track>
        <div className="lv-pin lv-stage">
          <div className="lv-ai">
            <strong>{copy.sample}</strong>
            <pre>{copy.aiD}</pre>
          </div>
          <div>
            <h2>{copy.aiT}</h2>
            <p>{copy.aiD}</p>
            <img src={`${MEDIA}/${lang}-desktop-ai.webp`} alt="" />
            <Link className="lv-go" to="/agents">{copy.aiA}</Link>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--mist" id="bizi" data-track>
        <div className="lv-pin lv-bizi">
          <img src="/brand/bizi.png" alt="Bizi" />
          <div>
            <h2>{copy.biziT}</h2>
            <p>{copy.biziD}</p>
            <span className="lv-chip">{copy.priceT}</span>
            <span className="lv-chip">{copy.demo}</span>
            <button type="button" className="lv-go" onClick={openBizi}>{copy.biziA}</button>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--pin" data-track data-layers="7" data-layer="0">
        <div className="lv-pin">
          <h2>{copy.stackT}</h2>
          <p>{copy.stackD}</p>
          <div className="lv-stack" data-layer="0">
            {LAYERS.map(([label, href, shot], index) => (
              <div key={label}>
                <button type="button" className="lv-tab" data-i={index} onClick={(event) => {
                  const section = event.currentTarget.closest<HTMLElement>("[data-track]");
                  if (section) section.dataset.layer = String(index);
                  const stack = event.currentTarget.closest<HTMLElement>(".lv-stack");
                  if (stack) stack.dataset.layer = String(index);
                }}>{label}</button>
                <div className="lv-panel" data-i={index}>
                  <img src={shot === "dashboard" && label === "websites" ? "/demo-media/home/websites.jpg" : `${MEDIA}/${lang}-desktop-${shot}.webp`} alt="" />
                  <Link className="lv-go" to={href}>{label}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--blush" data-track>
        <div className="lv-pin">
          <h2>{copy.solT}</h2>
          <p>{copy.solD}</p>
          <div className="lv-solutions">
            <div>
              {copy.sols.map(([title, body], index) => (
                <button key={title} type="button" aria-pressed={solution === index} onClick={() => setSolution(index)}>
                  {title}
                  {solution === index ? <small style={{ display: "block", fontWeight: 500 }}>{body}</small> : null}
                </button>
              ))}
            </div>
            <div className="lv-photo">
              <img src={`${MEDIA}/${lang}-desktop-${solution % 2 ? "whatsapp" : "crm-list"}.webp`} alt="" />
              <div className="lv-float">{copy.sols[solution][1]}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--pin lv-track--navy" data-track>
        <div className="lv-pin">
          <h2>{copy.journeyT}</h2>
          <p>{copy.journeyD}</p>
          <svg className="lv-path" viewBox="0 0 100 30" aria-hidden="true"><path pathLength="1" d="M2 20 C 20 5, 40 28, 60 12 S 90 8, 98 16" /></svg>
          <div className="lv-steps">{copy.steps.map((step) => <span key={step}>{step}</span>)}</div>
        </div>
      </section>

      <section className="lv-track" data-track>
        <div className="lv-pin">
          <h2>{copy.pathT}</h2>
          <p>{copy.pathD}</p>
          <div className="lv-fork">
            <article>
              <h3>{copy.self[0]}</h3>
              <ol>{copy.self.map((item) => <li key={item}>{item}</li>)}</ol>
              <Link className="lv-go" to="/register">{copy.start}</Link>
            </article>
            <article>
              <h3>{copy.guided[0]}</h3>
              <ol>{copy.guided.map((item) => <li key={item}>{item}</li>)}</ol>
              <Link className="lv-go" to="/contact">{copy.demo}</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--mist" data-track>
        <div className="lv-pin">
          <h2>{copy.integT}</h2>
          <div className="lv-orbit">
            <Link to="/meta-campaigns">Meta Lead Ads</Link>
            <span>Google Ads lead forms</span>
            <Link to="/website-builder">{he ? "טפסים באתר Bizuply" : "Bizuply site forms"}</Link>
            <Link to="/whatsapp-api">WhatsApp Cloud API</Link>
          </div>
        </div>
      </section>

      <section className="lv-track lv-track--yellow" data-track>
        <div className="lv-pin lv-words">
          <h2>{copy.benefitT}</h2>
          {copy.benefits.map(([title, body]) => <span key={title}>{title} — {body}</span>)}
        </div>
      </section>

      <section className="lv-track" data-track>
        <div className="lv-pin">
          <h2>{copy.priceT}</h2>
          <p>{copy.priceD}</p>
          <div className="lv-plans">
            {PRICING_PAGE_PACKAGES.map((plan) => (
              <article className="lv-plan" key={plan.type}>
                <h3>{he ? plan.nameHe : plan.nameEn}</h3>
                <b>${plan.price}</b>
                <span>{he ? plan.pricePeriodHe : plan.pricePeriodEn}</span>
                <p>{he ? plan.descriptionHe : plan.descriptionEn}</p>
              </article>
            ))}
          </div>
          <Link className="lv-go" to="/pricing">{he ? "לכל המחירים" : "See pricing"}</Link>
        </div>
      </section>

      <section className="lv-track lv-track--yellow" data-track>
        <div className="lv-pin">
          <h2>{copy.partnerT}</h2>
          <p>{copy.partnerD}</p>
          <Link className="lv-go" to="/partners">{copy.partnerA}</Link>
        </div>
      </section>

      <section className="lv-track" data-track>
        <div className="lv-pin">
          <h2>{copy.knowT}</h2>
          <p>{copy.knowD}</p>
          <div className="lv-guides">
            {guides.map((guide) => (
              <Link key={guide.slug} to={`/guides/${guide.slug}`}>{guide.article.h1}</Link>
            ))}
          </div>
          <Link className="lv-go" to="/guides">{copy.knowA}</Link>
        </div>
      </section>

      <section className="lv-track lv-track--mist lv-faq" data-track>
        <div className="lv-pin">
          <h2>{copy.faqT}</h2>
          {faqs.map(([question, answer], index) => (
            <details key={question} open={faqOpen === index} onToggle={(event) => { if (event.currentTarget.open) setFaqOpen(index); }}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
          <button type="button" className="lv-go" onClick={openBizi}>{copy.faqA}</button>
        </div>
      </section>

      <section className="lv-track lv-track--pink" data-track>
        <div className="lv-pin lv-end">
          <div className="lv-bits"><i>CRM</i><i>WhatsApp</i><i>{he ? "יומן" : "Calendar"}</i><i>{he ? "אוטומציות" : "Automations"}</i></div>
          <h2>{copy.endT}</h2>
          <p>{copy.endD}</p>
          <Link className="lv-go" to="/register">{copy.start}</Link>{" "}
          <Link className="lv-go" to="/contact">{copy.demo}</Link>
        </div>
      </section>
    </div>
  );
}
