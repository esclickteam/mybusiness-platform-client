/** Additional guides. Facts match the shipped product. No ranking promises. */

function guide(title, description, h1, sections, faq) {
  return { title, description, h1, updated: "2026-10-24", sections, faq };
}

const EN = {
  "connect-a-meta-ad-account": guide(
    "How to connect a Meta ad account | Bizuply",
    "The business connects its own Meta ad account in the Bizuply dashboard. Campaigns, ad sets and ads can then be created there. Meta still bills the spend.",
    "Connect the Meta ad account you already own",
    [
      ["Where the connection happens", ["Open the Meta campaigns area after you are in the business dashboard. The connection uses the business's own ad account. Bizuply does not become the advertiser and does not take a separate campaign fee on the pricing page."]],
      ["What you can edit afterwards", ["Campaigns, ad sets and ads. The budget sits on the campaign or on the ad set. Performance for the connected campaigns is shown in the same area. Lead forms can enter the CRM with a source and a status."]],
      ["Permissions", ["Bizuply is a Meta Tech Provider and the app passed Meta App Review for Lead Ads. The business approves the permissions on its own Facebook page. This is not a Meta Business Partner badge, and the official Meta logo is not used on the marketing site."]],
    ],
    [["Does connecting the account start spending?", "No. Spend starts when a campaign is published and Meta delivers it. Meta sends the bill for the media."]],
  ),
  "whatsapp-message-templates": guide(
    "How WhatsApp templates work in Bizuply | Bizuply",
    "A business message that starts a conversation uses a template Meta has approved. The number itself is $29 a month, and Meta bills messages separately. There is no free trial.",
    "Templates, then a paid number, then a send",
    [
      ["What the $29 covers", ["One connected number: the connection, the API and webhooks, templates, the dashboard and the docs. A second number needs a second subscription."]],
      ["What Meta still controls", ["Template approval, message category and the fee that depends on the recipient country. Bizuply does not publish Meta's rate card. Meta's own documentation is the source for those rates."]],
      ["What is not available", ["Several client numbers are not managed from one agency screen. Each number keeps its own subscription, key and webhook."]],
    ],
    [["Can an automation send WhatsApp by itself?", "Only through an approved template on a paid number. The business-plan automation can be the trigger. The demo saves the automation and does not send a real message."]],
  ),
  "website-form-to-crm": guide(
    "How a website form becomes a lead | Bizuply",
    "A form on a site built in Bizuply can create a lead whose source is the website. The same pipeline also accepts Meta Lead Ads and Google Ads lead forms.",
    "Publish the page, then read the lead where the team already works",
    [
      ["The self-serve path", ["Choose a template in the visual editor, place a form, and publish. The inquiry is stored as a lead with source Website and the new-lead status."]],
      ["The expert-build path", ["If you would rather not edit, the published expert build is $399 once for up to five pages, your content, a lead form and a CRM connection. That price is the setup service, not the CRM subscription."]],
      ["What happens next", ["Staff set one of six statuses and can add a note, a call or a WhatsApp log. A dated task is how the next step survives the day."]],
    ],
    [["Does the form require the business plan?", "The lead can enter the CRM on the $49 plan. Automations that react to that lead need the business plan."]],
  ),
  "appointments-for-a-service-business": guide(
    "How appointments work for a service business | Bizuply",
    "Business hours and a service catalog produce 15-minute openings. Appointments are part of the business plan, not of CRM only.",
    "Hours, a service, then an open slot",
    [
      ["What you configure", ["Hours for each day, and services with a duration and a price. The calendar offers openings in 15-minute steps. A booking stores the service, the price, a payment status and a note."]],
      ["Who can book", ["Staff book from the calendar. Clients can book on the public booking page when it is enabled, and both the client and the business can receive an email confirmation."]],
      ["The plan boundary", ["CRM only at $49 a month is the pipeline and the client file. Appointments, collaborations and automations are on the business plan at $99 a month or $990 a year."]],
    ],
    [["Is this a clinical record?", "No. It is a calendar and a client file. Medical charts stay in a system built for them."]],
  ),
  "from-ad-to-follow-up": guide(
    "From a Meta lead to the next task | Bizuply",
    "A lead form can create the CRM record, a person or an automation can set the next task, and WhatsApp is optional and priced apart.",
    "Four steps that already exist in the product",
    [
      ["The lead arrives", ["Meta Lead Ads, a Bizuply website form, or a Google Ads lead form. Each keeps its source. The first status is New."]],
      ["Someone owns the next step", ["A status change is logged on the timeline. A task with a date and time appears in notifications when it is overdue. On the business plan an automation can create that task for a new lead."]],
      ["If the reply is WhatsApp", ["The number is $29 a month and the template must be approved. Meta bills the message. The agents page, if you use it, is a human, not a bot."]],
    ],
    [["Where is the campaign price?", "There isn't one on the Bizuply price list. Meta bills the spend. Bizuply's related prices are the CRM, the business plan and, separately, WhatsApp."]],
  ),
  };

const HE = {
  "connect-a-meta-ad-account": guide(
    "איך מחברים חשבון מודעות של Meta | ביזאפלי",
    "העסק מחבר את חשבון המודעות שלו בלוח של ביזאפלי. אחר כך אפשר ליצור שם קמפיינים, קבוצות מודעות ומודעות. את ההוצאה עדיין גובה Meta.",
    "מחברים את חשבון המודעות שכבר שלכם",
    [
      ["איפה החיבור קורה", ["אזור הקמפיינים נפתח מתוך לוח העסק. החיבור משתמש בחשבון המודעות של העסק. ביזאפלי לא הופכת למפרסם ואין דמי קמפיין נפרדים במחירון."]],
      ["מה אפשר לערוך אחר כך", ["קמפיינים, קבוצות מודעות ומודעות. התקציב יושב על הקמפיין או על הקבוצה. ביצועים של הקמפיינים המחוברים מוצגים באותו אזור. טפסי לידים יכולים להיכנס ל־CRM עם מקור וסטטוס."]],
      ["הרשאות", ["ביזאפלי היא Meta Tech Provider והאפליקציה עברה App Review ל־Lead Ads. העסק מאשר את ההרשאות על הדף שלו. זה לא תג Meta Business Partner."]],
    ],
    [["החיבור מתחיל להוציא כסף?", "לא. ההוצאה מתחילה כשקמפיין מתפרסם ו־Meta מפיצה אותו. את חשבון המדיה שולחת Meta."]],
  ),
  "whatsapp-message-templates": guide(
    "איך עובדות תבניות WhatsApp בביזאפלי | ביזאפלי",
    "הודעה עסקית שפותחת שיחה משתמשת בתבנית ש־Meta אישרה. המספר עצמו עולה 29 דולר לחודש, ו־Meta מחייבת הודעות בנפרד. אין ניסיון חינם.",
    "תבנית, אחר כך מספר בתשלום, אחר כך שליחה",
    [
      ["מה ה־29 דולר מכסים", ["מספר מחובר אחד: החיבור, ה־API וה־webhooks, תבניות, לוח הבקרה והתיעוד. מספר שני דורש מנוי שני."]],
      ["מה נשאר אצל Meta", ["אישור התבנית, קטגוריית ההודעה והעמלה לפי מדינת הנמען. ביזאפלי לא מפרסמת את המחירון של Meta."]],
      ["מה לא זמין", ["כמה מספרי לקוחות לא מנוהלים ממסך סוכנות אחד. לכל מספר מנוי, מפתח ו־webhook משלו."]],
    ],
    [["אוטומציה יכולה לשלוח WhatsApp לבד?", "רק דרך תבנית מאושרת על מספר בתשלום. הטריגר יכול להיות אוטומציה של החבילה העסקית. הדמו שומר את האוטומציה ולא שולח הודעה אמיתית."]],
  ),
  "website-form-to-crm": guide(
    "איך טופס באתר הופך לליד | ביזאפלי",
    "טופס באתר שנבנה בביזאפלי יכול ליצור ליד שהמקור שלו הוא האתר. לאותו צינור נכנסים גם לידים מ־Meta ומטפסי Google Ads.",
    "מפרסמים את העמוד, וקוראים את הליד איפה שהצוות כבר עובד",
    [
      ["המסלול לבד", ["בוחרים תבנית בעורך, שמים טופס ומפרסמים. הפנייה נשמרת כליד עם מקור אתר וסטטוס חדש."]],
      ["מסלול המומחה", ["אם לא רוצים לערוך, הבנייה המפורסמת עולה 399 דולר חד־פעמית לעד חמישה עמודים, התוכן שלכם, טופס לידים וחיבור ל־CRM. זה מחיר ההקמה, לא מנוי ה־CRM."]],
      ["מה אחר כך", ["הצוות בוחר אחד משישה סטטוסים ויכול להוסיף הערה, שיחה או רישום WhatsApp. משימה עם תאריך היא איך הצעד הבא שורד את היום."]],
    ],
    [["הטופס דורש את החבילה העסקית?", "הליד יכול להיכנס ל־CRM במסלול של 49 דולר. אוטומציה שמגיבה לו דורשת את החבילה העסקית."]],
  ),
  "appointments-for-a-service-business": guide(
    "איך תורים עובדים לעסק שירותים | ביזאפלי",
    "שעות פעילות וקטלוג שירותים מייצרים חלונות של 15 דקות. התורים הם חלק מהחבילה העסקית, לא מ־CRM בלבד.",
    "שעות, שירות, ואז חלון פנוי",
    [
      ["מה מגדירים", ["שעות לכל יום, ושירותים עם משך ומחיר. היומן מציע פתיחות בקפיצות של 15 דקות. זימון שומר שירות, מחיר, סטטוס תשלום והערה."]],
      ["מי קובע", ["הצוות קובע מהיומן. לקוח יכול לקבוע בעמוד הזימון הציבורי כשהוא פעיל, והלקוח והעסק יכולים לקבל אישור במייל."]],
      ["גבול המסלול", ["CRM בלבד ב־49 דולר לחודש הוא הצינור ותיק הלקוח. תורים, שיתופים ואוטומציות נמצאים בחבילה העסקית ב־99 לחודש או 990 לשנה."]],
    ],
    [["זה רשומה רפואית?", "לא. זה יומן ותיק לקוח. תיק רפואי נשאר במערכת שנבנתה בשבילו."]],
  ),
  "from-ad-to-follow-up": guide(
    "מליד של Meta עד המשימה הבאה | ביזאפלי",
    "טופס לידים יכול ליצור את הרשומה ב־CRM, אדם או אוטומציה יכולים לקבוע את המשימה הבאה, ו־WhatsApp נשאר רשות ובמחיר נפרד.",
    "ארבעה צעדים שכבר קיימים במוצר",
    [
      ["הליד מגיע", ["Lead Ads של Meta, טופס באתר ביזאפלי, או טופס Google Ads. לכל אחד נשמר המקור. הסטטוס הראשון הוא חדש."]],
      ["מישהו מחזיק את הצעד הבא", ["שינוי סטטוס נרשם בציר הזמן. משימה עם תאריך ושעה מופיעה בהתראות כשהיא באיחור. בחבילה העסקית אוטומציה יכולה ליצור את המשימה לליד חדש."]],
      ["אם התשובה היא WhatsApp", ["המספר עולה 29 דולר לחודש והתבנית חייבת להיות מאושרת. Meta מחייבת את ההודעה. עמוד הנציגים, אם משתמשים בו, הוא אדם ולא בוט."]],
    ],
    [["איפה מחיר הקמפיין?", "אין מחיר כזה במחירון של ביזאפלי. Meta גובה את ההוצאה. המחירים הקשורים הם ה־CRM, החבילה העסקית, ובנפרד WhatsApp."]],
  ),
  };

const ES = {
  "connect-a-meta-ad-account": guide(
    "Cómo conectar una cuenta de anuncios de Meta | Bizuply",
    "El negocio conecta su propia cuenta en el panel de Bizuply. Después se pueden crear campañas, conjuntos y anuncios. El gasto lo cobra Meta.",
    "Conecte la cuenta de anuncios que ya es suya",
    [
      ["Dónde ocurre", ["El área de campañas está en el panel del negocio. La conexión usa la cuenta del negocio. Bizuply no se convierte en el anunciante y no hay una tarifa de campaña en precios."]],
      ["Qué se edita después", ["Campañas, conjuntos y anuncios. El presupuesto va en la campaña o en el conjunto. El rendimiento de lo conectado se ve en la misma zona. Los formularios pueden entrar al CRM con origen y estado."]],
      ["Permisos", ["Bizuply es Meta Tech Provider y la app pasó App Review para Lead Ads. El negocio aprueba los permisos en su página. No es una insignia de Meta Business Partner."]],
    ],
    [["¿Conectar empieza a gastar?", "No. El gasto empieza cuando una campaña se publica y Meta la distribuye."]],
  ),
  "whatsapp-message-templates": guide(
    "Cómo funcionan las plantillas de WhatsApp | Bizuply",
    "Un mensaje que abre una conversación usa una plantilla aprobada por Meta. El número cuesta 29 dólares al mes y Meta cobra los mensajes aparte. No hay prueba gratis.",
    "Plantilla, número de pago y después el envío",
    [
      ["Qué cubren los 29 dólares", ["Un número: conexión, API y webhooks, plantillas, panel y documentación. Un segundo número pide otra suscripción."]],
      ["Qué sigue en Meta", ["La aprobación, la categoría y la tarifa según el país del destinatario. Bizuply no publica la tarifa de Meta."]],
      ["Qué no está", ["Varios números de clientes no se gestionan desde una pantalla de agencia."]],
    ],
    [["¿Una automatización envía WhatsApp sola?", "Solo con una plantilla aprobada y un número de pago. La demo guarda la automatización y no envía un mensaje real."]],
  ),
  "website-form-to-crm": guide(
    "Cómo un formulario del sitio se vuelve un lead | Bizuply",
    "Un formulario en un sitio de Bizuply puede crear un lead con origen Sitio. Al mismo pipeline entran Lead Ads y formularios de Google Ads.",
    "Publique la página y lea el lead donde el equipo ya trabaja",
    [
      ["El camino propio", ["Elija una plantilla, coloque un formulario y publique. La consulta se guarda como lead con origen Sitio y estado nuevo."]],
      ["El camino de experto", ["Si no quiere editar, la construcción publicada cuesta 399 dólares una vez: hasta cinco páginas, su contenido, formulario y conexión al CRM."]],
      ["Después", ["El equipo elige uno de seis estados y puede añadir nota, llamada o registro de WhatsApp."]],
    ],
    [["¿El formulario exige el plan de negocio?", "El lead puede entrar al CRM de 49 dólares. Una automatización que reaccione pide el plan de negocio."]],
  ),
  "appointments-for-a-service-business": guide(
    "Cómo funcionan las citas en un negocio de servicios | Bizuply",
    "El horario y el catálogo crean huecos de 15 minutos. Las citas forman parte del plan de negocio, no del CRM solo.",
    "Horario, servicio y un hueco libre",
    [
      ["Qué se configura", ["Horas por día y servicios con duración y precio. La agenda ofrece huecos de 15 minutos. La reserva guarda servicio, precio, estado de pago y nota."]],
      ["Quién reserva", ["El equipo reserva en el calendario. El cliente puede reservar en la página pública cuando está activa."]],
      ["El límite del plan", ["CRM solo a 49 dólares es el pipeline y el expediente. Citas, colaboraciones y automatizaciones están en el plan de 99 al mes o 990 al año."]],
    ],
    [["¿Es una historia clínica?", "No. Es agenda y expediente. La historia clínica se queda en su sistema."]],
  ),
  "from-ad-to-follow-up": guide(
    "De un lead de Meta a la tarea siguiente | Bizuply",
    "Un formulario puede crear el registro, una persona o una automatización puede fijar la tarea, y WhatsApp sigue siendo opcional y de pago aparte.",
    "Cuatro pasos que ya existen",
    [
      ["Llega el lead", ["Lead Ads, un formulario de Bizuply o un formulario de Google Ads. Cada uno guarda su origen. El primer estado es Nuevo."]],
      ["Alguien tiene el siguiente paso", ["El cambio de estado queda en la línea de tiempo. Una tarea vencida aparece en las notificaciones. En el plan de negocio una automatización puede crear esa tarea."]],
      ["Si la respuesta es WhatsApp", ["El número cuesta 29 dólares y la plantilla debe estar aprobada. La página de agentes es una persona, no un bot."]],
    ],
    [["¿Dónde está el precio de la campaña?", "No está en la lista de Bizuply. Meta cobra el gasto."]],
  ),
  };

const PT = {
  "connect-a-meta-ad-account": guide(
    "Como conectar uma conta de anúncios da Meta | Bizuply",
    "O negócio conecta a própria conta no painel da Bizuply. Depois dá para criar campanhas, conjuntos e anúncios. O gasto continua com a Meta.",
    "Conecte a conta de anúncios que já é sua",
    [
      ["Onde acontece", ["A área de campanhas fica no painel do negócio. A conexão usa a conta do negócio. A Bizuply não vira o anunciante e não há taxa de campanha na página de preços."]],
      ["O que se edita depois", ["Campanhas, conjuntos e anúncios. O orçamento fica na campanha ou no conjunto. O desempenho do que está conectado aparece na mesma área. Formulários podem entrar no CRM com origem e status."]],
      ["Permissões", ["A Bizuply é Meta Tech Provider e o app passou App Review para Lead Ads. O negócio aprova as permissões na própria página. Não é um selo de Meta Business Partner."]],
    ],
    [["Conectar começa a gastar?", "Não. O gasto começa quando uma campanha é publicada e a Meta a distribui."]],
  ),
  "whatsapp-message-templates": guide(
    "Como funcionam os modelos de WhatsApp | Bizuply",
    "Uma mensagem que abre conversa usa um modelo aprovado pela Meta. O número custa 29 dólares por mês e a Meta cobra as mensagens à parte. Não há teste grátis.",
    "Modelo, número pago e só então o envio",
    [
      ["O que os 29 dólares cobrem", ["Um número: conexão, API e webhooks, modelos, painel e documentação. Um segundo número pede outra assinatura."]],
      ["O que continua na Meta", ["A aprovação, a categoria e a tarifa conforme o país do destinatário. A Bizuply não publica a tabela da Meta."]],
      ["O que não existe", ["Vários números de clientes não são geridos numa tela de agência."]],
    ],
    [["Uma automação envia WhatsApp sozinha?", "Só com modelo aprovado e número pago. A demo salva a automação e não envia mensagem real."]],
  ),
  "website-form-to-crm": guide(
    "Como um formulário do site vira um lead | Bizuply",
    "Um formulário num site da Bizuply pode criar um lead com origem Site. O mesmo pipeline recebe Lead Ads e formulários do Google Ads.",
    "Publique a página e leia o lead onde a equipe já trabalha",
    [
      ["O caminho próprio", ["Escolha um modelo, coloque um formulário e publique. O contato vira lead com origem Site e status novo."]],
      ["O caminho do especialista", ["Se não quiser editar, a construção publicada custa 399 dólares uma vez: até cinco páginas, o seu conteúdo, formulário e ligação ao CRM."]],
      ["Depois", ["A equipe escolhe um de seis status e pode acrescentar nota, ligação ou registro de WhatsApp."]],
    ],
    [["O formulário exige o plano de negócios?", "O lead pode entrar no CRM de 49 dólares. Uma automação que reaja pede o plano de negócios."]],
  ),
  "appointments-for-a-service-business": guide(
    "Como a agenda funciona num negócio de serviço | Bizuply",
    "O horário e o catálogo criam vagas de 15 minutos. A agenda faz parte do plano de negócios, não do CRM sozinho.",
    "Horário, serviço e uma vaga livre",
    [
      ["O que se configura", ["Horas por dia e serviços com duração e preço. A agenda oferece vagas de 15 minutos. A reserva guarda serviço, preço, status de pagamento e nota."]],
      ["Quem marca", ["A equipe marca no calendário. O cliente pode marcar na página pública quando ela está ativa."]],
      ["O limite do plano", ["CRM sozinho a 49 dólares é o pipeline e o arquivo. Agenda, colaborações e automações ficam no plano de 99 por mês ou 990 por ano."]],
    ],
    [["É um prontuário?", "Não. É agenda e arquivo. O prontuário fica no sistema feito para isso."]],
  ),
  "from-ad-to-follow-up": guide(
    "De um lead da Meta à tarefa seguinte | Bizuply",
    "Um formulário pode criar o registro, uma pessoa ou uma automação pode marcar a tarefa, e o WhatsApp continua opcional e com preço à parte.",
    "Quatro passos que já existem",
    [
      ["O lead chega", ["Lead Ads, um formulário da Bizuply ou um formulário do Google Ads. Cada um guarda a origem. O primeiro status é Novo."]],
      ["Alguém fica com o próximo passo", ["A mudança de status fica na linha do tempo. Uma tarefa atrasada aparece nas notificações. No plano de negócios uma automação pode criar essa tarefa."]],
      ["Se a resposta é WhatsApp", ["O número custa 29 dólares e o modelo precisa estar aprovado. A página de agentes é uma pessoa, não um bot."]],
    ],
    [["Onde está o preço da campanha?", "Não está na lista da Bizuply. A Meta cobra o gasto."]],
  ),
  };

const AR = {
  "connect-a-meta-ad-account": guide(
    "كيف يُربط حساب إعلانات Meta | Bizuply",
    "يربط النشاط حسابه في لوحة Bizuply. بعدها يمكن إنشاء حملات ومجموعات وإعلانات. يبقى الإنفاق على Meta.",
    "اربطوا حساب الإعلانات الذي تملكونه",
    [
      ["أين يحدث الربط", ["منطقة الحملات داخل لوحة النشاط. يستخدم الربط حساب النشاط. لا تصبح Bizuply المعلن ولا توجد رسوم حملة في الأسعار."]],
      ["ماذا يُحرَّر بعد ذلك", ["حملات ومجموعات وإعلانات. الميزانية على الحملة أو المجموعة. يظهر أداء المتصل في المنطقة نفسها. يمكن للنماذج أن تدخل CRM مع مصدر وحالة."]],
      ["الأذونات", ["Bizuply هي Meta Tech Provider واجتاز التطبيق App Review لإعلانات العملاء المحتملين. يوافق النشاط على الأذونات في صفحته. هذا ليس شارة Meta Business Partner."]],
    ],
    [["هل يبدأ الربط الإنفاق؟", "لا. يبدأ الإنفاق حين تُنشر حملة وتوزّعها Meta."]],
  ),
  "whatsapp-message-templates": guide(
    "كيف تعمل قوالب واتساب | Bizuply",
    "رسالة تفتح محادثة تستخدم قالباً وافقت عليه Meta. الرقم 29 دولاراً شهرياً وتحصّل Meta الرسائل بشكل منفصل. لا توجد تجربة مجانية.",
    "قالب، ثم رقم مدفوع، ثم إرسال",
    [
      ["ماذا يغطي مبلغ 29 دولاراً", ["رقماً واحداً: الربط وواجهة البرمجة وwebhooks والقوالب واللوحة والتوثيق. الرقم الثاني يحتاج اشتراكاً آخر."]],
      ["ماذا يبقى لدى Meta", ["الموافقة والفئة والرسوم حسب بلد المستلم. لا تنشر Bizuply جدول Meta."]],
      ["ما غير المتاح", ["لا تُدار أرقام عدة عملاء من شاشة وكالة واحدة."]],
    ],
    [["هل ترسل الأتمتة واتساب وحدها؟", "فقط بقالب معتمد ورقم مدفوع. يحفظ العرض الأتمتة ولا يرسل رسالة حقيقية."]],
  ),
  "website-form-to-crm": guide(
    "كيف يصبح نموذج الموقع عميلاً محتملاً | Bizuply",
    "يمكن لنموذج في موقع Bizuply أن ينشئ عميلاً محتملاً بمصدر الموقع. المسار نفسه يستقبل إعلانات Meta ونماذج Google Ads.",
    "انشروا الصفحة واقرؤوا العميل حيث يعمل الفريق",
    [
      ["المسار الذاتي", ["اختاروا قالباً، ضعوا نموذجاً، وانشروا. يُحفظ الطلب كعميل محتمل بمصدر الموقع وحالة جديد."]],
      ["مسار المختص", ["إن لم ترغبوا في التحرير، البناء المنشور 399 دولاراً مرة واحدة: حتى خمس صفحات، ومحتواكم، ونموذج، وربط بـ CRM."]],
      ["بعد ذلك", ["يختار الفريق واحدة من ست حالات ويمكنه إضافة ملاحظة أو مكالمة أو سجل واتساب."]],
    ],
    [["هل النموذج يطلب الخطة التجارية؟", "يمكن للعميل المحتمل دخول CRM ذي 49 دولاراً. أتمتة تتفاعل معه تطلب الخطة التجارية."]],
  ),
  "appointments-for-a-service-business": guide(
    "كيف تعمل المواعيد لعمل خدمات | Bizuply",
    "ساعات العمل والكتالوج ينتجان فترات من 15 دقيقة. المواعيد جزء من الخطة التجارية لا من CRM وحده.",
    "ساعات، خدمة، ثم فترة فارغة",
    [
      ["ماذا يُضبط", ["ساعات كل يوم وخدمات بمدة وسعر. يعرض التقويم فترات من 15 دقيقة. يحفظ الحجز الخدمة والسعر وحالة الدفع وملاحظة."]],
      ["من يحجز", ["يحجز الفريق من التقويم. يمكن للعميل الحجز في الصفحة العامة حين تكون مفعّلة."]],
      ["حد الخطة", ["CRM وحده بـ 49 دولاراً هو المسار والملف. المواعيد والتعاون والأتمتة في خطة 99 شهرياً أو 990 سنوياً."]],
    ],
    [["هل هذا ملف طبي؟", "لا. هو تقويم وملف عميل. الملف الطبي يبقى في نظامه."]],
  ),
  "from-ad-to-follow-up": guide(
    "من عميل Meta المحتمل إلى المهمة التالية | Bizuply",
    "يمكن للنموذج أن ينشئ السجل، ويمكن لشخص أو لأتمتة تحديد المهمة، ويبقى واتساب اختيارياً وبسعر منفصل.",
    "أربع خطوات موجودة فعلاً",
    [
      ["يصل العميل المحتمل", ["إعلانات Meta أو نموذج Bizuply أو نموذج Google Ads. يحتفظ كل منها بمصدره. الحالة الأولى جديد."]],
      ["شخص يملك الخطوة التالية", ["يُسجَّل تغيير الحالة على الخط الزمني. تظهر المهمة المتأخرة في التنبيهات. في الخطة التجارية يمكن للأتمتة إنشاء هذه المهمة."]],
      ["إذا كان الرد واتساب", ["الرقم 29 دولاراً ويجب أن يكون القالب معتمداً. صفحة الوكلاء شخص وليست روبوتاً."]],
    ],
    [["أين سعر الحملة؟", "ليس في قائمة Bizuply. تحصّل Meta الإنفاق."]],
  ),
  };

export const EXTRA_GUIDES = { en: EN, he: HE, es: ES, "pt-BR": PT, ar: AR };
export const EXTRA_GUIDE_SLUGS = Object.keys(EN);

export function getExtraGuide(slug, locale) {
  if (slug === "how-search-engines-read-a-business-site") return null;
  const pack = EXTRA_GUIDES[locale] || EXTRA_GUIDES.en;
  return pack[slug] || null;
}
