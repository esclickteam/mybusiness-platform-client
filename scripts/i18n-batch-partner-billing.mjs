function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const PARTNER_BRANDING = {
  title: row("Brand and personal address", "מיתוג וכתובת אישית", "Marca y dirección personal", "Marca e endereço pessoal", "الهوية والعنوان الشخصي"),
  brandName: row("Brand name", "שם מותג", "Nombre de marca", "Nome da marca", "اسم العلامة"),
  personalLink: row("My personal link", "הקישור האישי שלי", "Mi enlace personal", "Meu link pessoal", "رابطي الشخصي"),
  preview: row("Preview", "תצוגה מקדימה", "Vista previa", "Prévia", "معاينة"),
  uploadLogo: row("Upload logo", "העלאת לוגו", "Subir logo", "Enviar logo", "رفع الشعار"),
  subdomain: row("Subdomain", "כתובת משנה", "Subdominio", "Subdomínio", "النطاق الفرعي"),
  available: row("This address is available", "הכתובת פנויה", "La dirección está disponible", "O endereço está disponível", "العنوان متاح"),
};

const PARTNER_DEAL = {
  eyebrow: row(
    "Deal #{{number}}",
    "עסקה #{{number}}",
    "Trato #{{number}}",
    "Negócio #{{number}}",
    "صفقة #{{number}}"
  ),
  confirmingStripe: row(
    "Confirming the payment with Stripe. Commission is not available to withdraw until the customer is activated.",
    "מאשרים את התשלום מול Stripe. העמלה עדיין לא זמינה למשיכה עד שהלקוח יופעל.",
    "Confirmando el pago con Stripe. La comisión no se puede retirar hasta activar al cliente.",
    "Confirmando o pagamento com a Stripe. A comissão não pode ser sacada até ativar o cliente.",
    "جارٍ تأكيد الدفع مع Stripe. العمولة غير متاحة للسحب حتى تفعيل العميل."
  ),
  pendingUntilActive: row(
    "Commission waits until the business and digital products are activated. A paid payment is not automatically available to withdraw.",
    "העמלה ממתינה עד שהעסק יופעל והמוצרים הדיגיטליים יופעלו. תשלום שולם אינו זמין למשיכה אוטומטית.",
    "La comisión espera hasta activar el negocio y los productos digitales. Un pago cobrado no se puede retirar automáticamente.",
    "A comissão espera até ativar a empresa e os produtos digitais. Um pagamento pago não fica automaticamente disponível para saque.",
    "العمولة تنتظر حتى تفعيل النشاط والمنتجات الرقمية. الدفع المدفوع لا يصبح متاحًا للسحب تلقائيًا."
  ),
};

const PARTNER_DOSSIER = {
  activateAfterPayment: row(
    "Activate account after payment",
    "הפעלת חשבון אחרי תשלום",
    "Activar la cuenta después del pago",
    "Ativar a conta após o pagamento",
    "تفعيل الحساب بعد الدفع"
  ),
};

const PARTNER_PRICING = {
  addOneTime: row("Add one-time commission", "הוסף עמלה חד-פעמית", "Añadir comisión única", "Adicionar comissão única", "إضافة عمولة لمرة واحدة"),
  addMonthly: row("Add monthly recurring commission", "הוסף עמלה חודשית מתחדשת", "Añadir comisión mensual recurrente", "Adicionar comissão mensal recorrente", "إضافة عمولة شهرية متجددة"),
  addYearly: row("Add yearly recurring commission", "הוסף עמלה שנתית מתחדשת", "Añadir comisión anual recurrente", "Adicionar comissão anual recorrente", "إضافة عمولة سنوية متجددة"),
  basePrice: row("Base price", "מחיר בסיס", "Precio base", "Preço base", "السعر الأساسي"),
  bizuplyPriceLine: row(
    "Bizuply price: {{amount}} {{billing}}",
    "מחיר Bizuply: {{amount}} {{billing}}",
    "Precio Bizuply: {{amount}} {{billing}}",
    "Preço Bizuply: {{amount}} {{billing}}",
    "سعر Bizuply: {{amount}} {{billing}}"
  ),
};

const PARTNER_WIZARD = {
  pricingHint: row(
    "Price is built only from selected products: Bizuply price plus the one-time and monthly commission set for each product. Bizuply receives {{bizuply}} of every commission on your partner plan, and you receive {{partner}}.",
    "המחיר נבנה רק מהמוצרים שנבחרו: מחיר Bizuply + העמלה החד-פעמית והחודשית שהוגדרו לכל מוצר במחירון. Bizuply מקבלת {{bizuply}} מכל עמלה לפי חבילת הפרטנר, ואתם מקבלים {{partner}}.",
    "El precio se construye solo con los productos seleccionados: precio Bizuply más la comisión única y mensual de cada producto. Bizuply recibe {{bizuply}} de cada comisión según su plan de partner, y usted recibe {{partner}}.",
    "O preço é montado só com os produtos selecionados: preço Bizuply mais a comissão única e mensal de cada produto. A Bizuply recebe {{bizuply}} de cada comissão no seu plano de parceiro, e você recebe {{partner}}.",
    "يُبنى السعر من المنتجات المحددة فقط: سعر Bizuply إضافة إلى العمولة لمرة واحدة والشهرية لكل منتج. تحصل Bizuply على {{bizuply}} من كل عمولة وفق باقة الشريك، وتحصلون على {{partner}}."
  ),
};

const BILLING_PURCHASE = {
  close: row("Close", "סגירה", "Cerrar", "Fechar", "إغلاق"),
  chooseTrack: row("Choose a service track", "בחירת מסלול", "Elegir un itinerario", "Escolher um percurso", "اختيار مسار الخدمة"),
  trackN: row("Track {{number}}", "מסלול {{number}}", "Itinerario {{number}}", "Percurso {{number}}", "المسار {{number}}"),
  optionalAddons: row("Optional add-ons", "תוספות לבחירה", "Complementos opcionales", "Complementos opcionais", "إضافات اختيارية"),
  quantity: row("Quantity", "כמות", "Cantidad", "Quantidade", "الكمية"),
  howToPurchase: row("How would you like to purchase this service?", "איך תרצו לרכוש את השירות?", "¿Cómo quieres comprar este servicio?", "Como você quer comprar este serviço?", "كيف تريد شراء هذه الخدمة؟"),
  choosePlan: row("Choose a plan", "בחירת חבילה", "Elegir un plan", "Escolher um plano", "اختيار خطة"),
  summaryTitle: row("Purchase summary", "סיכום הרכישה", "Resumen de la compra", "Resumo da compra", "ملخص الشراء"),
  addToExisting: row("Add to my existing plan", "הוספה לחבילה הקיימת שלי", "Añadir a mi plan actual", "Adicionar ao meu plano atual", "إضافة إلى خطتي الحالية"),
  addToPlan: row("Add to a plan", "הוספה לחבילה", "Añadir a un plan", "Adicionar a um plano", "إضافة إلى خطة"),
  activePlanLine: row(
    "Active plan: {{name}}. Your plan will not be charged again.",
    "החבילה הפעילה: {{name}}. החבילה לא תחויב מחדש.",
    "Plan activo: {{name}}. Tu plan no se cobrará de nuevo.",
    "Plano ativo: {{name}}. Seu plano não será cobrado de novo.",
    "الخطة النشطة: {{name}}. لن تُحاسب خطتك مرة أخرى."
  ),
  bundleHint: row(
    "Combine the service with a website, monthly business, or yearly business plan.",
    "שלבו את השירות עם חבילת אתר, חבילה עסקית חודשית או חבילה עסקית שנתית.",
    "Combina el servicio con un sitio, un plan mensual o un plan anual.",
    "Combine o serviço com um site, um plano mensal ou um plano anual.",
    "ادمج الخدمة مع موقع أو خطة عمل شهرية أو سنوية."
  ),
  standalone: row("Purchase separately", "רכישה נפרדת", "Comprar por separado", "Comprar separadamente", "الشراء بشكل منفصل"),
  standaloneHint: row(
    "Purchase only the service without changing your plan.",
    "רכשו רק את השירות, בלי לשנות את החבילה שלכם.",
    "Compra solo el servicio sin cambiar tu plan.",
    "Compre só o serviço sem alterar seu plano.",
    "اشترِ الخدمة فقط دون تغيير خطتك."
  ),
  websitePlan: row("Website only", "אתר בלבד", "Solo sitio web", "Somente site", "موقع فقط"),
  monthlyPlan: row("Monthly plan", "חבילה חודשית", "Plan mensual", "Plano mensal", "خطة شهرية"),
  yearlyPlan: row("Yearly plan", "חבילה שנתית", "Plan anual", "Plano anual", "خطة سنوية"),
  perMonth: row("/month", " לחודש", "/mes", "/mês", "/شهر"),
  perYear: row("/year", " לשנה", "/año", "/ano", "/سنة"),
  websiteYearHint: row(
    "One manual payment for the website year.",
    "תשלום ידני חד־פעמי עבור שנת האתר.",
    "Un pago manual por el año del sitio.",
    "Um pagamento manual pelo ano do site.",
    "دفعة يدوية واحدة لسنة الموقع."
  ),
  payToday: row("Payment today", "לתשלום היום", "Pago de hoy", "Pagamento de hoje", "الدفع اليوم"),
  estimateNote: row(
    "Displayed prices are estimates. The server determines the final amount.",
    "המחירים במסך זה לתצוגה בלבד. הסכום הסופי נקבע בשרת.",
    "Los precios en pantalla son estimaciones. El servidor fija el importe final.",
    "Os preços na tela são estimativas. O servidor define o valor final.",
    "الأسعار المعروضة تقديرية. يحدّد الخادم المبلغ النهائي."
  ),
  monthlyRecurring: row("Monthly recurring", "חודשי חוזר", "Mensual recurrente", "Mensal recorrente", "شهري متكرر"),
  yearlyRecurring: row("Yearly recurring", "שנתי חוזר", "Anual recurrente", "Anual recorrente", "سنوي متكرر"),
  oneTimeItems: row("One-time items", "פריטים חד־פעמיים", "Artículos únicos", "Itens únicos", "عناصر لمرة واحدة"),
  inPlan: row("Plan: {{name}}", "בחבילה: {{name}}", "Plan: {{name}}", "Plano: {{name}}", "الخطة: {{name}}"),
  standaloneSummary: row("Standalone purchase", "רכישה נפרדת", "Compra independiente", "Compra avulsa", "شراء منفصل"),
  includesWebsiteAddon: row(
    "Includes website add-on {{amount}} one-time",
    "כולל תוספת אתר {{amount}} חד־פעמי",
    "Incluye el extra de sitio {{amount}} único",
    "Inclui o extra de site {{amount}} único",
    "يشمل إضافة الموقع {{amount}} لمرة واحدة"
  ),
  nextRenewal: row("Next renewal: {{date}}", "החידוש הבא: {{date}}", "Próxima renovación: {{date}}", "Próxima renovação: {{date}}", "التجديد التالي: {{date}}"),
  sequentialCheckout: row(
    "Important: the monthly plan and monthly service are two separate subscriptions. You will complete two secure Stripe Checkouts, one after the other.",
    "חשוב: החבילה החודשית והשירות החודשי הם שני מנויים נפרדים. תעברו בשני תשלומי Stripe מאובטחים, אחד אחרי השני.",
    "Importante: el plan mensual y el servicio mensual son dos suscripciones distintas. Completarás dos pagos seguros de Stripe, uno detrás del otro.",
    "Importante: o plano mensal e o serviço mensal são duas assinaturas separadas. Você fará dois checkouts seguros da Stripe, um após o outro.",
    "مهم: الخطة الشهرية والخدمة الشهرية اشتراكان منفصلان. ستكمل عمليتي دفع آمنتين عبر Stripe، واحدة تلو الأخرى."
  ),
  waitingPlan: row(
    "Waiting for your active plan to be confirmed. The next checkout will open automatically.",
    "ממתינים לאישור החבילה הפעילה. התשלום הבא ייפתח אוטומטית.",
    "Esperando la confirmación del plan activo. El siguiente pago se abrirá solo.",
    "Aguardando a confirmação do plano ativo. O próximo checkout abrirá automaticamente.",
    "بانتظار تأكيد خطتك النشطة. سيُفتح الدفع التالي تلقائيًا."
  ),
  checkoutError: row(
    "We couldn't open secure checkout. Please try again.",
    "לא הצלחנו לפתוח את התשלום המאובטח. נסו שוב.",
    "No pudimos abrir el pago seguro. Inténtalo de nuevo.",
    "Não foi possível abrir o checkout seguro. Tente de novo.",
    "تعذّر فتح الدفع الآمن. حاول مرة أخرى."
  ),
  quotePrefill: row(
    "I'd like a quote for {{service}}",
    "אשמח לקבל הצעה עבור {{service}}",
    "Me gustaría una propuesta para {{service}}",
    "Gostaria de uma proposta para {{service}}",
    "أود الحصول على عرض لـ {{service}}"
  ),
  theService: row("this service", "השירות", "este servicio", "este serviço", "هذه الخدمة"),
  back: row("Back", "חזרה", "Volver", "Voltar", "رجوع"),
  choosePurchase: row("Choose purchase", "לבחירת רכישה", "Elegir compra", "Escolher compra", "اختيار الشراء"),
  continueSummary: row("Continue to summary", "המשך לסיכום", "Continuar al resumen", "Continuar para o resumo", "المتابعة إلى الملخص"),
  openingCheckout: row("Opening checkout...", "פותחים תשלום...", "Abriendo el pago...", "Abrindo o checkout...", "جارٍ فتح الدفع..."),
  continueSecure: row("Continue to secure payment", "המשך לתשלום מאובטח", "Continuar al pago seguro", "Continuar para o pagamento seguro", "المتابعة إلى الدفع الآمن"),
  loginContinue: row("Log in and continue", "התחברות והמשך", "Iniciar sesión y continuar", "Entrar e continuar", "تسجيل الدخول والمتابعة"),
  registerContinue: row("Register and continue", "הרשמה והמשך", "Registrarse y continuar", "Cadastrar e continuar", "التسجيل والمتابعة"),
};

const BILLING_UPSELL = {
  title: row("Upsells and extra services", "אפסיילים ושירותים נוספים", "Upsells y servicios extra", "Upsells e serviços extras", "الترقيات والخدمات الإضافية"),
  hint: row("Select services to add to the purchase", "סמנו שירותים להוספה לרכישה", "Marca servicios para añadir a la compra", "Marque serviços para adicionar à compra", "حدّد خدمات لإضافتها إلى الشراء"),
  empty: row("There are no active upsells in the catalog", "אין אפסיילים פעילים בקטלוג", "No hay upsells activos en el catálogo", "Não há upsells ativos no catálogo", "لا توجد ترقيات نشطة في الكتالوج"),
  selectedCount: row(
    "{{count}} selected · ₪{{amount}}",
    "נבחרו {{count}} · ₪{{amount}}",
    "{{count}} seleccionados · ₪{{amount}}",
    "{{count}} selecionados · ₪{{amount}}",
    "تم اختيار {{count}} · ₪{{amount}}"
  ),
  monthly: row("Monthly", "חודשי", "Mensual", "Mensal", "شهري"),
  yearly: row("Yearly", "שנתי", "Anual", "Anual", "سنوي"),
  oneTime: row("One-time", "חד־פעמי", "Único", "Único", "لمرة واحدة"),
  catalogPrice: row("Catalog ₪{{amount}}", "קטלוג ₪{{amount}}", "Catálogo ₪{{amount}}", "Catálogo ₪{{amount}}", "الكتالوج ₪{{amount}}"),
  customPrice: row("Amount to charge (₪)", "מחיר לתשלום (₪)", "Importe a cobrar (₪)", "Valor a cobrar (₪)", "المبلغ للتحصيل (₪)"),
};

const BILLING_UPGRADE = {
  title: row("This module is not included in your plan", "המודול הזה לא כלול בחבילה שלך", "Este módulo no está en tu plan", "Este módulo não está no seu plano", "هذه الوحدة غير مشمولة في خطتك"),
  text: row(
    "Your current plan includes website and domain management only.\nTo get CRM, leads, appointments, collaborations, automations, and business AI — upgrade to the business plan.",
    "החבילה הנוכחית שלך כוללת ניהול אתר ודומיין בלבד.\nכדי לקבל גישה ל-CRM, לידים, פגישות, שיתופי פעולה, אוטומציות ול-AI העסקי — שדרגו לחבילה העסקית.",
    "Tu plan actual solo incluye la gestión del sitio y el dominio.\nPara CRM, leads, citas, colaboraciones, automatizaciones e IA de negocio, mejora al plan business.",
    "Seu plano atual inclui só gestão de site e domínio.\nPara CRM, leads, horários, colaborações, automações e IA de negócio, faça upgrade para o plano business.",
    "خطتك الحالية تشمل إدارة الموقع والنطاق فقط.\nللحصول على CRM والعملاء المحتملين والمواعيد والتعاون والأتمتة وذكاء الأعمال — رقِّ إلى خطة الأعمال."
  ),
  upgradeCta: row("Upgrade to the business plan", "שדרוג לחבילה העסקית", "Mejorar al plan business", "Fazer upgrade para o plano business", "الترقية إلى خطة الأعمال"),
  backToWebsite: row("Back to website management", "חזרה לניהול האתר", "Volver a la gestión del sitio", "Voltar à gestão do site", "العودة إلى إدارة الموقع"),
};

const SUPPORT_BUSINESS = {
  badge: row("Business support", "תמיכה לעסקים", "Soporte para negocios", "Suporte para empresas", "دعم الأعمال"),
  title: row("How can we help?", "איך אפשר לעזור?", "¿Cómo podemos ayudar?", "Como podemos ajudar?", "كيف يمكننا المساعدة؟"),
  intro: row(
    "Have a question, an issue, or something to check? Fill in the form and a team member will get back to you soon.",
    "יש לך שאלה, תקלה או משהו שצריך לבדוק? מלא את הטופס ונציג מהצוות יחזור אליך בהקדם.",
    "¿Tienes una pregunta, un problema o algo que revisar? Completa el formulario y te responderemos pronto.",
    "Tem uma pergunta, um problema ou algo para revisar? Preencha o formulário e retornaremos em breve.",
    "لديك سؤال أو عطل أو أمر يجب فحصه؟ املأ النموذج وسيتواصل معك أحد الفريق قريبًا."
  ),
  formTitle: row("Open a support request", "פתיחת פנייה לתמיכה", "Abrir una solicitud de soporte", "Abrir um chamado de suporte", "فتح طلب دعم"),
  formHint: row(
    "Fill in the details and we will get back to you with a clear answer.",
    "מלא את הפרטים ונחזור אליך עם מענה מסודר.",
    "Completa los datos y te responderemos con una respuesta clara.",
    "Preencha os dados e retornaremos com uma resposta clara.",
    "املأ التفاصيل وسنعود إليك برد واضح."
  ),
  fullName: row("Full name", "שם מלא", "Nombre completo", "Nome completo", "الاسم الكامل"),
  namePlaceholder: row("Enter your full name", "הכנס שם מלא", "Introduce tu nombre completo", "Informe seu nome completo", "أدخل اسمك الكامل"),
  phone: row("Phone", "טלפון", "Teléfono", "Telefone", "الهاتף"),
  email: row("Email", "אימייל", "Email", "E-mail", "البريد الإلكتروني"),
  emailPlaceholder: row("Enter your email address", "הכנס כתובת אימייל", "Introduce tu email", "Informe seu e-mail", "أدخل عنوان بريدك"),
  message: row("Message", "הודעה", "Mensaje", "Mensagem", "الرسالة"),
  messagePlaceholder: row("Describe your question or issue", "תאר את השאלה או התקלה שלך", "Describe tu pregunta o problema", "Descreva sua pergunta ou problema", "صف سؤالك أو مشكلتك"),
  sending: row("Sending...", "שולח...", "Enviando...", "Enviando...", "جارٍ الإرسال..."),
  submit: row("Send request", "שליחת פנייה", "Enviar solicitud", "Enviar chamado", "إرسال الطلب"),
  requiredFields: row(
    "Please fill in all fields, including a phone number.",
    "יש למלא את כל השדות, כולל מספר טלפון.",
    "Completa todos los campos, incluido el teléfono.",
    "Preencha todos os campos, incluindo o telefone.",
    "يرجى ملء كل الحقول، بما في ذلك رقم الهاتف."
  ),
  sent: row(
    "Your request was sent. We will get back to you soon.",
    "הפנייה נשלחה בהצלחה! נחזור אליך בהקדם.",
    "Tu solicitud se envió. Te responderemos pronto.",
    "Seu chamado foi enviado. Retornaremos em breve.",
    "تم إرسال طلبك. سنعود إليك قريبًا."
  ),
  sendError: row(
    "We could not send the request. Please try again later.",
    "אירעה שגיאה בשליחת הפנייה. נסה שוב מאוחר יותר.",
    "No pudimos enviar la solicitud. Inténtalo más tarde.",
    "Não foi possível enviar o chamado. Tente mais tarde.",
    "تعذّر إرسال الطلب. حاول مرة أخرى لاحقًا."
  ),
  asideTitle: row("We are here for you", "אנחנו כאן בשבילך", "Estamos aquí para ti", "Estamos aqui para você", "نحن هنا من أجلك"),
  asideText: row(
    "Our support team handles business requests, sign-in issues, payments, system problems, and questions about CRM, the dashboard, the business page, and anything that needs a review.",
    "צוות התמיכה שלנו מטפל בפניות של עסקים, בעיות התחברות, תשלומים, תקלות במערכת, שאלות על CRM, דשבורד, עמוד עסקי וכל דבר שצריך בדיקה.",
    "El equipo de soporte atiende solicitudes de negocios, acceso, pagos, fallos del sistema y preguntas de CRM, panel, página de negocio y lo que necesite revisión.",
    "Nossa equipe trata chamados de empresas, acesso, pagamentos, falhas do sistema e dúvidas de CRM, painel, página do negócio e o que precisar de revisão.",
    "يعالج فريق الدعم طلبات الأعمال ومشاكل الدخول والمدفوعات وأعطال النظام وأسئلة CRM ولوحة التحكم وصفحة النشاط وأي أمر يحتاج مراجعة."
  ),
  responseTime: row("Response time", "זמן מענה", "Tiempo de respuesta", "Tempo de resposta", "وقت الرد"),
  responseHint: row("We will get back to you as soon as possible", "נחזור אליך בהקדם האפשרי", "Te responderemos lo antes posible", "Retornaremos o mais rápido possível", "سنعود إليك في أقرب وقت ممكن"),
  directEmail: row("Direct email", "אימייל ישיר", "Email directo", "E-mail direto", "بريد مباشر"),
  attachTitle: row("Helpful to include", "מומלץ לצרף בפנייה", "Útil incluir", "Útil incluir", "يُفضّل إرفاقه"),
  attachHint: row(
    "Business name, a short description of the issue, a screenshot if you have one, and a phone number for a callback.",
    "שם העסק, תיאור קצר של הבעיה, צילום מסך אם יש, וטלפון לחזרה.",
    "Nombre del negocio, una breve descripción, una captura si la tienes y un teléfono de contacto.",
    "Nome da empresa, uma descrição curta, um print se tiver e um telefone para retorno.",
    "اسم النشاط ووصف قصير للمشكلة ولقطة شاشة إن وُجدت ورقم هاتف للرد."
  ),
};

const SETTINGS_SYSTEM = {
  title: row("BizUply system settings", "הגדרות מערכת BizUply", "Ajustes del sistema BizUply", "Configurações do sistema BizUply", "إعدادات نظام BizUply"),
  subtitle: row(
    "Learn how the BizUply system works and how to manage platform settings effectively.",
    "למדו איך מערכת BizUply עובדת ואיך לנהל את הגדרות הפלטפורמה ביעילות.",
    "Aprende cómo funciona el sistema BizUply y cómo gestionar los ajustes de la plataforma.",
    "Saiba como o sistema BizUply funciona e como gerenciar as configurações da plataforma.",
    "تعرّف كيف يعمل نظام BizUply وكيف تدير إعدادات المنصة بفعالية."
  ),
};

const SETTINGS_SYSTEM_ITEMS = {
  whatAre: {
    question: row(
      "What are system settings in BizUply?",
      "מהן הגדרות המערכת ב-BizUply?",
      "¿Qué son los ajustes del sistema en BizUply?",
      "O que são as configurações do sistema no BizUply?",
      "ما هي إعدادات النظام في BizUply؟"
    ),
    answer: row(
      "System settings let you manage BizUply's central configuration, including preferences, permissions, and internal tools that affect how the business runs.",
      "הגדרות המערכת מאפשרות לנהל את התצורה המרכזית של פלטפורמת BizUply, כולל העדפות, הרשאות וכלים פנימיים שמשפיעים על אופן הפעלת העסק.",
      "Los ajustes del sistema permiten gestionar la configuración central de BizUply, incluidas preferencias, permisos y herramientas internas que afectan al negocio.",
      "As configurações do sistema permitem gerenciar a configuração central do BizUply, incluindo preferências, permissões e ferramentas internas que afetam o negócio.",
      "تتيح إعدادات النظام إدارة التكوين المركزي لمنصة BizUply، بما في ذلك التفضيلات والصلاحيات والأدوات الداخلية التي تؤثر على تشغيل النشاط."
    ),
  },
  whereManage: {
    question: row(
      "Where do you manage business and account preferences?",
      "איפה מנהלים את העדפות העסק והחשבון?",
      "¿Dónde se gestionan las preferencias del negocio y la cuenta?",
      "Onde se gerenciam as preferências do negócio e da conta?",
      "أين تُدار تفضيلات النشاط والحساب؟"
    ),
    answer: row(
      "You can manage business profile details, contact details, visibility settings, and general preferences directly from the dashboard. Changes apply in real time across the platform.",
      "ניתן לנהל את פרטי פרופיל העסק, פרטי קשר, הגדרות נראות והעדפות כלליות ישירות מלוח הבקרה. השינויים מיושמים בזמן אמת בכל הפלטפורמה.",
      "Puedes gestionar el perfil del negocio, el contacto, la visibilidad y las preferencias generales desde el panel. Los cambios se aplican al momento en toda la plataforma.",
      "Você pode gerenciar o perfil do negócio, contato, visibilidade e preferências gerais pelo painel. As mudanças valem em tempo real em toda a plataforma.",
      "يمكن إدارة تفاصيل ملف النشاط وجهة الاتصال وإعدادات الظهور والتفضيلات العامة مباشرة من لوحة التحكم. تُطبَّق التغييرات فورًا في المنصة كلها."
    ),
  },
  whichTools: {
    question: row(
      "Which tools are part of the BizUply system?",
      "אילו כלים נחשבים חלק ממערכת BizUply?",
      "¿Qué herramientas forman parte del sistema BizUply?",
      "Quais ferramentas fazem parte do sistema BizUply?",
      "ما الأدوات التي تُعد جزءًا من نظام BizUply؟"
    ),
    answer: row(
      "BizUply includes a business website builder, dashboard and analytics, CRM, business collaborations, an AI advisor, and internal system configuration tools.",
      "BizUply כוללת בונה אתרים עסקי, לוח בקרה וניתוחים, CRM, שיתופי פעולה עסקיים, יועץ AI וכלי תצורת מערכת פנימיים.",
      "BizUply incluye constructor web, panel y analítica, CRM, colaboraciones, un asesor de IA y herramientas internas de configuración.",
      "O BizUply inclui construtor de site, painel e análises, CRM, colaborações, um consultor de IA e ferramentas internas de configuração.",
      "يشمل BizUply منشئ مواقع للأعمال ولوحة تحكم وتحليلات وCRM وتعاونًا تجاريًا ومستشار ذكاء وأدوات تكوين داخلية."
    ),
  },
  dataSecurity: {
    question: row(
      "How does BizUply handle data security and privacy?",
      "איך BizUply מטפלת באבטחת מידע ופרטיות?",
      "¿Cómo trata BizUply la seguridad y la privacidad?",
      "Como o BizUply trata segurança e privacidade?",
      "كيف يتعامل BizUply مع أمن البيانات والخصوصية؟"
    ),
    answer: row(
      "BizUply is built with strong security practices, including access control, secure data handling, and system-level protections to protect business information.",
      "BizUply בנויה עם שיטות אבטחה חזקות, כולל בקרת גישה, טיפול מאובטח בנתונים והגנות ברמת המערכת להגנה על מידע העסק.",
      "BizUply está construida con prácticas de seguridad sólidas: control de acceso, tratamiento seguro de datos y protecciones a nivel de sistema.",
      "O BizUply é feito com práticas fortes de segurança: controle de acesso, tratamento seguro de dados e proteções em nível de sistema.",
      "بُني BizUply بممارسات أمنية قوية تشمل التحكم في الوصول ومعالجة البيانات بأمان وحمايات على مستوى النظام لحماية معلومات النشاط."
    ),
  },
  permissions: {
    question: row(
      "Can you control permissions and access inside the system?",
      "האם ניתן לשלוט בהרשאות ובגישה בתוך המערכת?",
      "¿Se pueden controlar permisos y acceso en el sistema?",
      "É possível controlar permissões e acesso no sistema?",
      "هل يمكن التحكم في الصلاحيات والوصول داخل النظام؟"
    ),
    answer: row(
      "Yes. BizUply provides controlled access to system features based on the account and business configuration. Additional permissions may depend on your plan.",
      "כן. BizUply מאפשרת גישה מבוקרת לתכונות המערכת על בסיס החשבון והתצורה העסקית. הרשאות נוספות עשויות להיות תלויות בתוכנית שלכם.",
      "Sí. BizUply da acceso controlado a las funciones según la cuenta y la configuración del negocio. Permisos extra pueden depender de tu plan.",
      "Sim. O BizUply dá acesso controlado aos recursos conforme a conta e a configuração do negócio. Permissões extras podem depender do seu plano.",
      "نعم. يوفّر BizUply وصولًا مضبوطًا إلى ميزات النظام حسب الحساب وتكوين النشاط. قد تعتمد صلاحيات إضافية على خطتكم."
    ),
  },
  changeImpact: {
    question: row(
      "How do system changes affect the dashboard and tools?",
      "איך שינויי מערכת משפיעים על לוח הבקרה והכלים?",
      "¿Cómo afectan los cambios del sistema al panel y las herramientas?",
      "Como as mudanças do sistema afetam o painel e as ferramentas?",
      "كيف تؤثر تغييرات النظام على لوحة التحكم والأدوات؟"
    ),
    answer: row(
      "System updates are reflected immediately in the dashboard, CRM, website builder, AI advisor, and collaboration tools to keep everything consistent.",
      "עדכוני מערכת משתקפים מיד בלוח הבקרה, ב-CRM, בבונה האתרים, ביועץ AI ובכלי שיתופי הפעולה כדי להבטיח יציבות.",
      "Las actualizaciones se reflejan al momento en el panel, CRM, constructor, asesor de IA y colaboraciones para mantener la coherencia.",
      "As atualizações aparecem na hora no painel, CRM, construtor, consultor de IA e colaborações para manter a consistência.",
      "تنعكس تحديثات النظام فورًا في لوحة التحكم وCRM ومنشئ المواقع ومستشار الذكاء وأدوات التعاون لضمان الاتساق."
    ),
  },
  somethingWrong: {
    question: row(
      "What should I do if something does not work as expected?",
      "מה לעשות אם משהו לא עובד כצפוי?",
      "¿Qué hago si algo no funciona como se espera?",
      "O que fazer se algo não funcionar como esperado?",
      "ماذا أفعل إذا لم يعمل شيء كما هو متوقع؟"
    ),
    answer: row(
      "Try refreshing the page and checking the connection. If the issue continues, go to the \"Troubleshooting and errors\" section or contact technical support.",
      "נסו לרענן את הדף ולבדוק את החיבור. אם הבעיה נמשכת, עברו למקטע «פתרון תקלות ושגיאות» או פנו לתמיכה טכנית.",
      "Prueba a actualizar la página y revisar la conexión. Si sigue, ve a «Problemas y errores» o contacta con soporte técnico.",
      "Tente atualizar a página e verificar a conexão. Se continuar, vá em «Problemas e erros» ou fale com o suporte técnico.",
      "جرّب تحديث الصفحة والتحقق من الاتصال. إذا استمرت المشكلة فانتقل إلى قسم «استكشاف الأخطاء والأعطال» أو تواصل مع الدعم الفني."
    ),
  },
  autoUpdates: {
    question: row(
      "Do system features update automatically?",
      "האם תכונות המערכת מתעדכנות אוטומטית?",
      "¿Las funciones del sistema se actualizan solas?",
      "Os recursos do sistema atualizam automaticamente?",
      "هل تتحدّث ميزات النظام تلقائيًا؟"
    ),
    answer: row(
      "Yes. BizUply publishes improvements and system updates regularly and automatically to ensure stability, performance, and new capabilities.",
      "כן. BizUply מפרסמת שיפורים ועדכוני מערכת באופן שוטף ואוטומטי כדי להבטיח יציבות, ביצועים ויכולות חדשות.",
      "Sí. BizUply publica mejoras y actualizaciones de forma regular y automática para estabilidad, rendimiento y nuevas funciones.",
      "Sim. O BizUply publica melhorias e atualizações de forma regular e automática para estabilidade, desempenho e novos recursos.",
      "نعم. ينشر BizUply تحسينات وتحديثات نظام بشكل منتظم وتلقائي لضمان الاستقرار والأداء والقدرات الجديدة."
    ),
  },
};

export function extraPartnerBillingLocaleObject(locale) {
  return {
    partner: {
      branding: pickLocaleMap(PARTNER_BRANDING, locale),
      deal: pickLocaleMap(PARTNER_DEAL, locale),
      dossier: pickLocaleMap(PARTNER_DOSSIER, locale),
      pricing: pickLocaleMap(PARTNER_PRICING, locale),
      wizard: pickLocaleMap(PARTNER_WIZARD, locale),
    },
    billing: {
      purchase: pickLocaleMap(BILLING_PURCHASE, locale),
      upsell: pickLocaleMap(BILLING_UPSELL, locale),
      upgrade: pickLocaleMap(BILLING_UPGRADE, locale),
    },
    support: {
      business: pickLocaleMap(SUPPORT_BUSINESS, locale),
    },
    settings: {
      system: {
        ...pickLocaleMap(SETTINGS_SYSTEM, locale),
        items: Object.fromEntries(
          Object.entries(SETTINGS_SYSTEM_ITEMS).map(([key, value]) => [
            key,
            pickLocaleMap(value, locale),
          ])
        ),
      },
    },
  };
}
