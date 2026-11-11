/** Public FAQ. Answers stay inside published product limits. */

const GROUPS = {
  en: {
    title: "Questions about BizUply",
    lede: "Short answers about the platform, the plans, and what a page does not include.",
    groups: [
      ["general", "General", [
        ["What is BizUply?", "BizUply is the brand of the business platform at bizuply.com. The company is Bizuply LLC. The platform holds leads, customers, and the next task. Appointments, automations, and collaborations are on the business plan."],
        ["Does one subscription include every product?", "No. CRM only is $49 a month. The business plan is $99 a month or $990 a year. WhatsApp is $29 a month per connected number, and Meta bills messages separately."],
      ]],
      ["crm", "CRM", [
        ["What is a lead?", "A person who enquired and is not yet marked as a customer. Statuses are new, contacted, interested, converted, lost, and old lead."],
        ["Where can a lead come from?", "A form on a BizUply site, Meta Lead Ads after the account is eligible, a Google Ads lead form, or a manual entry. The source is stored on the lead. It is not a private attribution model."],
      ]],
      ["whatsapp", "WhatsApp", [
        ["What do the $29 cover?", "The BizUply price for one connected WhatsApp number. Meta approves the number and the templates. Meta's message charges are separate and depend on use and category."],
        ["Can the business message any number?", "No. Consent and WhatsApp policy still apply. Transferring an existing number depends on Meta and the current provider."],
      ]],
      ["automations", "Automations", [
        ["What can an automation do?", "On the business plan, a new lead can create a dated follow-up task. CRM only does not include automations."],
        ["Does the rule send WhatsApp or spend an ad budget?", "No. It does not send a template by itself and it does not spend Meta budget."],
      ]],
      ["websites", "Websites", [
        ["What does the editor publish?", "A page to the business address. A supported form can create a CRM lead with the website as the source. A store exists only where the editor offers it."],
        ["Is the $399 build the same as the editor?", "No. $399 is the published expert setup service. Domain, hosting, and later maintenance are included only if the agreement says so."],
      ]],
      ["pricing", "Pricing", [
        ["What is billed monthly and what is annual?", "CRM is $49 a month. The business plan is $99 a month or $990 a year. The live pricing page is the billing source."],
        ["Is WhatsApp included in the CRM price?", "No. WhatsApp is $29 a month per number, plus Meta's own message fees."],
      ]],
      ["account", "Account and access", [
        ["Who can open a record?", "People on the business account, according to the roles already set. These pages do not add a new role."],
        ["Does a public profile make a partnership?", "No. Finding a business by a published profile field is not a recommendation and not a verified partnership."],
      ]],
      ["privacy", "Privacy and security", [
        ["Is BizUply a medical-records system?", "No. It keeps the business relationship and the appointment. It does not claim HIPAA or clinical compliance."],
        ["Where is the privacy policy?", "On the privacy page. This answer does not replace that policy."],
      ]],
      ["support", "Support", [
        ["How do I ask a question?", "Use the contact form. Sending it does not start a charge."],
        ["What is the support address?", "support@bizuply.com."],
      ]],
    ],
  },
};

function pack(locale, title, lede, labels) {
  const base = GROUPS.en.groups;
  return {
    title,
    lede,
    groups: base.map(([id, , items], index) => ({
      id,
      title: labels[index][0],
      items: items.map((item, itemIndex) => labels[index][1][itemIndex]),
    })),
  };
}

const LOCALES = {
  en: {
    title: GROUPS.en.title,
    lede: GROUPS.en.lede,
    groups: GROUPS.en.groups.map(([id, title, items]) => ({ id, title, items })),
  },
  he: pack("he", "שאלות על BizUply", "תשובות קצרות על הפלטפורמה, על החבילות, ועל מה שעמוד לא כולל.", [
    ["כללי", [
      ["מהי BizUply?", "BizUply הוא המותג של הפלטפורמה ב־bizuply.com. החברה היא Bizuply LLC. הפלטפורמה מחזיקה לידים, לקוחות ואת המשימה הבאה. תורים, אוטומציות ושיתופי פעולה נמצאים בחבילה העסקית."],
      ["מנוי אחד כולל כל מוצר?", "לא. CRM בלבד עולה 49 דולר לחודש. החבילה העסקית עולה 99 דולר לחודש או 990 דולר לשנה. WhatsApp עולה 29 דולר לחודש למספר מחובר, ו־Meta מחייבת הודעות בנפרד."],
    ]],
    ["CRM", [
      ["מהו ליד?", "אדם שפנה ועדיין לא סומן כלקוח. הסטטוסים הם חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן."],
      ["מאיפה ליד יכול להגיע?", "מטופס באתר BizUply, ממודעות לידים של Meta אחרי שהחשבון כשיר, מטופס Google Ads, או מהוספה ידנית. המקור נשמר על הליד. זה לא מודל ייחוס פרטי."],
    ]],
    ["WhatsApp", [
      ["מה כוללים 29 הדולר?", "את המחיר של BizUply למספר WhatsApp מחובר אחד. Meta מאשרת את המספר ואת התבניות. חיובי ההודעות של Meta נפרדים ותלויים בשימוש ובקטגוריה."],
      ["אפשר לשלוח לכל מספר?", "לא. הסכמה ומדיניות WhatsApp נשארות. העברת מספר קיים תלויה ב־Meta ובספק הנוכחי."],
    ]],
    ["אוטומציות", [
      ["מה אוטומציה יכולה לעשות?", "בחבילה העסקית ליד חדש יכול ליצור משימת המשך עם תאריך. CRM בלבד לא כולל אוטומציות."],
      ["הכלל שולח WhatsApp או מוציא תקציב מודעות?", "לא. הוא לא שולח תבנית בעצמו ולא מוציא תקציב Meta."],
    ]],
    ["אתרים", [
      ["מה העורך מפרסם?", "עמוד לכתובת של העסק. טופס נתמך יכול ליצור ליד ב־CRM כשהאתר הוא המקור. חנות קיימת רק איפה שהעורך מציע אותה."],
      ["הבנייה ב־399 דולר היא העורך?", "לא. 399 דולר הם שירות ההקמה שפורסם. דומיין, אחסון ותחזוקה אחר כך כלולים רק אם ההסכם אומר זאת."],
    ]],
    ["מחירים", [
      ["מה חודשי ומה שנתי?", "CRM עולה 49 דולר לחודש. החבילה העסקית עולה 99 דולר לחודש או 990 דולר לשנה. עמוד המחירים החי הוא מקור החיוב."],
      ["WhatsApp כלול במחיר ה־CRM?", "לא. WhatsApp עולה 29 דולר לחודש למספר, ועוד חיובי ההודעות של Meta."],
    ]],
    ["חשבון והרשאות", [
      ["מי יכול לפתוח רשומה?", "אנשים בחשבון העסק, לפי התפקידים שכבר הוגדרו. העמודים האלה לא מוסיפים תפקיד."],
      ["פרופיל ציבורי יוצר שותפות?", "לא. מציאת עסק לפי שדה שפורסם אינה המלצה ואינה שותפות מאומתת."],
    ]],
    ["פרטיות ואבטחה", [
      ["BizUply היא מערכת רשומות רפואיות?", "לא. היא שומרת את הקשר העסקי ואת התור. היא לא טוענת ל־HIPAA או לעמידה קלינית."],
      ["איפה מדיניות הפרטיות?", "בעמוד הפרטיות. התשובה הזו לא מחליפה את המדיניות."],
    ]],
    ["תמיכה", [
      ["איך שואלים שאלה?", "דרך טופס יצירת הקשר. השליחה לא מתחילה חיוב."],
      ["מה כתובת התמיכה?", "support@bizuply.com."],
    ]],
  ]),
  es: pack("es", "Preguntas sobre BizUply", "Respuestas cortas sobre la plataforma, los planes y lo que una página no incluye.", [
    ["General", [
      ["¿Qué es BizUply?", "BizUply es la marca de la plataforma en bizuply.com. La empresa es Bizuply LLC. La plataforma guarda leads, clientes y la tarea siguiente. Citas, automatizaciones y colaboraciones están en el plan de negocio."],
      ["¿Una suscripción incluye todo?", "No. CRM solo cuesta 49 dólares al mes. El plan de negocio cuesta 99 al mes o 990 al año. WhatsApp cuesta 29 al mes por número conectado, y Meta cobra los mensajes aparte."],
    ]],
    ["CRM", [
      ["¿Qué es un lead?", "Una persona que consultó y aún no está marcada como cliente. Los estados son nuevo, contactado, interesado, convertido, perdido y lead antiguo."],
      ["¿De dónde puede llegar un lead?", "De un formulario en un sitio BizUply, de Lead Ads de Meta si la cuenta es apta, de un formulario de Google Ads o de un alta manual. El origen queda en el lead. No es un modelo privado de atribución."],
    ]],
    ["WhatsApp", [
      ["¿Qué cubren los 29 dólares?", "El precio de BizUply por un número de WhatsApp conectado. Meta aprueba el número y las plantillas. Los cargos de mensajes de Meta van aparte."],
      ["¿Se puede escribir a cualquier número?", "No. El consentimiento y la política de WhatsApp siguen. Transferir un número depende de Meta y del proveedor actual."],
    ]],
    ["Automatizaciones", [
      ["¿Qué puede hacer una automatización?", "En el plan de negocio un lead nuevo puede crear una tarea con fecha. CRM solo no incluye automatizaciones."],
      ["¿La regla envía WhatsApp o gasta presupuesto?", "No. No envía una plantilla por su cuenta ni gasta presupuesto de Meta."],
    ]],
    ["Sitios", [
      ["¿Qué publica el editor?", "Una página en la dirección del negocio. Un formulario compatible puede crear un lead con el sitio como origen. Una tienda existe solo donde el editor la ofrece."],
      ["¿Los 399 dólares son el editor?", "No. Son el servicio de puesta en marcha publicado. Dominio, alojamiento y mantenimiento posterior solo si el acuerdo lo dice."],
    ]],
    ["Precios", [
      ["¿Qué es mensual y qué es anual?", "El CRM cuesta 49 dólares al mes. El plan de negocio cuesta 99 al mes o 990 al año. La página de precios viva es la fuente de cobro."],
      ["¿WhatsApp está en el precio del CRM?", "No. WhatsApp cuesta 29 dólares al mes por número, más los cargos de Meta."],
    ]],
    ["Cuenta y acceso", [
      ["¿Quién puede abrir un registro?", "Las personas de la cuenta, según los roles ya definidos. Estas páginas no añaden un rol."],
      ["¿Un perfil público crea una alianza?", "No. Encontrar un negocio por un campo publicado no es una recomendación ni una alianza verificada."],
    ]],
    ["Privacidad y seguridad", [
      ["¿BizUply es una historia clínica?", "No. Guarda la relación comercial y la cita. No afirma HIPAA ni cumplimiento clínico."],
      ["¿Dónde está la política de privacidad?", "En la página de privacidad. Esta respuesta no la sustituye."],
    ]],
    ["Soporte", [
      ["¿Cómo se hace una pregunta?", "Con el formulario de contacto. Enviarlo no inicia un cobro."],
      ["¿Cuál es el correo de soporte?", "support@bizuply.com."],
    ]],
  ]),
  "pt-BR": pack("pt-BR", "Perguntas sobre a BizUply", "Respostas curtas sobre a plataforma, os planos e o que uma página não inclui.", [
    ["Geral", [
      ["O que é a BizUply?", "BizUply é a marca da plataforma em bizuply.com. A empresa é Bizuply LLC. A plataforma guarda leads, clientes e a próxima tarefa. Agenda, automações e colaborações estão no plano de negócios."],
      ["Uma assinatura inclui tudo?", "Não. O CRM sozinho custa 49 dólares por mês. O plano de negócios custa 99 por mês ou 990 por ano. O WhatsApp custa 29 por mês por número conectado, e a Meta cobra as mensagens à parte."],
    ]],
    ["CRM", [
      ["O que é um lead?", "Uma pessoa que consultou e ainda não foi marcada como cliente. Os status são novo, contatado, interessado, convertido, perdido e lead antigo."],
      ["De onde um lead pode vir?", "De um formulário num site BizUply, de Lead Ads da Meta se a conta for elegível, de um formulário do Google Ads ou de um lançamento manual. A origem fica no lead. Não é um modelo privado de atribuição."],
    ]],
    ["WhatsApp", [
      ["O que cobrem os 29 dólares?", "O preço da BizUply por um número de WhatsApp conectado. A Meta aprova o número e os modelos. As tarifas de mensagem da Meta ficam à parte."],
      ["Dá para escrever para qualquer número?", "Não. Consentimento e política do WhatsApp continuam. Transferir um número depende da Meta e do provedor atual."],
    ]],
    ["Automações", [
      ["O que uma automação pode fazer?", "No plano de negócios um lead novo pode criar uma tarefa com data. O CRM sozinho não inclui automações."],
      ["A regra envia WhatsApp ou gasta orçamento?", "Não. Não envia um modelo sozinha nem gasta orçamento da Meta."],
    ]],
    ["Sites", [
      ["O que o editor publica?", "Uma página no endereço do negócio. Um formulário compatível pode criar um lead com o site como origem. Uma loja existe só onde o editor a oferece."],
      ["Os 399 dólares são o editor?", "Não. São o serviço de implantação publicado. Domínio, hospedagem e manutenção posterior só se o acordo disser."],
    ]],
    ["Preços", [
      ["O que é mensal e o que é anual?", "O CRM custa 49 dólares por mês. O plano de negócios custa 99 por mês ou 990 por ano. A página de preços viva é a fonte da cobrança."],
      ["O WhatsApp entra no preço do CRM?", "Não. O WhatsApp custa 29 dólares por mês por número, mais as tarifas da Meta."],
    ]],
    ["Conta e acesso", [
      ["Quem pode abrir um registro?", "As pessoas da conta, segundo os papéis já definidos. Estas páginas não acrescentam um papel."],
      ["Um perfil público cria uma parceria?", "Não. Encontrar um negócio por um campo publicado não é uma recomendação nem uma parceria verificada."],
    ]],
    ["Privacidade e segurança", [
      ["A BizUply é um prontuário?", "Não. Guarda o relacionamento comercial e o horário. Não afirma HIPAA nem conformidade clínica."],
      ["Onde está a política de privacidade?", "Na página de privacidade. Esta resposta não a substitui."],
    ]],
    ["Suporte", [
      ["Como se faz uma pergunta?", "Pelo formulário de contato. Enviá-lo não inicia uma cobrança."],
      ["Qual é o e-mail de suporte?", "support@bizuply.com."],
    ]],
  ]),
  ar: pack("ar", "أسئلة عن BizUply", "إجابات قصيرة عن المنصة والخطط وما لا تتضمنه الصفحة.", [
    ["عام", [
      ["ما هي BizUply؟", "BizUply هي علامة المنصة على bizuply.com. الشركة هي Bizuply LLC. تحفظ المنصة العملاء المحتملين والعملاء والمهمة التالية. المواعيد والأتمتة والتعاون في الخطة التجارية."],
      ["هل يشمل اشتراك واحد كل منتج؟", "لا. CRM وحده 49 دولاراً شهرياً. الخطة التجارية 99 شهرياً أو 990 سنوياً. WhatsApp بسعر 29 شهرياً لكل رقم مربوط، وتحصّل Meta الرسائل بشكل منفصل."],
    ]],
    ["CRM", [
      ["ما هو العميل المحتمل؟", "شخص استفسر ولم يُعلَّم بعد كعميل. الحالات هي جديد، تم التواصل، مهتم، تم التحويل، مفقود، وعميل محتمل قديم."],
      ["من أين يمكن أن يأتي؟", "من نموذج في موقع BizUply، أو إعلانات Meta بعد أهلية الحساب، أو نموذج Google Ads، أو إدخال يدوي. يُحفظ المصدر على العميل المحتمل. ليس نموذج إسناد خاصاً."],
    ]],
    ["WhatsApp", [
      ["ماذا يشمل مبلغ 29 دولاراً؟", "سعر BizUply لرقم WhatsApp واحد مربوط. توافق Meta على الرقم والقوالب. رسوم رسائل Meta منفصلة."],
      ["هل يمكن المراسلة إلى أي رقم؟", "لا. تبقى الموافقة وسياسة WhatsApp. نقل رقم قائم يعتمد على Meta والمزوّد الحالي."],
    ]],
    ["الأتمتة", [
      ["ماذا تستطيع الأتمتة أن تفعل؟", "في الخطة التجارية يمكن لعميل محتمل جديد إنشاء مهمة بتاريخ. CRM وحده لا يشمل الأتمتة."],
      ["هل ترسل القاعدة WhatsApp أو تنفق ميزانية إعلان؟", "لا. لا ترسل قالباً من تلقاء نفسها ولا تنفق ميزانية Meta."],
    ]],
    ["المواقع", [
      ["ماذا ينشر المحرر؟", "صفحة على عنوان العمل. يمكن لنموذج مدعوم إنشاء عميل محتمل والموقع هو المصدر. يوجد متجر فقط حيث يوفّره المحرر."],
      ["هل مبلغ 399 دولاراً هو المحرر؟", "لا. هو خدمة الإعداد المنشورة. النطاق والاستضافة والصيانة اللاحقة فقط إذا قال الاتفاق ذلك."],
    ]],
    ["الأسعار", [
      ["ما الشهري وما السنوي؟", "CRM بسعر 49 دولاراً شهرياً. الخطة التجارية 99 شهرياً أو 990 سنوياً. صفحة الأسعار الحية هي مصدر التحصيل."],
      ["هل WhatsApp داخل سعر CRM؟", "لا. WhatsApp بسعر 29 دولاراً شهرياً لكل رقم، إضافة إلى رسوم Meta."],
    ]],
    ["الحساب والصلاحيات", [
      ["من يستطيع فتح سجل؟", "أشخاص الحساب، وفق الأدوار المضبوطة. لا تضيف هذه الصفحات دوراً."],
      ["هل ينشئ الملف العام شراكة؟", "لا. العثور على عمل عبر حقل منشور ليس توصية وليس شراكة موثّقة."],
    ]],
    ["الخصوصية والأمان", [
      ["هل BizUply نظام سجلات طبية؟", "لا. تحفظ العلاقة التجارية والموعد. لا تدّعي HIPAA أو امتثالاً سريرياً."],
      ["أين سياسة الخصوصية؟", "في صفحة الخصوصية. هذا الجواب لا يحل محل السياسة."],
    ]],
    ["الدعم", [
      ["كيف نطرح سؤالاً؟", "عبر نموذج الاتصال. إرساله لا يبدأ تحصيلاً."],
      ["ما عنوان الدعم؟", "support@bizuply.com."],
    ]],
  ]),
};

export function getFaqCatalog(locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  return LOCALES[language] || LOCALES.en;
}
