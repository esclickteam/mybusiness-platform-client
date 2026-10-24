/** Extra product detail for the public guides. No new slugs. */

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function text(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function shot(src, en, he, es, pt, ar) {
  return { src, caption: text(en, he, es, pt, ar) };
}

export function applyGuideDepth(articles) {
  function addSection(slug, section) {
    for (const locale of LOCALES) {
      articles[slug][locale].sections.push({
        id: section.id,
        heading: section.heading[locale],
        paragraphs: (section.paragraphs || []).map((paragraph) => paragraph[locale]),
        steps: section.steps?.map((step) => step[locale]),
        example: section.example
          ? { title: section.example.title[locale], body: section.example.body[locale] }
          : undefined,
        mistakes: section.mistakes?.map((item) => ({ problem: item.problem[locale], fix: item.fix[locale] })),
        shots: section.shots?.map((item) => ({ src: item.src, caption: item.caption[locale] })),
      });
    }
  }

  function patch(slug, id, change) {
    for (const locale of LOCALES) {
      const section = articles[slug][locale].sections.find((item) => item.id === id);
      if (section) change(section, locale);
    }
  }

  function layout(slug, name) {
    for (const locale of LOCALES) articles[slug][locale].layout = name;
  }

  patch("what-is-a-crm", "record", (section) => {
    delete section.video;
    delete section.videoNote;
    section.shots = [shot(
      "/demo-media/crm/still-3.jpg",
      "The lead list shows the source, the status, and the contact on one row.",
      "רשימת הלידים מציגה את המקור, את הסטטוס ואת פרטי הקשר באותה שורה.",
      "La lista de leads muestra el origen, el estado y el contacto en la misma fila.",
      "A lista de leads mostra a origem, o status e o contato na mesma linha.",
      "تعرض قائمة العملاء المصدر والحالة وبيانات التواصل في الصف نفسه.",
    )].map((item) => ({ src: item.src, caption: item.caption.en }));
  });
  patch("what-is-a-crm", "record", (section, locale) => {
    section.shots = [{
      src: "/demo-media/crm/still-3.jpg",
      caption: text(
        "The lead list shows the source, the status, and the contact on one row.",
        "רשימת הלידים מציגה את המקור, את הסטטוס ואת פרטי הקשר באותה שורה.",
        "La lista de leads muestra el origen, el estado y el contacto en la misma fila.",
        "A lista de leads mostra a origem, o status e o contato na mesma linha.",
        "تعرض قائمة العملاء المصدر والحالة وبيانات التواصل في الصف نفسه.",
      )[locale],
    }];
  });

  patch("follow-up-on-leads", "sequence", (section, locale) => {
    section.shots = [{
      src: "/demo-media/crm/still-8.jpg",
      caption: text(
        "On the lead, set the status, write the task, and give it a date before you close the file.",
        "על הליד קובעים סטטוס, כותבים את המשימה, ונותנים לה תאריך לפני שסוגרים את התיק.",
        "En el lead, ponga el estado, escriba la tarea y dele una fecha antes de cerrar el expediente.",
        "No lead, defina o status, escreva a tarefa e dê uma data antes de fechar o arquivo.",
        "على العميل، ضعوا الحالة، واكتبوا المهمة، وامنحوها تاريخاً قبل إغلاق الملف.",
      )[locale],
    }];
  });

  patch("from-ad-to-follow-up", "task", (section) => {
    delete section.video;
    delete section.videoNote;
  });
  patch("from-ad-to-follow-up", "task", (section, locale) => {
    section.shots = [{
      src: "/demo-media/crm/lead-task.png",
      caption: text(
        "The follow-up is a task on the lead, with the words and the date the next person needs.",
        "המעקב הוא משימה על הליד, עם המילים והתאריך שהאדם הבא צריך.",
        "El seguimiento es una tarea en el lead, con las palabras y la fecha que la siguiente persona necesita.",
        "O acompanhamento é uma tarefa no lead, com as palavras e a data de que a próxima pessoa precisa.",
        "المتابعة مهمة على العميل، بالكلمات والتاريخ اللذين يحتاجهما الشخص التالي.",
      )[locale],
    }];
  });

  patch("business-automation", "build", (section, locale) => {
    section.shots = [{
      src: "/demo-media/automations/still-8.jpg",
      caption: text(
        "The trigger is a lead moving to Contacted. The action creates a CRM task. Publish before you expect a run.",
        "הטריגר הוא ליד שעובר ל־נוצר קשר. הפעולה יוצרת משימת CRM. מפרסמים לפני שמצפים להרצה.",
        "El disparador es un lead que pasa a Contactado. La acción crea una tarea de CRM. Publique antes de esperar una ejecución.",
        "O gatilho é um lead que muda para Contato feito. A ação cria uma tarefa de CRM. Publique antes de esperar uma execução.",
        "المشغّل هو انتقال العميل إلى تم التواصل. ينشئ الإجراء مهمة CRM. انشروا قبل أن تتوقعوا تشغيلاً.",
      )[locale],
    }];
  });

  patch("build-a-website-without-code", "edit", (section, locale) => {
    section.shots = [{
      src: "/demo-media/websites/still-8.jpg",
      caption: text(
        "Select the headline, replace the words, and save before you trust the preview.",
        "בוחרים את הכותרת, מחליפים את המילים, ושומרים לפני שסומכים על התצוגה.",
        "Seleccione el titular, sustituya las palabras y guarde antes de fiarse de la vista previa.",
        "Selecione o título, substitua as palavras e salve antes de confiar na prévia.",
        "حدّدوا العنوان، واستبدلوا الكلمات، واحفظوا قبل الاعتماد على المعاينة.",
      )[locale],
    }];
  });
  patch("build-a-website-without-code", "publish", (section, locale) => {
    section.shots = [{
      src: "/demo-media/websites/still-14.jpg",
      caption: text(
        "Read the headline in the preview, including the phone width, before you publish.",
        "קוראים את הכותרת בתצוגה, כולל רוחב הטלפון, לפני הפרסום.",
        "Lea el titular en la vista previa, también en el ancho del teléfono, antes de publicar.",
        "Leia o título na prévia, inclusive na largura do telefone, antes de publicar.",
        "اقرأوا العنوان في المعاينة، بما في ذلك عرض الهاتف، قبل النشر.",
      )[locale],
    }];
  });

  patch("manage-meta-campaigns", "read", (section, locale) => {
    section.shots = [{
      src: "/demo-media/campaigns/still-8.jpg",
      caption: text(
        "Campaigns, ad sets and ads sit in one area. Your account shows your own spend and results.",
        "קמפיינים, סטים ומודעות יושבים באזור אחד. החשבון שלכם מציג את ההוצאה ואת התוצאות שלכם.",
        "Campañas, conjuntos y anuncios están en una sola área. Su cuenta muestra su propio gasto y sus resultados.",
        "Campanhas, conjuntos e anúncios ficam numa só área. A sua conta mostra o próprio gasto e os próprios resultados.",
        "الحملات والمجموعات والإعلانات في منطقة واحدة. يعرض حسابكم إنفاقكم ونتائجكم.",
      )[locale],
    }];
  });

  patch("appointments-for-a-service-business", "book", (section, locale) => {
    section.shots = [{
      src: "/demo-media/appointments/still-8.jpg",
      caption: text(
        "The calendar and the upcoming list keep the service and the time after you save.",
        "היומן ורשימת התורים הקרובים שומרים את השירות ואת השעה אחרי השמירה.",
        "El calendario y la lista próxima conservan el servicio y la hora después de guardar.",
        "O calendário e a lista próxima guardam o serviço e o horário depois de salvar.",
        "يبقي التقويم والقائمة القادمة الخدمة والوقت بعد الحفظ.",
      )[locale],
    }];
  });

  patch("whatsapp-message-templates", "template", (section, locale) => {
    section.shots = [{
      src: "/demo-media/whatsapp/still-3.jpg",
      caption: text(
        "Open the template and read its language, category, variables, and Meta status before a send.",
        "פותחים את התבנית וקוראים את השפה, הקטגוריה, המשתנים והסטטוס ב־Meta לפני שליחה.",
        "Abra la plantilla y lea el idioma, la categoría, las variables y el estado en Meta antes de un envío.",
        "Abra o modelo e leia o idioma, a categoria, as variáveis e o status na Meta antes de um envio.",
        "افتحوا القالب واقرأوا اللغة والفئة والمتغيرات وحالة Meta قبل الإرسال.",
      )[locale],
    }];
  });

  layout("crm-and-business-platform", "compare");
  layout("whatsapp-cloud-api-cost", "reference");
  layout("business-automation", "flow");
  layout("manage-meta-campaigns", "review");

  addSection("what-is-a-crm", {
    id: "morning",
    heading: text("A morning with three new leads", "בוקר עם שלושה לידים חדשים", "Una mañana con tres leads nuevos", "Uma manhã com três leads novos", "صباح مع ثلاثة عملاء جدد"),
    paragraphs: [
      text(
        "Open the lead list before you open a chat. Each row already has a source: a website form, a Meta lead form, a Google Ads form, or a person who typed the lead in. The first status is New. The file behind the row holds the phone, the email and the notes. That is the record the next person on the team can trust.",
        "פותחים את רשימת הלידים לפני שפותחים צ'אט. לכל שורה כבר יש מקור: טופס באתר, טופס לידים של Meta, טופס של Google Ads, או אדם שהקליד את הליד. הסטטוס הראשון הוא חדש. התיק מאחורי השורה מחזיק את הטלפון, את האימייל ואת ההערות. זו הרשומה שהאדם הבא בצוות יכול לסמוך עליה.",
        "Abra la lista de leads antes de abrir un chat. Cada fila ya tiene un origen: un formulario del sitio, un formulario de Meta, un formulario de Google Ads o una persona que escribió el lead. El primer estado es Nuevo. El expediente detrás de la fila guarda el teléfono, el correo y las notas.",
        "Abra a lista de leads antes de abrir um chat. Cada linha já tem uma origem: um formulário do site, um formulário da Meta, um formulário do Google Ads ou uma pessoa que digitou o lead. O primeiro status é Novo. O arquivo atrás da linha guarda o telefone, o e-mail e as notas.",
        "افتحوا قائمة العملاء قبل فتح دردشة. لكل صف مصدر: نموذج موقع، أو نموذج Meta، أو نموذج Google Ads، أو شخص كتب العميل. الحالة الأولى جديد. الملف خلف الصف يحفظ الهاتف والبريد والملاحظات.",
      ),
      text(
        "CRM only is $49 a month and renews monthly. It is the pipeline and the client file. Appointments, collaborations and automations are on the business plan at $99 a month or $990 a year. WhatsApp Business API is separate: $29 a month per connected number. Meta messaging charges apply separately, based on usage and message category.",
        "CRM בלבד עולה 49 דולר לחודש ומתחדש מדי חודש. זה הצינור ותיק הלקוח. תורים, שיתופים ואוטומציות נמצאים בחבילה העסקית ב־99 דולר לחודש או 990 דולר לשנה. WhatsApp Business API נפרד: 29 דולר לחודש לכל מספר מחובר. חיובי ההודעות של Meta מחושבים בנפרד, לפי השימוש וקטגוריית ההודעה.",
        "El CRM solo cuesta 49 dólares al mes y se renueva cada mes. Es el pipeline y el expediente. Las citas, las colaboraciones y las automatizaciones están en el plan de negocio a 99 dólares al mes o 990 al año. WhatsApp no entra en ninguno: un número conectado cuesta 29 dólares al mes, y Meta cobra los mensajes aparte.",
        "O CRM sozinho custa US$ 49 por mês e renova todo mês. É o pipeline e o arquivo do cliente. Agenda, colaborações e automações ficam no plano de negócios a US$ 99 por mês ou US$ 990 por ano. O WhatsApp não entra em nenhum: um número conectado custa US$ 29 por mês, e a Meta cobra as mensagens à parte.",
        "CRM وحده 49 دولاراً في الشهر ويتجدد شهرياً. هو المسار وملف العميل. المواعيد والتعاون والأتمتة في الخطة التجارية بـ 99 دولاراً في الشهر أو 990 في السنة. واتساب ليس في أي خطة: الرقم المتصل 29 دولاراً في الشهر، وMeta تحصّل الرسائل بشكل منفصل.",
      ),
    ],
    steps: [
      text("Open Leads, not a personal spreadsheet.", "פתחו לידים, לא גיליון אישי.", "Abra Leads, no una hoja personal.", "Abra Leads, não uma planilha pessoal.", "افتحوا العملاء، لا جدولاً شخصياً."),
      text("Read the source and the status before you dial.", "קראו את המקור ואת הסטטוס לפני החיוג.", "Lea el origen y el estado antes de llamar.", "Leia a origem e o status antes de ligar.", "اقرأوا المصدر والحالة قبل الاتصال."),
      text("Open the file and read the last note.", "פתחו את התיק וקראו את ההערה האחרונה.", "Abra el expediente y lea la última nota.", "Abra o arquivo e leia a última nota.", "افتحوا الملف واقرأوا الملاحظة الأخيرة."),
      text("Leave the next task on the file before you move on.", "השאירו את המשימה הבאה על התיק לפני שממשיכים.", "Deje la siguiente tarea en el expediente antes de seguir.", "Deixe a próxima tarefa no arquivo antes de seguir.", "اتركوا المهمة التالية على الملف قبل المتابعة."),
    ],
  });

  addSection("follow-up-on-leads", {
    id: "note",
    heading: text("Write a note the next person can use", "כותבים הערה שהאדם הבא יכול להשתמש בה", "Escriba una nota que la siguiente persona pueda usar", "Escreva uma nota que a próxima pessoa consiga usar", "اكتبوا ملاحظة يستطيع الشخص التالي استخدامها"),
    paragraphs: [
      text(
        "The note says what happened. “Called, no answer” is complete when that is what happened. “Asked for the morning package, call Thursday” is complete when that is what was promised. The task then carries the date and the owner. Overdue tasks appear in notifications, and a new lead does too, so the first response does not depend on refreshing a spreadsheet.",
        "ההערה אומרת מה קרה. ״התקשרתי, אין מענה״ שלם כשזה מה שקרה. ״ביקש את חבילת הבוקר, להתקשר ביום חמישי״ שלם כשזה מה שהובטח. המשימה אחר כך נושאת את התאריך ואת האחראי. משימות באיחור מופיעות בהתראות, וגם ליד חדש, כך שהתגובה הראשונה לא תלויה ברענון של גיליון.",
        "La nota dice lo que pasó. “Llamé, no contestó” está completa cuando eso es lo que pasó. “Pidió el paquete de la mañana, llamar el jueves” está completa cuando eso es lo prometido. La tarea lleva la fecha y el responsable. Las tareas vencidas aparecen en las alertas, y un lead nuevo también.",
        "A nota diz o que aconteceu. “Liguei, não atendeu” está completa quando foi isso. “Pediu o pacote da manhã, ligar na quinta” está completa quando foi isso o combinado. A tarefa carrega a data e o responsável. Tarefas atrasadas aparecem nos alertas, e um lead novo também.",
        "الملاحظة تقول ما حدث. «اتصلت، لا جواب» كافية حين يكون هذا ما حدث. «طلب باقة الصباح، الاتصال يوم الخميس» كافية حين يكون هذا الوعد. ثم تحمل المهمة التاريخ والمسؤول. تظهر المهام المتأخرة في التنبيهات، وكذلك العميل الجديد.",
      ),
    ],
    example: {
      title: text("A clinic desk at 09:10", "דלפק מרפאה ב־09:10", "Un mostrador de clínica a las 09:10", "Uma recepção de clínica às 09:10", "مكتب عيادة في 09:10"),
      body: text(
        "Two leads arrived overnight, one from the website and one from Meta. Both are New. The person on the desk calls the website lead first because that person asked for a time, writes “no answer, try 16:00”, and saves a task for 16:00. The Meta lead gets the same treatment a minute later. Nothing about either call lives only in a private chat.",
        "שני לידים הגיעו בלילה, אחד מהאתר ואחד מ־Meta. שניהם חדשים. מי שנמצא בדלפק מתקשר קודם לליד מהאתר כי הוא ביקש שעה, כותב ״אין מענה, לנסות ב־16:00״, ושומר משימה ל־16:00. ליד ה־Meta מקבל את אותו טיפול דקה אחר כך. שום דבר מאחת השיחות לא נשאר רק בצ'אט פרטי.",
        "Llegaron dos leads por la noche, uno del sitio y uno de Meta. Los dos están en Nuevo. Quien está en el mostrador llama primero al del sitio porque pidió una hora, escribe “no contestó, probar a las 16:00” y guarda una tarea para las 16:00.",
        "Chegaram dois leads de noite, um do site e um da Meta. Os dois estão em Novo. Quem está na recepção liga primeiro para o do site porque pediu um horário, escreve “não atendeu, tentar às 16:00” e salva uma tarefa para as 16:00.",
        "وصل عميلان ليلاً، واحد من الموقع وواحد من Meta. كلاهما جديد. من في المكتب يتصل أولاً بعميل الموقع لأنه طلب وقتاً، ويكتب «لا جواب، المحاولة في 16:00»، ويحفظ مهمة للساعة 16:00.",
      ),
    },
    mistakes: [
      {
        problem: text("The status moves to Contacted before anyone reached the person.", "הסטטוס עובר ל־נוצר קשר לפני שמישהו באמת הגיע אל האדם.", "El estado pasa a Contactado antes de que alguien llegue a la persona.", "O status muda para Contato feito antes de alguém alcançar a pessoa.", "تنتقل الحالة إلى تم التواصل قبل أن يصل أحد إلى الشخص."),
        fix: text("Contacted means a real contact. Until then the status stays New and the task is the call.", "נוצר קשר אומר שהיה קשר אמיתי. עד אז הסטטוס נשאר חדש והמשימה היא השיחה.", "Contactado significa un contacto real. Hasta entonces el estado sigue en Nuevo y la tarea es la llamada.", "Contato feito significa um contato real. Até lá o status continua Novo e a tarefa é a ligação.", "تم التواصل يعني تواصلاً حقيقياً. حتى ذلك تبقى الحالة جديداً والمهمة هي الاتصال."),
      },
    ],
  });

  addSection("meta-lead-ads-to-crm", {
    id: "confirm",
    heading: text("Confirm the person, then own the next step", "מאשרים את האדם, ואז לוקחים את הצעד הבא", "Confirme a la persona y luego tome el siguiente paso", "Confirme a pessoa e depois assuma o próximo passo", "أكّدوا الشخص ثم امتلكوا الخطوة التالية"),
    paragraphs: [
      text(
        "After the business approves the permission on its own Facebook page, a Lead Ad can create a CRM row. The source stays with that row, and the first status is New. Open the row before you treat the campaign as a source of work. A result count in the campaigns area is not the same thing as a person in the file.",
        "אחרי שהעסק מאשר את ההרשאה על דף הפייסבוק שלו, ליד ממודעה יכול ליצור שורה ב־CRM. המקור נשאר על השורה, והסטטוס הראשון הוא חדש. פותחים את השורה לפני שמתייחסים לקמפיין כאל מקור עבודה. מספר תוצאות באזור הקמפיינים אינו אותו דבר כמו אדם בתיק.",
        "Después de que el negocio aprueba el permiso en su propia página de Facebook, un Lead Ad puede crear una fila en el CRM. El origen se queda en esa fila y el primer estado es Nuevo. Abra la fila antes de tratar la campaña como una fuente de trabajo.",
        "Depois que o negócio aprova a permissão na própria página do Facebook, um Lead Ad pode criar uma linha no CRM. A origem fica nessa linha e o primeiro status é Novo. Abra a linha antes de tratar a campanha como uma fonte de trabalho.",
        "بعد أن يوافق النشاط على الإذن في صفحة فيسبوك الخاصة به، يمكن لإعلان عملاء أن ينشئ صفاً في CRM. يبقى المصدر على الصف والحالة الأولى جديد. افتحوا الصف قبل اعتبار الحملة مصدر عمل.",
      ),
      text(
        "The $49 plan can store the lead. An automation that creates the next task when the status changes is on the business plan. Meta still bills the ads. Bizuply is a Meta Tech Provider and the app passed Meta App Review for Lead Ads. That is not a Meta Business Partner badge, and connecting the page does not start spend.",
        "מסלול 49 הדולר יכול לשמור את הליד. אוטומציה שיוצרת את המשימה הבאה כשהסטטוס משתנה נמצאת בחבילה העסקית. Meta עדיין מחייבת את המודעות. ביזאפלי היא Meta Tech Provider והאפליקציה עברה Meta App Review ללידים ממודעות. זה לא תג Meta Business Partner, וחיבור הדף לא מתחיל הוצאה.",
        "El plan de 49 dólares puede guardar el lead. Una automatización que cree la siguiente tarea cuando cambia el estado está en el plan de negocio. Meta sigue cobrando los anuncios. Bizuply es Meta Tech Provider y la app pasó Meta App Review para Lead Ads. No es una insignia de Meta Business Partner, y conectar la página no inicia el gasto.",
        "O plano de US$ 49 pode guardar o lead. Uma automação que crie a próxima tarefa quando o status muda fica no plano de negócios. A Meta continua cobrando os anúncios. A Bizuply é Meta Tech Provider e o app passou no Meta App Review para Lead Ads. Não é um selo de Meta Business Partner, e conectar a página não inicia o gasto.",
        "خطة 49 دولاراً تستطيع حفظ العميل. أتمتة تنشئ المهمة التالية عند تغيّر الحالة موجودة في الخطة التجارية. ما زالت Meta تحصّل الإعلانات. Bizuply هي Meta Tech Provider واجتاز التطبيق Meta App Review لإعلانات العملاء. هذا ليس شارة Meta Business Partner، وربط الصفحة لا يبدأ الإنفاق.",
      ),
    ],
  });

  addSection("connect-a-meta-ad-account", {
    id: "spend",
    heading: text("Leave delivery off until the account is the one you expect", "משאירים את ההפצה כבויה עד שהחשבון הוא זה שציפיתם לו", "Deje la entrega apagada hasta que la cuenta sea la que espera", "Deixe a entrega desligada até a conta ser a que você espera", "اتركوا التسليم متوقفاً إلى أن يكون الحساب هو المتوقع"),
    paragraphs: [
      text(
        "The connection uses the ad account the business already owns. After approval, the campaigns area should list that account. Read the account before you create a campaign. Publishing, pausing and resuming change what Meta delivers, and Meta sends the bill for the media. Bizuply does not add a campaign fee on the pricing page.",
        "החיבור משתמש בחשבון המודעות שהעסק כבר מחזיק. אחרי האישור, אזור הקמפיינים צריך להציג את החשבון הזה. קוראים את החשבון לפני שיוצרים קמפיין. פרסום, השהיה וחידוש משנים את מה ש־Meta מפיצה, ו־Meta שולחת את החשבון על המדיה. ביזאפלי לא מוסיפה עמלת קמפיין בעמוד המחירים.",
        "La conexión usa la cuenta de anuncios que el negocio ya tiene. Después de la aprobación, el área de campañas debe mostrar esa cuenta. Lea la cuenta antes de crear una campaña. Publicar, pausar y reanudar cambian lo que Meta entrega, y Meta envía la factura de los medios.",
        "A conexão usa a conta de anúncios que o negócio já tem. Depois da aprovação, a área de campanhas deve mostrar essa conta. Leia a conta antes de criar uma campanha. Publicar, pausar e retomar mudam o que a Meta entrega, e a Meta envia a conta da mídia.",
        "يستخدم الربط حساب الإعلانات الذي يملكه النشاط. بعد الموافقة، يجب أن تعرض منطقة الحملات هذا الحساب. اقرأوا الحساب قبل إنشاء حملة. النشر والإيقاف والاستئناف تغيّر ما تسلّمه Meta، وترسل Meta فاتورة الوسائط.",
      ),
      text(
        "Each business connects an account it owns. There is no screen that connects every client of an agency from one login. Lead Ads use a separate permission on the Facebook page. After that permission, open the lead and check its source before you treat the connection and the lead form as the same job.",
        "כל עסק מחבר חשבון שהוא מחזיק. אין מסך שמחבר את כל לקוחות הסוכנות מהתחברות אחת. לידים ממודעות משתמשים בהרשאה נפרדת על דף הפייסבוק. אחרי ההרשאה פותחים את הליד ובודקים את המקור לפני שמתייחסים לחיבור ולטופס הלידים כאל אותה עבודה.",
        "Cada negocio conecta una cuenta que posee. No hay una pantalla que conecte a todos los clientes de una agencia desde un solo acceso. Los Lead Ads usan un permiso aparte en la página de Facebook.",
        "Cada negócio conecta uma conta que possui. Não há uma tela que conecte todos os clientes de uma agência a partir de um só login. Os Lead Ads usam uma permissão separada na página do Facebook.",
        "كل نشاط يربط حساباً يملكه. لا توجد شاشة تربط كل عملاء وكالة من دخول واحد. تستخدم إعلانات العملاء إذناً منفصلاً على صفحة فيسبوك.",
      ),
    ],
  });

  addSection("manage-meta-campaigns", {
    id: "lead",
    heading: text("Read the chart, then open the lead", "קוראים את התרשים, ואז פותחים את הליד", "Lea el gráfico y luego abra el lead", "Leia o gráfico e depois abra o lead", "اقرأوا الرسم ثم افتحوا العميل"),
    paragraphs: [
      text(
        "The campaigns area can show amount spent, impressions, reach, leads, CTR and CPC for the account you connected. Those figures describe delivery. They do not replace the lead file. Open the CRM and look for the Meta source. If the person is not there yet, the chart has not become a follow-up.",
        "אזור הקמפיינים יכול להציג סכום שהוצא, הצגות, חשיפה, לידים, CTR ו־CPC עבור החשבון שחיברתם. המספרים האלה מתארים הפצה. הם לא מחליפים את תיק הליד. פותחים את ה־CRM ומחפשים את המקור של Meta. אם האדם עוד לא שם, התרשים עוד לא הפך למעקב.",
        "El área de campañas puede mostrar el importe gastado, las impresiones, el alcance, los leads, el CTR y el CPC de la cuenta que conectó. Esas cifras describen la entrega. No sustituyen el expediente del lead.",
        "A área de campanhas pode mostrar o valor gasto, as impressões, o alcance, os leads, o CTR e o CPC da conta que você conectou. Esses números descrevem a entrega. Eles não substituem o arquivo do lead.",
        "يمكن لمنطقة الحملات أن تعرض المبلغ المنفق ومرات الظهور والوصول والعملاء وCTR وCPC للحساب الذي ربطتموه. تصف هذه الأرقام التسليم. وهي لا تستبدل ملف العميل.",
      ),
    ],
    mistakes: [
      {
        problem: text("A high lead count on the chart is treated as finished follow-up.", "מספר לידים גבוה בתרשים נחשב למעקב שנגמר.", "Un recuento alto de leads en el gráfico se trata como un seguimiento terminado.", "Uma contagem alta de leads no gráfico é tratada como acompanhamento concluído.", "يُعامل عدد عملاء مرتفع في الرسم كمتابعة منتهية."),
        fix: text("The follow-up starts when someone opens the lead and leaves a task.", "המעקב מתחיל כשמישהו פותח את הליד ומשאיר משימה.", "El seguimiento empieza cuando alguien abre el lead y deja una tarea.", "O acompanhamento começa quando alguém abre o lead e deixa uma tarefa.", "تبدأ المتابعة حين يفتح أحد العميل ويترك مهمة."),
      },
    ],
  });

  addSection("business-automation", {
    id: "publish-run",
    heading: text("Publish, then change the status", "מפרסמים, ואז משנים את הסטטוס", "Publique y luego cambie el estado", "Publique e depois mude o status", "انشروا ثم غيّروا الحالة"),
    paragraphs: [
      text(
        "The Test button checks the draft. It does not write a run and it does not create the task. Publish the workflow, then move a lead to Contacted. The history should show Success, and the task should sit on that lead. If the history stays empty, the workflow was not published or the status did not actually change.",
        "כפתור הבדיקה בודק את הטיוטה. הוא לא כותב הרצה ולא יוצר את המשימה. מפרסמים את התהליך, ואז מעבירים ליד ל־נוצר קשר. ההיסטוריה צריכה להציג Success, והמשימה צריכה לשבת על הליד. אם ההיסטוריה נשארת ריקה, התהליך לא פורסם או שהסטטוס לא באמת השתנה.",
        "El botón Probar revisa el borrador. No escribe una ejecución y no crea la tarea. Publique el flujo y luego pase un lead a Contactado. El historial debe mostrar Success, y la tarea debe quedar en ese lead.",
        "O botão Testar confere o rascunho. Ele não grava uma execução e não cria a tarefa. Publique o fluxo e depois mude um lead para Contato feito. O histórico deve mostrar Success, e a tarefa deve ficar nesse lead.",
        "زر الاختبار يراجع المسودة. لا يكتب تشغيلاً ولا ينشئ المهمة. انشروا التدفق ثم انقلوا عميلاً إلى تم التواصل. يجب أن يعرض السجل Success، وأن تكون المهمة على ذلك العميل.",
      ),
      text(
        "Leave out a condition you cannot fill. An empty condition blocks the branch, so the task never runs. The task title can be the default sentence plus the lead's name. WhatsApp is a different action: it needs the business plan, a paid number at $29 a month, and a template Meta has approved. The agents page is a person, not a bot.",
        "מוותרים על תנאי שאי אפשר למלא. תנאי ריק חוסם את הענף, והמשימה לא רצה. כותרת המשימה יכולה להיות משפט ברירת המחדל ועוד שם הליד. וואטסאפ הוא פעולה אחרת: הוא צריך את החבילה העסקית, מספר בתשלום ב־29 דולר לחודש, ותבנית ש־Meta אישרה. עמוד הסוכנים הוא אדם, לא בוט.",
        "Omita una condición que no pueda completar. Una condición vacía bloquea la rama, así que la tarea no se ejecuta. El título de la tarea puede ser la frase predeterminada más el nombre del lead. WhatsApp es otra acción: necesita el plan de negocio, un número de pago a 29 dólares al mes y una plantilla aprobada por Meta.",
        "Pule uma condição que você não consiga preencher. Uma condição vazia bloqueia o ramo, então a tarefa não executa. O título da tarefa pode ser a frase padrão mais o nome do lead. O WhatsApp é outra ação: precisa do plano de negócios, de um número pago a US$ 29 por mês e de um modelo aprovado pela Meta.",
        "تجاوزوا شرطاً لا يمكن ملؤه. الشرط الفارغ يوقف الفرع، فلا تعمل المهمة. يمكن أن يكون عنوان المهمة الجملة الافتراضية مع اسم العميل. واتساب إجراء آخر: يحتاج إلى الخطة التجارية ورقم مدفوع بـ 29 دولاراً في الشهر وقالب اعتمدته Meta.",
      ),
    ],
  });

  addSection("build-a-website-without-code", {
    id: "headline-choice",
    heading: text("Choose a headline a stranger can use", "בוחרים כותרת שאדם זר יכול להשתמש בה", "Elija un titular que un desconocido pueda usar", "Escolha um título que um desconhecido consiga usar", "اختاروا عنواناً يستطيع غريب استخدامه"),
    paragraphs: [
      text(
        "Name the service and who it is for. Save, then read the same sentence on the phone preview. If it is cut off, shorten it. Saving keeps the draft. Publishing is what a visitor can open. If the page should also collect an inquiry, place the form before you publish and then look in the CRM for a lead whose source is the website.",
        "מציינים את השירות ואת מי שהוא מיועד לו. שומרים, ואז קוראים את אותו משפט בתצוגת הטלפון. אם הוא נחתך, מקצרים. השמירה שומרת את הטיוטה. הפרסום הוא מה שמבקר יכול לפתוח. אם העמוד צריך גם לאסוף פנייה, מניחים את הטופס לפני הפרסום ואז מחפשים ב־CRM ליד שהמקור שלו הוא האתר.",
        "Nombre el servicio y para quién es. Guarde y luego lea la misma frase en la vista del teléfono. Si se corta, acórtela. Guardar conserva el borrador. Publicar es lo que un visitante puede abrir.",
        "Nomeie o serviço e para quem ele é. Salve e depois leia a mesma frase na prévia do telefone. Se for cortada, encurte. Salvar guarda o rascunho. Publicar é o que um visitante pode abrir.",
        "سمّوا الخدمة ولمن هي. احفظوا ثم اقرأوا الجملة نفسها في معاينة الهاتف. إذا قُصّت، قصّروها. الحفظ يبقي المسودة. النشر هو ما يستطيع الزائر فتحه.",
      ),
      text(
        "If you would rather not edit, the expert build is $399 once for up to five pages on an existing template, with your content, a lead form, a CRM connection and up to two revision rounds. An extra page is $49. Content writing, if you ask for it, is $149. A basic store is an extra $399. Advanced custom design is an extra $799. Those are setup prices. CRM only remains $49 a month.",
        "אם מעדיפים לא לערוך, בניית המומחה עולה 399 דולר חד־פעמית לעד חמישה עמודים על תבנית קיימת, עם התוכן שלכם, טופס לידים, חיבור ל־CRM ועד שני סבבי תיקונים. עמוד נוסף עולה 49 דולר. כתיבת תוכן, אם מבקשים אותה, עולה 149 דולר. חנות בסיסית היא תוספת של 399 דולר. עיצוב אישי מתקדם הוא תוספת של 799 דולר. אלה מחירי הקמה. CRM בלבד נשאר 49 דולר לחודש.",
        "Si prefiere no editar, la construcción de experto cuesta 399 dólares una vez por hasta cinco páginas sobre una plantilla existente, con su contenido, un formulario, conexión al CRM y hasta dos rondas de cambios. Una página extra cuesta 49 dólares. La redacción, si la pide, cuesta 149. Una tienda básica suma 399. El diseño avanzado suma 799. El CRM solo sigue a 49 dólares al mes.",
        "Se preferir não editar, a construção de especialista custa 399 dólares uma vez para até cinco páginas em um modelo existente, com o seu conteúdo, um formulário, ligação ao CRM e até duas rodadas de ajustes. Uma página extra custa 49 dólares. A redação, se pedir, custa 149. Uma loja básica soma 399. O design avançado soma 799. O CRM sozinho continua a US$ 49 por mês.",
        "إذا فضّلتم عدم التحرير، فبناء المختص 399 دولاراً مرة واحدة لما يصل إلى خمس صفحات على قالب موجود، بمحتواكم ونموذج وربط بـ CRM وحتى جولتي تعديل. الصفحة الإضافية 49 دولاراً. كتابة المحتوى، إن طُلبت، 149 دولاراً. متجر أساسي إضافة 399 دولاراً. تصميم متقدم إضافة 799 دولاراً. يبقى CRM وحده 49 دولاراً في الشهر.",
      ),
    ],
  });

  addSection("website-form-to-crm", {
    id: "after",
    heading: text("After the form is sent", "אחרי שהטופס נשלח", "Después de enviar el formulario", "Depois que o formulário é enviado", "بعد إرسال النموذج"),
    paragraphs: [
      text(
        "Submit the form once yourself after you publish. In the CRM, look for a new lead whose source is the website and whose status is New. Open it, write what the person asked, and leave a task with a date. Until that row exists, the form is only a field on a page.",
        "שולחים את הטופס פעם אחת בעצמכם אחרי הפרסום. ב־CRM מחפשים ליד חדש שהמקור שלו הוא האתר והסטטוס שלו חדש. פותחים אותו, כותבים מה האדם ביקש, ומשאירים משימה עם תאריך. עד שהשורה הזאת קיימת, הטופס הוא רק שדה בעמוד.",
        "Envíe el formulario una vez usted mismo después de publicar. En el CRM, busque un lead nuevo cuyo origen sea el sitio y cuyo estado sea Nuevo. Ábralo, escriba lo que la persona pidió y deje una tarea con fecha.",
        "Envie o formulário uma vez você mesmo depois de publicar. No CRM, procure um lead novo cuja origem seja o site e cujo status seja Novo. Abra, escreva o que a pessoa pediu e deixe uma tarefa com data.",
        "أرسلوا النموذج مرة بأنفسكم بعد النشر. في CRM ابحثوا عن عميل جديد مصدره الموقع وحالته جديد. افتحوه، واكتبوا ما طلبه الشخص، واتركوا مهمة بتاريخ.",
      ),
      text(
        "The same pipeline also accepts Meta Lead Ads and Google Ads lead forms, each with its own source. The $49 plan can store the lead. An automation that reacts to it needs the business plan. The website-only product has its own yearly price on the pricing page. The $399 expert build is the setup, not the subscription.",
        "אותו צינור מקבל גם לידים ממודעות Meta וטפסי Google Ads, כל אחד עם המקור שלו. מסלול 49 הדולר יכול לשמור את הליד. אוטומציה שמגיבה לו צריכה את החבילה העסקית. למוצר האתר בלבד יש מחיר שנתי משלו בעמוד המחירים. בניית 399 הדולר היא ההקמה, לא המנוי.",
        "El mismo pipeline también acepta Lead Ads de Meta y formularios de Google Ads, cada uno con su origen. El plan de 49 dólares puede guardar el lead. Una automatización que reaccione necesita el plan de negocio.",
        "O mesmo pipeline também aceita Lead Ads da Meta e formulários do Google Ads, cada um com a própria origem. O plano de US$ 49 pode guardar o lead. Uma automação que reaja precisa do plano de negócios.",
        "المسار نفسه يقبل أيضاً إعلانات Meta ونماذج Google Ads، لكل منها مصدره. خطة 49 دولاراً تستطيع حفظ العميل. أتمتة تتفاعل معه تحتاج إلى الخطة التجارية.",
      ),
    ],
  });

  addSection("appointments-for-a-service-business", {
    id: "day",
    heading: text("A day on the calendar", "יום על היומן", "Un día en el calendario", "Um dia no calendário", "يوم على التقويم"),
    paragraphs: [
      text(
        "Set the working hours before you look for a slot. A closed day offers no time. A service has a duration and a price, and the calendar offers starts in 15-minute steps. A 45-minute service cannot start so late that it runs past closing. Staff book from the calendar. Clients can book on the public booking page when it is enabled, and a confirmation email can go to the client and the business.",
        "קובעים את שעות העבודה לפני שמחפשים חלון. יום סגור לא מציע שעה. לשירות יש משך ומחיר, והיומן מציע התחלות בקפיצות של 15 דקות. שירות של 45 דקות לא יכול להתחיל מאוחר כל כך שיגלוש מעבר לסגירה. הצוות קובע מהיומן. לקוחות יכולים לקבוע בעמוד הזימון הציבורי כשהוא פעיל, ואישור במייל יכול להישלח ללקוח ולעסק.",
        "Defina el horario antes de buscar un hueco. Un día cerrado no ofrece una hora. Un servicio tiene duración y precio, y el calendario ofrece inicios en pasos de 15 minutos. El equipo reserva desde el calendario. El cliente puede reservar en la página pública cuando está activada.",
        "Defina o horário antes de procurar uma janela. Um dia fechado não oferece horário. Um serviço tem duração e preço, e o calendário oferece inícios em passos de 15 minutos. A equipe agenda pelo calendário. O cliente pode agendar na página pública quando ela está ativa.",
        "حدّدوا ساعات العمل قبل البحث عن خانة. اليوم المغلق لا يعرض وقتاً. للخدمة مدة وسعر، ويعرض التقويم بدايات بخطوات 15 دقيقة. يحجز الفريق من التقويم. يمكن للعميل الحجز في الصفحة العامة حين تكون مفعّلة.",
      ),
      text(
        "Appointments are on the business plan, at $99 a month or $990 a year. CRM only, at $49 a month, keeps the pipeline and the client file and does not include the calendar. The appointment stores the service, the price, a payment status and a note, on top of the time. To change the time, open the booking, choose another open slot, and save.",
        "תורים נמצאים בחבילה העסקית, ב־99 דולר לחודש או 990 דולר לשנה. CRM בלבד, ב־49 דולר לחודש, שומר את הצינור ואת תיק הלקוח ולא כולל את היומן. התור שומר את השירות, את המחיר, סטטוס תשלום והערה, מעל השעה. כדי לשנות שעה פותחים את התור, בוחרים חלון פנוי אחר, ושומרים.",
        "Las citas están en el plan de negocio, a 99 dólares al mes o 990 al año. El CRM solo, a 49 dólares al mes, guarda el pipeline y el expediente y no incluye el calendario. Para cambiar la hora, abra la reserva, elija otro hueco libre y guarde.",
        "Os agendamentos ficam no plano de negócios, a US$ 99 por mês ou US$ 990 por ano. O CRM sozinho, a US$ 49 por mês, guarda o pipeline e o arquivo e não inclui a agenda. Para mudar o horário, abra a reserva, escolha outra janela livre e salve.",
        "المواعيد في الخطة التجارية، بـ 99 دولاراً في الشهر أو 990 في السنة. CRM وحده، بـ 49 دولاراً في الشهر، يحفظ المسار والملف ولا يشمل التقويم. لتغيير الوقت افتحوا الحجز، واختاروا خانة متاحة أخرى، واحفظوا.",
      ),
    ],
  });

  addSection("whatsapp-message-templates", {
    id: "send-rule",
    heading: text("When a customer actually receives the message", "מתי לקוח באמת מקבל את ההודעה", "Cuándo el cliente recibe de verdad el mensaje", "Quando o cliente realmente recebe a mensagem", "متى يتلقى العميل الرسالة فعلاً"),
    paragraphs: [
      text(
        "A message the business starts uses a template Meta has approved. Read the variables and the status first. A reply inside an open customer conversation follows WhatsApp's own window. Saving a draft in the inbox is not that delivery. The customer receives the template when the number is on the paid plan and Meta has approved the template.",
        "הודעה שהעסק מתחיל משתמשת בתבנית ש־Meta אישרה. קודם קוראים את המשתנים ואת הסטטוס. תשובה בתוך שיחה פתוחה של לקוח עוקבת אחרי חלון הוואטסאפ עצמו. שמירת טיוטה בתיבת הדואר אינה המסירה הזאת. הלקוח מקבל את התבנית כשהמספר במסלול בתשלום ו־Meta אישרה את התבנית.",
        "Un mensaje que el negocio inicia usa una plantilla que Meta ha aprobado. Lea primero las variables y el estado. Una respuesta dentro de una conversación abierta sigue la ventana del propio WhatsApp. Guardar un borrador en la bandeja no es esa entrega.",
        "Uma mensagem que o negócio inicia usa um modelo que a Meta aprovou. Leia primeiro as variáveis e o status. Uma resposta dentro de uma conversa aberta segue a janela do próprio WhatsApp. Salvar um rascunho na caixa não é essa entrega.",
        "الرسالة التي يبدأها النشاط تستخدم قالباً اعتمدته Meta. اقرأوا أولاً المتغيرات والحالة. الرد داخل محادثة مفتوحة يتبع نافذة واتساب نفسها. حفظ مسودة في الصندوق ليس هذا التسليم.",
      ),
    ],
    shots: [
      shot(
        "/demo-media/whatsapp/still-8.jpg",
        "The inbox can save a reply. A saved reply is not, by itself, a message the customer received.",
        "תיבת הדואר יכולה לשמור תשובה. תשובה שנשמרה אינה, כשלעצמה, הודעה שהלקוח קיבל.",
        "La bandeja puede guardar una respuesta. Una respuesta guardada no es, por sí sola, un mensaje que el cliente recibió.",
        "A caixa pode salvar uma resposta. Uma resposta salva não é, por si só, uma mensagem que o cliente recebeu.",
        "يمكن للصندوق حفظ رد. الرد المحفوظ ليس، بحد ذاته، رسالة تلقاها العميل.",
      ),
    ],
  });

  addSection("whatsapp-cloud-api-cost", {
    id: "decide",
    heading: text("Decide before you connect the number", "מחליטים לפני שמחברים את המספר", "Decida antes de conectar el número", "Decida antes de conectar o número", "قرّروا قبل ربط الرقم"),
    paragraphs: [
      text(
        "Buy the number when the team is ready to send an approved template, not when the first lead arrives. WhatsApp Business API is $29 a month per connected number. That subscription includes the connection, templates, and the dashboard. Meta messaging charges apply separately, based on usage and message category. Each additional number has its own subscription.",
        "קונים את המספר כשהצוות מוכן לשלוח תבנית מאושרת, לא כשהליד הראשון מגיע. WhatsApp Business API עולה 29 דולר לחודש לכל מספר מחובר. המנוי כולל את החיבור, את התבניות ואת לוח הבקרה. חיובי ההודעות של Meta מחושבים בנפרד, לפי השימוש וקטגוריית ההודעה. לכל מספר נוסף יש מנוי משלו.",
        "Compre el número cuando el equipo esté listo para enviar una plantilla aprobada, no cuando llegue el primer lead. Los 29 dólares cubren un número conectado: la conexión, la API y los webhooks, las plantillas, el panel y la documentación. No compran mensajes, y no incluyen el CRM ni el plan de negocio.",
        "Compre o número quando a equipe estiver pronta para enviar um modelo aprovado, não quando o primeiro lead chegar. Os US$ 29 cobrem um número conectado: a conexão, a API e os webhooks, os modelos, o painel e a documentação. Eles não compram mensagens, e não incluem o CRM nem o plano de negócios.",
        "اشتروا الرقم حين يكون الفريق جاهزاً لإرسال قالب معتمد، لا حين يصل أول عميل. يغطي مبلغ 29 دولاراً رقماً واحداً متصلاً: الربط والواجهة وwebhooks والقوالب ولوحة التحكم والوثائق. وهو لا يشتري رسائل، ولا يشمل CRM ولا الخطة التجارية.",
      ),
      text(
        "Meta's message fee depends on the country and the category. Meta's own documentation is the source for those rates. An automation can start a template only on the business plan, and only after the number and the approval already exist.",
        "חיוב ההודעה של Meta תלוי במדינה ובקטגוריה. התיעוד של Meta הוא המקור לתעריפים האלה. אוטומציה יכולה להתחיל תבנית רק בחבילה העסקית, ורק אחרי שהמספר והאישור כבר קיימים.",
        "La tarifa de mensaje de Meta depende del país y de la categoría. La documentación de Meta es la fuente de esas tarifas. Una automatización puede iniciar una plantilla solo en el plan de negocio, y solo después de que el número y la aprobación ya existan.",
        "A tarifa de mensagem da Meta depende do país e da categoria. A documentação da Meta é a fonte dessas tarifas. Uma automação pode iniciar um modelo só no plano de negócios, e só depois que o número e a aprovação já existirem.",
        "رسم رسالة Meta يعتمد على الدولة والفئة. وثائق Meta هي مصدر هذه الأسعار. يمكن للأتمتة أن تبدأ قالباً فقط في الخطة التجارية، وفقط بعد أن يوجد الرقم والاعتماد.",
      ),
    ],
  });

  addSection("crm-and-business-platform", {
    id: "pick",
    heading: text("Pick the plan from the work, not from the name", "בוחרים מסלול לפי העבודה, לא לפי השם", "Elija el plan por el trabajo, no por el nombre", "Escolha o plano pelo trabalho, não pelo nome", "اختاروا الخطة حسب العمل، لا حسب الاسم"),
    paragraphs: [
      text(
        "If the team needs the pipeline and the client file, CRM only at $49 a month is the product. The day someone needs a calendar, a collaboration, or an automation that creates a task, the business plan at $99 a month or $990 a year is the upgrade. It includes the CRM. It does not include a WhatsApp number.",
        "אם הצוות צריך את הצינור ואת תיק הלקוח, CRM בלבד ב־49 דולר לחודש הוא המוצר. ביום שבו מישהו צריך יומן, שיתוף, או אוטומציה שיוצרת משימה, החבילה העסקית ב־99 דולר לחודש או 990 דולר לשנה היא השדרוג. היא כוללת את ה־CRM. היא לא כוללת מספר וואטסאפ.",
        "Si el equipo necesita el pipeline y el expediente, el CRM solo a 49 dólares al mes es el producto. El día en que alguien necesita un calendario, una colaboración o una automatización que cree una tarea, el plan de negocio a 99 dólares al mes o 990 al año es la mejora. Incluye el CRM. No incluye un número de WhatsApp.",
        "Se a equipe precisa do pipeline e do arquivo do cliente, o CRM sozinho a US$ 49 por mês é o produto. No dia em que alguém precisa de uma agenda, de uma colaboração ou de uma automação que crie uma tarefa, o plano de negócios a US$ 99 por mês ou US$ 990 por ano é o upgrade. Ele inclui o CRM. Não inclui um número de WhatsApp.",
        "إذا احتاج الفريق إلى المسار وملف العميل، فـ CRM وحده بـ 49 دولاراً في الشهر هو المنتج. في اليوم الذي يحتاج فيه أحد إلى تقويم أو تعاون أو أتمتة تنشئ مهمة، فالخطة التجارية بـ 99 دولاراً في الشهر أو 990 في السنة هي الترقية. تشمل CRM. ولا تشمل رقم واتساب.",
      ),
    ],
    example: {
      title: text("A plumber, then a calendar", "אינסטלטור, ואז יומן", "Un fontanero, y luego un calendario", "Um encanador, e depois uma agenda", "سبّاك، ثم تقويم"),
      body: text(
        "Every call starts as a lead with a source and a task to call back. That fits the $49 plan. The day the same person needs a slot on a calendar, the business plan is the relevant upgrade, not a second CRM and not a WhatsApp number.",
        "כל שיחה מתחילה כליד עם מקור ומשימה להתקשר בחזרה. זה מתאים למסלול 49 הדולר. ביום שבו אותו אדם צריך חלון ביומן, החבילה העסקית היא השדרוג הרלוונטי, לא CRM שני ולא מספר וואטסאפ.",
        "Cada llamada empieza como un lead con origen y una tarea de devolver la llamada. Eso cabe en el plan de 49 dólares. El día en que esa persona necesita un hueco en el calendario, el plan de negocio es la mejora, no un segundo CRM.",
        "Cada ligação começa como um lead com origem e uma tarefa de retornar. Isso cabe no plano de US$ 49. No dia em que essa pessoa precisa de um horário na agenda, o plano de negócios é o upgrade, não um segundo CRM.",
        "كل مكالمة تبدأ كعميل بمصدر ومهمة للاتصال مرة أخرى. هذا يناسب خطة 49 دولاراً. في اليوم الذي يحتاج فيه الشخص نفسه إلى خانة في التقويم، الخطة التجارية هي الترقية، لا CRM ثانٍ.",
      ),
    },
  });

  addSection("from-ad-to-follow-up", {
    id: "order",
    heading: text("Keep the four steps in order", "שומרים על ארבעת הצעדים לפי הסדר", "Mantenga los cuatro pasos en orden", "Mantenha os quatro passos em ordem", "أبقوا الخطوات الأربع بالترتيب"),
    paragraphs: [
      text(
        "The lead arrives with a source: Meta Lead Ads, a Bizuply website form, or a Google Ads lead form. The first status is New. A person sets Contacted only after the contact, writes the note, and creates a task with a date. If that task should appear for every lead that reaches Contacted, publish the automation. That automation is the business plan, not the $49 plan.",
        "הליד מגיע עם מקור: לידים ממודעות Meta, טופס באתר ביזאפלי, או טופס לידים של Google Ads. הסטטוס הראשון הוא חדש. אדם קובע נוצר קשר רק אחרי הקשר, כותב את ההערה, ויוצר משימה עם תאריך. אם המשימה הזאת צריכה להופיע לכל ליד שמגיע ל־נוצר קשר, מפרסמים את האוטומציה. האוטומציה הזו היא החבילה העסקית, לא מסלול 49 הדולר.",
        "El lead llega con un origen: Lead Ads de Meta, un formulario del sitio de Bizuply o un formulario de Google Ads. El primer estado es Nuevo. Una persona pone Contactado solo después del contacto, escribe la nota y crea una tarea con fecha. Si esa tarea debe aparecer para cada lead que llega a Contactado, publique la automatización.",
        "O lead chega com uma origem: Lead Ads da Meta, um formulário do site da Bizuply ou um formulário do Google Ads. O primeiro status é Novo. Uma pessoa marca Contato feito só depois do contato, escreve a nota e cria uma tarefa com data. Se essa tarefa deve aparecer para cada lead que chega a Contato feito, publique a automação.",
        "يصل العميل بمصدر: إعلانات Meta، أو نموذج موقع Bizuply، أو نموذج Google Ads. الحالة الأولى جديد. يضع شخص تم التواصل فقط بعد التواصل، ويكتب الملاحظة، وينشئ مهمة بتاريخ. إذا كان يجب أن تظهر هذه المهمة لكل عميل يصل إلى تم التواصل، انشروا الأتمتة.",
      ),
      text(
        "WhatsApp stays optional. A call and a task work on the CRM plan. A template needs the separate $29 number and Meta's approval, and Meta bills the message. The agents page, if you use it, is a person.",
        "וואטסאפ נשאר אופציונלי. שיחה ומשימה עובדות במסלול ה־CRM. תבנית צריכה את המספר הנפרד ב־29 דולר ואת האישור של Meta, ו־Meta מחייבת את ההודעה. עמוד הסוכנים, אם משתמשים בו, הוא אדם.",
        "WhatsApp sigue siendo opcional. Una llamada y una tarea funcionan en el plan de CRM. Una plantilla necesita el número aparte de 29 dólares y la aprobación de Meta, y Meta cobra el mensaje. La página de agentes, si la usa, es una persona.",
        "O WhatsApp continua opcional. Uma ligação e uma tarefa funcionam no plano de CRM. Um modelo precisa do número separado de US$ 29 e da aprovação da Meta, e a Meta cobra a mensagem. A página de agentes, se você usar, é uma pessoa.",
        "يبقى واتساب اختيارياً. مكالمة ومهمة تعملان في خطة CRM. يحتاج القالب إلى الرقم المنفصل بـ 29 دولاراً واعتماد Meta، وتحصّل Meta الرسالة. صفحة الوكلاء، إن استُخدمت، شخص.",
      ),
    ],
  });

  patch("build-a-website-without-code", "headline-choice", (section) => {
    section.paragraphs = section.paragraphs.filter((paragraph) => !/399|expert build|בניית המומחה|construcción de experto|construção de especialista|بناء المختص/.test(paragraph));
  });
  patch("website-form-to-crm", "place", (section) => {
    section.paragraphs = section.paragraphs.map((paragraph) => paragraph
      .replace(/\s*The expert build can place the same kind of form:.*$/, "")
      .replace(/\s*בניית המומחה יכולה לשים טופס מאותו סוג:.*$/, "")
      .replace(/\s*La construcción de experto puede colocar el mismo tipo de formulario\.?.*$/, "")
      .replace(/\s*A construção de especialista pode colocar o mesmo tipo de formulário\.?.*$/, "")
      .replace(/\s*يمكن لبناء المختص وضع النوع نفسه من النموذج\.?.*$/, ""));
  });
  patch("website-form-to-crm", "after", (section) => {
    section.paragraphs = section.paragraphs.map((paragraph) => paragraph
      .replace(/\s*The \$399 expert build is the setup, not the subscription\./, "")
      .replace(/\s*בניית 399 הדולר היא ההקמה, לא המנוי\./, ""));
  });
  patch("website-form-to-crm", "lead", (section) => {
    section.paragraphs = section.paragraphs.map((paragraph) => paragraph
      .replace("A new lead, source Website, status New.", "A new lead. The Source column reads website, and the status is New.")
      .replace("ליד חדש, מקור אתר, סטטוס חדש.", "ליד חדש. עמודת המקור מציגה website, והסטטוס הוא New.")
      .replace("Un lead nuevo, origen Sitio, estado Nuevo.", "Un lead nuevo. La columna Source muestra website, y el estado es New.")
      .replace("Um lead novo, origem Site, status Novo.", "Um lead novo. A coluna Source mostra website, e o status é New.")
      .replace("عميل جديد، مصدر الموقع، حالة جديد.", "عميل جديد. يعرض عمود المصدر website، والحالة New."));
  });

  const serviceLabels = text(
    "If you would rather not edit the page yourself, the expert website service is separate.",
    "אם מעדיפים לא לערוך את העמוד בעצמכם, שירות בניית האתר נפרד.",
    "Si prefiere no editar la página, el servicio de sitio de experto es aparte.",
    "Se preferir não editar a página, o serviço de site de especialista fica à parte.",
    "إذا فضّلتم عدم تحرير الصفحة بأنفسكم، فخدمة بناء الموقع منفصلة.",
  );
  for (const locale of LOCALES) {
    articles["build-a-website-without-code"][locale].serviceLink = {
      href: "/services/website-build",
      label: serviceLabels[locale],
    };
  }

  patch("connect-a-meta-ad-account", "where", (section, locale) => {
    section.shots = [{
      src: "/demo-media/meta/connection.png",
      caption: text(
        "Meta Connection shows Connected, the ad account, and the Facebook page. This screen does not publish a campaign.",
        "מסך Meta Connection מציג Connected, את חשבון המודעות ואת דף הפייסבוק. המסך הזה לא מפרסם קמפיין.",
        "Meta Connection muestra Connected, la cuenta de anuncios y la página de Facebook. Esta pantalla no publica una campaña.",
        "Meta Connection mostra Connected, a conta de anúncios e a página do Facebook. Esta tela não publica uma campanha.",
        "تعرض Meta Connection الحالة Connected وحساب الإعلانات وصفحة فيسبوك. هذه الشاشة لا تنشر حملة.",
      )[locale],
    }];
  });
  patch("meta-lead-ads-to-crm", "permission", (section, locale) => {
    section.shots = [{
      src: "/demo-media/meta/lead-source.png",
      caption: text(
        "A lead from a Facebook lead form shows facebook_lead_ads in the Source column.",
        "ליד מטופס פייסבוק מציג facebook_lead_ads בעמודת המקור.",
        "Un lead de un formulario de Facebook muestra facebook_lead_ads en la columna Source.",
        "Um lead de um formulário do Facebook mostra facebook_lead_ads na coluna Source.",
        "يعرض عميل من نموذج فيسبوك القيمة facebook_lead_ads في عمود المصدر.",
      )[locale],
    }];
  });
  patch("website-form-to-crm", "place", (section, locale) => {
    section.shots = [{
      src: "/demo-media/forms/form.png",
      caption: text(
        "The form asks for a name, an email, and the request.",
        "הטופס מבקש שם, אימייל ואת הבקשה.",
        "El formulario del sitio de demostración pide un nombre, un correo y la petición.",
        "O formulário do site de demonstração pede um nome, um e-mail e o pedido.",
        "يطلب النموذج في موقع العرض اسماً وبريداً والطلب.",
      )[locale],
    }];
  });
  patch("website-form-to-crm", "lead", (section, locale) => {
    section.shots = [{
      src: "/demo-media/forms/lead.png",
      caption: text(
        "After the form was sent, Olivia Bennett appeared as a new lead. The source is website and the status is New.",
        "אחרי שליחת הטופס הופיעה Olivia Bennett כליד חדש. המקור הוא website והסטטוס הוא New.",
        "Después de enviar el formulario, Olivia Bennett apareció como un lead nuevo. Source es website y el estado es New.",
        "Depois do envio, Olivia Bennett apareceu como um lead novo. Source é website e o status é New.",
        "بعد إرسال النموذج ظهرت Olivia Bennett كعميل جديد. المصدر website والحالة New.",
      )[locale],
    }];
  });
}
