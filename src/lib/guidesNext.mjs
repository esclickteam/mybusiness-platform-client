/** A closing section on each existing guide. No new public addresses. */

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function text(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function link(href, label) {
  return { href, label };
}

const glossary = link("/glossary", text("Glossary", "מילון מושגים", "Glosario", "Glossário", "المعجم"));
const templates = link("/templates", text("Workbooks and calculators", "תבניות ומחשבונים", "Plantillas y calculadoras", "Modelos e calculadoras", "قوالب وآلات حاسبة"));
const sheet = link("/compare/crm-or-spreadsheet", text("CRM or a spreadsheet", "CRM או גיליון", "CRM o una hoja de cálculo", "CRM ou uma planilha", "CRM أو جدول"));
const wa = link("/compare/whatsapp-app-or-api", text("WhatsApp app or platform", "אפליקציית וואטסאפ או הפלטפורמה", "App de WhatsApp o plataforma", "App do WhatsApp ou plataforma", "تطبيق واتساب أو المنصة"));
const pricing = link("/pricing", text("Pricing", "מחירים", "Precios", "Preços", "الأسعار"));

const NEXT = {
  "what-is-a-crm": {
    body: text(
      "Keep each inquiry in one record, with one of six statuses: New, Contacted, Interested, Converted, Lost, or Old lead. Appointments, collaborations, and automations are on the business plan. There is no lead score and no one-click spreadsheet import. A spreadsheet comparison and a workbook are linked below.",
      "שומרים כל פנייה ברשומה אחת, עם אחד משישה סטטוסים: חדש, נוצר קשר, מעוניין, הומר, אבוד, או ליד ישן. תורים, שיתופי פעולה ואוטומציות נמצאים בחבילה העסקית. אין ציון לליד ואין ייבוא גיליון בלחיצה. ההשוואה לגיליון וחוברת עבודה מקושרות למטה.",
      "Guarde cada consulta en un registro, con uno de seis estados: Nuevo, Contactado, Interesado, Convertido, Perdido o Lead antiguo. Las citas, las colaboraciones y las automatizaciones están en el plan de negocio. No hay puntuación de lead ni importación de una hoja en un clic. Abajo hay una comparación con una hoja y un libro de trabajo.",
      "Guarde cada pedido num registro, com um de seis status: Novo, Contato feito, Interessado, Convertido, Perdido ou Lead antigo. Agenda, colaborações e automações ficam no plano de negócios. Não há nota de lead nem importação de planilha num clique. Abaixo há uma comparação com uma planilha e uma pasta de trabalho.",
      "احتفظوا بكل استفسار في سجل واحد، بإحدى ست حالات: جديد، تم التواصل، مهتم، تم التحويل، ضائع، أو عميل قديم. المواعيد والتعاون والأتمتة في الخطة التجارية. لا توجد درجة للعميل ولا استيراد جدول بنقرة. في الأسفل مقارنة مع جدول ودفتر عمل.",
    ),
    links: [sheet, templates, glossary, pricing],
  },
  "follow-up-on-leads": {
    body: text(
      "Write a note and a dated task so the next step has an owner. Contacted means someone reached the person, not that a task exists. The message itself is still yours to send. WhatsApp can carry it later, on its own subscription, after a template is approved when the send is outside the customer-service window.",
      "כותבים הערה ומשימה עם תאריך, כדי שלצעד הבא יהיה אחראי. נוצר קשר אומר שמישהו באמת הגיע אל האדם, לא שקיימת משימה. את ההודעה עצמה שולחים בעצמכם. וואטסאפ יכול לשאת אותה אחר כך, במנוי נפרד, אחרי שתבנית מאושרת כשהשליחה מחוץ לחלון שירות הלקוחות.",
      "Escriba una nota y una tarea con fecha para que el siguiente paso tenga dueño. Contactado significa que alguien llegó a la persona, no que exista una tarea. El mensaje lo envía usted. WhatsApp puede llevarlo después, en su propia suscripción, cuando una plantilla esté aprobada y el envío quede fuera de la ventana de atención.",
      "Escreva uma nota e uma tarefa com data para o próximo passo ter um responsável. Contato feito significa que alguém alcançou a pessoa, não que exista uma tarefa. A mensagem é você quem envia. O WhatsApp pode levá-la depois, na própria assinatura, quando um modelo estiver aprovado e o envio ficar fora da janela de atendimento.",
      "اكتبوا ملاحظة ومهمة بتاريخ حتى تكون للخطوة التالية جهة مسؤولة. تم التواصل يعني أن أحداً وصل إلى الشخص، لا أن المهمة موجودة. الرسالة ترسلونها أنتم. يمكن لواتساب أن يحملها لاحقاً، في اشتراكه، بعد الموافقة على قالب حين يكون الإرسال خارج نافذة الخدمة.",
    ),
    links: [
      link("/guides/whatsapp-message-templates", text("Message templates", "תבניות הודעה", "Plantillas de mensajes", "Modelos de mensagem", "قوالب الرسائل")),
      link("/guides/what-is-a-crm", text("What a CRM record is", "מהי רשומת CRM", "Qué es un registro de CRM", "O que é um registro de CRM", "ما هو سجل CRM")),
      templates,
    ],
  },
  "meta-lead-ads-to-crm": {
    body: text(
      "A lead ad can create a row after the business approves the permission on its own Facebook page. The row starts as New, and the source stays on that row. Connecting the page does not start ad spend, and a result count in campaigns is not a person in the file. Bizuply is a Meta Tech Provider. That is not a Meta Business Partner badge.",
      "ליד ממודעה יכול ליצור שורה אחרי שהעסק מאשר את ההרשאה על דף הפייסבוק שלו. השורה מתחילה כחדשה, והמקור נשאר עליה. חיבור הדף לא מתחיל הוצאה על מודעות, ומספר תוצאות בקמפיינים אינו אדם בתיק. ביזאפלי היא Meta Tech Provider. זה לא תג Meta Business Partner.",
      "Un lead ad puede crear una fila después de que el negocio aprueba el permiso en su propia página de Facebook. La fila empieza en Nuevo y el origen se queda en ella. Conectar la página no inicia el gasto, y un recuento de resultados no es una persona en el expediente. Bizuply es Meta Tech Provider, no una insignia de Meta Business Partner.",
      "Um lead ad pode criar uma linha depois que o negócio aprova a permissão na própria página do Facebook. A linha começa em Novo e a origem fica nela. Conectar a página não inicia o gasto, e uma contagem de resultados não é uma pessoa no arquivo. A Bizuply é Meta Tech Provider, não um selo de Meta Business Partner.",
      "يمكن لإعلان عملاء أن ينشئ صفاً بعد موافقة النشاط على الإذن في صفحة فيسبوك الخاصة به. يبدأ الصف جديداً ويبقى المصدر عليه. ربط الصفحة لا يبدأ الإنفاق، وعدد النتائج ليس شخصاً في الملف. Bizuply هي Meta Tech Provider، وهذا ليس شارة Meta Business Partner.",
    ),
    links: [
      link("/guides/connect-a-meta-ad-account", text("Connect a Meta ad account", "חיבור חשבון מודעות של Meta", "Conectar una cuenta de anuncios de Meta", "Conectar uma conta de anúncios da Meta", "ربط حساب إعلانات Meta")),
      link("/guides/from-ad-to-follow-up", text("From the ad to the follow-up", "מהמודעה אל המעקב", "Del anuncio al seguimiento", "Do anúncio ao acompanhamento", "من الإعلان إلى المتابعة")),
      pricing,
    ],
  },
  "connect-a-meta-ad-account": {
    body: text(
      "The connection lets Bizuply read the account the business authorizes. It does not create campaigns by itself, and it does not move money. Media spend is billed by Meta. Campaign tools sit with the business plan after that account is connected.",
      "החיבור מאפשר לביזאפלי לקרוא את החשבון שהעסק מאשר. הוא לא יוצר קמפיינים לבד, והוא לא מזיז כסף. את ההוצאה על המדיה מחייבת Meta. כלי הקמפיינים יושבים עם החבילה העסקית אחרי שהחשבון מחובר.",
      "La conexión permite a Bizuply leer la cuenta que el negocio autoriza. No crea campañas sola y no mueve dinero. Meta cobra el gasto en medios. Las herramientas de campaña están en el plan de negocio después de conectar esa cuenta.",
      "A conexão permite à Bizuply ler a conta que o negócio autoriza. Ela não cria campanhas sozinha e não move dinheiro. A Meta cobra o gasto de mídia. As ferramentas de campanha ficam no plano de negócios depois que essa conta está conectada.",
      "يتيح الربط لـ Bizuply قراءة الحساب الذي يأذن به النشاط. لا ينشئ حملات وحده ولا ينقل مالاً. تحصّل Meta إنفاق الوسائط. أدوات الحملات مع الخطة التجارية بعد ربط ذلك الحساب.",
    ),
    links: [
      link("/guides/manage-meta-campaigns", text("Read a Meta campaign", "קריאת קמפיין Meta", "Leer una campaña de Meta", "Ler uma campanha da Meta", "قراءة حملة Meta")),
      link("/guides/meta-lead-ads-to-crm", text("Lead ads into the CRM", "לידים ממודעות אל ה־CRM", "Lead ads hacia el CRM", "Lead ads para o CRM", "إعلانات العملاء إلى CRM")),
    ],
  },
  "manage-meta-campaigns": {
    body: text(
      "Read the campaign report, then follow the person in the CRM. A result in the report is not yet a followed-up lead. Meta bills the media. The report alone does not show whether the campaign made money.",
      "קוראים את דוח הקמפיין, ואז עוקבים אחרי האדם ב־CRM. תוצאה בדוח אינה ליד שטופל. Meta מחייבת את המדיה. הדוח לבדו לא מראה אם הקמפיין הרוויח.",
      "Lea el informe de la campaña y luego siga a la persona en el CRM. Un resultado del informe todavía no es un lead con seguimiento. Meta cobra los medios. El informe solo no muestra si la campaña dio ganancia.",
      "Leia o relatório da campanha e depois acompanhe a pessoa no CRM. Um resultado do relatório ainda não é um lead com acompanhamento. A Meta cobra a mídia. O relatório sozinho não mostra se a campanha deu lucro.",
      "اقرأوا تقرير الحملة، ثم تابعوا الشخص في CRM. نتيجة في التقرير ليست عميلاً تمت متابعته. تحصّل Meta الوسائط. التقرير وحده لا يُظهر إن كانت الحملة رابحة.",
    ),
    links: [
      link("/guides/from-ad-to-follow-up", text("From the ad to the follow-up", "מהמודעה אל המעקב", "Del anuncio al seguimiento", "Do anúncio ao acompanhamento", "من الإعلان إلى المتابعة")),
      templates,
    ],
  },
  "from-ad-to-follow-up": {
    body: text(
      "Follow the path from the ad to a form, a CRM row, and a task. Google Ads lead forms and a form on a Bizuply site can create that row too. There is no lead score, and the ad platform's result count is not the lead list.",
      "עוקבים אחרי הדרך מהמודעה אל טופס, שורה ב־CRM ומשימה. גם טפסי לידים של Google Ads וטופס באתר של ביזאפלי יכולים ליצור את השורה. אין ציון לליד, ומספר התוצאות בפלטפורמת המודעות אינו רשימת הלידים.",
      "Siga el camino del anuncio al formulario, a la fila del CRM y a la tarea. Los formularios de Google Ads y un formulario en un sitio de Bizuply también pueden crear esa fila. No hay puntuación de lead, y el recuento de resultados no es la lista de leads.",
      "Siga o caminho do anúncio ao formulário, à linha do CRM e à tarefa. Formulários do Google Ads e um formulário num site da Bizuply também podem criar essa linha. Não há nota de lead, e a contagem de resultados não é a lista de leads.",
      "اتبعوا المسار من الإعلان إلى النموذج، ثم صف في CRM، ثم مهمة. يمكن لنماذج Google Ads ولنموذج في موقع Bizuply أن ينشئا ذلك الصف أيضاً. لا توجد درجة للعميل، وعدد النتائج ليس قائمة العملاء.",
    ),
    links: [
      link("/guides/follow-up-on-leads", text("Follow up on the lead", "מעקב אחרי הליד", "Seguimiento del lead", "Acompanhar o lead", "متابعة العميل")),
      link("/guides/website-form-to-crm", text("A website form into the CRM", "טופס אתר אל ה־CRM", "Un formulario del sitio al CRM", "Um formulário do site no CRM", "نموذج موقع إلى CRM")),
      templates,
    ],
  },
  "whatsapp-cloud-api-cost": {
    body: text(
      "Budget two charges. Bizuply is $29 a month for one connected number, with no free trial. Meta charges delivered business-to-user messages separately, by category and by the recipient's country. Read the pricing page Meta updated on 30 September 2026 before you budget a send.",
      "מתכננים שני חיובים. ביזאפלי היא 29 דולר לחודש למספר מחובר אחד, בלי ניסיון חינם. Meta מחייבת בנפרד על הודעות מהעסק אל המשתמש שנמסרו, לפי קטגוריה ולפי מדינת הנמען. קוראים את דף המחירים ש־Meta עדכנה ב־30 בספטמבר 2026 לפני שקובעים תקציב לשליחה.",
      "Presupueste dos cargos. Bizuply son 29 dólares al mes por un número conectado, sin prueba gratis. Meta cobra aparte los mensajes entregados del negocio al usuario, por categoría y por el país del destinatario. Lea la página de precios que Meta actualizó el 30 de septiembre de 2026 antes de presupuestar un envío.",
      "Separe dois custos. A Bizuply cobra US$ 29 por mês por um número conectado, sem teste grátis. A Meta cobra à parte as mensagens entregues da empresa ao usuário, por categoria e pelo país do destinatário. Leia a página de preços que a Meta atualizou em 30 de setembro de 2026 antes de orçar um envio.",
      "خططوا لتكلفتين. Bizuply بـ 29 دولاراً في الشهر لرقم متصل واحد، بلا تجربة مجانية. تحصّل Meta بشكل منفصل الرسائل المسلّمة من النشاط إلى المستخدم، حسب الفئة وبلد المستلم. اقرأوا صفحة الأسعار التي حدّثتها Meta في 30 سبتمبر 2026 قبل وضع ميزانية للإرسال.",
    ),
    links: [wa, link("/guides/whatsapp-message-templates", text("Message templates", "תבניות הודעה", "Plantillas de mensajes", "Modelos de mensagem", "قوالب الرسائل")), pricing],
  },
  "whatsapp-message-templates": {
    body: text(
      "Submit the template to Meta, then send it once the template and the number are approved. A template is what can be delivered outside the 24-hour customer-service window. A reply inside that window is a different send. Each client number has its own subscription. There is no single screen for several clients' numbers.",
      "שולחים את התבנית ל־Meta, ואז שולחים הודעה אחרי שהתבנית והמספר מאושרים. תבנית היא מה שאפשר למסור מחוץ לחלון שירות הלקוחות של 24 שעות. תשובה בתוך החלון היא שליחה אחרת. לכל מספר של לקוח יש מנוי משלו. אין מסך אחד לכמה מספרי לקוחות.",
      "Envíe la plantilla a Meta y úsela cuando la plantilla y el número estén aprobados. Una plantilla es lo que se puede entregar fuera de la ventana de 24 horas. Una respuesta dentro de esa ventana es otro envío. Cada número de cliente tiene su propia suscripción. No hay una sola pantalla para varios números de clientes.",
      "Envie o modelo à Meta e use-o quando o modelo e o número estiverem aprovados. Um modelo é o que pode ser entregue fora da janela de 24 horas. Uma resposta dentro dessa janela é outro envio. Cada número de cliente tem a própria assinatura. Não há uma única tela para vários números de clientes.",
      "أرسلوا القالب إلى Meta، ثم أرسلوا بعد موافقة القالب والرقم. القالب هو ما يمكن تسليمه خارج نافذة 24 ساعة. الرد داخل النافذة إرسال مختلف. لكل رقم عميل اشتراكه. لا توجد شاشة واحدة لأرقام عملاء عدة.",
    ),
    links: [wa, link("/guides/whatsapp-cloud-api-cost", text("What the WhatsApp subscription costs", "כמה עולה מנוי הוואטסאפ", "Cuánto cuesta la suscripción de WhatsApp", "Quanto custa a assinatura do WhatsApp", "كم يكلف اشتراك واتساب"))],
  },
  "business-automation": {
    body: text(
      "Set a trigger, a condition, and an action, such as creating the next task when a status changes. A WhatsApp message goes out only when a template is approved and the WhatsApp subscription is active. Automations are on the business plan, not on the $49 CRM plan.",
      "מגדירים טריגר, תנאי ופעולה, למשל יצירת המשימה הבאה כשסטטוס משתנה. הודעת וואטסאפ יוצאת רק כשתבנית מאושרת ומנוי הוואטסאפ פעיל. אוטומציות נמצאות בחבילה העסקית, לא במסלול ה־CRM של 49 דולר.",
      "Defina un disparador, una condición y una acción, como crear la siguiente tarea cuando cambia un estado. Un WhatsApp sale solo cuando hay una plantilla aprobada y la suscripción de WhatsApp está activa. Las automatizaciones están en el plan de negocio, no en el CRM de 49 dólares.",
      "Defina um gatilho, uma condição e uma ação, como criar a próxima tarefa quando um status muda. Um WhatsApp sai só quando há um modelo aprovado e a assinatura do WhatsApp está ativa. Automações ficam no plano de negócios, não no CRM de US$ 49.",
      "حدّدوا مشغّلاً وشرطاً وإجراءً، مثل إنشاء المهمة التالية حين تتغير حالة. تخرج رسالة واتساب فقط حين يكون القالب موافقاً عليه واشتراك واتساب فعّالاً. الأتمتة في الخطة التجارية، لا في CRM بـ 49 دولاراً.",
    ),
    links: [
      link("/guides/follow-up-on-leads", text("Follow up on the lead", "מעקב אחרי הליד", "Seguimiento del lead", "Acompanhar o lead", "متابعة العميل")),
      link("/automations", text("Automations product page", "עמוד האוטומציות", "Página de automatizaciones", "Página de automações", "صفحة الأتمتة")),
      pricing,
    ],
  },
  "build-a-website-without-code": {
    body: text(
      "Publish the page, then add a form if you want a visitor to become a CRM lead. An expert build of up to five pages, when it is offered, has its own one-time price on the pricing page.",
      "מפרסמים את העמוד, ואז מוסיפים טופס אם רוצים שמבקר יהפוך לליד ב־CRM. בנייה בידי מומחה של עד חמישה עמודים, כשהיא מוצעת, היא מחיר חד־פעמי משלה בעמוד המחירים.",
      "Publique la página y añada un formulario si quiere que un visitante se vuelva un lead del CRM. Una construcción de experto de hasta cinco páginas, cuando se ofrece, tiene su propio precio único en la página de precios.",
      "Publique a página e acrescente um formulário se quiser que um visitante vire um lead do CRM. Uma construção por especialista de até cinco páginas, quando é oferecida, tem o próprio preço único na página de preços.",
      "انشروا الصفحة، ثم أضيفوا نموذجاً إذا أردتم أن يصبح الزائر عميلاً في CRM. بناء خبير حتى خمس صفحات، حين يُعرض، له سعره لمرة واحدة في صفحة الأسعار.",
    ),
    links: [
      link("/guides/website-form-to-crm", text("A website form into the CRM", "טופס אתר אל ה־CRM", "Un formulario del sitio al CRM", "Um formulário do site no CRM", "نموذج موقع إلى CRM")),
      link("/website-builder", text("Website builder", "בניית אתרים", "Constructor de sitios", "Construtor de sites", "منشئ المواقع")),
      pricing,
    ],
  },
  "website-form-to-crm": {
    body: text(
      "A form on a Bizuply site creates a lead with the website as the source and New as the first status. The automatic sources are that form, Meta Lead Ads, and Google Ads lead forms. There is no one-click spreadsheet import.",
      "טופס באתר של ביזאפלי יוצר ליד שהמקור שלו הוא האתר והסטטוס הראשון שלו הוא חדש. המקורות האוטומטיים הם הטופס הזה, Meta Lead Ads, וטפסי לידים של Google Ads. אין ייבוא גיליון בלחיצה.",
      "Un formulario en un sitio de Bizuply crea un lead cuyo origen es el sitio y cuyo primer estado es Nuevo. Las fuentes automáticas son ese formulario, Meta Lead Ads y los formularios de Google Ads. No hay una importación de hoja en un clic.",
      "Um formulário num site da Bizuply cria um lead cuja origem é o site e cujo primeiro status é Novo. As origens automáticas são esse formulário, Meta Lead Ads e os formulários do Google Ads. Não há importação de planilha num clique.",
      "ينشئ نموذج في موقع Bizuply عميلاً مصدره الموقع وحالته الأولى جديد. المصادر الآلية هي هذا النموذج وإعلانات العملاء في Meta ونماذج Google Ads. لا يوجد استيراد جدول بنقرة.",
    ),
    links: [
      link("/guides/what-is-a-crm", text("What a CRM record is", "מהי רשומת CRM", "Qué es un registro de CRM", "O que é um registro de CRM", "ما هو سجل CRM")),
      link("/guides/build-a-website-without-code", text("Build the site", "בניית האתר", "Construir el sitio", "Construir o site", "بناء الموقع")),
      templates,
    ],
  },
  "appointments-for-a-service-business": {
    body: text(
      "Set hours and services, then let a client book a 15-minute opening. Appointments are on the business plan, not on the $49 CRM plan. A booking sits next to the follow-up task. It does not replace it.",
      "מגדירים שעות ושירותים, ואז הלקוח יכול לקבוע חלון של 15 דקות. תורים נמצאים בחבילה העסקית, לא במסלול ה־CRM של 49 דולר. הזימון יושב ליד משימת המעקב. הוא לא מחליף אותה.",
      "Defina el horario y los servicios, y deje que el cliente reserve un hueco de 15 minutos. Las citas están en el plan de negocio, no en el CRM de 49 dólares. La reserva queda junto a la tarea de seguimiento. No la sustituye.",
      "Defina o horário e os serviços e deixe o cliente marcar uma vaga de 15 minutos. A agenda fica no plano de negócios, não no CRM de US$ 49. A reserva fica ao lado da tarefa de acompanhamento. Ela não a substitui.",
      "حدّدوا الساعات والخدمات، ثم اتركوا الزبون يحجز فتحة من 15 دقيقة. المواعيد في الخطة التجارية، لا في CRM بـ 49 دولاراً. الحجز يبقى بجانب مهمة المتابعة. لا يستبدلها.",
    ),
    links: [
      link("/appointments", text("Appointments", "תורים", "Citas", "Agenda", "المواعيد")),
      link("/guides/follow-up-on-leads", text("Follow up on the lead", "מעקב אחרי הליד", "Seguimiento del lead", "Acompanhar o lead", "متابعة العميل")),
      link("/solutions/service-businesses", text("Service businesses", "עסקי שירות", "Negocios de servicios", "Negócios de serviços", "أنشطة الخدمات")),
    ],
  },
  "crm-and-business-platform": {
    body: text(
      "Choose CRM only at $49 a month for the lead list and the client file. Choose the business plan at $99 a month or $990 a year when you also want appointments, collaborations, and automations. WhatsApp is $29 a month per connected number, on its own subscription.",
      "בוחרים CRM בלבד ב־49 דולר לחודש לרשימת הלידים ולתיק הלקוח. בוחרים את החבילה העסקית ב־99 דולר לחודש או 990 לשנה כשרוצים גם תורים, שיתופי פעולה ואוטומציות. וואטסאפ הוא 29 דולר לחודש למספר מחובר, במנוי משלו.",
      "Elija el CRM solo a 49 dólares al mes para la lista de leads y el expediente. Elija el plan de negocio a 99 dólares al mes o 990 al año cuando también quiera citas, colaboraciones y automatizaciones. WhatsApp cuesta 29 dólares al mes por número conectado, en su propia suscripción.",
      "Escolha o CRM sozinho a US$ 49 por mês para a lista de leads e o arquivo do cliente. Escolha o plano de negócios a US$ 99 por mês ou US$ 990 por ano quando também quiser agenda, colaborações e automações. O WhatsApp custa US$ 29 por mês por número conectado, na própria assinatura.",
      "اختاروا CRM وحده بـ 49 دولاراً في الشهر لقائمة العملاء وملف العميل. اختاروا الخطة التجارية بـ 99 دولاراً في الشهر أو 990 في السنة حين تريدون أيضاً المواعيد والتعاون والأتمتة. واتساب بـ 29 دولاراً في الشهر لكل رقم متصل، في اشتراكه.",
    ),
    links: [sheet, pricing, link("/platform", text("The platform", "הפלטפורמה", "La plataforma", "A plataforma", "المنصة"))],
  },
};

export function applyGuideNext(articles) {
  for (const [slug, section] of Object.entries(NEXT)) {
    if (!articles[slug]) continue;
    for (const locale of LOCALES) {
      const page = articles[slug][locale];
      page.updated = "2026-11-15";
      page.sections.push({
        id: "boundary",
        heading: text(
          "What to do next",
          "מה עושים אחר כך",
          "Qué hacer después",
          "O que fazer depois",
          "ماذا بعد",
        )[locale],
        paragraphs: [section.body[locale]],
        links: section.links.map((item) => ({ href: item.href, label: item.label[locale] })),
      });
    }
  }
}
