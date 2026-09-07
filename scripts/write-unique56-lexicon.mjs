/**
 * unique56 — leftover Markora, Glintica, Bladehaus, Lexhaven, Pulsefit,
 * Lenscraft, Numeris, and Formara seed/hardcoded chrome.
 * Skip personal names, streets, cities, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Markora
  "CRO ודפי נחיתה": r(
    "CRO and landing pages",
    "CRO y landing pages",
    "CRO e landing pages",
    "CRO وصفحات هبوط",
  ),
  "קמפיינים נבחרים": r(
    "Selected campaigns",
    "Campañas seleccionadas",
    "Campanhas selecionadas",
    "حملات مختارة",
  ),
  "השקת מוצר B2C ב-14 יום": r(
    "A B2C product launch in 14 days",
    "Lanzamiento de producto B2C en 14 días",
    "Lançamento de produto B2C em 14 dias",
    "إطلاق منتج B2C خلال 14 يوماً",
  ),
  "מייסד מותג DTC": r(
    "DTC brand founder",
    "Fundador de marca DTC",
    "Fundador de marca DTC",
    "مؤسس علامة DTC",
  ),
  "אם זה נראה כמו כולם,\nזה לא Markora.": r(
    "If it looks like everyone else,\nit's not Markora.",
    "Si parece como todos los demás,\nno es Markora.",
    "Se parece com todo mundo,\nnão é Markora.",
    "إذا بدا مثل الجميع،\nفهذا ليس Markora.",
  ),
  "מה אתם רוצים לשווק?": r(
    "What do you want to market?",
    "¿Qué queréis comercializar?",
    "O que vocês querem divulgar?",
    "ماذا تريدون تسويقه؟",
  ),

  // Glintica
  "חבילות מרובעות": r("Square packages", "Packs cuadrados", "Pacotes quadrados", "باقات مربعة"),
  "כלות מספרות": r("Brides tell their story", "Las novias cuentan", "Noivas contam", "عرائس يروين"),
  "הפקת אופנה": r("Fashion production", "Producción de moda", "Produção de moda", "إنتاج أزياء"),
  "אירוע ערב": r("Evening event", "Evento de noche", "Evento noturno", "مناسبة مسائية"),
  "האם יש פגישת ניסיון?": r(
    "Is there a trial session?",
    "¿Hay una sesión de prueba?",
    "Tem sessão experimental?",
    "هل هناك جلسة تجريبية؟",
  ),
  "יומן פתוח": r("Open calendar", "Agenda abierta", "Agenda aberta", "يومية مفتوحة"),
  "קבעו מועד": r("Book a date", "Reservad una fecha", "Marquem uma data", "احجزوا موعداً"),
  "רמת גן · ניידות לכל הארץ": r(
    "Ramat Gan · mobile nationwide",
    "Ramat Gan · movilidad a todo el país",
    "Ramat Gan · mobilidade para o país todo",
    "رمات غان · تنقّل لكل البلاد",
  ),
  "היום המושלם מתחיל באור הנכון.": r(
    "The perfect day starts with the right light.",
    "El día perfecto empieza con la luz correcta.",
    "O dia perfeito começa com a luz certa.",
    "اليوم المثالي يبدأ بالضوء الصحيح.",
  ),
  חצי: r("Half", "Mitad", "Meio", "منتصف"),
  "השוואת לפני ואחרי": r(
    "Before and after comparison",
    "Comparación antes y después",
    "Comparação antes e depois",
    "مقارنة قبل وبعد",
  ),
  "תאריך האירוע": r("Event date", "Fecha del evento", "Data do evento", "تاريخ المناسبة"),
  "מה תרצי שנדע?": r(
    "What would you like us to know?",
    "¿Qué te gustaría que sepamos?",
    "O que você quer que a gente saiba?",
    "ماذا تريدين أن نعرف؟",
  ),

  // Bladehaus (skip names שחר/אלון and Allenby address)
  הספרים: r("The barbers", "Los barberos", "Os barbeiros", "الحلاقون"),
  הכיסא: r("The chair", "La silla", "A cadeira", "الكرسي"),
  הלהב: r("The blade", "La hoja", "A lâmina", "النصل"),
  החדר: r("The room", "La sala", "A sala", "الغرفة"),
  מוצש: r("Sat night", "Sáb noche", "Sáb à noite", "مساء السبت"),
  בתיאום: r("By appointment", "Con cita", "Com agendamento", "بتنسيق مسبق"),
  "לקוח קבוע": r("Regular client", "Cliente habitual", "Cliente regular", "زبون ثابت"),
  "צריך לקבוע מראש?": r(
    "Do you need to book ahead?",
    "¿Hay que reservar con antelación?",
    "Precisa marcar com antecedência?",
    "هل يجب الحجز مسبقاً؟",
  ),
  "יש שירותי זקן?": r(
    "Are there beard services?",
    "¿Hay servicios de barba?",
    "Tem serviços de barba?",
    "هل هناك خدمات لحية؟",
  ),
  "שמרו מקום": r("Hold a seat", "Reservad sitio", "Guarden um lugar", "احجزوا مكاناً"),
  "תור עכשיו": r("Book now", "Cita ahora", "Horário agora", "موعد الآن"),
  "שירות מבוקש": r("Requested service", "Servicio solicitado", "Serviço pedido", "خدمة مطلوبة"),

  // Lexhaven (skip names and Rothschild address)
  "תהליך הליווי": r("The guidance process", "El proceso de acompañamiento", "O processo de acompanhamento", "عملية المرافقة"),
  "בקשת ייעוץ ראשוני": r(
    "Request an initial consultation",
    "Pedir una consulta inicial",
    "Pedir uma consulta inicial",
    "طلب استشارة أولى",
  ),
  "שותף, חברות": r("Partner, corporate", "Socio, sociedades", "Sócio, sociedades", "شريك، شركات"),
  פעולה: r("Action", "Acción", "Ação", "فعل"),
  "ספרו לנו בקצרה על הסוגיה": r(
    "Tell us briefly about the issue",
    "Contadnos en breve la cuestión",
    "Contem em breve sobre a questão",
    "أخبرونا باختصار عن المسألة",
  ),

  // Pulsefit (skip name ליאור)
  "תוצאות בשטח": r("Results in the field", "Resultados en el terreno", "Resultados no campo", "نتائج في الميدان"),
  "לפני / אחרי — שינוי של 90 יום": r(
    "Before / after — a 90-day change",
    "Antes / después — un cambio de 90 días",
    "Antes / depois — uma mudança de 90 dias",
    "قبل / بعد — تغيير خلال 90 يوماً",
  ),
  חיטוב: r("Toning", "Definición", "Definição", "نحت"),
  "12 שבועות / כוח": r("12 weeks / strength", "12 semanas / fuerza", "12 semanas / força", "12 أسبوعاً / قوة"),
  "Reset אישי": r("Personal reset", "Reset personal", "Reset pessoal", "إعادة ضبط شخصية"),
  "ליווי 1:1": r("1:1 coaching", "Acompañamiento 1:1", "Acompanhamento 1:1", "مرافقة 1:1"),
  "דירוג ממוצע אחרי 30 ימים": r(
    "Average rating after 30 days",
    "Valoración media a los 30 días",
    "Nota média depois de 30 dias",
    "تقييم متوسط بعد 30 يوماً",
  ),
  "סוף סוף יש מספרים.": r(
    "Finally there are numbers.",
    "Por fin hay números.",
    "Finalmente há números.",
    "أخيراً هناك أرقام.",
  ),
  "מתחילים באבחון קצר.": r(
    "We start with a short assessment.",
    "Empezamos con un diagnóstico breve.",
    "Começamos com um diagnóstico curto.",
    "نبدأ بتشخيص قصير.",
  ),
  "אולפן כוח · תל אביב": r(
    "Power studio · Tel Aviv",
    "Estudio de fuerza · Tel Aviv",
    "Estúdio de força · Tel Aviv",
    "استوديو قوة · تل أبيب",
  ),
  "הגוף הבא שלכם מחכה לאימון הראשון.": r(
    "Your next body is waiting for the first session.",
    "Vuestro siguiente cuerpo espera el primer entrenamiento.",
    "O próximo corpo de vocês espera o primeiro treino.",
    "جسمكم التالي ينتظر التمرين الأول.",
  ),
  "מטרה: חיטוב / כוח / כושר": r(
    "Goal: tone / strength / fitness",
    "Objetivo: definición / fuerza / forma",
    "Meta: definição / força / condicionamento",
    "هدف: نحت / قوة / لياقة",
  ),
  "מה חייב להשתנות ב-90 הימים הקרובים?": r(
    "What must change in the next 90 days?",
    "¿Qué tiene que cambiar en los próximos 90 días?",
    "O que precisa mudar nos próximos 90 dias?",
    "ماذا يجب أن يتغيّر في الـ90 يوماً القادمة؟",
  ),

  // Lenscraft
  "סטים מוכנים לצילום": r(
    "Sets ready for a shoot",
    "Sets listos para fotografiar",
    "Sets prontos para fotografar",
    "مجموعات جاهزة للتصوير",
  ),
  "צילום מוצר": r("Product photography", "Fotografía de producto", "Fotografia de produto", "تصوير منتجات"),
  "צילום מותג": r("Brand photography", "Fotografía de marca", "Fotografia de marca", "تصوير علامة"),
  "אירועים והשקות": r("Events and launches", "Eventos y lanzamientos", "Eventos e lançamentos", "مناسبات وإطلاقات"),
  "תוכן לרשתות": r("Social content", "Contenido para redes", "Conteúdo para redes", "محتوى للشبكات"),
  "גלריה נבחרת": r("Selected gallery", "Galería seleccionada", "Galeria selecionada", "معرض مختار"),
  "חבילות צילום": r("Photo packages", "Packs de foto", "Pacotes de foto", "باقات تصوير"),
  בריף: r("Brief", "Brief", "Brief", "موجز"),
  "מייסד North Coffee": r(
    "Founder, North Coffee",
    "Fundador, North Coffee",
    "Fundador, North Coffee",
    "مؤسس، North Coffee",
  ),
  "בואו נבנה יום צילום": r(
    "Let's build a shoot day",
    "Construyamos un día de foto",
    "Vamos construir um dia de foto",
    "لنبنِ يوم تصوير",
  ),
  "איזה צילום אתם צריכים?": r(
    "What kind of photography do you need?",
    "¿Qué fotografía necesitáis?",
    "Que tipo de fotografia vocês precisam?",
    "أي تصوير تحتاجون؟",
  ),

  // Numeris
  "דוחות הנהלה": r("Management reports", "Informes de dirección", "Relatórios de direção", "تقارير إدارة"),
  "שנות ניסיון מקצועי": r(
    "Years of professional experience",
    "Años de experiencia profesional",
    "Anos de experiência profissional",
    "سنوات خبرة مهنية",
  ),
  עצמאי: r("Freelance", "Autónomo", "Autônomo", "مستقل"),
  "עד 60 מסמכים בחודש": r(
    "Up to 60 documents a month",
    "Hasta 60 documentos al mes",
    "Até 60 documentos por mês",
    "حتى 60 مستنداً في الشهر",
  ),
  "צוות קטן": r("Small team", "Equipo pequeño", "Equipe pequena", "فريق صغير"),
  "עד 5 עובדים": r("Up to 5 employees", "Hasta 5 empleados", "Até 5 funcionários", "حتى 5 موظفين"),
  "רשות המסים": r("Tax Authority", "Agencia tributaria", "Receita federal", "سلطة الضرائب"),
  "ביטוח לאומי": r("National Insurance", "Seguridad Social", "Previdência", "التأمين الوطني"),
  "לקוחות שמרגישים שליטה": r(
    "Clients who feel in control",
    "Clientes que sienten control",
    "Clientes que sentem controle",
    "عملاء يشعرون بالسيطرة",
  ),
  "בעלים, סטודיו לעיצוב": r(
    "Owner, design studio",
    "Propietario, estudio de diseño",
    "Dono, estúdio de design",
    "مالك، استوديو تصميم",
  ),
  "מנכ״ל, חברת SaaS": r(
    "CEO, SaaS company",
    "CEO, empresa SaaS",
    "CEO, empresa SaaS",
    "المدير التنفيذي، شركة SaaS",
  ),
  "מתחילים בבדיקת מצב קצרה": r(
    "We start with a short status check",
    "Empezamos con una revisión breve",
    "Começamos com uma checagem curta",
    "نبدأ بفحص وضع قصير",
  ),
  "רחובות · שירות ארצי אונליין": r(
    "Rehovot · nationwide online service",
    "Rehovot · servicio nacional online",
    "Rehovot · serviço nacional online",
    "رحوفوت · خدمة وطنية عبر الإنترنت",
  ),
  "דוח חודשי": r("Monthly report", "Informe mensual", "Relatório mensal", "تقرير شهري"),
  "כמה עובדים / חשבוניות בחודש?": r(
    "How many employees / invoices a month?",
    "¿Cuántos empleados / facturas al mes?",
    "Quantos funcionários / notas por mês?",
    "كم موظفاً / فاتورة في الشهر؟",
  ),

  // Formara (skip name רוני אלדר)
  "שירותי סטודיו": r("Studio services", "Servicios de estudio", "Serviços de estúdio", "خدمات استوديو"),
  "דירות בוטיק": r("Boutique apartments", "Pisos boutique", "Apartamentos boutique", "شقق بوتيك"),
  "דירת גן בכרם התימנים": r(
    "Garden apartment in Kerem HaTeimanim",
    "Piso jardín en Kerem HaTeimanim",
    "Apartamento jardim em Kerem HaTeimanim",
    "شقة حديقة في كيرم هتيمانيم",
  ),
  "קו עיצובי של Formara": r(
    "Formara's design line",
    "La línea de diseño de Formara",
    "A linha de design da Formara",
    "خط تصميم Formara",
  ),
  "קריאת חלל": r("Reading the space", "Lectura del espacio", "Leitura do espaço", "قراءة الفراغ"),
  חימר: r("Clay", "Arcilla", "Argila", "طين"),
  "מילים מהשטח": r("Words from the field", "Palabras del terreno", "Palavras do campo", "كلمات من الميدان"),
  "לקוחות מספרים בשקט": r(
    "Clients speak quietly",
    "Los clientes cuentan en silencio",
    "Os clientes contam em silêncio",
    "العملاء يروون بهدوء",
  ),
  "דירת גן בתל אביב": r(
    "Garden apartment in Tel Aviv",
    "Piso jardín en Tel Aviv",
    "Apartamento jardim em Tel Aviv",
    "شقة حديقة في تل أبيب",
  ),
  "ספרו לנו על החלל": r(
    "Tell us about the space",
    "Contadnos sobre el espacio",
    "Contem sobre o espaço",
    "أخبرونا عن الفراغ",
  ),
  "החלל הבא שלכם מתחיל בקו חומר אחד.": r(
    "Your next space starts with one material line.",
    "Vuestro siguiente espacio empieza con una línea de material.",
    "O próximo espaço de vocês começa com uma linha de material.",
    "فراغكم التالي يبدأ بخط مادة واحد.",
  ),
  "מה תרצו לעצב?": r(
    "What would you like to design?",
    "¿Qué os gustaría diseñar?",
    "O que vocês querem desenhar?",
    "ماذا تريدون تصميمه؟",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique56.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique56 rows`);
