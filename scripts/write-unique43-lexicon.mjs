/**
 * unique43 — leftover Spalcio/Elevora/Servora built-in seed and preview chrome.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff, and smash-hazard singles
 * unless they are explicit UI labels.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "ייעוץ עסקי ואסטרטגי": r(
    "Business and strategy consulting",
    "Consultoría de negocio y estrategia",
    "Consultoria de negócios e estratégia",
    "استشارة أعمال واستراتيجية",
  ),
  "אסטרטגיה, צמיחה ותוצאות": r(
    "Strategy, growth, and results",
    "Estrategia, crecimiento y resultados",
    "Estratégia, crescimento e resultados",
    "استراتيجية ونمو ونتائج",
  ),
  "עוזרים לעסקים לבנות תהליך מכירה ברור": r(
    "We help businesses build a clear sales process",
    "Ayudamos a negocios a construir un proceso de venta claro",
    "Ajudamos negócios a construir um processo de vendas claro",
    "نساعد الأعمال على بناء عملية بيع واضحة",
  ),
  "ולהפוך יותר לידים ללקוחות.": r(
    "and turn more leads into customers.",
    "y convertir más leads en clientes.",
    "e transformar mais leads em clientes.",
    "وتحويل المزيد من العملاء المحتملين إلى زبائن.",
  ),
  "תבנית מקצועית לעסקים שרוצים להציג שירותים, לבנות אמון, לקבל פניות איכותיות ולשדר מותג יוקרתי כבר מהרגע הראשון.":
    r(
      "A professional template for businesses that want to show services, build trust, get quality inquiries, and look like a luxury brand from the first moment.",
      "Una plantilla profesional para negocios que quieren mostrar servicios, construir confianza, recibir consultas de calidad y proyectar una marca de lujo desde el primer momento.",
      "Um modelo profissional para negócios que querem mostrar serviços, construir confiança, receber consultas de qualidade e projetar uma marca de luxo desde o primeiro momento.",
      "قالب مهني لأعمال تريد عرض خدمات وبناء ثقة والحصول على استفسارات نوعية وإظهار علامة فاخرة من اللحظة الأولى.",
    ),
  "לקביעת שיחת ייעוץ": r(
    "Book a consulting call",
    "Reservar una llamada de consultoría",
    "Marcar uma chamada de consultoria",
    "حجز مكالمة استشارة",
  ),
  "צפו בשירותים": r("See services", "Ver servicios", "Ver serviços", "عرض الخدمات"),
  "שיפור ממוצע בהמרת לידים": r(
    "Average improvement in lead conversion",
    "Mejora media en conversión de leads",
    "Melhora média na conversão de leads",
    "تحسّن متوسط في تحويل العملاء المحتملين",
  ),
  "עסקים שליווינו": r("Businesses we supported", "Negocios que acompañamos", "Negócios que acompanhamos", "أعمال رافقناها"),
  "תוכנית פעולה ראשונית": r("Initial action plan", "Plan de acción inicial", "Plano de ação inicial", "خطة عمل أولية"),
  "אסטרטגיה עסקית": r("Business strategy", "Estrategia de negocio", "Estratégia de negócio", "استراتيجية أعمال"),
  "מיקוד קהל יעד, הצעת ערך, מסרים, בידול ותוכנית פעולה ברורה לצמיחה.": r(
    "Audience focus, value proposition, messages, differentiation, and a clear growth action plan.",
    "Enfoque de audiencia, propuesta de valor, mensajes, diferenciación y un plan de acción claro para crecer.",
    "Foco de público, proposta de valor, mensagens, diferenciação e um plano de ação claro para crescer.",
    "تركيز الجمهور والعرض القيمي والرسائل والتمييز وخطة عمل واضحة للنمو.",
  ),
  "שיפור מכירות": r("Sales improvement", "Mejora de ventas", "Melhora de vendas", "تحسين المبيعات"),
  "בניית תהליך מכירה, טיפול בלידים, מעקב אחרי פניות והגדלת אחוזי סגירה.": r(
    "Building a sales process, handling leads, following inquiries, and raising close rates.",
    "Construir un proceso de venta, tratar leads, seguir consultas y subir el cierre.",
    "Construir um processo de vendas, tratar leads, acompanhar consultas e subir o fechamento.",
    "بناء عملية بيع ومعالجة العملاء المحتملين ومتابعة الاستفسارات ورفع نسب الإغلاق.",
  ),
  "מיתוג ושיווק": r("Branding and marketing", "Marca y marketing", "Marca e marketing", "علامة وتسويق"),
  "דיוק השפה, הנראות והמסרים כדי שהעסק ייראה מקצועי וימשוך לקוחות נכונים.": r(
    "Tighten language, look, and messages so the business looks professional and attracts the right clients.",
    "Afinar el lenguaje, la imagen y los mensajes para que el negocio se vea profesional y atraiga a los clientes correctos.",
    "Ajustar a linguagem, a imagem e as mensagens para o negócio parecer profissional e atrair os clientes certos.",
    "ضبط اللغة والمظهر والرسائل حتى يبدو العمل مهنياً ويجذب الزبائن المناسبين.",
  ),
  "אוטומציות ותהליכים": r("Automations and processes", "Automatizaciones y procesos", "Automações e processos", "أتمتة وعمليات"),
  "חיבור טפסים, CRM, תזכורות, תהליכי עבודה ומעקב כדי שלא יפלו לידים בדרך.": r(
    "Connect forms, CRM, reminders, workflows, and tracking so leads do not fall through.",
    "Conectar formularios, CRM, recordatorios, flujos y seguimiento para que no se caigan leads.",
    "Ligar formulários, CRM, lembretes, fluxos e acompanhamento para leads não se perderem.",
    "ربط النماذج وCRM والتذكيرات ومسارات العمل والمتابعة حتى لا تسقط الاستفسارات في الطريق.",
  ),
  "אבחון העסק": r("Business diagnosis", "Diagnóstico del negocio", "Diagnóstico do negócio", "تشخيص العمل"),
  "מבינים את המצב הנוכחי, השירותים, הקהל, נקודות החוזקה ומה עוצר את הצמיחה.": r(
    "We understand the current state, services, audience, strengths, and what is blocking growth.",
    "Entendemos el estado actual, los servicios, la audiencia, las fortalezas y qué frena el crecimiento.",
    "Entendemos o estado atual, os serviços, o público, os pontos fortes e o que trava o crescimento.",
    "نفهم الوضع الحالي والخدمات والجمهور ونقاط القوة وما يوقف النمو.",
  ),
  "בניית תוכנית": r("Build the plan", "Construir el plan", "Construir o plano", "بناء الخطة"),
  "מגדירים אסטרטגיה, מסרים, מבנה הצעה, תהליך ליד ותוכנית יישום ברורה.": r(
    "We define strategy, messages, offer structure, a lead process, and a clear implementation plan.",
    "Definimos estrategia, mensajes, estructura de oferta, proceso de lead y un plan de implementación claro.",
    "Definimos estratégia, mensagens, estrutura de oferta, processo de lead e um plano de implementação claro.",
    "نحدّد الاستراتيجية والرسائل وبنية العرض وعملية العميل المحتمل وخطة تنفيذ واضحة.",
  ),
  "יישום ושיפור": r("Implement and improve", "Implementar y mejorar", "Implementar e melhorar", "تنفيذ وتحسين"),
  "מטמיעים בפועל, מודדים תוצאות ומשפרים את התהליך עד שהוא עובד בצורה יציבה.": r(
    "We implement in practice, measure results, and improve the process until it runs stably.",
    "Implantamos en la práctica, medimos resultados y mejoramos el proceso hasta que funcione de forma estable.",
    "Implantamos na prática, medimos resultados e melhoramos o processo até funcionar de forma estável.",
    "نطبّق فعلياً ونقيس النتائج ونحسّن العملية حتى تعمل بشكل مستقر.",
  ),
  "בעלת קליניקה": r("Clinic owner", "Dueña de clínica", "Dona de clínica", "صاحبة عيادة"),
  "אחרי התהליך הבנו סוף סוף איך להציג את השירותים שלנו ואיך לטפל בלידים בצורה מסודרת. הפניות הפכו להרבה יותר איכותיות.":
    r(
      "After the process we finally understood how to present our services and how to handle leads in an organized way. Inquiries became much higher quality.",
      "Después del proceso por fin entendimos cómo presentar nuestros servicios y cómo tratar los leads de forma ordenada. Las consultas se volvieron mucho más de calidad.",
      "Depois do processo finalmente entendemos como apresentar nossos serviços e como tratar leads de forma organizada. As consultas ficaram bem mais qualificadas.",
      "بعد العملية فهمنا أخيراً كيف نعرض خدماتنا وكيف نعالج العملاء المحتملين بترتيب. أصبحت الاستفسارات أعلى جودة بكثير.",
    ),
  "מנכ״ל סוכנות שירותים": r(
    "CEO of a services agency",
    "CEO de una agencia de servicios",
    "CEO de uma agência de serviços",
    "رئيس وكالة خدمات",
  ),
  "האתר והתהליך העסקי נראים הרבה יותר מקצועיים. יש מסר ברור, הצעה ברורה ולקוחות מבינים מהר למה לבחור בנו.":
    r(
      "The site and the business process look much more professional. There is a clear message, a clear offer, and clients quickly see why to choose us.",
      "El sitio y el proceso de negocio se ven mucho más profesionales. Hay un mensaje claro, una oferta clara y los clientes entienden rápido por qué elegirnos.",
      "O site e o processo de negócio parecem bem mais profissionais. Há uma mensagem clara, uma oferta clara e os clientes entendem rápido por que nos escolher.",
      "الموقع والعملية التجارية يبدوان أكثر مهنية بكثير. هناك رسالة واضحة وعرض واضح والزبائن يفهمون بسرعة لماذا يختاروننا.",
    ),
  "יועצת פיננסית": r("Financial advisor", "Asesora financiera", "Consultora financeira", "مستشارة مالية"),
  "קיבלתי אתר שמשדר בדיוק את הרמה שרציתי. נקי, יוקרתי, אמין ומאוד קל ללקוח להשאיר פרטים.":
    r(
      "I got a site that projects exactly the level I wanted. Clean, luxury, trustworthy, and very easy for a client to leave details.",
      "Recibí un sitio que proyecta exactamente el nivel que quería. Limpio, de lujo, fiable y muy fácil para que el cliente deje datos.",
      "Recebi um site que projeta exatamente o nível que eu queria. Limpo, de luxo, confiável e muito fácil para o cliente deixar dados.",
      "حصلت على موقع يعكس تماماً المستوى الذي أردته. نظيف وفاخر وموثوق وسهل جداً للزبون أن يترك التفاصيل.",
    ),
  "למי התבנית מתאימה?": r("Who is this template for?", "¿Para quién es esta plantilla?", "Para quem é este modelo?", "لمن يناسب هذا القالب؟"),
  "לעסקים נותני שירות, יועצים, סוכנויות, מאמנים, קליניקות, עורכי דין, רואי חשבון וכל עסק שרוצה אתר תדמיתי מקצועי שמייצר פניות.":
    r(
      "For service businesses, consultants, agencies, coaches, clinics, lawyers, accountants, and any business that wants a professional profile site that generates inquiries.",
      "Para negocios de servicios, consultores, agencias, coaches, clínicas, abogados, contadores y cualquier negocio que quiera un sitio de imagen profesional que genere consultas.",
      "Para negócios de serviço, consultores, agências, coaches, clínicas, advogados, contadores e qualquer negócio que queira um site institucional profissional que gere consultas.",
      "لأعمال الخدمات والمستشارين والوكالات والمدربين والعيادات والمحامين والمحاسبين وأي عمل يريد موقعاً تعريفياً مهنياً يولّد استفسارات.",
    ),
  "אפשר להתאים את הטקסטים והתמונות?": r(
    "Can the texts and images be customized?",
    "¿Se pueden adaptar los textos y las imágenes?",
    "Dá para adaptar os textos e as imagens?",
    "هل يمكن ملاءمة النصوص والصور؟",
  ),
  "כן. כל הטקסטים, התמונות, הכפתורים והאזורים בנויים כך שיהיה קל להחליף אותם בעורך.":
    r(
      "Yes. Every text, image, button, and section is built so it is easy to replace them in the editor.",
      "Sí. Todos los textos, imágenes, botones y áreas están construidos para que sea fácil cambiarlos en el editor.",
      "Sim. Todos os textos, imagens, botões e áreas estão feitos para ser fácil trocá-los no editor.",
      "نعم. كل النصوص والصور والأزرار والمناطق مبنية بحيث يسهل استبدالها في المحرر.",
    ),
  "אפשר לחבר טופס לידים?": r("Can a lead form be connected?", "¿Se puede conectar un formulario de leads?", "Dá para ligar um formulário de leads?", "هل يمكن ربط نموذج عملاء محتملين؟"),
  "כן. אזור יצירת הקשר בנוי לטופס ליד, וניתן לחבר אותו ל־CRM, וואטסאפ, מייל או אוטומציה.":
    r(
      "Yes. The contact area is built for a lead form, and you can connect it to CRM, WhatsApp, email, or automation.",
      "Sí. El área de contacto está hecha para un formulario de lead, y se puede conectar a CRM, WhatsApp, email o automatización.",
      "Sim. A área de contato é feita para um formulário de lead, e dá para ligar a CRM, WhatsApp, e-mail ou automação.",
      "نعم. منطقة التواصل مبنية لنموذج عميل محتمل، ويمكن ربطها بـ CRM أو واتساب أو البريد أو الأتمتة.",
    ),
  "צוות שמחבר בין חשיבה עסקית, נראות מקצועית ותוצאות.": r(
    "A team that connects business thinking, professional look, and results.",
    "Un equipo que conecta pensamiento de negocio, imagen profesional y resultados.",
    "Uma equipe que liga pensamento de negócio, imagem profissional e resultados.",
    "فريق يربط التفكير التجاري والمظهر المهني والنتائج.",
  ),
  "אנחנו מלווים עסקים שרוצים להיראות טוב יותר, למכור ברור יותר ולבנות תהליך שמייצר יותר פניות איכותיות. התהליך שלנו משלב אסטרטגיה, UX, מסרים, שירותים ואוטומציות.":
    r(
      "We support businesses that want to look better, sell more clearly, and build a process that creates more quality inquiries. Our process combines strategy, UX, messages, services, and automations.",
      "Acompañamos negocios que quieren verse mejor, vender más claro y construir un proceso que genere más consultas de calidad. Nuestro proceso combina estrategia, UX, mensajes, servicios y automatizaciones.",
      "Acompanhamos negócios que querem parecer melhor, vender de forma mais clara e construir um processo que gere mais consultas de qualidade. Nosso processo combina estratégia, UX, mensagens, serviços e automações.",
      "نرافق أعمال تريد أن تبدو أفضل وتبيع أوضح وتبني عملية تولّد المزيد من الاستفسارات النوعية. عمليتنا تجمع الاستراتيجية وتجربة المستخدم والرسائل والخدمات والأتمتة.",
    ),
  "בניית מסר עסקי חד וברור": r("Building a sharp, clear business message", "Construir un mensaje de negocio nítido y claro", "Construir uma mensagem de negócio nítida e clara", "بناء رسالة أعمال حادة وواضحة"),
  "שיפור תהליך קבלת לידים": r("Improving the lead intake process", "Mejorar el proceso de recepción de leads", "Melhorar o processo de recebimento de leads", "تحسين عملية استقبال العملاء المحتملين"),
  "עיצוב אתר תדמיתי מקצועי": r("Designing a professional profile site", "Diseñar un sitio de imagen profesional", "Desenhar um site institucional profissional", "تصميم موقع تعريفي مهني"),
  "התאמה לעסקים קטנים ובינוניים": r("Fit for small and mid-size businesses", "Ajuste a negocios pequeños y medianos", "Ajuste a negócios pequenos e médios", "ملاءمة للأعمال الصغيرة والمتوسطة"),
  "רוצים אתר עסקי שנראה מקצועי ומביא יותר פניות?": r(
    "Want a business site that looks professional and brings more inquiries?",
    "¿Quieres un sitio de negocio que se vea profesional y traiga más consultas?",
    "Quer um site de negócio que pareça profissional e traga mais consultas?",
    "تريدون موقعاً تجارياً يبدو مهنياً ويجلب المزيد من الاستفسارات؟",
  ),
  "השאירו פרטים ונחזור אליכם עם כיוון ראשוני, המלצות ותוכנית פעולה שמתאימה לעסק שלכם.":
    r(
      "Leave your details and we will get back with an initial direction, recommendations, and an action plan that fits your business.",
      "Deja tus datos y te responderemos con una dirección inicial, recomendaciones y un plan de acción que encaje en tu negocio.",
      "Deixe seus dados e voltaremos com uma direção inicial, recomendações e um plano de ação que sirva ao seu negócio.",
      "اتركوا التفاصيل وسنعود باتجاه أولي وتوصيات وخطة عمل تناسب عملكم.",
    ),
  "בואו נתחיל": r("Let's start", "Empecemos", "Vamos começar", "لنبدأ"),
  "השאירו פרטים ונחזור אליכם לשיחת התאמה.": r(
    "Leave your details and we will get back for a fit call.",
    "Deja tus datos y te responderemos para una llamada de encaje.",
    "Deixe seus dados e voltaremos para uma chamada de encaixe.",
    "اتركوا التفاصيل وسنعود لمكالمة ملاءمة.",
  ),
  "ספרו לנו במה העסק עוסק ומה המטרה המרכזית שלכם — אתר תדמית, יותר לידים, שיפור מכירות או בניית תהליך מלא.":
    r(
      "Tell us what the business does and your main goal — a profile site, more leads, better sales, or building a full process.",
      "Cuéntanos a qué se dedica el negocio y cuál es tu objetivo principal — un sitio de imagen, más leads, mejorar ventas o construir un proceso completo.",
      "Contem no que o negócio atua e qual é o objetivo principal — um site institucional, mais leads, melhorar vendas ou construir um processo completo.",
      "أخبرونا بما يعمل العمل وما هو هدفكم الأساسي — موقع تعريفي أو المزيد من العملاء المحتملين أو تحسين المبيعات أو بناء عملية كاملة.",
    ),
  "א׳-ה׳ 09:00-18:00": r("Sun–Thu 09:00-18:00", "Dom–jue 09:00-18:00", "Dom–qui 09:00-18:00", "أحد–خميس 09:00-18:00"),
  "פתרונות עסקיים לאתר מקצועי, לידים ותהליך מכירה ברור.": r(
    "Business solutions for a professional site, leads, and a clear sales process.",
    "Soluciones de negocio para un sitio profesional, leads y un proceso de venta claro.",
    "Soluções de negócio para um site profissional, leads e um processo de vendas claro.",
    "حلول أعمال لموقع مهني وعملاء محتملين وعملية بيع واضحة.",
  ),
  "עמוד שירותים שמתאים לעסקים שרוצים להסביר במה הם עוזרים, למה לבחור בהם ואיך להשאיר פרטים.":
    r(
      "A services page for businesses that want to explain how they help, why to choose them, and how to leave details.",
      "Una página de servicios para negocios que quieren explicar en qué ayudan, por qué elegirlos y cómo dejar datos.",
      "Uma página de serviços para negócios que querem explicar em que ajudam, por que escolhê-los e como deixar dados.",
      "صفحة خدمات لأعمال تريد شرح بما تساعد ولماذا اختيارها وكيف ترك التفاصيل.",
  ),
  "פגישה עסקית מקצועית": r("A professional business meeting", "Una reunión de negocio profesional", "Uma reunião de negócio profissional", "اجتماع أعمال مهني"),
  "צוות ייעוץ עסקי": r("Business consulting team", "Equipo de consultoría de negocio", "Equipe de consultoria de negócio", "فريق استشارة أعمال"),
  "קבלו פרטים": r("Get details", "Recibir detalles", "Receber detalhes", "احصلوا على التفاصيل"),
  "סטודיו לצמיחה עסקית": r("A studio for business growth", "Un estudio para el crecimiento de negocio", "Um estúdio para crescimento de negócio", "استوديو لنمو الأعمال"),
  "תבנית אתר פרימיום לעסקים שרוצים לשדר אמינות, מקצועיות ונוכחות חזקה מהרגע הראשון.":
    r(
      "A premium site template for businesses that want to project trust, professionalism, and a strong presence from the first moment.",
      "Una plantilla premium para negocios que quieren proyectar fiabilidad, profesionalidad y una presencia fuerte desde el primer momento.",
      "Um modelo premium para negócios que querem projetar confiança, profissionalismo e uma presença forte desde o primeiro momento.",
      "قالب موقع فاخر لأعمال تريد إظهار المصداقية والمهنية وحضوراً قوياً من اللحظة الأولى.",
    ),
  "אסטרטגיה · מיתוג · נוכחות דיגיטלית": r(
    "Strategy · branding · digital presence",
    "Estrategia · marca · presencia digital",
    "Estratégia · marca · presença digital",
    "استراتيجية · علامة · حضور رقمي",
  ),
  "אתר עסקי שמרגיש יוקרתי, ברור ומוכן להביא לקוחות.": r(
    "A business site that feels luxury, clear, and ready to bring customers.",
    "Un sitio de negocio que se siente de lujo, claro y listo para traer clientes.",
    "Um site de negócio que parece de luxo, claro e pronto para trazer clientes.",
    "موقع أعمال يشعر بالفخامة والوضوح والجاهزية لجلب الزبائن.",
  ),
  "תבנית פרימיום לעסקים, יועצים, סוכנויות ונותני שירות שרוצים להיראות גדולים יותר, מקצועיים יותר ומשכנעים יותר — בלי אתר משעמם ובלי עומס מיותר.":
    r(
      "A premium template for businesses, consultants, agencies, and service providers that want to look bigger, more professional, and more convincing — without a boring site or extra clutter.",
      "Una plantilla premium para negocios, consultores, agencias y prestadores de servicio que quieren verse más grandes, más profesionales y más convincentes — sin un sitio aburrido ni saturación extra.",
      "Um modelo premium para negócios, consultores, agências e prestadores de serviço que querem parecer maiores, mais profissionais e mais convincentes — sem um site entediante nem excesso.",
      "قالب فاخر لأعمال ومستشارين ووكالات ومقدّمي خدمات يريدون أن يبدوا أكبر وأكثر مهنية وأكثر إقناعاً — دون موقع ممل ودون ازدحام زائد.",
    ),
  "קביעת שיחת ייעוץ": r("Book a consulting call", "Reservar una llamada de consultoría", "Marcar uma chamada de consultoria", "حجز مكالمة استشارة"),
  "צפייה בפרויקטים": r("View projects", "Ver proyectos", "Ver projetos", "عرض المشاريع"),
  "משרד עסקי יוקרתי ומודרני": r("A luxury modern business office", "Una oficina de negocio de lujo y moderna", "Um escritório de negócio de luxo e moderno", "مكتب أعمال فاخر وحديث"),
  "נוכחות עסקית שמייצרת אמון": r("A business presence that creates trust", "Una presencia de negocio que genera confianza", "Uma presença de negócio que gera confiança", "حضور أعمال يصنع ثقة"),
  "היררכיה ברורה, אזורי תוכן חזקים, הוכחות, שירותים וקריאה לפעולה שמובילה לפניות.":
    r(
      "Clear hierarchy, strong content areas, proof, services, and a call to action that leads to inquiries.",
      "Jerarquía clara, áreas de contenido fuertes, pruebas, servicios y una llamada a la acción que lleva a consultas.",
      "Hierarquia clara, áreas de conteúdo fortes, provas, serviços e um chamado à ação que leva a consultas.",
      "تسلسل واضح ومناطق محتوى قوية وإثباتات وخدمات ودعوة للفعل تؤدي إلى استفسارات.",
    ),
  "שביעות רצון": r("Satisfaction", "Satisfacción", "Satisfação", "رضا"),
  "מה אנחנו עושים": r("What we do", "Qué hacemos", "O que fazemos", "ماذا نفعل"),
  "כל מה שעסק צריך כדי להיראות כמו מותג רציני ולא כמו עוד אתר רגיל.": r(
    "Everything a business needs to look like a serious brand, not just another ordinary site.",
    "Todo lo que un negocio necesita para verse como una marca seria y no como un sitio más.",
    "Tudo o que um negócio precisa para parecer uma marca séria, e não mais um site qualquer.",
    "كل ما يحتاجه عمل ليبدو كعلامة جدّية وليس كموقع عادي آخر.",
  ),
  "Spalcio בנויה לעסקים שמוכרים אמון, מומחיות ותוצאה — עם מבנה שמציג ערך מהר, ברור וחזק.":
    r(
      "Spalcio is built for businesses that sell trust, expertise, and results — with a layout that shows value fast, clearly, and strongly.",
      "Spalcio está hecha para negocios que venden confianza, expertise y resultado — con una estructura que muestra valor rápido, claro y fuerte.",
      "A Spalcio é feita para negócios que vendem confiança, expertise e resultado — com uma estrutura que mostra valor rápido, claro e forte.",
      "سبالسيو مبنية لأعمال تبيع الثقة والخبرة والنتيجة — ببنية تعرض القيمة بسرعة ووضوح وقوة.",
    ),
  "אסטרטגיה ומיצוב": r("Strategy and positioning", "Estrategia y posicionamiento", "Estratégia e posicionamento", "استراتيجية وتموضع"),
  "חידוד המסר, קהל היעד וההצעה העסקית כדי שכל אזור באתר יעבוד לטובת מכירה ופנייה.":
    r(
      "Sharpen the message, audience, and offer so every area of the site works toward a sale and an inquiry.",
      "Afinar el mensaje, la audiencia y la oferta para que cada área del sitio trabaje a favor de la venta y la consulta.",
      "Ajustar a mensagem, o público e a oferta para cada área do site trabalhar a favor da venda e da consulta.",
      "صقل الرسالة والجمهور والعرض حتى يعمل كل جزء في الموقع لصالح البيع والاستفسار.",
    ),
  "נראות פרימיום": r("Premium look", "Imagen premium", "Visual premium", "مظهر فاخر"),
  "עיצוב נקי, אלגנטי ובטוח שמייצר תחושה של עסק מבוסס, מקצועי ואמין כבר מהכניסה הראשונה.":
    r(
      "Clean, elegant, confident design that feels like an established, professional, trustworthy business from the first visit.",
      "Diseño limpio, elegante y seguro que genera la sensación de un negocio consolidado, profesional y fiable desde la primera visita.",
      "Design limpo, elegante e seguro que gera a sensação de um negócio consolidado, profissional e confiável desde a primeira visita.",
      "تصميم نظيف وأنيق وواثق يصنع شعور عمل راسخ ومهني وموثوق من أول زيارة.",
    ),
  "מערכת שמביאה פניות": r("A system that brings inquiries", "Un sistema que trae consultas", "Um sistema que traz consultas", "منظومة تجلب الاستفسارات"),
  "מבנה שמוביל את הגולש משלב ההתעניינות לשלב הפעולה: טופס, שיחה, קביעת פגישה או יצירת קשר.":
    r(
      "A layout that leads the visitor from interest to action: a form, a call, booking a meeting, or getting in touch.",
      "Una estructura que lleva al visitante del interés a la acción: formulario, llamada, reserva de reunión o contacto.",
      "Uma estrutura que leva o visitante do interesse à ação: formulário, chamada, agendamento ou contato.",
      "بنية تقود الزائر من الاهتمام إلى الفعل: نموذج أو مكالمة أو حجز اجتماع أو تواصل.",
    ),
  "עבודות נבחרות": r("Selected work", "Trabajos seleccionados", "Trabalhos selecionados", "أعمال مختارة"),
  "תצוגת פרויקטים שמוכיחה יכולת, ניסיון ותוצאה — לא רק טקסט יפה.": r(
    "A project display that proves ability, experience, and results — not just pretty text.",
    "Una muestra de proyectos que prueba capacidad, experiencia y resultado — no solo texto bonito.",
    "Uma vitrine de projetos que prova capacidade, experiência e resultado — não só texto bonito.",
    "عرض مشاريع يثبت القدرة والخبرة والنتيجة — وليس نصاً جميلاً فقط.",
  ),
  "סטודיו לייעוץ עסקי": r("A business consulting studio", "Un estudio de consultoría de negocio", "Um estúdio de consultoria de negócio", "استوديو استشارة أعمال"),
  "אתר תדמית נקי ויוקרתי שמציג מומחיות, שירותים ותהליך עבודה בצורה שמייצרת אמון.":
    r(
      "A clean luxury profile site that shows expertise, services, and a work process in a way that creates trust.",
      "Un sitio de imagen limpio y de lujo que muestra expertise, servicios y un proceso de trabajo de forma que genera confianza.",
      "Um site institucional limpo e de luxo que mostra expertise, serviços e um processo de trabalho de forma que gera confiança.",
      "موقع تعريفي نظيف وفاخر يعرض الخبرة والخدمات وعملية العمل بطريقة تصنع ثقة.",
    ),
  "חברת נדל״ן והשקעות": r("A real-estate and investment firm", "Una empresa inmobiliaria e de inversión", "Uma empresa imobiliária e de investimentos", "شركة عقارات واستثمار"),
  "עמוד עסקי חזק עם נראות יציבה, אזורי הוכחה, פרויקטים וקריאה ברורה לפעולה.":
    r(
      "A strong business page with a stable look, proof areas, projects, and a clear call to action.",
      "Una página de negocio fuerte con imagen estable, áreas de prueba, proyectos y una llamada clara a la acción.",
      "Uma página de negócio forte com visual estável, áreas de prova, projetos e um chamado claro à ação.",
      "صفحة أعمال قوية بمظهر ثابت ومناطق إثبات ومشاريع ودعوة واضحة للفعل.",
    ),
  "סוכנות קריאייטיב": r("A creative agency", "Una agencia creativa", "Uma agência criativa", "وكالة إبداعية"),
  "תצוגת עבודות מודרנית שמדגישה יכולות, תוצאות, תהליך וייחודיות של המותג.":
    r(
      "A modern work display that highlights capability, results, process, and brand uniqueness.",
      "Una muestra de trabajos moderna que destaca capacidades, resultados, proceso y la singularidad de la marca.",
      "Uma vitrine de trabalhos moderna que destaca capacidades, resultados, processo e a singularidade da marca.",
      "عرض أعمال حديث يبرز القدرات والنتائج والعملية وتفرّد العلامة.",
    ),
  "למה זה עובד": r("Why it works", "Por qué funciona", "Por que funciona", "لماذا يعمل"),
  "האתר לא רק נראה טוב — הוא בנוי כדי לגרום ללקוח להבין למה לבחור בכם.": r(
    "The site does not just look good — it is built so the client understands why to choose you.",
    "El sitio no solo se ve bien — está construido para que el cliente entienda por qué elegiros.",
    "O site não só parece bom — é feito para o cliente entender por que escolher vocês.",
    "الموقع لا يبدو جيداً فقط — إنه مبني حتى يفهم الزبون لماذا يختاركم.",
  ),
  "Spalcio נותנת לעסק מבוסס שירותים מבנה מלא עם מסר חד, הצגת שירותים, פרויקטים, תהליך עבודה, המלצות ויצירת קשר. כל חלק באתר נועד לחזק אמון ולהוביל לפעולה.":
    r(
      "Spalcio gives a service business a full layout with a sharp message, services, projects, a work process, testimonials, and contact. Every part of the site is meant to strengthen trust and lead to action.",
      "Spalcio da a un negocio de servicios una estructura completa con un mensaje nítido, servicios, proyectos, un proceso de trabajo, testimonios y contacto. Cada parte del sitio está hecha para reforzar confianza y llevar a la acción.",
      "A Spalcio dá a um negócio de serviços uma estrutura completa com uma mensagem nítida, serviços, projetos, um processo de trabalho, depoimentos e contato. Cada parte do site é feita para reforçar confiança e levar à ação.",
      "سبالسيو تعطي عمل خدمات بنية كاملة برسالة حادة وعرض خدمات ومشاريع وعملية عمل وشهادات وتواصل. كل جزء في الموقع معدّ لتعزيز الثقة والقيادة إلى الفعل.",
    ),
  "פגישת עבודה עסקית": r("A business work meeting", "Una reunión de trabajo de negocio", "Uma reunião de trabalho de negócio", "اجتماع عمل تجاري"),
  "נראות יוקרתית שמתאימה לעסקים רציניים": r(
    "A luxury look that fits serious businesses",
    "Una imagen de lujo que encaja en negocios serios",
    "Um visual de luxo que serve negócios sérios",
    "مظهر فاخر يناسب أعمال جدّية",
  ),
  "מסרים ברורים שמסבירים מהר מה הערך שלכם": r(
    "Clear messages that quickly explain your value",
    "Mensajes claros que explican rápido vuestro valor",
    "Mensagens claras que explicam rápido o valor de vocês",
    "رسائل واضحة تشرح بسرعة قيمتكم",
  ),
  "מבנה מוכן לפניות, שיחות ייעוץ ויצירת לידים": r(
    "A layout ready for inquiries, consulting calls, and lead capture",
    "Una estructura lista para consultas, llamadas de consultoría y captura de leads",
    "Uma estrutura pronta para consultas, chamadas de consultoria e captura de leads",
    "بنية جاهزة للاستفسارات ومكالمات الاستشارة وجمع العملاء المحتملين",
  ),
  "מבנה פשוט וברור שמוביל את הלקוח מהיכרות לפנייה.": r(
    "A simple, clear layout that leads the client from introduction to inquiry.",
    "Una estructura simple y clara que lleva al cliente del conocimiento a la consulta.",
    "Uma estrutura simples e clara que leva o cliente do conhecimento à consulta.",
    "بنية بسيطة وواضحة تقود الزبون من التعارف إلى الاستفسار.",
  ),
  "מגדירים מסר": r("Define the message", "Definir el mensaje", "Definir a mensagem", "تحديد الرسالة"),
  "מציגים בצורה ברורה מי אתם, למי אתם עוזרים ולמה כדאי לבחור דווקא בכם.": r(
    "You show clearly who you are, who you help, and why they should choose you.",
    "Mostráis con claridad quiénes sois, a quién ayudáis y por qué conviene elegiros.",
    "Vocês mostram com clareza quem são, a quem ajudam e por que convém escolhê-los.",
    "تعرضون بوضوح من أنتم ولمن تساعدون ولماذا يستحق اختياركم.",
  ),
  "בונים אמון": r("Build trust", "Construir confianza", "Construir confiança", "بناء الثقة"),
  "מוסיפים שירותים, פרויקטים, יתרונות, המלצות ותהליך שמחזקים את הביטחון של הלקוח.":
    r(
      "Add services, projects, benefits, testimonials, and a process that strengthen the client's confidence.",
      "Añadís servicios, proyectos, ventajas, testimonios y un proceso que refuerzan la confianza del cliente.",
      "Vocês acrescentam serviços, projetos, vantagens, depoimentos e um processo que reforçam a confiança do cliente.",
      "تضيفون خدمات ومشاريع ومزايا وشهادات وعملية تعزّز ثقة الزبون.",
    ),
  "מובילים לפעולה": r("Lead to action", "Llevar a la acción", "Levar à ação", "القيادة إلى الفعل"),
  "מסיימים עם קריאה ברורה לפעולה כדי שהגולש ידע בדיוק מה הצעד הבא.": r(
    "Finish with a clear call to action so the visitor knows exactly what the next step is.",
    "Termináis con una llamada clara a la acción para que el visitante sepa exactamente cuál es el siguiente paso.",
    "Vocês terminam com um chamado claro à ação para o visitante saber exatamente qual é o próximo passo.",
    "تنهون بدعوة واضحة للفعل حتى يعرف الزائر بالضبط ما هي الخطوة التالية.",
  ),
  "האתר החדש שינה לגמרי את הרושם הראשוני. פתאום העסק נראה מסודר, מקצועי והרבה יותר יוקרתי.":
    r(
      "The new site completely changed the first impression. Suddenly the business looks organized, professional, and much more luxury.",
      "El sitio nuevo cambió por completo la primera impresión. De pronto el negocio se ve ordenado, profesional y mucho más de lujo.",
      "O site novo mudou por completo a primeira impressão. De repente o negócio parece organizado, profissional e bem mais de luxo.",
      "الموقع الجديد غيّر الانطباع الأول تماماً. فجأة يبدو العمل مرتّباً ومهنياً وأكثر فخامة بكثير.",
    ),
  "מייסד סטודיו": r("Studio founder", "Fundador de estudio", "Fundador de estúdio", "مؤسس استوديو"),
  "רוצים אתר עסקי שנראה מקצועי ומייצר יותר פניות?": r(
    "Want a business site that looks professional and generates more inquiries?",
    "¿Quieres un sitio de negocio que se vea profesional y genere más consultas?",
    "Quer um site de negócio que pareça profissional e gere mais consultas?",
    "تريدون موقعاً تجارياً يبدو مهنياً ويولّد المزيد من الاستفسارات؟",
  ),
  "שם פרטי": r("First name", "Nombre", "Nome", "الاسم الأول"),
  "שם משפחה": r("Last name", "Apellido", "Sobrenome", "اسم العائلة"),
  "ספרו לנו על העסק או הפרויקט שלכם": r(
    "Tell us about your business or project",
    "Cuéntanos sobre tu negocio o proyecto",
    "Contem sobre o negócio ou o projeto de vocês",
    "أخبرونا عن عملكم أو مشروعكم",
  ),
  "שליחת הודעה": r("Send message", "Enviar mensaje", "Enviar mensagem", "إرسال رسالة"),
  "א׳–ה׳, 09:00–18:00": r("Sun–Thu, 09:00–18:00", "Dom–jue, 09:00–18:00", "Dom–qui, 09:00–18:00", "أحد–خميس، 09:00–18:00"),
  "שירות חשמל לבית ולעסק": r(
    "Electrical service for home and business",
    "Servicio eléctrico para casa y negocio",
    "Serviço elétrico para casa e negócio",
    "خدمة كهرباء للمنزل والعمل",
  ),
  "שירות 24/7": r("24/7 service", "Servicio 24/7", "Serviço 24/7", "خدمة 24/7"),
  "מחירים הוגנים": r("Fair prices", "Precios justos", "Preços justos", "أسعار عادلة"),
  "חשמלאים מוסמכים": r("Licensed electricians", "Electricistas certificados", "Eletricistas certificados", "كهربائيون معتمدون"),
  "פריסה ארצית": r("Nationwide coverage", "Cobertura nacional", "Cobertura nacional", "تغطية على مستوى البلاد"),
  "חשמלאי מוסמך עם ניסיון": r("A licensed electrician with experience", "Un electricista certificado con experiencia", "Um eletricista certificado com experiência", "كهربائي معتمد ذو خبرة"),
  "מתקנים, משדרגים ומשפצים מערכות חשמל": r(
    "We repair, upgrade, and renovate electrical systems",
    "Reparamos, mejoramos y reformamos sistemas eléctricos",
    "Reparamos, atualizamos e reformamos sistemas elétricos",
    "نصلح ونرقّي ونجدّد أنظمة الكهرباء",
  ),
  "בכל סוגי הבתים והעסקים.": r(
    "in every type of home and business.",
    "en todo tipo de casas y negocios.",
    "em todo tipo de casas e negócios.",
    "في كل أنواع المنازل والأعمال.",
  ),
  "שירות חשמל מקצועי, מהיר ובטוח — מתיקון תקלה ועד שדרוג מערכת מלאה. זמינים לקריאות דחופות, התקנות, לוחות חשמל ותחזוקה שוטפת.":
    r(
      "Professional, fast, and safe electrical service — from a fault repair to a full system upgrade. Available for urgent calls, installations, electrical panels, and ongoing maintenance.",
      "Servicio eléctrico profesional, rápido y seguro — desde la reparación de una avería hasta una mejora completa del sistema. Disponibles para llamadas urgentes, instalaciones, cuadros eléctricos y mantenimiento continuo.",
      "Serviço elétrico profissional, rápido e seguro — do reparo de uma falha até um upgrade completo do sistema. Disponíveis para chamadas urgentes, instalações, quadros elétricos e manutenção contínua.",
      "خدمة كهرباء مهنية وسريعة وآمنة — من إصلاح عطل حتى ترقية منظومة كاملة. متاحون للمكالمات العاجلة والتركيب ولوحات الكهرباء والصيانة المستمرة.",
    ),
  "שירות מהיר, אמין ומקצועי": r("Fast, reliable, professional service", "Servicio rápido, fiable y profesional", "Serviço rápido, confiável e profissional", "خدمة سريعة وموثوقة ومهنية"),
  "חשמלאים מוסמכים עם ניסיון רב": r(
    "Licensed electricians with extensive experience",
    "Electricistas certificados con amplia experiencia",
    "Eletricistas certificados com ampla experiência",
    "كهربائيون معتمدون بخبرة واسعة",
  ),
  "מענה 24/7 לכל בעיה וקריאה": r(
    "24/7 response for every issue and call",
    "Respuesta 24/7 a cada problema y llamada",
    "Resposta 24/7 para cada problema e chamada",
    "استجابة 24/7 لكل مشكلة ومكالمة",
  ),
  "לקביעת ביקור": r("Book a visit", "Reservar una visita", "Marcar uma visita", "حجز زيارة"),
  "זמינות לקריאות חשמל דחופות ותיאום מהיר": r(
    "Available for urgent electrical calls and fast scheduling",
    "Disponibilidad para llamadas eléctricas urgentes y coordinación rápida",
    "Disponibilidade para chamadas elétricas urgentes e agendamento rápido",
    "توفّر لمكالمات الكهرباء العاجلة وتنسيق سريع",
  ),
  "זמינות מלאה": r("Full availability", "Disponibilidad completa", "Disponibilidade completa", "توفّر كامل"),
  "תיקונים ושדרוגים": r("Repairs and upgrades", "Reparaciones y mejoras", "Reparos e upgrades", "إصلاحات وترقيات"),
  "תיקון תקלות, שדרוג לוח חשמל, החלפת שקעים ונקודות בצורה בטוחה.": r(
    "Fault repair, panel upgrades, and safe replacement of sockets and points.",
    "Reparación de fallos, mejora del cuadro eléctrico y recambio seguro de enchufes y puntos.",
    "Reparo de falhas, upgrade do quadro elétrico e troca segura de tomadas e pontos.",
    "إصلاح أعطال وترقية لوحة الكهرباء واستبدال مقابس ونقاط بشكل آمن.",
  ),
  "התקנות חדשות": r("New installations", "Instalaciones nuevas", "Instalações novas", "تركيبات جديدة"),
  "התקנת גופי תאורה, נקודות חשמל, מפסקים, מאווררים ומערכות ביתיות.": r(
    "Installing light fixtures, electrical points, switches, fans, and home systems.",
    "Instalación de luminarias, puntos eléctricos, interruptores, ventiladores y sistemas del hogar.",
    "Instalação de luminárias, pontos elétricos, interruptores, ventiladores e sistemas da casa.",
    "تركيب وحدات إضاءة ونقاط كهرباء ومفاتيح ومراوح وأنظمة منزلية.",
  ),
  "שדרוג ואוטומציה": r("Upgrade and automation", "Mejora y automatización", "Upgrade e automação", "ترقية وأتمتة"),
  "הכנה לבית חכם, תכנון עומסים, חיבור מערכות ותשתיות מתקדמות.": r(
    "Preparation for a smart home, load planning, connecting systems, and advanced infrastructure.",
    "Preparación para casa inteligente, planificación de cargas, conexión de sistemas e infraestructuras avanzadas.",
    "Preparação para casa inteligente, planejamento de cargas, ligação de sistemas e infraestruturas avançadas.",
    "تجهيز لمنزل ذكي وتخطيط أحمال وربط أنظمة وبنى تحتية متقدمة.",
  ),
  "פתרונות לעסקים": r("Solutions for businesses", "Soluciones para negocios", "Soluções para negócios", "حلول للأعمال"),
  "תכנון וביצוע מערכות חשמל לעסקים, משרדים ומבנים מסחריים.": r(
    "Planning and installing electrical systems for businesses, offices, and commercial buildings.",
    "Planificación y ejecución de sistemas eléctricos para negocios, oficinas y edificios comerciales.",
    "Planejamento e execução de sistemas elétricos para negócios, escritórios e edifícios comerciais.",
    "تخطيط وتنفيذ أنظمة كهرباء للأعمال والمكاتب والمباني التجارية.",
  ),
  "התקנות תאורה": r("Lighting installations", "Instalaciones de iluminación", "Instalações de iluminação", "تركيبات إضاءة"),
  "גופי תאורה, פסי לד, תאורת חוץ, תאורת פנים ותכנון נקודות חדשות.": r(
    "Light fixtures, LED strips, outdoor lighting, indoor lighting, and planning new points.",
    "Luminarias, tiras LED, iluminación exterior, interior y planificación de puntos nuevos.",
    "Luminárias, fitas LED, iluminação externa, interna e planejamento de pontos novos.",
    "وحدات إضاءة وأشرطة LED وإضاءة خارجية وداخلية وتخطيط نقاط جديدة.",
  ),
  "תחזוקה מונעת": r("Preventive maintenance", "Mantenimiento preventivo", "Manutenção preventiva", "صيانة وقائية"),
  "בדיקות תקופתיות, סריקות עומסים, איתור תקלות ומניעת בעיות מראש.": r(
    "Periodic checks, load scans, fault finding, and preventing issues in advance.",
    "Revisiones periódicas, escaneos de carga, localización de fallos y prevención de problemas de antemano.",
    "Verificações periódicas, varreduras de carga, localização de falhas e prevenção de problemas de antemão.",
    "فحوصات دورية ومسح أحمال وتحديد أعطال ومنع المشاكل مسبقاً.",
  ),
  "זקוקים לחשמלאי עכשיו?": r("Need an electrician now?", "¿Necesitas un electricista ahora?", "Precisa de um eletricista agora?", "تحتاجون كهربائياً الآن؟"),
  "שירות מהיר, אמין ומקצועי — אנחנו כאן בשבילכם.": r(
    "Fast, reliable, professional service — we are here for you.",
    "Servicio rápido, fiable y profesional — estamos aquí para vosotros.",
    "Serviço rápido, confiável e profissional — estamos aqui para vocês.",
    "خدمة سريعة وموثوقة ومهنية — نحن هنا لأجلكم.",
  ),
  "התקשרו עכשיו": r("Call now", "Llamad ahora", "Liguem agora", "اتصلوا الآن"),
  "לקביעת ביקור או ייעוץ": r(
    "To book a visit or consultation",
    "Para reservar una visita o una consulta",
    "Para marcar uma visita ou consulta",
    "لحجز زيارة أو استشارة",
  ),
  "השאירו פרטים ונחזור אליכם במהירות.": r(
    "Leave your details and we will get back quickly.",
    "Deja tus datos y te responderemos rápido.",
    "Deixe seus dados e voltaremos rápido.",
    "اتركوا التفاصيل وسنعود بسرعة.",
  ),
  "נשמח להבין מה התקלה, לתאם ביקור ולתת הצעת מחיר מסודרת.": r(
    "We will be glad to understand the issue, schedule a visit, and give an organized quote.",
    "Estaremos encantados de entender la avería, coordinar una visita y dar un presupuesto ordenado.",
    "Vamos ficar felizes em entender a falha, agendar uma visita e dar um orçamento organizado.",
    "يسعدنا فهم العطل وتنسيق زيارة وتقديم عرض سعر مرتّب.",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique43.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique43 rows`);
