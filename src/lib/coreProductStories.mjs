/**
 * Published product stories for the public site.
 * Facts are limited to behavior already described in the product:
 * six lead statuses, CRM $49, Business $99 or $990, WhatsApp $29 plus separate Meta fees,
 * business-plan automations, Meta campaign editing after the business connects its own ad account,
 * website forms that can create a lead, appointment slots of 15 minutes on the business plan.
 */

function story(title, description, crumb, h1, lede, sections, faq, links) {
  return {
    title,
    description,
    crumb,
    h1,
    lede,
    paragraphs: [lede],
    sections: sections.map(([heading, ...paragraphs]) => ({ heading, paragraphs })),
    faq,
    links,
  };
}

const LINKS = {
  en: [["/platform", "Platform"], ["/crm", "CRM"], ["/pricing", "Pricing"], ["/guides", "Guides"], ["/contact", "Contact"]],
  he: [["/platform", "הפלטפורמה"], ["/crm", "CRM"], ["/pricing", "מחירים"], ["/guides", "מדריכים"], ["/contact", "יצירת קשר"]],
  es: [["/platform", "Plataforma"], ["/crm", "CRM"], ["/pricing", "Precios"], ["/guides", "Guías"], ["/contact", "Contacto"]],
  "pt-BR": [["/platform", "Plataforma"], ["/crm", "CRM"], ["/pricing", "Preços"], ["/guides", "Guias"], ["/contact", "Contato"]],
  ar: [["/platform", "المنصة"], ["/crm", "CRM"], ["/pricing", "الأسعار"], ["/guides", "الأدلة"], ["/contact", "اتصال"]],
};

const PAGES = {
  "/whatsapp-api": {
    en: story(
      "WhatsApp Business API for businesses | BizUply",
      "Connect WhatsApp Business API with BizUply. Approved templates and business messaging under Meta's rules, with a published price of $29 per connected number. Meta messaging fees are separate.",
      "WhatsApp",
      "WhatsApp Business API that connects communication to the business",
      "Use WhatsApp Business API for business conversations, send messages that require an approved template, and keep that channel next to the customer work BizUply already supports.",
      [
        ["WhatsApp is a business channel. The work is to keep it inside a clear process.", "When a customer asks a question or receives an update, the message should follow the permissions of the account. WhatsApp Business API is Meta's interface for software. BizUply connects the Cloud API: approved templates, delivery follow-up and signed webhooks.", "The connection is Embedded Signup inside the business dashboard. Meta approves the templates and the number. There is no separate BizUply approval queue."],
        ["Message templates", "Some outbound messages must use a template Meta has already approved. The template fixes the wording for that category. Marketing, utility and authentication messages follow the categories Meta applies at the time of sending.", "BizUply does not approve a template in Meta's place, and it does not waive consent rules."],
        ["Initiated messages", "A business can start a conversation when the account meets Meta's conditions: the right template, consent where it is required, and the quality limits of that phone number.", "BizUply does not allow a send to every number. A number that has not opted in, or a message that breaks WhatsApp policy, is outside the product."],
        ["Next to the customer record", "A WhatsApp conversation is more useful when the team can see the lead or the customer it belongs to. Where the account has both products, the message sits beside the CRM record instead of in a separate inbox with no context.", "The WhatsApp subscription is not the CRM plan. It is $29 per month for each connected number. Meta bills the messages separately, by use and by category."],
        ["Before you connect a number", "Setup can include a Meta business account, verification, a phone number and templates. An existing number can move only when Meta and the current provider allow it. Check that before promising the number to a customer.", "One subscription covers one connected number. A second number needs its own $29 subscription."],
      ],
      [
        ["What is WhatsApp Business API?", "It is WhatsApp's interface for software. A business uses it to run supported conversations and templates, under Meta's policy and the permissions of the account."],
        ["How is the API different from the WhatsApp Business app?", "The app is a person using WhatsApp Business directly. The API connects that number to software, templates and webhooks."],
        ["Can we send marketing messages?", "Only when the account has the right consent and the message uses the template and category Meta requires."],
        ["Do templates need approval?", "Yes. Outbound messages that WhatsApp classifies as template messages wait for Meta's approval."],
        ["Can we message any phone number?", "No. Consent, WhatsApp policy and the account's quality limits still apply."],
        ["What does the service cost?", "The published BizUply price is $29 per month for each connected number. Meta's own message charges are separate."],
        ["Can we keep the current number?", "Only if Meta and the current WhatsApp provider allow that number to move. It has to be checked before the business commits."],
      ],
      LINKS.en,
    ),
    he: story(
      "WhatsApp Business API לעסקים | BizUply",
      "חיבור WhatsApp Business API לעסק עם BizUply. תבניות הודעה ותקשורת עסקית בהתאם למדיניות Meta. המחיר המפורסם הוא 29 דולר לחודש למספר מחובר, וחיובי ההודעות של Meta נפרדים.",
      "WhatsApp",
      "WhatsApp Business API שמחבר בין התקשורת לעסק",
      "נהלו תקשורת עסקית באמצעות WhatsApp Business API, שלחו הודעות שדורשות תבנית מאושרת, והשאירו את הערוץ ליד עבודת הלקוחות ש־BizUply כבר תומכת בה.",
      [
        ["WhatsApp הוא ערוץ עסקי. הניהול הופך אותו לחלק מהעבודה.", "כשלקוח שואל, מבקש מידע או מקבל עדכון, ההודעה צריכה לעמוד בהרשאות של החשבון. WhatsApp Business API הוא הממשק של Meta לתוכנה. BizUply מחברת את Cloud API: תבניות מאושרות, מעקב מסירה ו־webhooks חתומים.", "החיבור נעשה ב־Embedded Signup מתוך לוח הבקרה. Meta מאשרת את התבניות ואת המספר. אין תור אישור נפרד של BizUply."],
        ["תבניות הודעה", "חלק מההודעות היוצאות חייבות תבנית ש־Meta כבר אישרה. התבנית קובעת את הנוסח לקטגוריה הזו. הודעות שיווק, תפעול ואימות נשלחות לפי הקטגוריות ש־Meta מחילה בזמן השליחה.", "BizUply לא מאשרת תבנית במקום Meta, ולא מוותרת על כללי הסכמה."],
        ["הודעות שהעסק יוזם", "אפשר לפתוח שיחה כשהחשבון עומד בתנאים של Meta: התבנית הנכונה, הסכמה כשהיא נדרשת, ומגבלות האיכות של המספר.", "אי אפשר לשלוח לכל מספר. מספר בלי הסכמה, או הודעה שחורגת ממדיניות WhatsApp, אינם חלק מהמוצר."],
        ["תקשורת ליד רשומת הלקוח", "שיחת WhatsApp מועילה יותר כשהצוות רואה את הליד או את הלקוח שהיא שייכת אליו. בחשבון שבו שני המוצרים פעילים, ההודעה נשארת ליד הרשומה ולא בתיבה נפרדת בלי הקשר.", "מנוי WhatsApp אינו מסלול ה־CRM. הוא 29 דולר לחודש לכל מספר מחובר. Meta מחייבת את ההודעות בנפרד, לפי שימוש ולפי קטגוריה."],
        ["לפני חיבור המספר", "ההפעלה יכולה לכלול חשבון עסקי ב־Meta, אימות, מספר טלפון ותבניות. מספר קיים עובר רק אם Meta והספק הנוכחי מאפשרים זאת. בודקים את זה לפני שמתחייבים מול לקוח.", "מנוי אחד מכסה מספר מחובר אחד. מספר נוסף דורש מנוי נפרד של 29 דולר."],
      ],
      [
        ["מה זה WhatsApp Business API?", "זה הממשק של WhatsApp לתוכנה. עסק משתמש בו לשיחות ולתבניות נתמכות, לפי מדיניות Meta ולהרשאות החשבון."],
        ["מה ההבדל בין האפליקציה ל־API?", "האפליקציה מיועדת לאדם שעובד ישירות ב־WhatsApp Business. ה־API מחבר את המספר לתוכנה, לתבניות ול־webhooks."],
        ["האם אפשר לשלוח הודעות שיווקיות?", "רק כשיש הסכמה מתאימה וההודעה עומדת בתבנית ובקטגוריה ש־Meta דורשת."],
        ["האם צריך לאשר תבניות?", "כן. הודעות ש־WhatsApp מסווגת כהודעות תבנית ממתינות לאישור של Meta."],
        ["האם אפשר לשלוח לכל מספר?", "לא. הסכמה, מדיניות WhatsApp ומגבלות האיכות של החשבון נשארות בתוקף."],
        ["כמה עולה השירות?", "המחיר המפורסם של BizUply הוא 29 דולר לחודש לכל מספר מחובר. חיובי ההודעות של Meta נפרדים."],
        ["מה כוללים 29 הדולר?", "מנוי למספר וואטסאפ מחובר אחד: חיבור, API ו־webhooks, תבניות, לוח בקרה ותיעוד. מספר נוסף דורש מנוי נפרד. חיובי Meta אינם כלולים."],
        ["האם אפשר לחבר את המספר הקיים?", "רק אם Meta והספק הנוכחי מאפשרים להעביר את המספר. צריך לבדוק לפני התחייבות."],
      ],
      LINKS.he,
    ),
    es: story(
      "WhatsApp Business API para empresas | BizUply",
      "Conecte WhatsApp Business API con BizUply. Plantillas aprobadas y mensajería empresarial según las reglas de Meta. El precio publicado es 29 dólares al mes por número conectado. Los cargos de Meta van aparte.",
      "WhatsApp",
      "WhatsApp Business API que une la comunicación con el negocio",
      "Gestione la comunicación con WhatsApp Business API, envíe los mensajes que exigen una plantilla aprobada y deje ese canal junto al trabajo con clientes que BizUply ya admite.",
      [
        ["WhatsApp es un canal de negocio. El trabajo es mantenerlo dentro de un proceso claro.", "Cuando un cliente pregunta o recibe un aviso, el mensaje debe respetar los permisos de la cuenta. La API es la interfaz de Meta para el software. BizUply conecta Cloud API: plantillas aprobadas, seguimiento de entrega y webhooks firmados.", "La conexión se hace con Embedded Signup desde el panel. Meta aprueba las plantillas y el número. No hay una cola de aprobación aparte de BizUply."],
        ["Plantillas de mensaje", "Parte de los mensajes salientes exige una plantilla que Meta ya aprobó. La plantilla fija el texto de esa categoría. Marketing, utilidad y autenticación siguen las categorías que Meta aplica al enviar.", "BizUply no aprueba una plantilla en lugar de Meta y no anula las reglas de consentimiento."],
        ["Mensajes iniciados por el negocio", "Se puede abrir una conversación cuando la cuenta cumple las condiciones de Meta: la plantilla correcta, el consentimiento cuando hace falta y los límites de calidad del número.", "No se puede escribir a cualquier número. Un número sin consentimiento, o un mensaje fuera de la política de WhatsApp, queda fuera del producto."],
        ["La conversación junto a la ficha", "Una conversación de WhatsApp sirve más cuando el equipo ve el lead o el cliente al que pertenece. Si la cuenta tiene los dos productos, el mensaje queda junto al registro y no en una bandeja sin contexto.", "La suscripción de WhatsApp no es el plan de CRM. Cuesta 29 dólares al mes por cada número conectado. Meta factura los mensajes aparte, según el uso y la categoría."],
        ["Antes de conectar un número", "La puesta en marcha puede incluir una cuenta de Meta, verificación, un teléfono y plantillas. Un número actual solo se mueve si Meta y el proveedor actual lo permiten. Hay que comprobarlo antes de prometerlo.", "Una suscripción cubre un número. Un segundo número necesita otra suscripción de 29 dólares."],
      ],
      [
        ["¿Qué es WhatsApp Business API?", "Es la interfaz de WhatsApp para software. El negocio la usa para conversaciones y plantillas compatibles, según la política de Meta y los permisos de la cuenta."],
        ["¿En qué se diferencia de la aplicación WhatsApp Business?", "La aplicación es una persona trabajando directo en WhatsApp Business. La API conecta el número con software, plantillas y webhooks."],
        ["¿Se pueden enviar mensajes de marketing?", "Solo con el consentimiento adecuado y con la plantilla y la categoría que Meta exige."],
        ["¿Hay que aprobar plantillas?", "Sí. Los mensajes que WhatsApp clasifica como plantilla esperan la aprobación de Meta."],
        ["¿Se puede escribir a cualquier número?", "No. Siguen vigentes el consentimiento, la política de WhatsApp y los límites de calidad de la cuenta."],
        ["¿Cuánto cuesta el servicio?", "El precio publicado de BizUply es 29 dólares al mes por número conectado. Los cargos de mensajes de Meta son aparte."],
        ["¿Se puede conservar el número actual?", "Solo si Meta y el proveedor actual permiten moverlo. Hay que verificarlo antes de comprometerse."],
      ],
      LINKS.es,
    ),
    "pt-BR": story(
      "API do WhatsApp Business para empresas | BizUply",
      "Conecte a API do WhatsApp Business com a BizUply. Modelos aprovados e mensagens comerciais segundo as regras da Meta. O preço publicado é 29 dólares por mês para cada número conectado. As tarifas de mensagem da Meta são separadas.",
      "WhatsApp",
      "API do WhatsApp Business ligada ao trabalho do negócio",
      "Conduza a comunicação pela API do WhatsApp Business, envie as mensagens que exigem um modelo aprovado e mantenha esse canal ao lado do atendimento que a BizUply já sustenta.",
      [
        ["WhatsApp é um canal comercial. O cuidado é mantê-lo dentro de um processo.", "Quando o cliente pergunta ou recebe um aviso, a mensagem precisa respeitar as permissões da conta. A API é a interface da Meta para software. A BizUply conecta a Cloud API: modelos aprovados, acompanhamento de entrega e webhooks assinados.", "A conexão acontece no Embedded Signup, dentro do painel. A Meta aprova os modelos e o número. Não existe uma fila de aprovação separada da BizUply."],
        ["Modelos de mensagem", "Parte das mensagens de saída exige um modelo que a Meta já aprovou. O modelo fixa o texto daquela categoria. Marketing, utilidade e autenticação seguem as categorias que a Meta aplica no envio.", "A BizUply não aprova um modelo no lugar da Meta e não dispensa as regras de consentimento."],
        ["Mensagens iniciadas pelo negócio", "Dá para abrir uma conversa quando a conta cumpre as condições da Meta: o modelo certo, o consentimento quando ele é exigido e os limites de qualidade do número.", "Não dá para escrever para qualquer número. Número sem consentimento, ou mensagem fora da política do WhatsApp, fica de fora do produto."],
        ["A conversa ao lado da ficha", "Uma conversa de WhatsApp ajuda mais quando a equipe vê o lead ou o cliente a que ela pertence. Na conta em que os dois produtos estão ativos, a mensagem fica junto do registro, não numa caixa sem contexto.", "A assinatura do WhatsApp não é o plano de CRM. São 29 dólares por mês para cada número conectado. A Meta cobra as mensagens à parte, pelo uso e pela categoria."],
        ["Antes de conectar um número", "A ativação pode incluir conta comercial na Meta, verificação, telefone e modelos. Um número que já existe só muda de provedor se a Meta e o provedor atual permitirem. Isso se confirma antes de qualquer promessa.", "Uma assinatura cobre um número. O segundo número pede outra assinatura de 29 dólares."],
      ],
      [
        ["O que é a API do WhatsApp Business?", "É a interface do WhatsApp para software. O negócio usa essa interface para conversas e modelos compatíveis, segundo a política da Meta e as permissões da conta."],
        ["Qual é a diferença para o aplicativo WhatsApp Business?", "O aplicativo é uma pessoa trabalhando direto no WhatsApp Business. A API liga o número a software, modelos e webhooks."],
        ["Dá para enviar mensagens de marketing?", "Somente com o consentimento adequado e com o modelo e a categoria que a Meta exige."],
        ["Os modelos precisam de aprovação?", "Sim. Mensagens que o WhatsApp classifica como modelo esperam a aprovação da Meta."],
        ["Dá para escrever para qualquer número?", "Não. Consentimento, política do WhatsApp e limites de qualidade da conta continuam valendo."],
        ["Quanto custa o serviço?", "O preço publicado da BizUply é 29 dólares por mês para cada número conectado. As tarifas de mensagem da Meta são separadas."],
        ["Dá para manter o número atual?", "Somente se a Meta e o provedor atual permitirem a mudança. É preciso verificar antes de assumir o compromisso."],
      ],
      LINKS["pt-BR"],
    ),
    ar: story(
      "WhatsApp Business API للأعمال | BizUply",
      "اربطوا WhatsApp Business API مع BizUply. قوالب معتمدة وتواصل تجاري وفق قواعد Meta. السعر المنشور 29 دولاراً شهرياً لكل رقم متصل. رسوم رسائل Meta منفصلة.",
      "WhatsApp",
      "WhatsApp Business API يربط التواصل بعمل النشاط",
      "أديروا التواصل عبر WhatsApp Business API، وأرسلوا الرسائل التي تتطلب قالباً معتمداً، وأبقوا هذه القناة إلى جانب عمل العملاء الذي تدعمه BizUply.",
      [
        ["WhatsApp قناة عمل. الإدارة تبقيها داخل عملية واضحة.", "حين يسأل العميل أو يتلقى تحديثاً، يجب أن تلتزم الرسالة بأذونات الحساب. واجهة API هي اتصال Meta بالبرمجيات. تربط BizUply واجهة Cloud API: قوالب معتمدة، ومتابعة التسليم، وwebhooks موقّعة.", "يتم الربط عبر Embedded Signup من داخل لوحة العمل. توافق Meta على القوالب وعلى الرقم. لا يوجد طابور موافقة منفصل لدى BizUply."],
        ["قوالب الرسائل", "بعض الرسائل الصادرة تتطلب قالباً وافقت عليه Meta مسبقاً. القالب يثبت الصياغة لتلك الفئة. رسائل التسويق والخدمة والتحقق تتبع الفئات التي تطبقها Meta وقت الإرسال.", "لا توافق BizUply على قالب بدلاً من Meta، ولا تلغي قواعد الموافقة."],
        ["رسائل يبدأها النشاط", "يمكن فتح محادثة حين يستوفي الحساب شروط Meta: القالب الصحيح، والموافقة حين تكون مطلوبة، وحدود جودة الرقم.", "لا يمكن المراسلة إلى كل رقم. رقم بلا موافقة، أو رسالة تخالف سياسة WhatsApp، خارج نطاق المنتج."],
        ["المحادثة إلى جانب سجل العميل", "تفيد محادثة WhatsApp أكثر حين يرى الفريق العميل المحتمل أو العميل الذي تخصه. في الحساب الذي يعمل فيه المنتجان، تبقى الرسالة بجانب السجل لا في صندوق بلا سياق.", "اشتراك WhatsApp ليس خطة CRM. سعره 29 دولاراً شهرياً لكل رقم متصل. تحصّل Meta رسوم الرسائل بشكل منفصل، حسب الاستخدام والفئة."],
        ["قبل ربط الرقم", "قد يشمل التشغيل حساب Meta تجارياً، والتحقق، ورقماً، وقوالب. لا ينتقل رقم قائم إلا إذا سمحت Meta والمزوّد الحالي. يُفحص ذلك قبل أي التزام.", "يغطي اشتراك واحد رقماً واحداً. الرقم الثاني يحتاج اشتراكاً آخر بقيمة 29 دولاراً."],
      ],
      [
        ["ما هو WhatsApp Business API؟", "هو واجهة WhatsApp للبرمجيات. يستخدمها النشاط للمحادثات والقوالب المدعومة، وفق سياسة Meta وأذونات الحساب."],
        ["ما الفرق عن تطبيق WhatsApp Business؟", "التطبيق لشخص يعمل مباشرة داخل WhatsApp Business. الواجهة البرمجية تربط الرقم بالبرمجيات والقوالب وwebhooks."],
        ["هل يمكن إرسال رسائل تسويقية؟", "فقط عند وجود الموافقة المناسبة واستخدام القالب والفئة التي تطلبها Meta."],
        ["هل تحتاج القوالب إلى موافقة؟", "نعم. الرسائل التي يصنفها WhatsApp كقوالب تنتظر موافقة Meta."],
        ["هل يمكن المراسلة إلى أي رقم؟", "لا. تبقى الموافقة وسياسة WhatsApp وحدود جودة الحساب سارية."],
        ["كم تبلغ تكلفة الخدمة؟", "السعر المنشور لدى BizUply هو 29 دولاراً شهرياً لكل رقم متصل. رسوم رسائل Meta منفصلة."],
        ["هل يمكن الإبقاء على الرقم الحالي؟", "فقط إذا سمحت Meta والمزوّد الحالي بنقل الرقم. يجب التحقق قبل الالتزام."],
      ],
      LINKS.ar,
    ),
  },
};

import { MORE } from "./coreProductStoriesMore.mjs";
import { REST } from "./coreProductStoriesRest.mjs";

const ALL = { ...PAGES, ...MORE, ...REST };

export function getCoreProductStory(path, locale) {
  const page = ALL[path];
  if (!page) return null;
  const language = locale === "pt" ? "pt-BR" : locale;
  return page[language] || page.en || null;
}
