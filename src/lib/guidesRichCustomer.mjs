/** Customer-facing page guide. No crawl or optimization instructions. */

export function installCustomerGuide(add, t) {
  add("what-customers-should-see", {
    title: t(
      "What customers should see on your website | Bizuply",
      "מה הלקוחות צריכים לראות באתר שלכם | ביזאפלי",
      "Qué deben ver los clientes en su sitio | Bizuply",
      "O que os clientes devem ver no seu site | Bizuply",
      "ماذا يجب أن يرى العملاء في موقعكم | Bizuply",
    ),
    description: t(
      "A visitor should understand who you help, what you offer, and how to book or ask. You write that in the Bizuply editor.",
      "מבקר צריך להבין את מי אתם עוזרים, מה אתם מציעים, ואיך קובעים או שואלים. את זה כותבים בעורך של ביזאפלי.",
      "Un visitante debe entender a quién ayuda, qué ofrece y cómo reservar o preguntar. Eso se escribe en el editor de Bizuply.",
      "Um visitante precisa entender quem você atende, o que oferece e como agendar ou perguntar. Isso se escreve no editor da Bizuply.",
      "يجب أن يفهم الزائر من تساعدون، وماذا تقدمون، وكيف يحجز أو يسأل. تكتبون ذلك في محرر Bizuply.",
    ),
    h1: t(
      "What customers should see on your website",
      "מה הלקוחות צריכים לראות באתר שלכם",
      "Qué deben ver los clientes en su sitio",
      "O que os clientes devem ver no seu site",
      "ماذا يجب أن يرى العملاء في موقعكم",
    ),
    lede: t(
      "Someone arrives with a job to do: book a visit, ask about a service, or check whether you work with people like them. The page should answer that before it asks them to admire a slogan.",
      "מישהו מגיע עם עבודה: לקבוע ביקור, לשאול על שירות, או לבדוק אם אתם עובדים עם אנשים כמוהו. העמוד צריך לענות על זה לפני שהוא מבקש להתפעל מסיסמה.",
      "Alguien llega con un trabajo: reservar una visita, preguntar por un servicio o ver si trabaja con personas como ella. La página debe responder eso antes de pedir que admire un eslogan.",
      "Alguém chega com uma tarefa: marcar uma visita, perguntar sobre um serviço ou ver se você atende pessoas como ela. A página deve responder a isso antes de pedir admiração por um slogan.",
      "يصل شخص ومعه مهمة: حجز زيارة، أو السؤال عن خدمة، أو معرفة إن كنتم تخدمون أناساً مثله. يجب أن تجيب الصفحة عن ذلك قبل أن تطلب الإعجاب بشعار.",
    ),
    related: ["build-a-website-without-code", "website-form-to-crm", "appointments-for-a-service-business"],
    sections: [
      {
        id: "visitor",
        heading: t("Start from the visitor's question", "מתחילים מהשאלה של המבקר", "Empiece por la pregunta del visitante", "Comece pela pergunta do visitante", "ابدأوا من سؤال الزائر"),
        paragraphs: [
          t(
            "A clinic visitor wants the service, the hours, and a way to book. A studio visitor wants the treatment and a way to ask. Write those facts in the words your customers already use. A headline that could belong to any business does not help the person who opened this page.",
            "מבקר במרפאה רוצה את השירות, את השעות, ודרך לקבוע. מבקר בסטודיו רוצה את הטיפול ודרך לשאול. כותבים את העובדות האלה במילים שהלקוחות כבר משתמשים בהן. כותרת שיכולה להתאים לכל עסק לא עוזרת למי שפתח את העמוד הזה.",
            "Quien visita una clínica quiere el servicio, el horario y una forma de reservar. Quien visita un estudio quiere el tratamiento y una forma de preguntar. Escriba esos datos con las palabras que sus clientes ya usan.",
            "Quem visita uma clínica quer o serviço, o horário e um jeito de agendar. Quem visita um estúdio quer o tratamento e um jeito de perguntar. Escreva esses fatos com as palavras que seus clientes já usam.",
            "زائر العيادة يريد الخدمة والساعات وطريقة للحجز. زائر الاستوديو يريد العلاج وطريقة للسؤال. اكتبوا هذه الحقائق بالكلمات التي يستخدمها عملاؤكم أصلاً.",
          ),
        ],
        figure: "crawl",
      },
      {
        id: "edit",
        heading: t("Write it in the editor, then check the phone", "כותבים את זה בעורך, ואז בודקים בטלפון", "Escríbalo en el editor y luego revise el teléfono", "Escreva no editor e depois confira o telefone", "اكتبوه في المحرر، ثم تحققوا من الهاتف"),
        paragraphs: [
          t(
            "Open a template, replace the headline with the service, and save. Then look at the phone preview. If the sentence is cut off, shorten it. Most people will meet the page on a phone, and a headline they cannot read is a headline you do not have.",
            "פותחים תבנית, מחליפים את הכותרת בשירות, ושומרים. אחר כך מסתכלים על תצוגת הטלפון. אם המשפט נחתך, מקצרים אותו. רוב האנשים יפגשו את העמוד בטלפון, וכותרת שאי אפשר לקרוא היא כותרת שאין לכם.",
            "Abra una plantilla, sustituya el titular por el servicio y guarde. Luego mire la vista del teléfono. Si la frase se corta, acórtela. La mayoría verá la página en un teléfono.",
            "Abra um modelo, substitua o título pelo serviço e salve. Depois olhe a prévia do telefone. Se a frase for cortada, encurte-a. A maioria vai ver a página no telefone.",
            "افتحوا قالباً، واستبدلوا العنوان بالخدمة، واحفظوا. ثم انظروا إلى معاينة الهاتف. إذا قُصّت الجملة، قصّروها. معظم الناس سيقابلون الصفحة على الهاتف.",
          ),
        ],
        steps: [
          t("Name the people you help in the first screen.", "ציינו את האנשים שאתם עוזרים להם במסך הראשון.", "Nombre a las personas a las que ayuda en la primera pantalla.", "Nomeie as pessoas que você atende na primeira tela.", "سمّوا الأشخاص الذين تساعدونهم في الشاشة الأولى."),
          t("Name the service, not a slogan.", "ציינו את השירות, לא סיסמה.", "Nombre el servicio, no un eslogan.", "Nomeie o serviço, não um slogan.", "سمّوا الخدمة، لا الشعار."),
          t("Add a way to book or a short form.", "הוסיפו דרך לקבוע או טופס קצר.", "Añada una forma de reservar o un formulario breve.", "Adicione um jeito de agendar ou um formulário curto.", "أضيفوا طريقة للحجز أو نموذجاً قصيراً."),
          t("Save, then read the page on the phone preview.", "שמרו, ואז קראו את העמוד בתצוגת הטלפון.", "Guarde y luego lea la página en la vista del teléfono.", "Salve e depois leia a página na prévia do telefone.", "احفظوا، ثم اقرأوا الصفحة في معاينة الهاتف."),
          t("Publish when a stranger could take the next step.", "פרסמו כשאדם זר יכול לעשות את הצעד הבא.", "Publique cuando un desconocido pueda dar el siguiente paso.", "Publique quando um desconhecido conseguir dar o próximo passo.", "انشروا حين يستطيع غريب أن يتخذ الخطوة التالية."),
        ],
        video: "websites",
        videoNote: t(
          "Change the headline, save, and check the desktop and phone previews.",
          "משנים כותרת, שומרים, ובודקים את התצוגה במחשב ובטלפון.",
          "Cambie el titular, guarde y revise las vistas de escritorio y de teléfono.",
          "Mude o título, salve e confira as prévias de computador e de telefone.",
          "غيّروا العنوان، واحفظوا، وتحققوا من معاينتي الحاسوب والهاتف.",
        ),
      },
      {
        id: "example",
        heading: t("A clinic page that tells people what to do", "עמוד מרפאה שאומר לאנשים מה לעשות", "Una página de clínica que dice qué hacer", "Uma página de clínica que diz o que fazer", "صفحة عيادة تقول للناس ماذا يفعلون"),
        paragraphs: [
          t(
            "Hours are 09:00 to 13:00. A 30-minute visit can be booked in 15-minute steps. The page says that, names the service, and links to the booking page. If you also want the inquiry in the pipeline, the form creates a lead with the website as its source. Appointments themselves are on the business plan.",
            "השעות הן 09:00 עד 13:00. ביקור של 30 דקות אפשר לקבוע בקפיצות של 15 דקות. העמוד אומר את זה, מציין את השירות, ומקשר לעמוד הזימון. אם רוצים גם את הפנייה בצינור, הטופס יוצר ליד שהמקור שלו הוא האתר. התורים עצמם נמצאים בחבילה העסקית.",
            "El horario es de 09:00 a 13:00. Una visita de 30 minutos se reserva en pasos de 15 minutos. La página lo dice, nombra el servicio y enlaza a la reserva. Si también quiere la consulta en el pipeline, el formulario crea un lead con el sitio como origen.",
            "O horário é das 09:00 às 13:00. Uma visita de 30 minutos pode ser marcada em passos de 15 minutos. A página diz isso, nomeia o serviço e liga para a reserva. Se você também quer o contato no pipeline, o formulário cria um lead com o site como origem.",
            "الساعات من 09:00 إلى 13:00. يمكن حجز زيارة من 30 دقيقة بخطوات 15 دقيقة. تقول الصفحة ذلك، وتسمي الخدمة، وتربط بصفحة الحجز. إذا أردتم أيضاً أن يدخل الاستفسار إلى المسار، ينشئ النموذج عميلاً مصدره الموقع.",
          ),
        ],
        example: {
          title: t("What the first screen can say", "מה המסך הראשון יכול לומר", "Qué puede decir la primera pantalla", "O que a primeira tela pode dizer", "ماذا يمكن أن تقول الشاشة الأولى"),
          body: t(
            "“Book a 30-minute consultation. Weekday mornings, in 15-minute steps.” A person knows the offer and the next click. “Welcome to our journey” does not.",
            "״קביעת ייעוץ של 30 דקות. בבקרים של ימי חול, בקפיצות של 15 דקות.״ אדם יודע את ההצעה ואת הלחיצה הבאה. ״ברוכים הבאים למסע שלנו״ לא.",
            "“Reserve una consulta de 30 minutos. Mañanas entre semana, en pasos de 15 minutos.” La persona conoce la oferta y el siguiente clic. “Bienvenido a nuestro viaje” no.",
            "“Agende uma consulta de 30 minutos. Manhãs de dia útil, em passos de 15 minutos.” A pessoa conhece a oferta e o próximo clique. “Bem-vindo à nossa jornada” não.",
            "«احجزوا استشارة من 30 دقيقة. صباح أيام الأسبوع، بخطوات 15 دقيقة.» يعرف الشخص العرض والنقرة التالية. «أهلاً بكم في رحلتنا» لا.",
          ),
        },
        mistakes: [
          {
            problem: t("The page is a slogan and a photo.", "העמוד הוא סיסמה ותמונה.", "La página es un eslogan y una foto.", "A página é um slogan e uma foto.", "الصفحة شعار وصورة."),
            fix: t("Add the service and one next step: book, call, or a short form.", "הוסיפו את השירות וצעד הבא אחד: קביעה, שיחה, או טופס קצר.", "Añada el servicio y un siguiente paso: reservar, llamar o un formulario breve.", "Adicione o serviço e um próximo passo: agendar, ligar ou um formulário curto.", "أضيفوا الخدمة وخطوة تالية واحدة: حجز أو اتصال أو نموذج قصير."),
          },
          {
            problem: t("The price exists only inside a picture.", "המחיר קיים רק בתוך תמונה.", "El precio existe solo dentro de una imagen.", "O preço existe só dentro de uma imagem.", "السعر موجود فقط داخل صورة."),
            fix: t("If you publish a price, write it as text next to the service.", "אם מפרסמים מחיר, כותבים אותו כטקסט ליד השירות.", "Si publica un precio, escríbalo como texto junto al servicio.", "Se você publica um preço, escreva-o como texto ao lado do serviço.", "إذا نشرتم سعراً، اكتبوه نصاً بجانب الخدمة."),
          },
          {
            problem: t("The form asks for everything.", "הטופס מבקש הכול.", "El formulario pide todo.", "O formulário pede tudo.", "النموذج يطلب كل شيء."),
            fix: t("Ask for a name, a way to reply, and the request. The rest can wait for the conversation.", "בקשו שם, דרך להשיב, ואת הבקשה. השאר יכול לחכות לשיחה.", "Pida un nombre, una forma de responder y la petición. El resto puede esperar a la conversación.", "Peça um nome, um jeito de responder e o pedido. O resto pode esperar a conversa.", "اطلبوا اسماً وطريقة للرد والطلب. الباقي يمكن أن ينتظر المحادثة."),
          },
        ],
      },
    ],
    faq: [
      [t("Can I edit the page myself?", "אפשר לערוך את העמוד לבד?", "¿Puedo editar la página yo mismo?", "Posso editar a página sozinho?", "هل أستطيع تحرير الصفحة بنفسي؟"), t("Yes. The visual editor starts from a template. Change the text, save, check the phone, and publish.", "כן. העורך החזותי מתחיל מתבנית. משנים את הטקסט, שומרים, בודקים בטלפון, ומפרסמים.", "Sí. El editor visual empieza en una plantilla. Cambie el texto, guarde, revise el teléfono y publique.", "Sim. O editor visual começa em um modelo. Mude o texto, salve, confira o telefone e publique.", "نعم. يبدأ المحرر المرئي من قالب. غيّروا النص، واحفظوا، وتحققوا من الهاتف، وانشروا.")],
      [t("What if I would rather not write it?", "מה אם מעדיפים לא לכתוב את זה?", "¿Y si prefiero no escribirlo?", "E se eu preferir não escrever?", "ماذا إذا فضّلت عدم كتابته؟"), t("The published expert build is $399 once for up to five pages on an existing template, with your content, a lead form and a CRM connection. An extra page is $49. That setup is separate from the CRM subscription.", "בניית המומחה שפורסמה עולה 399 דולר חד־פעמית לעד חמישה עמודים על תבנית קיימת, עם התוכן שלכם, טופס לידים וחיבור ל־CRM. עמוד נוסף עולה 49 דולר. ההקמה הזו נפרדת ממנוי ה־CRM.", "La construcción de experto publicada cuesta 399 dólares una vez por hasta cinco páginas sobre una plantilla existente, con su contenido, un formulario y conexión al CRM. Una página extra cuesta 49 dólares.", "A construção de especialista publicada custa 399 dólares uma vez para até cinco páginas em um modelo existente, com o seu conteúdo, um formulário e ligação ao CRM. Uma página extra custa 49 dólares.", "بناء المختص المنشور يكلف 399 دولاراً مرة واحدة لما يصل إلى خمس صفحات على قالب موجود، بمحتواكم ونموذج وربط بـ CRM. الصفحة الإضافية 49 دولاراً.")],
      [t("Does a form on the site become a lead?", "האם טופס באתר הופך לליד?", "¿Un formulario del sitio se convierte en un lead?", "Um formulário no site vira um lead?", "هل يصبح نموذج في الموقع عميلاً محتملاً؟"), t("Yes, once the CRM is in place. The lead arrives as New, with the website as its source. The $49 plan can store it. Follow-up is a status, a note and a dated task.", "כן, ברגע שה־CRM קיים. הליד מגיע כחדש, עם האתר כמקור. מסלול 49 הדולר יכול לשמור אותו. המעקב הוא סטטוס, הערה ומשימה עם תאריך.", "Sí, cuando el CRM está en marcha. El lead llega como Nuevo, con el sitio como origen. El plan de 49 dólares puede guardarlo.", "Sim, quando o CRM está ativo. O lead chega como Novo, com o site como origem. O plano de US$ 49 pode guardá-lo.", "نعم، حين يكون CRM قائماً. يصل العميل كجديد، والموقع مصدره. خطة 49 دولاراً تستطيع حفظه.")],
      [t("Is the website the same product as the CRM?", "האם האתר הוא אותו מוצר כמו ה־CRM?", "¿El sitio es el mismo producto que el CRM?", "O site é o mesmo produto que o CRM?", "هل الموقع هو المنتج نفسه مثل CRM؟"), t("No. The website-only product has its own yearly price on the pricing page. CRM only is $49 a month. Appointments, collaborations and automations are on the business plan at $99 a month or $990 a year.", "לא. למוצר האתר בלבד יש מחיר שנתי משלו בעמוד המחירים. CRM בלבד עולה 49 דולר לחודש. תורים, שיתופים ואוטומציות נמצאים בחבילה העסקית ב־99 דולר לחודש או 990 דולר לשנה.", "No. El sitio solo tiene su propio precio anual en la página de precios. El CRM solo cuesta 49 dólares al mes.", "Não. O site sozinho tem o próprio preço anual na página de preços. O CRM sozinho custa US$ 49 por mês.", "لا. للموقع وحده سعره السنوي في صفحة الأسعار. CRM وحده 49 دولاراً في الشهر.")],
    ],
  });
}
