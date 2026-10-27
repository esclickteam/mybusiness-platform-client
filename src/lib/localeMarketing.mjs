/**
 * Crawlable marketing copy for Spanish, Brazilian Portuguese, and Arabic.
 * English stays in marketingSeo.mjs. Hebrew stays in hebrewMarketing.mjs.
 * Prices and product limits match the shipped English and Hebrew pages.
 */

function page(title, description, crumb, h1, paragraphs, faq) {
  return { title, description, crumb, h1, paragraphs, faq: faq || null };
}

const CRM_FAQ = {
  es: [
    ["¿Qué estados puede tener un lead?", "Seis: nuevo, contactado, interesado, convertido, perdido y lead antiguo. Cada cambio de estado queda en la línea de tiempo del lead."],
    ["¿De dónde entran los leads?", "De tres canales automáticos: anuncios de clientes potenciales de Facebook e Instagram con una conexión de Meta aprobada, formularios de Google Ads y formularios del sitio creado en Bizuply. Cada lead conserva su origen."],
    ["¿Meta aprobó a Bizuply?", "Sí. Bizuply es Meta Tech Provider y la aplicación pasó Meta App Review para Lead Ads. El negocio conecta su propia página de Facebook y aprueba los permisos. No somos Meta Business Partner."],
    ["¿Cómo se evita perder el seguimiento?", "En cada lead se puede registrar una nota, una llamada o un WhatsApp, y abrir una tarea con fecha y hora. Las tareas vencidas aparecen en el centro de notificaciones."],
    ["¿Qué guarda el expediente del cliente?", "Datos de contacto, una línea de tiempo con notas, llamadas, WhatsApp, tareas, citas, archivos y acuerdos, más historial de citas y campos personalizados."],
    ["¿Cómo funciona el calendario de citas?", "Se definen horarios por día y un catálogo de servicios con duración y precio. El sistema calcula huecos de 15 minutos. La cita guarda servicio, precio, estado de pago y una nota."],
    ["¿El cliente puede reservar solo?", "Sí. Hay una página de reserva donde elige servicio y fecha. Al reservar se envía un correo al cliente y al negocio, y la cita aparece en el calendario."],
    ["¿Puedo ver un resumen sin abrir el CRM?", "Sí. El panel del negocio muestra leads nuevos, leads sin tratar, el cambio frente al periodo anterior, una tabla de leads recientes y las próximas citas."],
    ["¿Cuánto cuesta el CRM?", "CRM solo cuesta 49 dólares al mes, con renovación mensual. El plan de negocio, que incluye CRM junto con citas, colaboraciones y automatizaciones, cuesta 99 dólares al mes o 990 dólares al año."],
  ],
  "pt-BR": [
    ["Quais status um lead pode ter?", "Seis: novo, contatado, interessado, convertido, perdido e lead antigo. Cada mudança fica na linha do tempo do lead."],
    ["De onde vêm os leads?", "De três canais automáticos: anúncios de cadastro do Facebook e do Instagram com uma conexão Meta aprovada, formulários do Google Ads e formulários do site criado na Bizuply. Cada lead guarda a origem."],
    ["A Meta aprovou a Bizuply?", "Sim. A Bizuply é Meta Tech Provider e o aplicativo passou no Meta App Review para Lead Ads. O negócio conecta a própria página do Facebook e aprova as permissões. Não somos Meta Business Partner."],
    ["Como não perder o acompanhamento?", "Em cada lead dá para registrar nota, ligação ou WhatsApp e abrir uma tarefa com data e hora. Tarefas atrasadas aparecem no centro de notificações."],
    ["O que fica no arquivo do cliente?", "Contato, uma linha do tempo com notas, ligações, WhatsApp, tarefas, compromissos, arquivos e acordos, além do histórico de compromissos e campos personalizados."],
    ["Como funciona a agenda?", "Você define o horário de cada dia e um catálogo de serviços com duração e preço. O sistema calcula horários livres em passos de 15 minutos. O compromisso guarda serviço, preço, status de pagamento e uma nota."],
    ["O cliente pode agendar sozinho?", "Sim. Há uma página de agendamento. Na reserva, um e-mail vai para o cliente e para o negócio, e o compromisso entra na agenda."],
    ["Dá para ver um resumo sem abrir o CRM?", "Sim. O painel mostra leads novos, leads sem tratamento, a variação em relação ao período anterior, uma tabela dos leads recentes e os próximos compromissos."],
    ["Quanto custa o CRM?", "CRM sozinho custa 49 dólares por mês, com renovação mensal. O plano de negócios, que inclui CRM junto com agenda, colaborações e automações, custa 99 dólares por mês ou 990 dólares por ano."],
  ],
  ar: [
    ["ما حالات العميل المحتمل؟", "ست حالات: جديد، تم التواصل، مهتم، تم التحويل، مفقود، وعميل محتمل قديم. كل تغيير يُسجَّل في الخط الزمني."],
    ["من أين تصل العملاء المحتملون؟", "من ثلاث قنوات تلقائية: إعلانات العملاء المحتملين في فيسبوك وإنستغرام عبر اتصال Meta معتمد، ونماذج Google Ads، ونماذج الموقع الذي بنيتموه في Bizuply. يُحفظ مصدر كل عميل محتمل."],
    ["هل وافقت Meta على Bizuply؟", "نعم. Bizuply هي Meta Tech Provider واجتاز التطبيق Meta App Review لإعلانات العملاء المحتملين. يربط النشاط صفحته في فيسبوك ويوافق على الأذونات. لسنا Meta Business Partner."],
    ["كيف لا تضيع المتابعة؟", "يمكن تسجيل ملاحظة أو مكالمة أو واتساب وفتح مهمة بتاريخ ووقت. المهام المتأخرة تظهر في مركز التنبيهات."],
    ["ماذا يُحفظ في ملف العميل؟", "بيانات الاتصال، وخط زمني يشمل ملاحظات ومكالمات وواتساب ومهام ومواعيد وملفات واتفاقيات، مع سجل المواعيد وحقول مخصصة."],
    ["كيف يعمل تقويم المواعيد؟", "تُحدد ساعات العمل لكل يوم وكتالوج خدمات بالمدة والسعر. يحسب النظام النوافذ المتاحة بخطوات 15 دقيقة. يُحفظ الموعد مع الخدمة والسعر وحالة الدفع وملاحظة."],
    ["هل يستطيع العميل الحجز بنفسه؟", "نعم. توجد صفحة حجز. عند الحجز يُرسل بريد للعميل وللنشاط، ويظهر الموعد في التقويم."],
    ["هل يمكن رؤية ملخص دون فتح CRM؟", "نعم. لوحة النشاط تعرض العملاء المحتملين الجدد، ومن لم يُعالجوا، والتغير مقابل الفترة السابقة، وجدولاً حديثاً، والمواعيد القادمة."],
    ["كم يكلف CRM؟", "CRM وحده 49 دولاراً شهرياً بتجديد شهري. الخطة التجارية، وتشمل CRM مع المواعيد والتعاون والأتمتة، 99 دولاراً شهرياً أو 990 دولاراً سنوياً."],
  ],
};

const WHATSAPP_FAQ = {
  es: [
    ["¿Qué incluyen los 29 dólares?", "La suscripción de un número de WhatsApp conectado: conexión, API y webhooks, plantillas, panel y documentación. Cada número adicional necesita su propia suscripción."],
    ["¿Qué incluye la suscripción?", "WhatsApp Business API cuesta 29 dólares al mes por número conectado. Los cargos de mensajería de Meta se aplican aparte, según el uso y la categoría del mensaje."],
    ["¿Las tarifas de Meta están incluidas?", "No. Meta cobra aparte según el país del destinatario y la categoría del mensaje."],
    ["¿Cómo se factura un número adicional?", "Cada número conectado tiene su propia suscripción de 29 dólares al mes."],
  ],
  "pt-BR": [
    ["O que os 29 dólares incluem?", "A assinatura de um número de WhatsApp conectado: conexão, API e webhooks, modelos, painel e documentação. Cada número extra precisa da própria assinatura."],
    ["O que a assinatura inclui?", "O WhatsApp Business API custa US$ 29 por mês por número conectado. As cobranças de mensagens da Meta são à parte, conforme o uso e a categoria da mensagem."],
    ["As tarifas da Meta estão incluídas?", "Não. A Meta cobra à parte conforme o país do destinatário e a categoria da mensagem."],
    ["Como um número adicional é cobrado?", "Cada número conectado tem a própria assinatura de US$ 29 por mês."],
  ],
  ar: [
    ["ماذا يشمل مبلغ 29 دولاراً؟", "اشتراك رقم واتساب واحد متصل: الربط وواجهة البرمجة وwebhooks والقوالب ولوحة التحكم والتوثيق. كل رقم إضافي يحتاج اشتراكاً مستقلاً."],
    ["ماذا يشمل الاشتراك؟", "WhatsApp Business API بـ 29 دولاراً في الشهر لكل رقم متصل. تُحسب رسوم رسائل Meta بشكل منفصل، حسب الاستخدام وفئة الرسالة."],
    ["هل رسوم Meta مشمولة؟", "لا. تحصّل Meta الرسوم بشكل منفصل حسب بلد المستلم وفئة الرسالة."],
    ["كيف يُحسب رقم إضافي؟", "لكل رقم متصل اشتراكه بـ 29 دولاراً في الشهر."],
  ],
};

const PAGES = {
  es: {
    "/": page(
      "Bizuply | Gestión empresarial, CRM, sitios web y soluciones SaaS",
      "Gestione su negocio con Bizuply. Explore CRM, WhatsApp, marketing, automatizaciones, creación de sitios, soluciones SaaS listas y servicios profesionales.",
      "Bizuply",
      "Todo lo que su negocio necesita. Un lugar potente para crecer.",
      [
        "Gestione clientes, capture leads, ejecute campañas, comuníquese por WhatsApp, programe citas y automatice el trabajo diario, todo desde una plataforma de negocio conectada.",
        "Si prefiere gestionarlo todo o necesita ayuda experta para la puesta en marcha, Bizuply da a su negocio las herramientas y el apoyo para avanzar.",
      ],
    ),
    "/about": page(
      "Sobre Bizuply | Nuestra misión, enfoque y plataforma de negocio",
      "Conozca Bizuply, nuestra misión y nuestro enfoque de la tecnología empresarial conectada. Descubra cómo nuestra plataforma de software y nuestros servicios digitales apoyan a las empresas modernas.",
      "Nosotros",
      "Creada para que el negocio se sienta más conectado",
      [
        "Bizuply reúne la gestión del negocio, las relaciones con los clientes, el marketing, la comunicación y las herramientas digitales en una plataforma conectada. Nos enfocamos en ayudar a las empresas a organizar su trabajo, simplificar los procesos cotidianos y crear más espacio para el crecimiento.",
        "Bizuply es una empresa de tecnología empresarial que ofrece una plataforma conectada y soluciones digitales para negocios que quieren gestionar sus operaciones con mayor eficacia. Nuestro trabajo reúne software, flujos de trabajo empresariales y servicios profesionales para responder a las necesidades prácticas de las compañías modernas.",
        "Nuestra misión es ayudar a las empresas a trabajar con mayor claridad, acercando las herramientas digitales esenciales y los procesos cotidianos del negocio.",
        "Bizuply LLC es una empresa registrada en Estados Unidos. Para los datos oficiales de la empresa y la información de contacto actual, consulte la información empresarial verificada que publica Bizuply.",
      ]
    ),
    "/contact": page(
      "Contacto | Bizuply",
      "Contacte al equipo de Bizuply para preguntas, soporte y consultas de negocio.",
      "Contacto",
      "Contacto",
      ["Escriba al equipo de Bizuply para soporte, facturación o una pregunta sobre el producto."],
    ),
    "/faq": page(
      "Preguntas frecuentes | Bizuply",
      "Respuestas sobre Bizuply: leads, Meta, sitios web, automatizaciones, precios y soporte.",
      "Preguntas",
      "Preguntas frecuentes",
      ["Las respuestas de producto, precios y límites están en cada página de producto y en el centro de guías."],
    ),
    "/how-it-works": page(
      "Cómo funciona Bizuply",
      "Cómo Bizuply conecta leads, citas, el sitio y las automatizaciones en un solo flujo de trabajo.",
      "Cómo funciona",
      "Cómo funciona",
      ["Un lead entra desde Meta, Google Ads o el sitio. Recibe un estado, una tarea y, si hace falta, una cita. Las automatizaciones del plan de negocio pueden continuar el seguimiento."],
    ),
    "/pricing": page(
      "Precios | Bizuply",
      "CRM solo: 49 dólares al mes. Plan de negocio: 99 dólares al mes o 990 al año. WhatsApp: 29 dólares al mes por número conectado, más las tarifas de Meta.",
      "Precios",
      "Precios",
      [
        "CRM solo cuesta 49 dólares al mes. El plan de negocio cuesta 99 dólares al mes o 990 dólares al año e incluye CRM, citas, colaboraciones y automatizaciones.",
        "WhatsApp Cloud API cuesta 29 dólares al mes por número conectado. Las tarifas de mensajes de Meta se cobran aparte. Los cargos de mensajería de Meta se aplican aparte, según el uso y la categoría del mensaje.",
        "El sitio web tiene un precio anual propio en la página de precios. No forma parte del producto CRM.",
      ],
    ),
    "/features": page(
      "Funciones | Bizuply",
      "CRM, citas, sitio web, automatizaciones, colaboraciones, agentes humanos y WhatsApp Cloud API.",
      "Funciones",
      "Funciones",
      ["Las funciones publicadas son las que ya funcionan en el producto: CRM y leads, citas, constructor de sitios, automatizaciones, campañas de Meta dentro del panel y WhatsApp Cloud API."],
    ),
    "/solutions": page(
      "Soluciones para negocios | Bizuply",
      "Una plataforma para negocios de servicios que reciben leads, reservan citas y responden por WhatsApp.",
      "Soluciones",
      "Soluciones para negocios",
      ["Bizuply está pensado para negocios que necesitan un pipeline, un expediente de cliente y un calendario, no para sustituir el administrador de anuncios de Meta."],
    ),
    "/crm": page(
      "Software CRM para empresas con anuncios de clientes potenciales | Bizuply",
      "Gestione leads y clientes en un solo CRM. Meta Lead Ads, Google Ads y su sitio entran en un pipeline, con expediente y citas. CRM solo: 49 dólares al mes.",
      "CRM",
      "Cada lead, cada cliente y cada cita en un solo lugar",
      [
        "Las consultas de Facebook, Instagram, Google Ads y su sitio entran en un pipeline con estado, notas y tareas. Desde ahí se sigue al expediente, al calendario y al catálogo de servicios.",
        "Los estados son nuevo, contactado, interesado, convertido, perdido y lead antiguo. Cada cambio queda en la línea de tiempo.",
        "Sirve a negocios de servicios, a equipos que usan formularios de leads y a negocios cuyo sitio de Bizuply debe alimentar el mismo pipeline.",
        "CRM solo cuesta 49 dólares al mes. El plan de negocio, con CRM, citas, colaboraciones y automatizaciones, cuesta 99 dólares al mes o 990 dólares al año.",
      ],
      CRM_FAQ.es,
    ),
    "/automations": page(
      "Automatizaciones para negocios | Bizuply",
      "Recordatorios, seguimientos, tareas y avisos conectados al CRM de Bizuply, para que menos consultas se queden sin respuesta.",
      "Automatizaciones",
      "Automatizaciones para el negocio",
      [
        "Una automatización empieza con un disparador, por ejemplo un lead nuevo o un cambio de estado. Después puede crear una tarea, enviar un recordatorio o actualizar el seguimiento.",
        "Las automatizaciones forman parte del plan de negocio, de 99 dólares al mes o 990 dólares al año, junto con CRM, citas y colaboraciones.",
        "No sustituyen la aprobación de plantillas de WhatsApp ni el gasto publicitario de Meta.",
      ],
    ),
    "/website-builder": page(
      "Constructor de sitios web para negocios | Bizuply",
      "Cree un sitio, una tienda o una página con reservas en un editor visual y publique en su dominio. Cada consulta del sitio entra al CRM.",
      "Sitios web",
      "Un sitio profesional que trae clientes",
      [
        "Elija una plantilla de la biblioteca, edite el contenido en el editor visual y publique en su dirección. No publicamos aquí una cifra de plantillas que no se haya vuelto a contar en esta versión.",
        "Los formularios del sitio pueden crear un lead en el mismo CRM, con su origen.",
      ],
    ),
    "/appointments": page(
      "Agenda de citas | Bizuply",
      "Calendario de citas, recordatorios y seguimiento de clientes en Bizuply, con huecos de 15 minutos.",
      "Citas",
      "Agenda de citas",
      ["Defina horarios y servicios. El calendario ofrece huecos de 15 minutos. El cliente puede reservar en una página pública y el negocio recibe la cita en el mismo sistema que el CRM."],
    ),
    "/collaborations": page(
      "Colaboraciones entre negocios | Bizuply",
      "Coordine colaboraciones con otros negocios desde Bizuply, dentro del plan de negocio.",
      "Colaboraciones",
      "Colaboraciones",
      ["Las colaboraciones forman parte del plan de negocio de 99 dólares al mes o 990 dólares al año, junto con CRM, citas y automatizaciones."],
    ),
    "/agents": page(
      "Agentes humanos | Bizuply",
      "Asigne el trabajo del negocio a agentes humanos. Esta página no describe un chatbot de inteligencia artificial.",
      "Agentes",
      "Agentes del negocio",
      ["Los agentes de esta página son personas del equipo, no un chatbot. El acceso y los permisos se gestionan dentro de la cuenta del negocio."],
    ),
    "/business": page(
      "Para negocios | Bizuply",
      "Abra un negocio en Bizuply para usar CRM, citas, sitio, automatizaciones y WhatsApp.",
      "Negocios",
      "Empiece con su negocio",
      ["El alta del negocio es el camino para usar el panel. Los precios públicos están en la página de precios y en las páginas de CRM y WhatsApp."],
    ),
    "/whatsapp-api": page(
      "WhatsApp API para empresas | Bizuply",
      "Conecte WhatsApp Cloud API de Meta con Bizuply. 29 dólares al mes por número conectado. Las tarifas de Meta van aparte Los cargos de mensajería de Meta se aplican aparte.",
      "WhatsApp API",
      "WhatsApp API para empresas",
      [
        "Bizuply conecta WhatsApp Cloud API: envío de plantillas aprobadas, seguimiento de entrega y webhooks firmados.",
        "La suscripción es de 29 dólares al mes por un número conectado. Meta cobra los mensajes aparte. Los cargos de mensajería de Meta se aplican aparte, según el uso y la categoría del mensaje.",
        "La conexión se hace con Embedded Signup de Meta desde el panel. Meta aprueba las plantillas y el número. No hay una cola de aprobación aparte de Bizuply.",
        "Sirve a desarrolladores, a negocios con CRM o sitio y a agencias que conectan un número por cliente. Administrar varios clientes desde una sola pantalla todavía no está disponible.",
      ],
      WHATSAPP_FAQ.es,
    ),
    "/meta-campaigns": page(
      "Gestión de campañas de Meta | Bizuply",
      "Cree y edite campañas, conjuntos de anuncios y anuncios de Meta desde el panel de Bizuply, y reciba los Lead Ads en el CRM. El gasto lo cobra Meta.",
      "Campañas de Meta",
      "Campañas de Meta junto al CRM",
      [
        "Desde el panel se conecta la cuenta de anuncios de Meta del propio negocio. Se pueden crear y editar campañas, conjuntos de anuncios y anuncios, con presupuesto a nivel de campaña o de conjunto.",
        "El panel muestra resultados de las campañas conectadas. Los formularios de Lead Ads pueden entrar al CRM con origen y estado, el mismo flujo descrito en la página de CRM.",
        "El seguimiento posterior se hace con tareas del CRM y, en el plan de negocio, con automatizaciones. Bizuply no sustituye el pago del medio: Meta cobra el gasto publicitario.",
        "No hay un precio aparte de campañas en esta página. CRM solo cuesta 49 dólares al mes. El plan de negocio cuesta 99 dólares al mes o 990 al año.",
      ],
    ),
    "/guides": page(
      "Guías | Bizuply",
      "Guías prácticas sobre CRM, WhatsApp Cloud API, automatizaciones, anuncios de Meta y el constructor de sitios de Bizuply.",
      "Guías",
      "Centro de guías",
      ["Guías escritas a partir de las funciones que el producto ya publica. Cada guía indica el precio real y los límites conocidos."],
    ),
  },
};

function cloneShape(locale, dict) {
  PAGES[locale] = dict;
}

cloneShape("pt-BR", {
  "/": page(
    "Bizuply | Gestão de negócios, CRM, sites e soluções SaaS",
    "Administre o negócio com a Bizuply. Explore CRM, WhatsApp, marketing, automações, criação de sites, soluções SaaS prontas e serviços profissionais.",
    "Bizuply",
    "Tudo o que o seu negócio precisa. Um lugar poderoso para crescer.",
    [
      "Gerencie clientes, capture leads, rode campanhas, converse pelo WhatsApp, marque compromissos e automatize o trabalho do dia — tudo em uma plataforma de negócios conectada.",
      "Se você prefere cuidar de tudo ou precisa de ajuda especializada para começar, a Bizuply dá ao negócio as ferramentas e o apoio para avançar.",
    ],
  ),
  "/about": page(
    "Sobre a Bizuply | Nossa missão, abordagem e plataforma de negócios",
    "Conheça a Bizuply, nossa missão e nossa abordagem à tecnologia empresarial conectada. Veja como nossa plataforma de software e nossos serviços digitais apoiam empresas modernas.",
    "Sobre",
    "Criada para tornar o trabalho do negócio mais conectado",
    [
      "A Bizuply reúne gestão empresarial, relacionamento com clientes, marketing, comunicação e ferramentas digitais em uma plataforma conectada. Nosso foco é ajudar empresas a organizar o trabalho, simplificar processos do dia a dia e abrir mais espaço para o crescimento.",
      "A Bizuply é uma empresa de tecnologia empresarial que oferece uma plataforma conectada e soluções digitais para negócios que querem gerir suas operações com mais eficiência. Nosso trabalho reúne software, fluxos de trabalho empresariais e serviços profissionais para atender às necessidades práticas de empresas modernas.",
      "Nossa missão é ajudar empresas a trabalhar com mais clareza, aproximando ferramentas digitais essenciais e processos empresariais do dia a dia.",
      "A Bizuply LLC é uma empresa registrada nos Estados Unidos. Para os dados oficiais da empresa e as informações de contato atuais, consulte as informações empresariais verificadas publicadas pela Bizuply.",
    ]
  ),
  "/contact": page("Contato | Bizuply", "Fale com a equipe da Bizuply sobre suporte, cobrança e o produto.", "Contato", "Contato", ["Escreva para a equipe da Bizuply sobre suporte, cobrança ou uma dúvida do produto."]),
  "/faq": page("Perguntas frequentes | Bizuply", "Respostas sobre leads, Meta, sites, automações, preços e suporte.", "Perguntas", "Perguntas frequentes", ["As respostas de produto, preço e limite estão em cada página de produto e no centro de guias."]),
  "/how-it-works": page("Como a Bizuply funciona", "Como a Bizuply liga leads, agenda, site e automações em um fluxo.", "Como funciona", "Como funciona", ["Um lead entra pela Meta, pelo Google Ads ou pelo site. Ele recebe um status, uma tarefa e, se preciso, um compromisso. As automações do plano de negócios podem continuar o acompanhamento."]),
  "/pricing": page(
    "Preços | Bizuply",
    "CRM sozinho: 49 dólares por mês. Plano de negócios: 99 dólares por mês ou 990 por ano. WhatsApp: 29 dólares por mês por número, mais as tarifas da Meta.",
    "Preços",
    "Preços",
    [
      "CRM sozinho custa 49 dólares por mês. O plano de negócios custa 99 dólares por mês ou 990 dólares por ano e inclui CRM, agenda, colaborações e automações.",
      "WhatsApp Cloud API custa 29 dólares por mês por número conectado. As tarifas de mensagem da Meta são cobradas à parte. As cobranças de mensagens da Meta são à parte, conforme o uso e a categoria da mensagem.",
      "O site tem um preço anual próprio na página de preços. Ele não faz parte do produto de CRM.",
    ],
  ),
  "/features": page("Recursos | Bizuply", "CRM, agenda, site, automações, colaborações, agentes humanos e WhatsApp Cloud API.", "Recursos", "Recursos", ["Os recursos publicados são os que já funcionam: CRM e leads, agenda, construtor de sites, automações, campanhas da Meta no painel e WhatsApp Cloud API."]),
  "/solutions": page("Soluções para negócios | Bizuply", "Uma plataforma para negócios de serviço que recebem leads, marcam horários e respondem no WhatsApp.", "Soluções", "Soluções para negócios", ["A Bizuply serve a negócios que precisam de um pipeline, um arquivo de cliente e uma agenda. Ela não substitui o gerenciador de anúncios da Meta."]),
  "/crm": page(
    "CRM para pequenas empresas com anúncios de cadastro | Bizuply",
    "Gerencie leads e clientes em um CRM. Meta Lead Ads, Google Ads e o seu site entram em um pipeline, com arquivo e agenda. CRM sozinho: 49 dólares por mês.",
    "CRM",
    "Cada lead, cada cliente e cada compromisso em um só lugar",
    [
      "Consultas do Facebook, do Instagram, do Google Ads e do seu site entram em um pipeline com status, notas e tarefas. Dali seguem para o arquivo, a agenda e o catálogo de serviços.",
      "Os status são novo, contatado, interessado, convertido, perdido e lead antigo. Cada mudança fica na linha do tempo.",
      "Serve a negócios de serviço, a equipes que usam formulários de lead e a negócios cujo site da Bizuply precisa alimentar o mesmo pipeline.",
      "CRM sozinho custa 49 dólares por mês. O plano de negócios, com CRM, agenda, colaborações e automações, custa 99 dólares por mês ou 990 dólares por ano.",
    ],
    CRM_FAQ["pt-BR"],
  ),
  "/automations": page(
    "Automações para empresas | Bizuply",
    "Lembretes, acompanhamentos, tarefas e alertas ligados ao CRM da Bizuply, para menos contatos ficarem sem resposta.",
    "Automações",
    "Automações para o negócio",
    [
      "Uma automação começa com um gatilho, por exemplo um lead novo ou uma mudança de status. Depois ela pode criar uma tarefa, enviar um lembrete ou atualizar o acompanhamento.",
      "As automações fazem parte do plano de negócios, de 99 dólares por mês ou 990 dólares por ano, junto com CRM, agenda e colaborações.",
      "Elas não substituem a aprovação de modelos do WhatsApp nem o investimento em mídia da Meta.",
    ],
  ),
  "/website-builder": page(
    "Construtor de sites para negócios | Bizuply",
    "Crie um site, uma loja ou uma página com agendamento em um editor visual e publique no seu domínio. Cada contato do site entra no CRM.",
    "Sites",
    "Um site profissional que traz clientes",
    [
      "Escolha um modelo da biblioteca, edite o conteúdo no editor visual e publique no seu endereço. Esta página não publica uma quantidade de modelos que não tenha sido recontada nesta versão.",
      "Os formulários do site podem criar um lead no mesmo CRM, com a origem.",
    ],
  ),
  "/appointments": page("Agenda de compromissos | Bizuply", "Calendário, lembretes e acompanhamento na Bizuply, com horários de 15 minutos.", "Agenda", "Agenda de compromissos", ["Defina horários e serviços. O calendário oferece horários livres de 15 minutos. O cliente pode reservar em uma página pública e o compromisso entra no mesmo sistema do CRM."]),
  "/collaborations": page("Colaborações entre negócios | Bizuply", "Coordene colaborações com outros negócios dentro do plano de negócios da Bizuply.", "Colaborações", "Colaborações", ["As colaborações fazem parte do plano de 99 dólares por mês ou 990 dólares por ano, junto com CRM, agenda e automações."]),
  "/agents": page("Agentes humanos | Bizuply", "Atribua o trabalho do negócio a agentes humanos. Esta página não descreve um chatbot.", "Agentes", "Agentes do negócio", ["Os agentes desta página são pessoas da equipe, não um chatbot. O acesso fica na conta do negócio."]),
  "/business": page("Para negócios | Bizuply", "Abra um negócio na Bizuply para usar CRM, agenda, site, automações e WhatsApp.", "Negócios", "Comece com o seu negócio", ["O cadastro do negócio é o caminho para o painel. Os preços públicos estão na página de preços e nas páginas de CRM e WhatsApp."]),
  "/whatsapp-api": page(
    "WhatsApp API para empresas | Bizuply",
    "Conecte a WhatsApp Cloud API da Meta com a Bizuply. 29 dólares por mês por número conectado. As tarifas da Meta são à parte As cobranças de mensagens da Meta são à parte.",
    "WhatsApp API",
    "WhatsApp API para empresas",
    [
      "A Bizuply conecta a WhatsApp Cloud API: envio de modelos aprovados, acompanhamento de entrega e webhooks assinados.",
      "A assinatura é de 29 dólares por mês para um número conectado. A Meta cobra as mensagens à parte. As cobranças de mensagens da Meta são à parte, conforme o uso e a categoria da mensagem.",
      "A conexão usa o Embedded Signup da Meta no painel. A Meta aprova os modelos e o número. Não existe uma fila de aprovação separada da Bizuply.",
      "Serve a desenvolvedores, a negócios com CRM ou site e a agências que conectam um número por cliente. Administrar vários clientes em uma única tela ainda não está disponível.",
    ],
    WHATSAPP_FAQ["pt-BR"],
  ),
  "/meta-campaigns": page(
    "Gestão de campanhas da Meta | Bizuply",
    "Crie e edite campanhas, conjuntos de anúncios e anúncios da Meta no painel da Bizuply e receba Lead Ads no CRM. A mídia é cobrada pela Meta.",
    "Campanhas da Meta",
    "Campanhas da Meta ao lado do CRM",
    [
      "No painel, o negócio conecta a própria conta de anúncios da Meta. Dá para criar e editar campanhas, conjuntos de anúncios e anúncios, com orçamento na campanha ou no conjunto.",
      "O painel mostra resultados das campanhas conectadas. Formulários de Lead Ads podem entrar no CRM com origem e status, o mesmo fluxo da página de CRM.",
      "O acompanhamento seguinte usa tarefas do CRM e, no plano de negócios, automações. A Bizuply não substitui o pagamento da mídia.",
      "Não há um preço separado de campanhas nesta página. CRM sozinho custa 49 dólares por mês. O plano de negócios custa 99 dólares por mês ou 990 por ano.",
    ],
  ),
  "/guides": page(
    "Guias | Bizuply",
    "Guias práticos sobre CRM, WhatsApp Cloud API, automações, anúncios da Meta e o construtor de sites da Bizuply.",
    "Guias",
    "Centro de guias",
    ["Guias escritos a partir das funções que o produto já publica. Cada guia indica o preço real e os limites conhecidos."],
  ),
});

cloneShape("ar", {
  "/": page(
    "Bizuply | إدارة الأعمال وCRM والمواقع وحلول SaaS",
    "أديروا عملكم مع Bizuply. استكشفوا CRM وWhatsApp والتسويق والأتمتة وبناء المواقع وحلول SaaS الجاهزة والخدمات المهنية.",
    "Bizuply",
    "كل ما يحتاجه عملكم. مكان واحد قوي للنمو.",
    [
      "أديروا العملاء، والتقطوا الطلبات، وشغّلوا الحملات، وتواصلوا عبر WhatsApp، ونظّموا المواعيد، وأتمتوا العمل اليومي — من منصة أعمال واحدة متصلة.",
      "سواء فضّلتم إدارة كل شيء بأنفسكم أو احتجتم إلى مساعدة خبراء في التهيئة، تمنح Bizuply عملكم الأدوات والدعم للمضي قدمًا.",
    ],
  ),
  "/about": page(
    "عن Bizuply | رسالتنا ونهجنا ومنصة الأعمال",
    "تعرّف على Bizuply، وعلى رسالتنا ونهجنا في تقنية الأعمال المترابطة. اكتشف كيف تدعم منصة البرمجيات والخدمات الرقمية لدينا الشركات الحديثة.",
    "نبذة",
    "بُنيت لتجعل العمل التجاري أكثر ترابطًا",
    [
      "تجمع Bizuply إدارة الأعمال وعلاقات العملاء والتسويق والتواصل والأدوات الرقمية في منصة واحدة مترابطة. نركّز على مساعدة الشركات في تنظيم عملها، وتبسيط العمليات اليومية، وإتاحة مساحة أكبر للنمو.",
      "Bizuply شركة تقنية أعمال تقدّم منصة مترابطة وحلولًا رقمية للشركات التي تريد إدارة عملياتها بفعالية أكبر. يجمع عملنا بين البرمجيات وسير العمل التجاري والخدمات المهنية لدعم الاحتياجات العملية للشركات الحديثة.",
      "رسالتنا هي مساعدة الشركات على العمل بوضوح أكبر من خلال تقريب الأدوات الرقمية الأساسية والعمليات التجارية اليومية بعضها من بعض.",
      "Bizuply LLC شركة مسجّلة في الولايات المتحدة. للاطلاع على البيانات الرسمية للشركة ومعلومات التواصل الحالية، يُرجى الرجوع إلى المعلومات التجارية الموثّقة التي تنشرها Bizuply.",
    ]
  ),
  "/contact": page("اتصلوا بنا | Bizuply", "تواصلوا مع فريق Bizuply للدعم والأسئلة التجارية.", "اتصلوا بنا", "اتصلوا بنا", ["اكتبوا لفريق Bizuply بشأن الدعم أو الفوترة أو سؤال عن المنتج."]),
  "/faq": page("أسئلة شائعة | Bizuply", "إجابات عن العملاء المحتملين وMeta والمواقع والأتمتة والأسعار والدعم.", "أسئلة", "أسئلة شائعة", ["إجابات المنتج والسعر والحدود موجودة في صفحة كل منتج وفي مركز الأدلة."]),
  "/how-it-works": page("كيف تعمل Bizuply", "كيف تربط Bizuply العملاء المحتملين والمواعيد والموقع والأتمتة في مسار واحد.", "آلية العمل", "كيف تعمل", ["يصل العميل المحتمل من Meta أو Google Ads أو الموقع. يحصل على حالة ومهمة وعند الحاجة على موعد. أتمتة الخطة التجارية يمكن أن تواصل المتابعة."]),
  "/pricing": page(
    "الأسعار | Bizuply",
    "CRM وحده 49 دولاراً شهرياً. الخطة التجارية 99 دولاراً شهرياً أو 990 سنوياً. واتساب 29 دولاراً شهرياً لكل رقم، إضافة إلى رسوم Meta.",
    "الأسعار",
    "الأسعار",
    [
      "CRM وحده 49 دولاراً شهرياً. الخطة التجارية 99 دولاراً شهرياً أو 990 دولاراً سنوياً وتشمل CRM والمواعيد والتعاون والأتمتة.",
      "واجهة واتساب السحابية 29 دولاراً شهرياً لكل رقم متصل. رسوم رسائل Meta تُحصَّل بشكل منفصل. تُحسب رسوم رسائل Meta بشكل منفصل، حسب الاستخدام وفئة الرسالة.",
      "للموقع سعر سنوي مستقل في صفحة الأسعار. وهو ليس منتج CRM.",
    ],
  ),
  "/features": page("المزايا | Bizuply", "CRM والمواعيد والموقع والأتمتة والتعاون ووكلاء بشريون وواجهة واتساب.", "المزايا", "المزايا", ["المزايا المنشورة هي ما يعمل اليوم: CRM والعملاء المحتملون، والمواعيد، ومنشئ المواقع، والأتمتة، وحملات Meta داخل اللوحة، وواجهة واتساب."]),
  "/solutions": page("حلول لإدارة النشاط | Bizuply", "منصة لأنشطة الخدمات التي تستقبل عملاء محتملين وتحجز مواعيد وترد عبر واتساب.", "حلول", "حلول للنشاط", ["Bizuply مخصصة لمن يحتاج مساراً وملف عميل وتقويماً. هي لا تستبدل مدير إعلانات Meta."]),
  "/crm": page(
    "برنامج إدارة علاقات العملاء للشركات | Bizuply",
    "إدارة العملاء المحتملين والعملاء في CRM واحد. إعلانات Meta وGoogle Ads والموقع تدخل مساراً واحداً مع ملف وجدول مواعيد. CRM وحده 49 دولاراً شهرياً.",
    "CRM",
    "كل عميل محتمل وكل عميل وكل موعد في مكان واحد",
    [
      "الاستفسارات من فيسبوك وإنستغرام وGoogle Ads والموقع تدخل مساراً بحالة وملاحظات ومهام. ومنها إلى ملف العميل والتقويم وكتالوج الخدمات.",
      "الحالات هي جديد، تم التواصل، مهتم، تم التحويل، مفقود، وعميل محتمل قديم. كل تغيير يُحفظ في الخط الزمني.",
      "يناسب أنشطة الخدمات والفرق التي تستخدم نماذج العملاء المحتملين والأنشطة التي يجب أن يغذّي موقعها في Bizuply المسار نفسه.",
      "CRM وحده 49 دولاراً شهرياً. الخطة التجارية، مع CRM والمواعيد والتعاون والأتمتة، 99 دولاراً شهرياً أو 990 دولاراً سنوياً.",
    ],
    CRM_FAQ.ar,
  ),
  "/automations": page(
    "أتمتة الأعمال | Bizuply",
    "تذكيرات ومتابعات ومهام وتنبيهات مرتبطة بـ CRM في Bizuply حتى لا تضيع الاستفسارات.",
    "الأتمتة",
    "أتمتة للنشاط",
    [
      "تبدأ الأتمتة بمحفّز، مثل عميل محتمل جديد أو تغيير حالة. بعدها يمكن إنشاء مهمة أو إرسال تذكير أو تحديث المتابعة.",
      "الأتمتة جزء من الخطة التجارية بسعر 99 دولاراً شهرياً أو 990 دولاراً سنوياً، مع CRM والمواعيد والتعاون.",
      "لا تستبدل موافقة قوالب واتساب ولا إنفاق Meta الإعلاني.",
    ],
  ),
  "/website-builder": page(
    "منشئ مواقع للأنشطة | Bizuply",
    "أنشئوا موقعاً أو متجراً أو صفحة حجز بمحرر مرئي وانشروا على نطاقكم. كل استفسار من الموقع يدخل إلى CRM.",
    "المواقع",
    "موقع مهني يجلب عملاء",
    [
      "اختاروا قالباً من المكتبة، وحرّروا المحتوى في المحرر المرئي، ثم انشروا على عنوانكم. لا نعرض هنا رقماً للقوالب لم يُعَد إحصاؤه في هذه النسخة.",
      "يمكن لنماذج الموقع إنشاء عميل محتمل في CRM نفسه مع مصدره.",
    ],
  ),
  "/appointments": page("تنسيق المواعيد | Bizuply", "تقويم مواعيد وتذكيرات ومتابعة داخل Bizuply بخطوات 15 دقيقة.", "المواعيد", "تنسيق المواعيد", ["حدّدوا الساعات والخدمات. يعرض التقويم نوافذ من 15 دقيقة. يستطيع العميل الحجز في صفحة عامة ويظهر الموعد في النظام نفسه مع CRM."]),
  "/collaborations": page("التعاون بين الأنشطة | Bizuply", "نسّقوا التعاون مع أنشطة أخرى ضمن الخطة التجارية في Bizuply.", "التعاون", "التعاون", ["التعاون جزء من خطة 99 دولاراً شهرياً أو 990 دولاراً سنوياً مع CRM والمواعيد والأتمتة."]),
  "/agents": page("وكلاء بشريون | Bizuply", "أسندوا عمل النشاط إلى وكلاء بشريين. هذه الصفحة لا تصف روبوت دردشة.", "الوكلاء", "وكلاء النشاط", ["الوكلاء هنا أشخاص من الفريق وليسوا روبوت دردشة. تُدار الصلاحيات من حساب النشاط."]),
  "/business": page("للأنشطة | Bizuply", "افتحوا نشاطاً في Bizuply لاستخدام CRM والمواعيد والموقع والأتمتة وواتساب.", "النشاط", "ابدأوا بنشاطكم", ["تسجيل النشاط هو الطريق إلى اللوحة. الأسعار العامة في صفحة الأسعار وفي صفحتي CRM وواتساب."]),
  "/whatsapp-api": page(
    "واتساب API للأعمال | Bizuply",
    "اربطوا WhatsApp Cloud API من Meta عبر Bizuply. 29 دولاراً شهرياً لكل رقم متصل. رسوم Meta منفصلة تُحسب رسوم رسائل Meta بشكل منفصل.",
    "واتساب API",
    "واتساب API للأعمال",
    [
      "تربط Bizuply واجهة واتساب السحابية: إرسال القوالب المعتمدة، وتتبع التسليم، وwebhooks موقّعة.",
      "الاشتراك 29 دولاراً شهرياً لرقم واحد متصل. تحصّل Meta رسوم الرسائل بشكل منفصل. تُحسب رسوم رسائل Meta بشكل منفصل، حسب الاستخدام وفئة الرسالة.",
      "يتم الربط عبر Embedded Signup من Meta داخل اللوحة. توافق Meta على القوالب والرقم. لا يوجد طابور موافقة منفصل لدى Bizuply.",
      "يناسب المطوّرين والأنشطة التي لديها CRM أو موقع والوكالات التي تربط رقماً واحداً لكل عميل. إدارة عدة عملاء من شاشة واحدة غير متاحة بعد.",
    ],
    WHATSAPP_FAQ.ar,
  ),
  "/meta-campaigns": page(
    "إدارة حملات Meta | Bizuply",
    "أنشئوا وحرّروا الحملات ومجموعات الإعلانات والإعلانات من لوحة Bizuply، وتصل إعلانات العملاء المحتملين إلى CRM. الإنفاق تحصّله Meta.",
    "حملات Meta",
    "حملات Meta إلى جانب CRM",
    [
      "من اللوحة يربط النشاط حسابه الإعلاني في Meta. يمكن إنشاء وتحرير الحملات ومجموعات الإعلانات والإعلانات، بميزانية على مستوى الحملة أو المجموعة.",
      "تعرض اللوحة نتائج الحملات المتصلة. يمكن لنماذج Lead Ads أن تدخل CRM مع المصدر والحالة، وهو المسار نفسه الموصوف في صفحة CRM.",
      "المتابعة اللاحقة تتم بمهام CRM، وفي الخطة التجارية بالأتمتة. لا تستبدل Bizuply دفع الوسيلة الإعلانية.",
      "لا يوجد سعر منفصل للحملات في هذه الصفحة. CRM وحده 49 دولاراً شهرياً. الخطة التجارية 99 دولاراً شهرياً أو 990 سنوياً.",
    ],
  ),
  "/guides": page(
    "أدلة | Bizuply",
    "أدلة عملية عن CRM وواتساب API والأتمتة وإعلانات Meta ومنشئ المواقع في Bizuply.",
    "أدلة",
    "مركز الأدلة",
    ["أدلة مكتوبة من الوظائف التي ينشرها المنتج فعلاً. يذكر كل دليل السعر الحقيقي والحدود المعروفة."],
  ),
});

export function getLocaleMarketingPage(path, locale) {
  return PAGES[locale]?.[path] || null;
}

export function localizedMarketingLocales() {
  return Object.keys(PAGES);
}
