/**
 * unique40 — leftover gallery-template preview chrome after unique39/IDO.
 * Clean indented tx() keys plus unwrapped Aeline/PulseCore/Spalcio/Adion copy.
 * Skip personal names, streets, cities, Admin/Staff, hybrids, and smash-hazard singles
 * unless they are explicit UI labels.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "סטודיו דיגיטלי שמחבר בין עיצוב, אוטומציות, CRM ותהליכי מכירה כדי\nלעזור לעסקים לעבוד מהר יותר, מסודר יותר ורווחי יותר.":
    r(
      "A digital studio that connects design, automations, CRM, and sales processes to\nhelp businesses work faster, more organized, and more profitable.",
      "Un estudio digital que conecta diseño, automatizaciones, CRM y procesos de venta para\nayudar a negocios a trabajar más rápido, más ordenados y más rentables.",
      "Um estúdio digital que liga design, automações, CRM e processos de vendas para\najudar negócios a trabalhar mais rápido, mais organizados e mais lucrativos.",
      "استوديو رقمي يربط التصميم والأتمتة وCRM وعمليات البيع لكي\nتساعد الأعمال على العمل أسرع وبترتيب أعلى وبربح أكبر.",
    ),
  "“פתאום כל הפניות, המשימות והמעקבים נמצאים במקום אחד. הצוות פשוט\nיודע מה לעשות.”":
    r(
      "“Suddenly every inquiry, task, and follow-up is in one place. The team just\nknows what to do.”",
      "“De pronto todas las consultas, tareas y seguimientos están en un lugar. El equipo simplemente\nsabe qué hacer.”",
      "“De repente todas as consultas, tarefas e acompanhamentos estão em um lugar. A equipe simplesmente\nsabe o que fazer.”",
      "«فجأة كل الاستفسارات والمهام والمتابعات في مكان واحد. الفريق ببساطة\nيعرف ماذا يفعل.»",
    ),
  "פניות עברו דרך תהליכים דיגיטליים שמסדרים טיפול, תזכורות\nופולואפים.":
    r(
      "Inquiries went through digital processes that organize handling, reminders,\nand follow-ups.",
      "Las consultas pasaron por procesos digitales que ordenan el trato, recordatorios\ny seguimientos.",
      "As consultas passaram por processos digitais que organizam atendimento, lembretes\ne follow-ups.",
      "مرّت الاستفسارات عبر عمليات رقمية ترتّب المعالجة والتذكيرات\nوالمتابعات.",
    ),
  "תבנית פרימיום לעסקים שרוצים להציג תהליך חכם, חוויית לקוח חזקה\nומערכת שמובילה לפניות איכותיות.":
    r(
      "A premium template for businesses that want to show a smart process, a strong customer experience,\nand a system that leads to quality inquiries.",
      "Plantilla premium para negocios que quieren mostrar un proceso inteligente, una experiencia de cliente fuerte\ny un sistema que lleva a consultas de calidad.",
      "Modelo premium para negócios que querem mostrar um processo inteligente, uma experiência de cliente forte\ne um sistema que leva a consultas de qualidade.",
      "قالب فاخر لأعمال تريد عرض عملية ذكية وتجربة زبائن قوية\nومنظومة تؤدي إلى استفسارات نوعية.",
    ),
  "כאן אפשר לחבר טופס, יומן פגישות או CRM כדי לאסוף פניות\nבצורה מסודרת.":
    r(
      "Here you can connect a form, appointment calendar, or CRM to collect inquiries\nin an organized way.",
      "Aquí puedes conectar un formulario, calendario de citas o CRM para recoger consultas\nde forma ordenada.",
      "Aqui você pode ligar um formulário, agenda de reuniões ou CRM para reunir consultas\nde forma organizada.",
      "هنا يمكن ربط نموذج أو تقويم مواعيد أو CRM لجمع الاستفسارات\nبشكل مرتّب.",
    ),
  "תכנית כושר אישית, מותאמת, סטודיו פרטי וחדר כושר פרימיום להצגת\nתוצאות אימון אמיתיות, מחירים והצטרפות מהירה.":
    r(
      "A personal, tailored fitness plan, a private studio, and a premium gym to show\nreal training results, prices, and fast signup.",
      "Un plan de fitness personal y a medida, un estudio privado y un gimnasio premium para mostrar\nresultados reales, precios y alta rápida.",
      "Um plano de fitness pessoal e sob medida, um estúdio privado e uma academia premium para mostrar\nresultados reais, preços e adesão rápida.",
      "خطة لياقة شخصية ومخصصة واستوديو خاص وصالة فاخرة لعرض\nنتائج تدريب حقيقية وأسعار وانضمام سريع.",
    ),
  "השאירו פרטים ונחזור אליכם לתיאום אימון ניסיון, התאמת מסלול או\nשיחת היכרות קצרה.":
    r(
      "Leave your details and we will get back to you to book a trial session, match a plan, or\nhold a short intro call.",
      "Dejad los datos y os responderemos para coordinar un entreno de prueba, ajustar un plan o\nuna llamada corta de presentación.",
      "Deixem os dados e voltaremos para agendar um treino experimental, ajustar um plano ou\numa conversa curta de apresentação.",
      "اتركوا التفاصيل وسنعود إليكم لتنسيق تدريب تجريبي أو ملاءمة مسار أو\nمكالمة تعارف قصيرة.",
    ),
  "תבנית פיטנס אנרגטית למאמנים, חדרי כושר וסטודיואים שרוצים אתר\nשמרגיש חזק, חי וממיר.":
    r(
      "An energetic fitness template for trainers, gyms, and studios that want a site\nthat feels strong, alive, and converting.",
      "Plantilla de fitness enérgica para entrenadores, gimnasios y estudios que quieren un sitio\nque se sienta fuerte, vivo y que convierta.",
      "Modelo de fitness energético para treinadores, academias e estúdios que querem um site\nque pareça forte, vivo e que converta.",
      "قالب لياقة طاقي للمدربين والصالات والاستوديوهات التي تريد موقعاً\nيشعر بالقوة والحياة ويحوّل الزوار.",
    ),
  "מבנה שמתאים לעסקים נותני שירות — עם שירותים ברורים, אמון, המלצות\nוטופס ליד שמוביל לפעולה.":
    r(
      "A layout that fits service businesses — with clear services, trust, testimonials,\nand a lead form that leads to action.",
      "Una estructura que encaja en negocios de servicios — con servicios claros, confianza, testimonios\ny un formulario de lead que lleva a la acción.",
      "Uma estrutura que serve negócios de serviço — com serviços claros, confiança, depoimentos\ne um formulário de lead que leva à ação.",
      "بنية تناسب أعمال الخدمات — مع خدمات واضحة وثقة وشهادات\nونموذج عميل محتمل يؤدي إلى الفعل.",
    ),
  "אפשר להחליף כאן טקסט, טלפון, כתובת, שעות פעילות ולחבר את הטופס\nלמערכת הלידים.":
    r(
      "You can replace the text, phone, address, and hours here, and connect the form\nto the leads system.",
      "Puedes cambiar aquí el texto, teléfono, dirección y horario, y conectar el formulario\nal sistema de leads.",
      "Você pode trocar aqui o texto, telefone, endereço e horário, e ligar o formulário\nao sistema de leads.",
      "يمكن استبدال النص والهاتف والعنوان وساعات العمل هنا وربط النموذج\nبنظام العملاء المحتملين.",
    ),
  "אנחנו הופכים רעיונות לחוויות ויזואליות קולנועיות. אסטרטגיה,\nצילום, הפקה ועריכה מתחברים יחד כדי ליצור תוכן שנראה חד,\nרגשי ופרימיום.":
    r(
      "We turn ideas into cinematic visual experiences. Strategy,\nphotography, production, and editing come together to create content that looks sharp,\nemotional, and premium.",
      "Convertimos ideas en experiencias visuales cinematográficas. Estrategia,\nfotografía, producción y edición se unen para crear contenido nítido,\nemocional y premium.",
      "Transformamos ideias em experiências visuais cinematográficas. Estratégia,\nfotografia, produção e edição se unem para criar conteúdo nítido,\nemocional e premium.",
      "نحوّل الأفكار إلى تجارب بصرية سينمائية. الاستراتيجية،\nالتصوير والإنتاج والمونتاج تلتقي لصناعة محتوى يبدو حاداً،\nعاطفياً وفاخراً.",
    ),
  "Adion הוא סטודיו ויזואלי לצלמים, יוצרי וידאו וצוותי הפקה שרוצים\nנוכחות דיגיטלית יוקרתית. התבנית משלבת טיפוגרפיה גדולה,\nתמונות חזקות ותנועה קולנועית.":
    r(
      "Adion is a visual studio for photographers, video creators, and production teams who want\na luxury digital presence. The template combines large type,\nstrong images, and cinematic motion.",
      "Adion es un estudio visual para fotógrafos, creadores de vídeo y equipos de producción que quieren\nuna presencia digital de lujo. La plantilla combina tipografía grande,\nimágenes fuertes y movimiento cinematográfico.",
      "Adion é um estúdio visual para fotógrafos, criadores de vídeo e equipes de produção que querem\numa presença digital de luxo. O modelo combina tipografia grande,\nimagens fortes e movimento cinematográfico.",
      "Adion استوديو بصري للمصورين وصنّاع الفيديو وفرق الإنتاج الذين يريدون\nحضوراً رقمياً فاخراً. يجمع القالب بين طباعة كبيرة،\nوصوراً قوية وحركة سينمائية.",
    ),
  "כל הזכויות שמורות.": r(
    "All rights reserved.",
    "Todos los derechos reservados.",
    "Todos os direitos reservados.",
    "جميع الحقوق محفوظة.",
  ),
  "כל הזכויות שמורות": r(
    "All rights reserved",
    "Todos los derechos reservados",
    "Todos os direitos reservados",
    "جميع الحقوق محفوظة",
  ),
  "נשלח — נחזור אליכם בקרוב": r(
    "Sent — we will get back to you soon",
    "Enviado — os responderemos pronto",
    "Enviado — voltaremos em breve",
    "أُرسل — سنعود إليكم قريباً",
  ),
  מודעות: r("Ads", "Anuncios", "Anúncios", "إعلانات"),
  רימרקטינג: r("Remarketing", "Remarketing", "Remarketing", "إعادة استهداف"),
  "מעגל כוח": r("Strength circuit", "Circuito de fuerza", "Circuito de força", "دائرة قوة"),
  "מערכת לידים ומכירות": r(
    "Leads and sales system",
    "Sistema de leads y ventas",
    "Sistema de leads e vendas",
    "منظومة عملاء محتملين ومبيعات",
  ),
  "בניית מסע לקוח ברור שמחבר בין טפסים, הודעות, פולואפים, אנשי מכירות ודשבורד אחד שמרכז את כל התמונה.":
    r(
      "Building a clear customer journey that connects forms, messages, follow-ups, salespeople, and one dashboard that holds the full picture.",
      "Construir un journey de cliente claro que conecta formularios, mensajes, seguimientos, comerciales y un dashboard que centraliza toda la imagen.",
      "Construir uma jornada de cliente clara que liga formulários, mensagens, follow-ups, vendedores e um dashboard que centraliza o quadro completo.",
      "بناء مسار عميل واضح يربط النماذج والرسائل والمتابعات ورجال المبيعات ولوحة واحدة تجمع الصورة كاملة.",
    ),
  "אוטומציות שירות": r(
    "Service automations",
    "Automatizaciones de servicio",
    "Automações de serviço",
    "أتمتة الخدمة",
  ),
  "תהליכים חכמים שמטפלים בפניות, תזכורות, עדכונים ופעולות חוזרות כדי שהצוות יתעסק במה שבאמת חשוב.":
    r(
      "Smart flows that handle inquiries, reminders, updates, and repeat actions so the team can focus on what actually matters.",
      "Flujos inteligentes que tratan consultas, recordatorios, actualizaciones y acciones repetidas para que el equipo se ocupe de lo que de verdad importa.",
      "Fluxos inteligentes que tratam consultas, lembretes, atualizações e ações repetidas para a equipe cuidar do que realmente importa.",
      "عمليات ذكية تعالج الاستفسارات والتذكيرات والتحديثات والإجراءات المتكررة حتى يهتم الفريق بما يهم فعلاً.",
    ),
  "חוויית לקוח דיגיטלית": r(
    "Digital customer experience",
    "Experiencia de cliente digital",
    "Experiência digital do cliente",
    "تجربة زبون رقمية",
  ),
  "עיצוב חוויה שמרגישה מהירה, יוקרתית וברורה — מהכניסה הראשונה ועד השארת פרטים או רכישה.":
    r(
      "Designing an experience that feels fast, premium, and clear — from the first visit to leaving details or buying.",
      "Diseñar una experiencia que se siente rápida, premium y clara — desde la primera entrada hasta dejar datos o comprar.",
      "Desenhar uma experiência que parece rápida, premium e clara — da primeira visita até deixar dados ou comprar.",
      "تصميم تجربة سريعة وفاخرة وواضحة — من أول دخول حتى ترك التفاصيل أو الشراء.",
    ),
  "חבילת Launch": r("Launch package", "Paquete Launch", "Pacote Launch", "باقة Launch"),
  "לעסק שרוצה להרים תשתית דיגיטלית חכמה ולהתחיל לנהל פניות בצורה מסודרת.":
    r(
      "For a business that wants to raise a smart digital foundation and start managing inquiries in an organized way.",
      "Para un negocio que quiere levantar una base digital inteligente y empezar a gestionar consultas de forma ordenada.",
      "Para um negócio que quer levantar uma base digital inteligente e começar a gerir consultas de forma organizada.",
      "لعمل يريد رفع بنية رقمية ذكية والبدء بإدارة الاستفسارات بشكل مرتّب.",
    ),
  "אפיון מסע לקוח": r("Customer-journey mapping", "Mapeo del journey", "Mapeamento da jornada", "توصيف مسار العميل"),
  "עמוד נחיתה ממיר": r("A converting landing page", "Landing que convierte", "Landing que converte", "صفحة هبوط محوّلة"),
  "חיבור טופס לידים": r("Lead-form connection", "Conexión de formulario de leads", "Ligação de formulário de leads", "ربط نموذج العملاء المحتملين"),
  "אוטומציית הודעת פתיחה": r("Opening-message automation", "Automatización del mensaje de apertura", "Automação da mensagem de abertura", "أتمتة رسالة الافتتاح"),
  "חבילת Scale": r("Scale package", "Paquete Scale", "Pacote Scale", "باقة Scale"),
  "לעסק שרוצה לחבר מכירות, שירות, תזכורות ודוחות למערכת אחת שעובדת ברקע.":
    r(
      "For a business that wants to connect sales, service, reminders, and reports into one system that works in the background.",
      "Para un negocio que quiere conectar ventas, servicio, recordatorios e informes en un sistema que trabaja en segundo plano.",
      "Para um negócio que quer ligar vendas, serviço, lembretes e relatórios em um sistema que trabalha em segundo plano.",
      "لعمل يريد ربط المبيعات والخدمة والتذكيرات والتقارير بمنظومة واحدة تعمل في الخلفية.",
    ),
  "בניית CRM תפעולי": r("Building an operational CRM", "Construir un CRM operativo", "Construir um CRM operacional", "بناء CRM تشغيلي"),
  "אוטומציות פולואפ": r("Follow-up automations", "Automatizaciones de follow-up", "Automações de follow-up", "أتمتة المتابعة"),
  "דשבורד ביצועים": r("Performance dashboard", "Dashboard de rendimiento", "Dashboard de desempenho", "لوحة أداء"),
  "תהליך עבודה לצוות": r("A team workflow", "Un flujo de trabajo para el equipo", "Um fluxo de trabalho para a equipe", "سير عمل للفريق"),
  "חבילת Flow": r("Flow package", "Paquete Flow", "Pacote Flow", "باقة Flow"),
  "לעסקים עם כמה מחלקות, מספר ערוצי פנייה ותהליכים מורכבים שדורשים מערכת מותאמת.":
    r(
      "For businesses with several departments, multiple inquiry channels, and complex processes that need a tailored system.",
      "Para negocios con varios departamentos, varios canales de consulta y procesos complejos que requieren un sistema a medida.",
      "Para negócios com várias áreas, vários canais de consulta e processos complexos que pedem um sistema sob medida.",
      "لأعمال بعدة أقسام وقنوات استفسار وعمليات معقّدة تحتاج منظومة مخصصة.",
    ),
  "מיפוי תהליכים מלא": r("Full process mapping", "Mapeo completo de procesos", "Mapeamento completo de processos", "تخطيط عمليات كامل"),
  "חיבור מערכות קיימות": r("Connecting existing systems", "Conectar sistemas existentes", "Ligar sistemas existentes", "ربط الأنظمة الحالية"),
  "אוטומציות מתקדמות": r("Advanced automations", "Automatizaciones avanzadas", "Automações avançadas", "أتمتة متقدمة"),
  "ליווי והטמעה לצוות": r("Team coaching and rollout", "Acompañamiento e implantación al equipo", "Acompanhamento e implantação para a equipe", "مرافقة وتثبيت للفريق"),
  "מכירות בלי בלגן": r("Sales without the mess", "Ventas sin lío", "Vendas sem bagunça", "مبيعات بلا فوضى"),
  "כל ליד מקבל טיפול, תיוג, תזכורת ופולואפ בלי לרדוף אחרי הודעות מפוזרות בין וואטסאפ, טפסים ומיילים.":
    r(
      "Every lead gets handling, tagging, a reminder, and a follow-up without chasing scattered messages across WhatsApp, forms, and email.",
      "Cada lead recibe trato, etiquetado, recordatorio y seguimiento sin perseguir mensajes dispersos entre WhatsApp, formularios y emails.",
      "Cada lead recebe atendimento, marcação, lembrete e follow-up sem correr atrás de mensagens espalhadas entre WhatsApp, formulários e e-mails.",
      "كل عميل محتمل يحصل على معالجة ووسم وتذكير ومتابعة دون ملاحقة رسائل مبعثرة بين واتساب والنماذج والبريد.",
    ),
  "דוחות שמספרים סיפור": r(
    "Reports that tell a story",
    "Informes que cuentan una historia",
    "Relatórios que contam uma história",
    "تقارير تروي قصة",
  ),
  "נתונים ברורים על פניות, סגירות, מקורות לידים, זמני תגובה והזדמנויות לשיפור.":
    r(
      "Clear data on inquiries, closes, lead sources, response times, and chances to improve.",
      "Datos claros sobre consultas, cierres, fuentes de leads, tiempos de respuesta y oportunidades de mejora.",
      "Dados claros sobre consultas, fechamentos, fontes de leads, tempos de resposta e oportunidades de melhoria.",
      "بيانات واضحة عن الاستفسارات والإغلاقات ومصادر العملاء المحتملين وأزمنة الرد وفرص التحسين.",
    ),
  "שירות מהיר יותר": r("Faster service", "Servicio más rápido", "Serviço mais rápido", "خدمة أسرع"),
  "פחות פעולות ידניות, פחות טעויות ויותר חוויית לקוח מקצועית מרגע הפנייה ועד סיום הטיפול.":
    r(
      "Fewer manual actions, fewer mistakes, and a more professional customer experience from the first inquiry to the end of handling.",
      "Menos acciones manuales, menos errores y más experiencia de cliente profesional desde la consulta hasta el final del trato.",
      "Menos ações manuais, menos erros e mais experiência profissional do cliente desde a consulta até o fim do atendimento.",
      "إجراءات يدوية أقل وأخطاء أقل وتجربة زبون أكثر احترافية من لحظة الاستفسار حتى نهاية المعالجة.",
    ),
  "מערכת שגדלה איתכם": r(
    "A system that grows with you",
    "Un sistema que crece con vosotros",
    "Um sistema que cresce com vocês",
    "منظومة تنمو معكم",
  ),
  "מבנה גמיש שאפשר להרחיב בהמשך לעמודים, תורים, חנות, קמפיינים, צוותים ואוטומציות נוספות.":
    r(
      "A flexible structure you can later expand to pages, queues, a store, campaigns, teams, and more automations.",
      "Una estructura flexible que luego se puede ampliar a páginas, colas, tienda, campañas, equipos y más automatizaciones.",
      "Uma estrutura flexível que depois pode expandir para páginas, filas, loja, campanhas, equipes e mais automações.",
      "بنية مرنة يمكن توسيعها لاحقاً إلى صفحات وطوابير ومتجر وحملات وفرق وأتمتة إضافية.",
    ),
  "איך להפוך לידים לשיחות מכירה אמיתיות": r(
    "How to turn leads into real sales conversations",
    "Cómo convertir leads en conversaciones de venta reales",
    "Como transformar leads em conversas de venda reais",
    "كيف نحوّل العملاء المحتملين إلى محادثات بيع حقيقية",
  ),
  "הדרך לבנות מסע קצר וברור שמקטין פספוסים ומעלה את אחוזי הסגירה.":
    r(
      "The way to build a short, clear journey that reduces missed leads and raises close rates.",
      "El camino para construir un journey corto y claro que reduce fallos y sube el cierre.",
      "O caminho para construir uma jornada curta e clara que reduz perdas e sobe o fechamento.",
      "الطريق لبناء مسار قصير وواضح يقلل الضياع ويرفع نسب الإغلاق.",
    ),
  "מה עסק קטן יכול לאוטומט כבר היום": r(
    "What a small business can automate today",
    "Qué puede automatizar hoy un negocio pequeño",
    "O que um negócio pequeno já pode automatizar hoje",
    "ما يمكن لعمل صغير أتمتته اليوم",
  ),
  "רעיונות פשוטים לתהליכים שחוסכים שעות עבודה ומשפרים את חוויית הלקוח.":
    r(
      "Simple ideas for flows that save work hours and improve the customer experience.",
      "Ideas simples para procesos que ahorran horas de trabajo y mejoran la experiencia del cliente.",
      "Ideias simples para processos que poupam horas de trabalho e melhoram a experiência do cliente.",
      "أفكار بسيطة لعمليات توفّر ساعات عمل وتحسّن تجربة الزبون.",
    ),
  "למה דשבורד טוב משנה החלטות": r(
    "Why a good dashboard changes decisions",
    "Por qué un buen dashboard cambia las decisiones",
    "Por que um bom dashboard muda decisões",
    "لماذا لوحة جيدة تغيّر القرارات",
  ),
  "כשכל הנתונים מול העיניים, קל יותר להבין מה עובד ומה חייב להשתנות.":
    r(
      "When all the data is in front of you, it is easier to see what works and what has to change.",
      "Cuando todos los datos están delante, es más fácil entender qué funciona y qué debe cambiar.",
      "Quando todos os dados estão à frente, fica mais fácil ver o que funciona e o que precisa mudar.",
      "عندما تكون كل البيانات أمام العين، يسهل فهم ما يعمل وما يجب أن يتغيّر.",
    ),
  "שנות ניסיון ויזואלי": r(
    "Years of visual experience",
    "Años de experiencia visual",
    "Anos de experiência visual",
    "سنوات خبرة بصرية",
  ),
  פרויקט: r("Project", "Proyecto", "Projeto", "مشروع"),
  "סרט מותג, חתונה, קמפיין...": r(
    "Brand film, wedding, campaign...",
    "Película de marca, boda, campaña...",
    "Filme de marca, casamento, campanha...",
    "فيلم علامة، حفل، حملة...",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique40.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique40 rows`);
