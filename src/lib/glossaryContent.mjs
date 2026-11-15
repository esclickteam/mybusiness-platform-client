/**
 * One glossary page. Close terms share an entry instead of a thin URL each.
 * Prices below are the published Bizuply prices, and only inside the example.
 */

const UPDATED = "2026-11-15";

function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function entry(id, term, definition, practice, example, links) {
  return { id, term, definition, practice, example, links };
}

const ENTRIES = [
  entry(
    "crm",
    row("CRM", "CRM", "CRM", "CRM", "CRM"),
    row(
      "A CRM is the system of record for people who might buy and people who already did. It keeps the source, the status, the conversation and the next step on one record, so the answer does not live in someone's memory.",
      "CRM הוא הרשומה של מי שעשוי לקנות ושל מי שכבר קנה. המקור, הסטטוס, השיחה והצעד הבא יושבים על רשומה אחת, כדי שהתשובה לא תישאר בזיכרון של מישהו.",
      "Un CRM es el registro de quien podría comprar y de quien ya compró. Guarda el origen, el estado, la conversación y el siguiente paso en un mismo registro.",
      "Um CRM é o registro de quem pode comprar e de quem já comprou. Guarda a origem, o status, a conversa e o próximo passo no mesmo registro.",
      "CRM هو سجل من قد يشتري ومن اشترى. يُحفظ المصدر والحالة والمحادثة والخطوة التالية في سجل واحد.",
    ),
    row(
      "Open the person before you open a chart. Read where they came from, set a status that matches what just happened, and write the next step with a date before you leave the record.",
      "פותחים את האדם לפני שפותחים תרשים. קוראים מאיפה הגיע, קובעים סטטוס שמתאים למה שקרה, וכותבים את הצעד הבא עם תאריך לפני שעוזבים את הרשומה.",
      "Abra a la persona antes que el gráfico. Lea de dónde llegó, ponga un estado que coincida con lo que acaba de pasar y escriba el siguiente paso con fecha.",
      "Abra a pessoa antes do gráfico. Leia de onde ela veio, defina um status que combine com o que acabou de acontecer e escreva o próximo passo com data.",
      "افتحوا الشخص قبل الرسم. اقرأوا المصدر، وضعوا حالة تطابق ما حدث، واكتبوا الخطوة التالية بتاريخ.",
    ),
    row(
      "A studio receives a form on Monday and a call on Thursday. Both belong on the same record if they are the same person. In Bizuply that record is a lead with one of six statuses, plus a client file. CRM only is $49 a month.",
      "סטודיו מקבל טופס ביום שני ושיחה ביום חמישי. שניהם שייכים לאותה רשומה אם זה אותו אדם. בביזאפלי זו רשומת ליד עם אחד משישה סטטוסים, ועוד תיק לקוח. CRM בלבד עולה 49 דולר לחודש.",
      "Un estudio recibe un formulario el lunes y una llamada el jueves. Los dos van al mismo registro si son la misma persona. En BizUply ese registro es un lead con uno de seis estados. El CRM solo cuesta 49 dólares al mes.",
      "Um estúdio recebe um formulário na segunda e uma ligação na quinta. Os dois ficam no mesmo registro se forem a mesma pessoa. Na BizUply esse registro é um lead com um de seis status. O CRM sozinho custa US$ 49 por mês.",
      "يستقبل استوديو نموذجاً يوم الاثنين ومكالمة يوم الخميس. كلاهما في السجل نفسه إذا كان الشخص نفسه. في BizUply السجل عميل محتمل بإحدى ست حالات. CRM وحده 49 دولاراً في الشهر.",
    ),
    [["/guides/what-is-a-crm", row("What is a CRM?", "מהו CRM?", "Qué es un CRM", "O que é um CRM", "ما هو CRM؟")], ["/crm", row("Bizuply CRM", "CRM של ביזאפלי", "CRM de Bizuply", "CRM da Bizuply", "CRM من Bizuply")]],
  ),
  entry(
    "lead",
    row("Lead and lead scoring", "ליד ודירוג לידים", "Lead y puntuación", "Lead e pontuação", "العميل المحتمل وتقييمه"),
    row(
      "A lead is a person or a company that has shown a specific interest and is not yet a customer. Lead scoring is a rule that ranks those people so the team calls the stronger interest first. A score is a sorting aid. It is not a promise that the person will buy.",
      "ליד הוא אדם או חברה שהביעו עניין מסוים ועדיין אינם לקוחות. דירוג לידים הוא כלל שממיין אותם, כדי שהצוות יתקשר קודם לעניין החזק יותר. הציון הוא כלי מיון. הוא לא הבטחה שהאדם יקנה.",
      "Un lead es una persona o empresa que mostró un interés concreto y todavía no es cliente. La puntuación ordena esos contactos para llamar primero al interés más claro. La nota ayuda a ordenar. No promete una compra.",
      "Um lead é uma pessoa ou empresa que mostrou um interesse específico e ainda não é cliente. A pontuação ordena esses contatos para ligar primeiro ao interesse mais claro. A nota ajuda a ordenar. Não promete uma compra.",
      "العميل المحتمل شخص أو شركة أظهرا اهتماماً محدداً ولم يصبحا زبوناً بعد. التقييم قاعدة ترتّب هؤلاء ليتصل الفريق بالاهتمام الأقوى أولاً. الدرجة أداة فرز وليست وعداً بالشراء.",
    ),
    row(
      "Keep the source on the lead. Use a small set of statuses the whole team means the same way. Add a score only when you can name the signals, such as a request for a price or a booked time. A score with no definition becomes decoration.",
      "שומרים את המקור על הליד. משתמשים במעט סטטוסים שכל הצוות מבין אותו דבר. מוסיפים ציון רק כשאפשר לנקוב בסימנים, למשל בקשת מחיר או זמן שנקבע. ציון בלי הגדרה הופך לקישוט.",
      "Guarde el origen en el lead. Use pocos estados que todo el equipo entienda igual. Añada una nota solo cuando pueda nombrar las señales, como una petición de precio o una hora reservada.",
      "Guarde a origem no lead. Use poucos status que a equipe inteira entenda do mesmo jeito. Some uma nota só quando puder nomear os sinais, como um pedido de preço ou um horário marcado.",
      "احفظوا المصدر على العميل المحتمل. استخدموا حالات قليلة يفهمها الفريق بالطريقة نفسها. أضيفوا درجة فقط حين تستطيعون تسمية الإشارات، مثل طلب سعر أو موعد محجوز.",
    ),
    row(
      "Two people fill the same form. One asks for a price this week. The other only downloaded a checklist. The first is the call to make today. In Bizuply the statuses are New, Contacted, Interested, Converted, Lost and Old lead. The product does not publish an automatic score.",
      "שני אנשים ממלאים אותו טופס. אחד מבקש מחיר השבוע. השני רק הוריד רשימת בדיקה. הראשון הוא השיחה של היום. בביזאפלי הסטטוסים הם חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן. המוצר לא מפרסם ציון אוטומטי.",
      "Dos personas rellenan el mismo formulario. Una pide un precio esta semana. La otra solo descargó una lista. La primera es la llamada de hoy. En BizUply los estados son Nuevo, Contactado, Interesado, Convertido, Perdido y Lead antiguo. El producto no publica una puntuación automática.",
      "Duas pessoas preenchem o mesmo formulário. Uma pede um preço nesta semana. A outra só baixou uma lista. A primeira é a ligação de hoje. Na BizUply os status são Novo, Contato feito, Interessado, Convertido, Perdido e Lead antigo. O produto não publica uma pontuação automática.",
      "شخصان يملآن النموذج نفسه. أحدهما يطلب سعراً هذا الأسبوع. والآخر نزّل قائمة فقط. الأول هو اتصال اليوم. في BizUply الحالات هي جديد، وتم التواصل، ومهتم، وتم التحويل، وضائع، وعميل قديم. المنتج لا ينشر درجة تلقائية.",
    ),
    [["/guides/follow-up-on-leads", row("Follow up on a new lead", "מעקב על ליד חדש", "Seguimiento de un lead", "Acompanhar um lead", "متابعة عميل محتمل")]],
  ),
  entry(
    "sales-pipeline",
    row("Sales pipeline", "משפך מכירות", "Embudo de ventas", "Funil de vendas", "مسار المبيعات"),
    row(
      "A sales pipeline is the set of stages a deal moves through, from the first inquiry to a won or lost decision. Each stage should mean one observable event, not a feeling. A pipeline shows how many deals sit in each stage and where they stall.",
      "משפך מכירות הוא סדרת השלבים שעסקה עוברת, מהפנייה הראשונה ועד החלטה של זכייה או הפסד. באנגלית קוראים לזה pipeline. כל שלב צריך לתאר אירוע שאפשר לראות, לא תחושה. המשפך מראה כמה עסקאות יושבות בכל שלב ואיפה הן נתקעות.",
      "Un embudo de ventas es el conjunto de etapas que recorre un trato, desde la primera consulta hasta una decisión ganada o perdida. En inglés se llama pipeline. Cada etapa debe ser un hecho observable, no una sensación.",
      "Um funil de vendas é o conjunto de etapas de um negócio, da primeira consulta até uma decisão ganha ou perdida. Em inglês, chama-se pipeline. Cada etapa deve ser um fato observável, não uma sensação.",
      "مسار المبيعات هو مراحل الصفقة، من أول استفسار حتى قرار الربح أو الخسارة. كل مرحلة يجب أن تصف حدثاً يمكن رؤيته، لا شعوراً.",
    ),
    row(
      "Name the stages in the words the team already uses. Count how many deals entered and how many moved forward. If a stage has no exit rule, split it or remove it.",
      "קוראים לשלבים במילים שהצוות כבר משתמש בהן. סופרים כמה עסקאות נכנסו וכמה התקדמו. אם לשלב אין כלל יציאה, מפצלים אותו או מוחקים אותו.",
      "Nombre las etapas con las palabras que el equipo ya usa. Cuente cuántos tratos entraron y cuántos avanzaron. Si una etapa no tiene regla de salida, divídala o quítela.",
      "Dê nomes às etapas com as palavras que a equipe já usa. Conte quantos negócios entraram e quantos avançaram. Se uma etapa não tem regra de saída, divida-a ou retire-a.",
      "سمّوا المراحل بالكلمات التي يستخدمها الفريق. عدّوا كم صفقة دخلت وكم تقدمت. إذا لم تكن للمرحلة قاعدة خروج، قسّموها أو احذفوها.",
    ),
    row(
      "A consultant might use New, Conversation booked, Proposal sent, Won and Lost. \"Thinking about it\" is not a stage, because nobody can tell when it ends.",
      "יועץ יכול להשתמש בחדש, שיחה נקבעה, הצעה נשלחה, נסגר ואבוד. \"חושב על זה\" אינו שלב, כי אי אפשר לדעת מתי הוא נגמר.",
      "Un consultor puede usar Nuevo, Conversación reservada, Propuesta enviada, Ganado y Perdido. \"Lo está pensando\" no es una etapa, porque nadie sabe cuándo termina.",
      "Um consultor pode usar Novo, Conversa marcada, Proposta enviada, Ganho e Perdido. \"Está pensando\" não é uma etapa, porque ninguém sabe quando termina.",
      "يمكن لمستشار أن يستخدم جديد، ومحادثة محجوزة، وعرض مُرسل، وربح، وخسارة. «يفكر في الأمر» ليست مرحلة، لأن لا أحد يعرف متى تنتهي.",
    ),
    [["/compare/crm-or-spreadsheet", row("CRM or a spreadsheet", "CRM או גיליון", "CRM o una hoja", "CRM ou uma planilha", "CRM أو جدول")]],
  ),
  entry(
    "customer-journey",
    row("Customer journey", "מסע לקוח", "Recorrido del cliente", "Jornada do cliente", "رحلة العميل"),
    row(
      "The customer journey is the whole path a person takes, from the first time they notice the business to the work after they buy. The pipeline is only the sales part of that path. A journey includes the ad, the page, the message, the appointment and the invoice.",
      "מסע הלקוח הוא כל הדרך שאדם עובר, מהפעם הראשונה ששם לב לעסק ועד העבודה שאחרי הקנייה. המשפך הוא רק חלק המכירה בדרך הזו. המסע כולל את המודעה, העמוד, ההודעה, התור והחשבונית.",
      "El recorrido es todo el camino de una persona, desde que nota el negocio hasta el trabajo después de comprar. El embudo es solo la parte de venta. El recorrido incluye el anuncio, la página, el mensaje, la cita y la factura.",
      "A jornada é o caminho inteiro de uma pessoa, de quando nota o negócio até o trabalho depois da compra. O funil é só a parte da venda. A jornada inclui o anúncio, a página, a mensagem, o horário e a fatura.",
      "رحلة العميل هي الطريق كاملاً، من أول ملاحظة للنشاط حتى العمل بعد الشراء. المسار هو جزء البيع فقط. الرحلة تشمل الإعلان والصفحة والرسالة والموعد والفاتورة.",
    ),
    row(
      "Write the path as the customer would tell it, in order. Mark the handoff where a person or a system has to do something. That handoff is where inquiries usually disappear.",
      "כותבים את הדרך כפי שהלקוח היה מספר אותה, לפי הסדר. מסמנים את נקודת המסירה שבה אדם או מערכת צריכים לעשות משהו. שם בדרך כלל נעלמות פניות.",
      "Escriba el camino como lo contaría el cliente, en orden. Marque el punto en el que una persona o un sistema tiene que actuar. Ahí suelen desaparecer las consultas.",
      "Escreva o caminho como o cliente contaria, em ordem. Marque o ponto em que uma pessoa ou um sistema precisa agir. É aí que as consultas costumam sumir.",
      "اكتبوا الطريق كما يرويه العميل، بالترتيب. علّموا نقطة التسليم التي يجب أن يتصرف فيها شخص أو نظام. هناك تختفي الاستفسارات عادة.",
    ),
    row(
      "Someone sees an ad, opens a page, sends a WhatsApp and books a time. Four teams can each believe they own that person. One record is what keeps the journey in one place.",
      "מישהו רואה מודעה, פותח עמוד, שולח וואטסאפ וקובע זמן. ארבעה צוותים יכולים לחשוב שכל אחד מהם הבעלים של האדם הזה. רשומה אחת היא מה שמחזיק את המסע במקום אחד.",
      "Alguien ve un anuncio, abre una página, envía un WhatsApp y reserva una hora. Cuatro equipos pueden creer que esa persona es suya. Un registro mantiene el recorrido en un solo lugar.",
      "Alguém vê um anúncio, abre uma página, envia um WhatsApp e marca um horário. Quatro equipes podem achar que essa pessoa é delas. Um registro mantém a jornada num só lugar.",
      "يرى شخص إعلاناً، ويفتح صفحة، ويرسل واتساب، ويحجز وقتاً. أربعة فرق قد تظن أن هذا الشخص لها. سجل واحد يُبقي الرحلة في مكان واحد.",
    ),
    [["/guides/from-ad-to-follow-up", row("From the ad to the next task", "מהמודעה אל המשימה הבאה", "Del anuncio a la siguiente tarea", "Do anúncio à próxima tarefa", "من الإعلان إلى المهمة التالية")]],
  ),
  entry(
    "conversion-rate",
    row("Conversion rate", "שיעור המרה", "Tasa de conversión", "Taxa de conversão", "معدل التحويل"),
    row(
      "A conversion rate is the share of people who completed a defined action, out of the people who had the chance. Conversions divided by opportunities, then multiplied by 100. The number is meaningless until you name both the action and the group.",
      "שיעור המרה הוא החלק של האנשים שהשלימו פעולה מוגדרת, מתוך מי שהייתה לו הזדמנות. מחלקים המרות בהזדמנויות ומכפילים ב־100. המספר חסר משמעות עד שמגדירים גם את הפעולה וגם את הקבוצה.",
      "La tasa de conversión es la parte de personas que completaron una acción definida, entre quienes tuvieron la oportunidad. Conversiones divididas por oportunidades, por 100. El número no dice nada hasta que nombre la acción y el grupo.",
      "A taxa de conversão é a parte das pessoas que concluíram uma ação definida, entre quem teve a chance. Conversões divididas por oportunidades, vezes 100. O número não diz nada até você nomear a ação e o grupo.",
      "معدل التحويل هو حصة من أكملوا فعلاً محدداً، من بين من سنحت لهم الفرصة. التحويلات مقسومة على الفرص ثم مضروبة في 100. الرقم بلا معنى حتى تسمّوا الفعل والمجموعة.",
    ),
    row(
      "Pick one rate at a time: visits to inquiries, inquiries to conversations, or conversations to customers. Do not average them into a single vanity number. Use the calculator on the templates page for the arithmetic.",
      "בוחרים שיעור אחד בכל פעם: ביקורים לפניות, פניות לשיחות, או שיחות ללקוחות. לא ממצעים אותם למספר אחד לקישוט. את החשבון עצמו עושים במחשבון שבדף התבניות.",
      "Elija una tasa cada vez: visitas a consultas, consultas a conversaciones o conversaciones a clientes. No las promedie en un número de adorno. La cuenta está en la calculadora de la página de plantillas.",
      "Escolha uma taxa de cada vez: visitas a pedidos, pedidos a conversas ou conversas a clientes. Não faça média delas num número de enfeite. A conta está na calculadora da página de modelos.",
      "اختاروا معدلاً واحداً في كل مرة: زيارات إلى استفسارات، أو استفسارات إلى محادثات، أو محادثات إلى زبائن. لا تحسبوا متوسطها في رقم للعرض. الحساب في حاسبة صفحة القوالب.",
    ),
    row(
      "A page had 200 visits and 10 people asked for a price. The visit-to-inquiry rate is 5 percent. That does not say how many of the 10 became customers.",
      "לעמוד היו 200 ביקורים ו־10 אנשים ביקשו מחיר. שיעור הביקור לפנייה הוא 5 אחוז. זה לא אומר כמה מתוך העשרה הפכו ללקוחות.",
      "Una página tuvo 200 visitas y 10 personas pidieron un precio. La tasa de visita a consulta es 5 por ciento. Eso no dice cuántas de las 10 se hicieron clientes.",
      "Uma página teve 200 visitas e 10 pessoas pediram um preço. A taxa de visita para pedido é 5 por cento. Isso não diz quantas das 10 viraram clientes.",
      "كان للصفحة 200 زيارة و10 أشخاص طلبوا سعراً. معدل الزيارة إلى الاستفسار 5 بالمئة. هذا لا يقول كم من العشرة صاروا زبائن.",
    ),
    [["/templates", row("Conversion calculator", "מחשבון המרה", "Calculadora de conversión", "Calculadora de conversão", "حاسبة التحويل")]],
  ),
  entry(
    "api-webhook",
    row("API and webhook", "API ו־webhook", "API y webhook", "API e webhook", "API وويب هوك"),
    row(
      "An API is a way for one system to ask another system to do something, or to fetch a record, over a defined request. A webhook is the reverse direction: the other system calls your address when an event happens, so you do not have to keep asking.",
      "API הוא אופן שבו מערכת אחת מבקשת ממערכת אחרת לעשות משהו, או לשלוף רשומה, דרך בקשה מוגדרת. Webhook הוא הכיוון ההפוך: המערכת האחרת קוראת לכתובת שלכם כשקורה אירוע, כדי שלא תצטרכו לשאול כל הזמן.",
      "Una API es la forma en que un sistema pide a otro que haga algo, o que traiga un registro, con una solicitud definida. Un webhook es la dirección inversa: el otro sistema llama a su dirección cuando ocurre un evento.",
      "Uma API é o modo como um sistema pede a outro que faça algo, ou busque um registro, com um pedido definido. Um webhook é o sentido inverso: o outro sistema chama o seu endereço quando um evento acontece.",
      "API طريقة يطلب بها نظام من نظام آخر أن يفعل شيئاً، أو يجلب سجلاً، بطلب محدد. الويب هوك هو الاتجاه المعاكس: النظام الآخر يتصل بعنوانكم حين يقع حدث.",
    ),
    row(
      "Use an API when your system starts the action, such as sending an approved WhatsApp template. Use a webhook when the event starts elsewhere, such as a new lead arriving. Check the signature on a webhook before you trust the body.",
      "משתמשים ב־API כשהמערכת שלכם מתחילה את הפעולה, למשל שליחת תבנית וואטסאפ מאושרת. משתמשים ב־webhook כשהאירוע מתחיל במקום אחר, למשל ליד חדש שמגיע. בודקים את החתימה על webhook לפני שסומכים על התוכן.",
      "Use una API cuando su sistema inicia la acción, como enviar una plantilla de WhatsApp aprobada. Use un webhook cuando el evento empieza en otro lugar, como un lead nuevo. Compruebe la firma antes de fiarse del contenido.",
      "Use uma API quando o seu sistema inicia a ação, como enviar um modelo de WhatsApp aprovado. Use um webhook quando o evento começa em outro lugar, como um lead novo. Confira a assinatura antes de confiar no conteúdo.",
      "استخدموا API حين يبدأ نظامكم الفعل، مثل إرسال قالب واتساب معتمد. استخدموا ويب هوك حين يبدأ الحدث في مكان آخر، مثل عميل محتمل جديد. تحققوا من التوقيع قبل الوثوق بالمحتوى.",
    ),
    row(
      "A new Meta lead can arrive by webhook and land as a CRM record. Later, the CRM can call the WhatsApp API to send a template Meta has already approved. Those are two different calls.",
      "ליד חדש מ־Meta יכול להגיע ב־webhook ולהיכנס כרשומת CRM. אחר כך ה־CRM יכול לקרוא ל־API של וואטסאפ כדי לשלוח תבנית ש־Meta כבר אישרה. אלה שתי קריאות שונות.",
      "Un lead nuevo de Meta puede llegar por webhook y quedar como registro del CRM. Después el CRM puede llamar a la API de WhatsApp para enviar una plantilla que Meta ya aprobó. Son dos llamadas distintas.",
      "Um lead novo da Meta pode chegar por webhook e virar um registro do CRM. Depois o CRM pode chamar a API do WhatsApp para enviar um modelo que a Meta já aprovou. São duas chamadas diferentes.",
      "قد يصل عميل محتمل جديد من Meta عبر ويب هوك ويصبح سجل CRM. لاحقاً يمكن لـ CRM أن يستدعي API واتساب ليرسل قالباً وافقت عليه Meta. هاتان دعوتان مختلفتان.",
    ),
    [["/guides/whatsapp-message-templates", row("WhatsApp templates", "תבניות WhatsApp", "Plantillas de WhatsApp", "Modelos de WhatsApp", "قوالب واتساب")], ["/whatsapp-api", row("WhatsApp API product", "מוצר WhatsApp API", "Producto WhatsApp API", "Produto WhatsApp API", "منتج WhatsApp API")]],
  ),
  entry(
    "automation",
    row("Automation", "אוטומציה", "Automatización", "Automação", "أتمتة"),
    row(
      "A business automation is a rule that runs when something happens. A trigger, such as a new lead, can create a task, a reminder or another record. It does not decide for you. It does the repeatable step you already defined.",
      "אוטומציה עסקית היא כלל שרץ כשמשהו קורה. טריגר, למשל ליד חדש, יכול ליצור משימה, תזכורת או רשומה אחרת. היא לא מחליטה במקומכם. היא עושה את הצעד החוזר שכבר הגדרתם.",
      "Una automatización es una regla que se ejecuta cuando pasa algo. Un disparador, como un lead nuevo, puede crear una tarea, un recordatorio u otro registro. No decide por usted. Hace el paso repetible que ya definió.",
      "Uma automação é uma regra que roda quando algo acontece. Um gatilho, como um lead novo, pode criar uma tarefa, um lembrete ou outro registro. Ela não decide por você. Faz o passo repetível que você já definiu.",
      "الأتمتة قاعدة تعمل حين يحدث شيء. محفّز، مثل عميل محتمل جديد، يمكنه إنشاء مهمة أو تذكير أو سجل آخر. هي لا تقرر عنكم. تنفّذ الخطوة المتكررة التي حددتموها.",
    ),
    row(
      "Write the trigger, the condition and the action in one sentence before you build it. If you cannot say what should happen every time, it is not ready to automate.",
      "כותבים את הטריגר, התנאי והפעולה במשפט אחד לפני שבונים. אם אי אפשר לומר מה צריך לקרות בכל פעם, זה עדיין לא מוכן לאוטומציה.",
      "Escriba el disparador, la condición y la acción en una frase antes de construirla. Si no puede decir qué debe pasar cada vez, todavía no está lista.",
      "Escreva o gatilho, a condição e a ação numa frase antes de construir. Se você não consegue dizer o que deve acontecer toda vez, ainda não está pronta.",
      "اكتبوا المحفّز والشرط والفعل في جملة واحدة قبل البناء. إذا لم تستطيعوا قول ما يجب أن يحدث في كل مرة، فهي ليست جاهزة.",
    ),
    row(
      "Every new lead should get a task due tomorrow morning. That is an automation. Deciding the price for a custom job is not. In Bizuply, automations are part of the business plan at $99 a month or $990 a year.",
      "כל ליד חדש צריך לקבל משימה למחר בבוקר. זו אוטומציה. החלטה על מחיר לעבודה מותאמת אינה אוטומציה. בביזאפלי האוטומציות הן חלק מהחבילה העסקית ב־99 דולר לחודש או 990 לשנה.",
      "Cada lead nuevo debe recibir una tarea para mañana por la mañana. Eso es una automatización. Decidir el precio de un trabajo a medida no lo es. En BizUply las automatizaciones forman parte del plan de negocio a 99 dólares al mes o 990 al año.",
      "Todo lead novo deve receber uma tarefa para amanhã de manhã. Isso é uma automação. Decidir o preço de um trabalho sob medida não é. Na BizUply as automações fazem parte do plano de negócios a US$ 99 por mês ou US$ 990 por ano.",
      "كل عميل محتمل جديد يجب أن يحصل على مهمة لصباح الغد. هذه أتمتة. تحديد سعر عمل مخصص ليس كذلك. في BizUply الأتمتة جزء من الخطة التجارية بـ 99 دولاراً في الشهر أو 990 في السنة.",
    ),
    [["/guides/business-automation", row("What is a business automation?", "מהי אוטומציה עסקית?", "Qué es una automatización", "O que é uma automação", "ما هي الأتمتة؟")], ["/automations", row("Automations product", "מוצר האוטומציות", "Producto de automatizaciones", "Produto de automações", "منتج الأتمتة")]],
  ),
  entry(
    "whatsapp-template",
    row("WhatsApp template", "תבנית WhatsApp", "Plantilla de WhatsApp", "Modelo de WhatsApp", "قالب واتساب"),
    row(
      "A WhatsApp template is a message format that Meta reviews before a business can use it to start a conversation, or to write outside the open customer-service window. The template has a category, such as marketing, utility or authentication. Meta can reject it.",
      "תבנית WhatsApp היא מבנה הודעה ש־Meta בודקת לפני שעסק יכול להשתמש בה כדי לפתוח שיחה, או כדי לכתוב מחוץ לחלון שירות הלקוחות הפתוח. לתבנית יש קטגוריה, למשל שיווק, תפעול או אימות. Meta יכולה לדחות אותה.",
      "Una plantilla de WhatsApp es un formato que Meta revisa antes de que un negocio pueda usarlo para iniciar una conversación, o para escribir fuera de la ventana de atención abierta. Tiene una categoría, como marketing, utilidad o autenticación. Meta puede rechazarla.",
      "Um modelo de WhatsApp é um formato que a Meta revisa antes de a empresa usá-lo para iniciar uma conversa, ou para escrever fora da janela de atendimento aberta. Tem uma categoria, como marketing, utilidade ou autenticação. A Meta pode recusá-lo.",
      "قالب واتساب صيغة تراجعها Meta قبل أن يستخدمها النشاط لبدء محادثة، أو للكتابة خارج نافذة خدمة العملاء المفتوحة. للقالب فئة، مثل تسويق أو خدمة أو توثيق. يمكن لـ Meta رفضه.",
    ),
    row(
      "Write the message the way you would actually send it. Name the variables, such as the person's name or the appointment time. Submit it in Meta and wait for the decision. Do not assume a draft is approved.",
      "כותבים את ההודעה כפי שבאמת תישלח. נותנים שם למשתנים, למשל שם האדם או שעת התור. מגישים ל־Meta ומחכים להחלטה. לא מניחים שטיוטה מאושרת.",
      "Escriba el mensaje como realmente lo enviaría. Nombre las variables, como el nombre de la persona o la hora de la cita. Envíelo a Meta y espere la decisión. No suponga que un borrador está aprobado.",
      "Escreva a mensagem como você realmente a enviaria. Nomeie as variáveis, como o nome da pessoa ou o horário. Envie à Meta e espere a decisão. Não suponha que um rascunho está aprovado.",
      "اكتبوا الرسالة كما ستُرسل فعلاً. سمّوا المتغيرات، مثل اسم الشخص أو وقت الموعد. أرسلوها إلى Meta وانتظروا القرار. لا تفترضوا أن المسودة معتمدة.",
    ),
    row(
      "\"Your appointment on {{1}} is confirmed\" is a template. A free-text note typed inside an open 24-hour window is not. Meta's current categories and prices are on Meta's pricing page. Bizuply does not republish that rate card.",
      "\"התור שלך ב־{{1}} אושר\" היא תבנית. הערה חופשית שנכתבת בתוך חלון של 24 שעות אינה תבנית. הקטגוריות והמחירים העדכניים של Meta נמצאים בדף המחירים של Meta. ביזאפלי לא מפרסמת מחדש את המחירון הזה.",
      "\"Su cita del {{1}} está confirmada\" es una plantilla. Una nota libre dentro de la ventana de 24 horas no lo es. Las categorías y precios actuales de Meta están en la página de precios de Meta.",
      "\"O seu horário em {{1}} está confirmado\" é um modelo. Uma nota livre dentro da janela de 24 horas não é. As categorias e preços atuais da Meta estão na página de preços da Meta.",
      "«موعدك في {{1}} مؤكد» قالب. ملاحظة حرة داخل نافذة 24 ساعة ليست قالباً. فئات Meta وأسعارها الحالية في صفحة أسعار Meta.",
    ),
    [["/guides/whatsapp-message-templates", row("How templates work", "איך תבניות עובדות", "Cómo funcionan las plantillas", "Como os modelos funcionam", "كيف تعمل القوالب")], ["/compare/whatsapp-app-or-api", row("App or platform", "אפליקציה או פלטפורמה", "App o plataforma", "App ou plataforma", "التطبيق أو المنصة")]],
  ),
  entry(
    "saas",
    row("SaaS", "SaaS", "SaaS", "SaaS", "SaaS"),
    row(
      "SaaS means software you use through the internet and pay for as a subscription, instead of installing a program you own outright. The vendor runs the service. You get access for as long as the subscription is active.",
      "SaaS הוא תוכנה שמשתמשים בה דרך האינטרנט ומשלמים עליה כמנוי, במקום להתקין תוכנית שבבעלותכם. הספק מפעיל את השירות. מקבלים גישה כל עוד המנוי פעיל.",
      "SaaS es software que se usa por internet y se paga como suscripción, en lugar de instalar un programa en propiedad. El proveedor opera el servicio. Usted tiene acceso mientras la suscripción está activa.",
      "SaaS é software que se usa pela internet e se paga como assinatura, em vez de instalar um programa que você possui. O fornecedor opera o serviço. Você tem acesso enquanto a assinatura está ativa.",
      "SaaS برنامج تستخدمونه عبر الإنترنت وتدفعون عنه اشتراكاً، بدلاً من تثبيت برنامج تملكونه. المزوّد يشغّل الخدمة. تحصلون على الوصول ما دام الاشتراك سارياً.",
    ),
    row(
      "Read what the subscription includes and what is billed by someone else. A platform fee, a message fee and an ad budget are often three different bills.",
      "קוראים מה המנוי כולל ומה מחויב על ידי מישהו אחר. דמי פלטפורמה, דמי הודעות ותקציב מודעות הם לעתים קרובות שלושה חשבונות שונים.",
      "Lea qué incluye la suscripción y qué cobra otra empresa. Una tarifa de plataforma, una tarifa de mensajes y un presupuesto de anuncios suelen ser tres facturas distintas.",
      "Leia o que a assinatura inclui e o que outra empresa cobra. Uma taxa de plataforma, uma taxa de mensagens e um orçamento de anúncios costumam ser três faturas diferentes.",
      "اقرأوا ما يشمله الاشتراك وما يفوتره طرف آخر. رسم المنصة ورسم الرسائل وميزانية الإعلان غالباً ثلاثة فواتير مختلفة.",
    ),
    row(
      "Bizuply CRM at $49 a month is a subscription. WhatsApp at $29 a month per connected number is another subscription. Meta bills delivered business messages separately. The ad budget, if you run ads, is a third bill from Meta.",
      "CRM של ביזאפלי ב־49 דולר לחודש הוא מנוי. וואטסאפ ב־29 דולר לחודש למספר מחובר הוא מנוי אחר. Meta מחייבת בנפרד על הודעות עסקיות שנמסרו. תקציב המודעות, אם מריצים מודעות, הוא חשבון שלישי מ־Meta.",
      "El CRM de Bizuply a 49 dólares al mes es una suscripción. WhatsApp a 29 dólares al mes por número conectado es otra. Meta factura aparte los mensajes de negocio entregados. El presupuesto de anuncios, si los hay, es una tercera factura de Meta.",
      "O CRM da Bizuply a US$ 49 por mês é uma assinatura. O WhatsApp a US$ 29 por mês por número conectado é outra. A Meta fatura à parte as mensagens comerciais entregues. O orçamento de anúncios, se houver, é uma terceira fatura da Meta.",
      "CRM من Bizuply بـ 49 دولاراً في الشهر اشتراك. واتساب بـ 29 دولاراً في الشهر لكل رقم متصل اشتراك آخر. تفوتر Meta رسائل النشاط المُسلَّمة بشكل منفصل. ميزانية الإعلان، إن وُجدت، فاتورة ثالثة من Meta.",
    ),
    [["/pricing", row("Published prices", "המחירים המפורסמים", "Precios publicados", "Preços publicados", "الأسعار المنشورة")]],
  ),
  entry(
    "landing-page",
    row("Landing page", "דף נחיתה", "Página de aterrizaje", "Página de destino", "صفحة هبوط"),
    row(
      "A landing page is a page built for one visit and one next step, usually from an ad or a message. A business site is the broader home of the company: several pages, the offer, proof and a way to look around. A landing page is not automatically better. It is narrower.",
      "דף נחיתה הוא עמוד שנבנה לביקור אחד ולצעד הבא אחד, בדרך כלל ממודעה או מהודעה. אתר עסקי הוא הבית הרחב יותר של החברה: כמה עמודים, ההצעה, הוכחה ודרך להסתכל. דף נחיתה אינו טוב יותר באופן אוטומטי. הוא צר יותר.",
      "Una página de aterrizaje está hecha para una visita y un siguiente paso, normalmente desde un anuncio o un mensaje. El sitio del negocio es la casa más amplia: varias páginas, la oferta, pruebas y una forma de mirar. La página de aterrizaje no es mejor por sí sola. Es más estrecha.",
      "Uma página de destino é feita para uma visita e um próximo passo, em geral a partir de um anúncio ou uma mensagem. O site do negócio é a casa mais ampla: várias páginas, a oferta, provas e um jeito de olhar. A página de destino não é melhor sozinha. É mais estreita.",
      "صفحة الهبوط مبنية لزيارة واحدة وخطوة تالية واحدة، غالباً من إعلان أو رسالة. موقع النشاط هو البيت الأوسع: صفحات عدة، والعرض، ودليل، وطريق للتجول. صفحة الهبوط ليست أفضل تلقائياً. هي أضيق.",
    ),
    row(
      "Match the headline to the promise that brought the person. Offer one action. Send that action into the same lead record as every other door.",
      "מתאימים את הכותרת להבטחה שהביאה את האדם. מציעים פעולה אחת. שולחים את הפעולה לאותה רשומת ליד כמו כל דלת אחרת.",
      "Haga coincidir el título con la promesa que trajo a la persona. Ofrezca una acción. Envíe esa acción al mismo registro de lead que las demás puertas.",
      "Faça o título combinar com a promessa que trouxe a pessoa. Ofereça uma ação. Envie essa ação para o mesmo registro de lead das outras portas.",
      "طابقوا العنوان مع الوعد الذي أحضر الشخص. اعرضوا فعلاً واحداً. أرسلوا هذا الفعل إلى سجل العميل المحتمل نفسه ككل باب آخر.",
    ),
    row(
      "An ad says \"book a 20-minute intro.\" The page repeats that sentence and has one form. The form creates a lead whose source is the website. The rest of the site can exist for people who were not sent by that ad.",
      "מודעה אומרת \"קובעים היכרות של 20 דקות\". העמוד חוזר על המשפט ויש בו טופס אחד. הטופס יוצר ליד שהמקור שלו הוא האתר. שאר האתר יכול להתקיים עבור אנשים שלא הגיעו מהמודעה הזו.",
      "Un anuncio dice \"reserve una introducción de 20 minutos\". La página repite esa frase y tiene un formulario. El formulario crea un lead cuyo origen es el sitio.",
      "Um anúncio diz \"marque uma introdução de 20 minutos\". A página repete essa frase e tem um formulário. O formulário cria um lead cuja origem é o site.",
      "يقول إعلان «احجزوا تعارفاً من 20 دقيقة». تكرر الصفحة الجملة وفيها نموذج واحد. ينشئ النموذج عميلاً محتملاً مصدره الموقع.",
    ),
    [["/guides/build-a-website-without-code", row("Build a business site", "בניית אתר לעסק", "Crear un sitio", "Criar um site", "بناء موقع")], ["/guides/website-form-to-crm", row("From a form to a lead", "מטופס לליד", "Del formulario al lead", "Do formulário ao lead", "من النموذج إلى العميل")]],
  ),
  entry(
    "cac-ltv",
    row("CAC and LTV", "CAC ו־LTV", "CAC y LTV", "CAC e LTV", "CAC وLTV"),
    row(
      "CAC, customer acquisition cost, is what you spent to gain one customer: the related ad cost, tools and labor, divided by the new customers from that effort. LTV, lifetime value, is the gross profit you expect from that customer over the relationship. Compare them only when both use the same kind of customer and a period you can defend.",
      "CAC, עלות רכישת לקוח, הוא מה שהוצאתם כדי להשיג לקוח אחד: עלות המודעות, הכלים והעבודה שקשורים למאמץ, חלקי הלקוחות החדשים מהמאמץ הזה. LTV, ערך לאורך החיים, הוא הרווח הגולמי שמצפים מהלקוח לאורך הקשר. משווים ביניהם רק כששניהם מתייחסים לאותו סוג לקוח ולתקופה שאפשר להגן עליה.",
      "El CAC, coste de adquisición, es lo que gastó para conseguir un cliente: anuncios, herramientas y trabajo relacionados, dividido por los clientes nuevos de ese esfuerzo. El LTV, valor de vida, es el beneficio bruto que espera de ese cliente durante la relación. Compárelos solo si hablan del mismo tipo de cliente y de un periodo que pueda defender.",
      "O CAC, custo de aquisição, é o que você gastou para conseguir um cliente: anúncios, ferramentas e trabalho relacionados, dividido pelos clientes novos desse esforço. O LTV, valor vitalício, é o lucro bruto que você espera desse cliente ao longo da relação. Compare os dois só quando usam o mesmo tipo de cliente e um período que você consegue defender.",
      "CAC، تكلفة اكتساب العميل، هو ما أُنفق لكسب عميل واحد: الإعلان والأدوات والعمل المرتبط، مقسوماً على العملاء الجدد من هذا الجهد. LTV، القيمة مدى الحياة، هو الربح الإجمالي المتوقع من ذلك العميل طوال العلاقة. قارنوهما فقط حين يتحدثان عن النوع نفسه من العملاء وعن فترة يمكن الدفاع عنها.",
    ),
    row(
      "Start with one channel and one month you have already closed. Include only costs that existed because of that effort. If you do not know gross profit, do not invent LTV from revenue alone.",
      "מתחילים בערוץ אחד וחודש אחד שכבר נסגר. כוללים רק עלויות שהיו בגלל המאמץ הזה. אם לא יודעים רווח גולמי, לא ממציאים LTV מהכנסה בלבד.",
      "Empiece por un canal y un mes ya cerrado. Incluya solo costes que existieron por ese esfuerzo. Si no conoce el beneficio bruto, no invente el LTV a partir de los ingresos solos.",
      "Comece por um canal e um mês já fechado. Inclua só custos que existiram por causa desse esforço. Se você não sabe o lucro bruto, não invente o LTV a partir da receita sozinha.",
      "ابدأوا بقناة واحدة وشهر أُغلق. أدخلوا فقط التكاليف التي وُجدت بسبب هذا الجهد. إذا لم تعرفوا الربح الإجمالي، لا تخترعوا LTV من الإيراد وحده.",
    ),
    row(
      "You spent $600 on ads and $0 of extra labor, and you gained 3 customers. CAC from ads is $200. If each customer brings $150 of gross profit and usually buys twice, a cautious LTV is $300, not a five-year guess.",
      "הוצאתם 600 דולר על מודעות ובלי עבודה נוספת, והשגתם 3 לקוחות. CAC מהמודעות הוא 200 דולר. אם כל לקוח מביא 150 דולר רווח גולמי ובדרך כלל קונה פעמיים, LTV זהיר הוא 300 דולר, לא ניחוש לחמש שנים.",
      "Gastó 600 dólares en anuncios y nada de trabajo extra, y consiguió 3 clientes. El CAC de anuncios es 200 dólares. Si cada cliente aporta 150 de beneficio bruto y suele comprar dos veces, un LTV prudente es 300, no una suposición a cinco años.",
      "Você gastou US$ 600 em anúncios e nada de trabalho extra, e ganhou 3 clientes. O CAC dos anúncios é US$ 200. Se cada cliente traz US$ 150 de lucro bruto e costuma comprar duas vezes, um LTV prudente é US$ 300, não um chute de cinco anos.",
      "أنفقتم 600 دولار على الإعلانات وبلا عمل إضافي، وكسبتم 3 عملاء. CAC من الإعلانات 200 دولار. إذا جلب كل عميل 150 دولاراً ربحاً إجمالياً واشترى عادة مرتين، فإن LTV حذراً هو 300، وليس تخميناً لخمس سنوات.",
    ),
    [["/templates", row("Lead-cost calculator", "מחשבון עלות ליד", "Calculadora de coste por lead", "Calculadora de custo por lead", "حاسبة تكلفة العميل المحتمل")]],
  ),
  entry(
    "marketing-attribution",
    row("Marketing attribution", "שיוך שיווקי", "Atribución de marketing", "Atribuição de marketing", "إسناد التسويق"),
    row(
      "Marketing attribution is the record of which touch you credit for a result. A common simple version gives the credit to the last door the person used, or to the first. No model is the truth. It is a choice you should be able to explain.",
      "שיוך שיווקי הוא הרישום של איזה מגע זוקפים לתוצאה. גרסה פשוטה נותנת את הקרדיט לדלת האחרונה שהאדם עבר בה, או לראשונה. אף מודל אינו האמת. זו בחירה שצריך להיות אפשר להסביר.",
      "La atribución es el registro de qué contacto acredita un resultado. Una versión simple da el crédito a la última puerta que la persona usó, o a la primera. Ningún modelo es la verdad. Es una elección que debe poder explicar.",
      "A atribuição é o registro de qual contato recebe o crédito por um resultado. Uma versão simples dá o crédito à última porta que a pessoa usou, ou à primeira. Nenhum modelo é a verdade. É uma escolha que você precisa conseguir explicar.",
      "إسناد التسويق هو تسجيل أي نقطة تماس تنسبون إليها النتيجة. نسخة بسيطة تعطي الفضل لآخر باب استخدمه الشخص، أو للأول. لا نموذج هو الحقيقة. هو اختيار يجب أن تستطيعوا شرحه.",
    ),
    row(
      "Save the source on the lead at the moment it is created. Do not rewrite it later to match the channel you prefer. If the person came from an ad and then sent a WhatsApp, keep both events and decide in advance which one gets the credit.",
      "שומרים את המקור על הליד ברגע שהוא נוצר. לא משכתבים אותו אחר כך כדי שיתאים לערוץ שמועדף עליכם. אם האדם הגיע ממודעה ואחר כך שלח וואטסאפ, שומרים את שני האירועים ומחליטים מראש מי מקבל את הקרדיט.",
      "Guarde el origen en el lead en el momento en que se crea. No lo reescriba después para que coincida con el canal que prefiere. Si la persona llegó de un anuncio y luego envió un WhatsApp, conserve los dos hechos y decida de antemano cuál recibe el crédito.",
      "Guarde a origem no lead no momento em que ele é criado. Não a reescreva depois para combinar com o canal que você prefere. Se a pessoa veio de um anúncio e depois enviou um WhatsApp, guarde os dois fatos e decida antes qual recebe o crédito.",
      "احفظوا المصدر على العميل المحتمل لحظة إنشائه. لا تعيدوا كتابته لاحقاً ليطابق القناة التي تفضلونها. إذا جاء الشخص من إعلان ثم أرسل واتساب، احتفظوا بالحدثين وقرروا مسبقاً أيهما يأخذ الفضل.",
    ),
    row(
      "A lead from a Meta form keeps the source Meta. A later WhatsApp does not erase that. Bizuply stores the source for Meta Lead Ads, Google Ads lead forms and forms on a site built in Bizuply. It does not claim a perfect multi-touch model.",
      "ליד מטופס של Meta שומר את המקור Meta. וואטסאפ מאוחר יותר לא מוחק את זה. ביזאפלי שומרת את המקור ללידים ממודעות Meta, לטפסי Google Ads ולטפסים באתר שנבנה בביזאפלי. היא לא טוענת למודל רב־מגעי מושלם.",
      "Un lead de un formulario de Meta conserva el origen Meta. Un WhatsApp posterior no lo borra. Bizuply guarda el origen de Lead Ads de Meta, formularios de Google Ads y formularios de un sitio hecho en Bizuply. No afirma un modelo multitáctil perfecto.",
      "Um lead de um formulário da Meta guarda a origem Meta. Um WhatsApp posterior não apaga isso. A Bizuply guarda a origem de Lead Ads da Meta, formulários do Google Ads e formulários de um site feito na Bizuply. Ela não afirma um modelo multitoque perfeito.",
      "عميل محتمل من نموذج Meta يحتفظ بمصدر Meta. واتساب لاحق لا يمحو ذلك. تحفظ Bizuply مصدر إعلانات العملاء في Meta ونماذج Google Ads ونماذج موقع بُني في Bizuply. لا تدّعي نموذجاً متعدد اللمس كاملاً.",
    ),
    [["/guides/meta-lead-ads-to-crm", row("Meta leads in the CRM", "לידים מ־Meta ב־CRM", "Leads de Meta en el CRM", "Leads da Meta no CRM", "عملاء Meta في CRM")]],
  ),
];

export function glossaryPage(locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  const pack = {
    en: {
      title: "Glossary of business terms | BizUply",
      description: "Plain definitions of CRM, leads, pipeline, conversion rate, WhatsApp templates, CAC, LTV and the other terms teams mix up.",
      crumb: "Glossary",
      h1: "A glossary for running the work",
      lede: "Short definitions you can use in a meeting. Each entry says what the word means, how to use it, and one business example. Close ideas share an entry.",
    },
    he: {
      title: "מילון מושגים לניהול עסק | ביזאפלי",
      description: "הגדרות ברורות ל־CRM, לידים, משפך מכירות, שיעור המרה, תבניות WhatsApp, CAC, LTV ומושגים שצוותים מערבבים.",
      crumb: "מילון",
      h1: "מילון לעבודה עצמה",
      lede: "הגדרות קצרות שאפשר להשתמש בהן בישיבה. בכל ערך: מה המילה אומרת, איך משתמשים בה, ודוגמה עסקית אחת. רעיונות קרובים חולקים ערך.",
    },
    es: {
      title: "Glosario de términos de negocio | BizUply",
      description: "Definiciones claras de CRM, leads, embudo de ventas, tasa de conversión, plantillas de WhatsApp, CAC, LTV y otros términos que los equipos confunden.",
      crumb: "Glosario",
      h1: "Un glosario para el trabajo",
      lede: "Definiciones cortas para una reunión. Cada entrada dice qué significa la palabra, cómo usarla y un ejemplo. Las ideas cercanas comparten entrada.",
    },
    "pt-BR": {
      title: "Glossário de termos de negócio | BizUply",
      description: "Definições claras de CRM, leads, funil de vendas, taxa de conversão, modelos de WhatsApp, CAC, LTV e outros termos que as equipes misturam.",
      crumb: "Glossário",
      h1: "Um glossário para o trabalho",
      lede: "Definições curtas para uma reunião. Cada verbete diz o que a palavra significa, como usá-la e um exemplo. Ideias próximas dividem o mesmo verbete.",
    },
    ar: {
      title: "معجم مصطلحات العمل | BizUply",
      description: "تعريفات واضحة لـ CRM والعملاء المحتملين ومسار المبيعات ومعدل التحويل وقوالب واتساب وCAC وLTV ومصطلحات تخلطها الفرق.",
      crumb: "المعجم",
      h1: "معجم للعمل نفسه",
      lede: "تعريفات قصيرة تصلح لاجتماع. كل مدخل يقول معنى الكلمة وكيف تُستخدم ومثالاً واحداً. الأفكار القريبة تشترك في مدخل.",
    },
  }[language] || null;
  if (!pack) return null;
  return {
    ...pack,
    updated: UPDATED,
    terms: ENTRIES.map((item) => ({
      id: item.id,
      term: item.term[language],
      definition: item.definition[language],
      practice: item.practice[language],
      example: item.example[language],
      links: item.links.map(([href, label]) => ({ href, label: label[language] })),
    })),
  };
}
