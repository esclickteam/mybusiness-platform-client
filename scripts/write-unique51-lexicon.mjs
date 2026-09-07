/**
 * unique51 — leftover Cyclora, Chanel, and Aurelia preview chrome.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff, and brand names שאנל/סיקלורה/אורליה.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Cyclora hero + strategy
  "שיווק חכם": r("Smart marketing", "Marketing inteligente", "Marketing inteligente", "تسويق ذكي"),
  "חוויית שיווק מבוססת נתונים": r(
    "A data-driven marketing experience",
    "Una experiencia de marketing basada en datos",
    "Uma experiência de marketing baseada em dados",
    "تجربة تسويق مبنية على البيانات",
  ),
  "שנבנתה לצמיחה.": r(
    "built for growth.",
    "construida para crecer.",
    "feita para crescer.",
    "بُنيت للنمو.",
  ),
  "אסטרטגיה, אוטומציות, קריאייטיב ומדידה מתחברים למערכת אחת שמקדמת את העסק מהר יותר.": r(
    "Strategy, automations, creative, and measurement connect into one system that moves the business faster.",
    "Estrategia, automatizaciones, creativo y medición se conectan en un sistema que impulsa el negocio más rápido.",
    "Estratégia, automações, criativo e medição se conectam num sistema que impulsiona o negócio mais rápido.",
    "الاستراتيجية والأتمتة والإبداع والقياس تتصل في منظومة واحدة تدفع العمل أسرع.",
  ),
  "המשיכו לגלול": r("Keep scrolling", "Seguid bajando", "Continuem rolando", "تابعوا التمرير"),
  "מעטפת שיווקית לעסקים שרוצים לעבוד מדויק, להיראות מקצועיים ולהפוך יותר עניין להכנסות.": r(
    "A marketing wrap for businesses that want to work precisely, look professional, and turn more interest into revenue.",
    "Una envoltura de marketing para negocios que quieren trabajar con precisión, verse profesionales y convertir más interés en ingresos.",
    "Uma envoltória de marketing para negócios que querem trabalhar com precisão, parecer profissionais e transformar mais interesse em receita.",
    "غلاف تسويقي لأعمال تريد العمل بدقة وتبدو مهنية وتحوّل مزيداً من الاهتمام إلى إيراد.",
  ),
  "✦ נבחרים על ידי צוותים שממוקדים בצמיחה.": r(
    "✦ Chosen by teams focused on growth.",
    "✦ Elegidos por equipos centrados en el crecimiento.",
    "✦ Escolhidos por equipes focadas em crescimento.",
    "✦ يختارهم فرق تركّز على النمو.",
  ),
  "נבחרים על ידי צוותים שממוקדים בצמיחה.": r(
    "Chosen by teams focused on growth.",
    "Elegidos por equipos centrados en el crecimiento.",
    "Escolhidos por equipes focadas em crescimento.",
    "يختارهم فرق تركّز على النمو.",
  ),
  "הפתרונות שלנו": r("Our solutions", "Nuestras soluciones", "Nossas soluções", "حلولنا"),
  "אסטרטגיות שגדלות איתכם": r(
    "Strategies that grow with you",
    "Estrategias que crecen con vosotros",
    "Estratégias que crescem com vocês",
    "استراتيجيات تنمو معكم",
  ),
  "שגדלות איתכם": r(
    "that grow with you",
    "que crecen con vosotros",
    "que crescem com vocês",
    "تنمو معكم",
  ),
  "אוטומציה חכמה": r("Smart automation", "Automatización inteligente", "Automação inteligente", "أتمتة ذكية"),
  תהליכים: r("Processes", "Procesos", "Processos", "عمليات"),
  "מערכי לידים, ניהול לקוחות ותהליכים אוטומטיים שמורידים עומס ומקצרים זמני תגובה.": r(
    "Lead systems, client management, and automated processes that cut overload and shorten response times.",
    "Sistemas de leads, gestión de clientes y procesos automáticos que bajan la carga y acortan los tiempos de respuesta.",
    "Sistemas de leads, gestão de clientes e processos automáticos que reduzem sobrecarga e encurtam o tempo de resposta.",
    "منظومات عملاء محتملين وإدارة زبائن وعمليات مؤتمتة تخفّض العبء وتقصر زمن الرد.",
  ),
  "זמן טיפול": r("handling time", "tiempo de gestión", "tempo de atendimento", "وقت المعالجة"),
  "-61% זמן טיפול": r("-61% handling time", "-61% tiempo de gestión", "-61% tempo de atendimento", "-61% وقت المعالجة"),
  "תובנות בזמן אמת": r("Real-time insights", "Insights en tiempo real", "Insights em tempo real", "رؤى فورية"),
  "דשבורדים ותובנות שמראים מה באמת עובד, איפה נשרף תקציב ומה הצעד הבא.": r(
    "Dashboards and insights that show what really works, where budget burns, and what the next step is.",
    "Dashboards e insights que muestran qué funciona de verdad, dónde se quema presupuesto y cuál es el siguiente paso.",
    "Dashboards e insights que mostram o que realmente funciona, onde o orçamento queima e qual é o próximo passo.",
    "لوحات ورؤى تُظهر ما الذي يعمل حقاً وأين يُحرق الميزانية وما الخطوة التالية.",
  ),
  "לקוחות • 4.9/5": r("clients • 4.9/5", "clientes • 4.9/5", "clientes • 4.9/5", "زبائن • 4.9/5"),
  "200+ לקוחות • 4.9/5": r("200+ clients • 4.9/5", "200+ clientes • 4.9/5", "200+ clientes • 4.9/5", "200+ زبائن • 4.9/5"),
  "תכנון צמיחה": r("Growth planning", "Planificación de crecimiento", "Planejamento de crescimento", "تخطيط النمو"),
  "תוכנית מותאמת לעסק עם מסרים, הצעה, משפך ותעדוף שמייצרים צמיחה יציבה.": r(
    "A plan fitted to the business with messages, offer, funnel, and priorities that create stable growth.",
    "Un plan adaptado al negocio con mensajes, oferta, embudo y prioridades que generan crecimiento estable.",
    "Um plano ajustado ao negócio com mensagens, oferta, funil e prioridades que geram crescimento estável.",
    "خطة ملائمة للعمل مع رسائل وعرض وقمع وأولويات تصنع نمواً ثابتاً.",
  ),
  "תוכנית 90 יום": r("A 90-day plan", "Un plan de 90 días", "Um plano de 90 dias", "خطة 90 يوماً"),
  "מיקוד מדויק": r("Precise targeting", "Enfoque preciso", "Foco preciso", "تركيز دقيق"),
  פרסום: r("Advertising", "Publicidad", "Publicidade", "إعلان"),
  "קמפיינים מדויקים שמחברים בין קריאייטיב חזק, קהלים נכונים ומדידה אמיתית.": r(
    "Precise campaigns that connect strong creative, the right audiences, and real measurement.",
    "Campañas precisas que conectan creativo fuerte, audiencias correctas y medición real.",
    "Campanhas precisas que ligam criativo forte, públicos certos e medição real.",
    "حملات دقيقة تربط إبداعاً قوياً وجمهوراً صحيحاً وقياساً حقيقياً.",
  ),
  "החזר פי 4.8": r("4.8x return", "Retorno x4.8", "Retorno 4,8x", "عائد 4.8 ضعف"),
  אינסטגרם: r("Instagram", "Instagram", "Instagram", "Instagram"),
  לינקדאין: r("LinkedIn", "LinkedIn", "LinkedIn", "LinkedIn"),
  פייסבוק: r("Facebook", "Facebook", "Facebook", "Facebook"),

  // Chanel first-screen + catalog chrome (skip brand שאנל)
  "משלוח חינם לכל הארץ · קולקציית אביב 2026 כאן": r(
    "Free shipping nationwide · Spring 2026 collection is here",
    "Envío gratis a todo el país · La colección primavera 2026 ya está aquí",
    "Frete grátis para o país todo · A coleção primavera 2026 já chegou",
    "شحن مجاني لكل البلاد · مجموعة ربيع 2026 هنا",
  ),
  "גלו עכשיו": r("Discover now", "Descubrid ahora", "Descubram agora", "اكتشفوا الآن"),
  הצטרפו: r("Join", "Uníos", "Entrem", "انضموا"),
  "קולקציית אביב 2026": r("Spring 2026 collection", "Colección primavera 2026", "Coleção primavera 2026", "مجموعة ربيع 2026"),
  אלגנטיות: r("Elegance", "Elegancia", "Elegância", "أناقة"),
  "שעוצבת לנצח": r("designed to last", "diseñada para durar", "desenhada para durar", "مصمّمة لتدوم"),
  "תיקים, תכשיטים ואקססוריז מעור יוקרתי — מיוצרים בקפידה באיטליה ומגיעים אליכם עם חוויית רכישה פרימיום.": r(
    "Bags, jewelry, and accessories in luxury leather — made carefully in Italy and delivered with a premium shopping experience.",
    "Bolsos, joyas y accesorios de cuero de lujo — hechos con cuidado en Italia y llegan con una experiencia de compra premium.",
    "Bolsas, joias e acessórios de couro de luxo — feitos com cuidado na Itália e chegam com uma experiência de compra premium.",
    "حقائب ومجوهرات وإكسسوارات من جلد فاخر — تُصنع بعناية في إيطاليا وتصل بتجربة شراء فاخرة.",
  ),
  "לקולקציה החדשה": r("To the new collection", "A la nueva colección", "Para a coleção nova", "إلى المجموعة الجديدة"),
  "גלו את העולם שלנו": r("Discover our world", "Descubrid nuestro mundo", "Descubram nosso mundo", "اكتشفوا عالمنا"),
  "העולם שלנו": r("our world", "nuestro mundo", "nosso mundo", "عالمنا"),
  "תיקי עור": r("Leather bags", "Bolsos de cuero", "Bolsas de couro", "حقائب جلد"),
  "עיצוב מינימליסטי עם גימור ידני מושלם": r(
    "Minimal design with a perfect hand finish",
    "Diseño minimalista con un acabado manual perfecto",
    "Design minimalista com acabamento manual perfeito",
    "تصميم بسيط مع تشطيب يدوي مثالي",
  ),
  "זהב מבריק ופנינים נבחרות לכל אירוע": r(
    "Bright gold and selected pearls for every occasion",
    "Oro brillante y perlas seleccionadas para cada ocasión",
    "Ouro brilhante e pérolas escolhidas para cada ocasião",
    "ذهب لامع ولآلئ مختارة لكل مناسبة",
  ),
  "מנגנון שוויצרי ועיצוב קלאסי לדור הבא": r(
    "A Swiss movement and classic design for the next generation",
    "Mecanismo suizo y diseño clásico para la próxima generación",
    "Mecanismo suíço e design clássico para a próxima geração",
    "حركة سويسرية وتصميم كلاسيكي للجيل التالي",
  ),
  "חגורות, צעיפים ופריטים משלימים ללוק מושלם": r(
    "Belts, scarves, and finishing pieces for a complete look",
    "Cinturones, pañuelos y piezas que cierran un look perfecto",
    "Cintos, lenços e peças que fecham um look perfeito",
    "أحزمة وأوشحة وقطع تكمل إطلالة كاملة",
  ),
  מומלצים: r("Featured", "Destacados", "Em destaque", "مختارة"),
  "תיק קלאסיקה קטן": r("Small classic bag", "Bolso clásico pequeño", "Bolsa clássica pequena", "حقيبة كلاسيكية صغيرة"),
  "שרשרת פנינה מעוצבת": r("Designed pearl necklace", "Collar de perlas diseñado", "Colar de pérolas desenhado", "عقد لؤلؤ مصمّم"),
  "שעון אובל דה-לוקס": r("Deluxe oval watch", "Reloj oval de lujo", "Relógio oval deluxe", "ساعة بيضاوية فاخرة"),
  "ארנק עור מרובע": r("Square leather wallet", "Cartera de cuero cuadrada", "Carteira de couro quadrada", "محفظة جلد مربّعة"),
  "עגילי זהב מעוטרים": r("Ornamented gold earrings", "Pendientes de oro ornamentados", "Brincos de ouro ornamentados", "أقراط ذهب مزخرفة"),
  "צעיף משי פרימיום": r("Premium silk scarf", "Pañuelo de seda premium", "Lenço de seda premium", "وشاح حرير فاخر"),
  "הערכים שלנו": r("Our values", "Nuestros valores", "Nossos valores", "قيمنا"),
  "בלי פשרות": r("without compromise", "sin concesiones", "sem concessões", "بلا تنازل"),
  "איכות ללא פשרות": r("Uncompromising quality", "Calidad sin concesiones", "Qualidade sem concessões", "جودة بلا تنازل"),
  "חומרי גלם נבחרים ותהליכי ייצור מוקפדים בכל שלב.": r(
    "Selected materials and careful production at every step.",
    "Materias primas seleccionadas y procesos de fabricación cuidadosos en cada etapa.",
    "Matérias-primas escolhidas e processos de fabricação cuidadosos em cada etapa.",
    "مواد خام مختارة وعمليات تصنيع دقيقة في كل مرحلة.",
  ),
  "ייצור אחראי": r("Responsible production", "Producción responsable", "Produção responsável", "تصنيع مسؤول"),
  "שקיפות מלאה בשרשרת האספקה ומחויבות לקיימות.": r(
    "Full supply-chain transparency and a commitment to sustainability.",
    "Transparencia total en la cadena de suministro y compromiso con la sostenibilidad.",
    "Transparência total na cadeia de suprimento e compromisso com a sustentabilidade.",
    "شفافية كاملة في سلسلة التوريد والتزام بالاستدامة.",
  ),
  "עיצוב נצחי": r("Timeless design", "Diseño eterno", "Design atemporal", "تصميم خالد"),
  "קווים נקיים שעוברים מעונות ונשארים רלוונטיים.": r(
    "Clean lines that move through seasons and stay relevant.",
    "Líneas limpias que atraviesan temporadas y siguen siendo relevantes.",
    "Linhas limpas que atravessam temporadas e continuam relevantes.",
    "خطوط نظيفة تعبر المواسم وتبقى ذات صلة.",
  ),

  // Aurelia leftover body
  "חומרי גלם": r("Ingredients", "Materias primas", "Ingredientes", "مواد خام"),
  "עונתיים, מקומיים וטריים בכל בוקר": r(
    "Seasonal, local, and fresh every morning",
    "De temporada, locales y frescos cada mañana",
    "Sazonais, locais e frescos toda manhã",
    "موسمية ومحلية وطيبة كل صباح",
  ),
  "מטבח פתוח": r("Open kitchen", "Cocina abierta", "Cozinha aberta", "مطبخ مفتوح"),
  "שקיפות מלאה מהאש ועד הצלחת": r(
    "Full transparency from the fire to the plate",
    "Transparencia total del fuego al plato",
    "Transparência total do fogo até o prato",
    "شفافية كاملة من النار حتى الطبق",
  ),
  "אירוח חם": r("Warm hospitality", "Hospitalidad cálida", "Hospitalidade calorosa", "ضيافة دافئة"),
  "שירות אישי שמרגיש כמו בבית": r(
    "Personal service that feels like home",
    "Un servicio personal que se siente como en casa",
    "Um serviço pessoal que parece casa",
    "خدمة شخصية تشعر وكأنها بيت",
  ),
  "מוכנים לערב?": r("Ready for the evening?", "¿Listos para la noche?", "Prontos para a noite?", "مستعدون لليلة؟"),
  "שולחן מחכה לכם.": r(
    "A table is waiting for you.",
    "Hay una mesa esperándoos.",
    "Uma mesa espera por vocês.",
    "طاولة بانتظاركم.",
  ),
  "תבנית Aurelia · Bizuply Studio": r(
    "Aurelia template · Bizuply Studio",
    "Plantilla Aurelia · Bizuply Studio",
    "Modelo Aurelia · Bizuply Studio",
    "قالب Aurelia · Bizuply Studio",
  ),
  "נשמור לכם ערב מושלם.": r(
    "We'll save you a perfect evening.",
    "Os guardaremos una noche perfecta.",
    "Vamos guardar uma noite perfeita para vocês.",
    "سنحفظ لكم أمسية مثالية.",
  ),
  "מספר סועדים": r("Number of guests", "Número de comensales", "Número de pessoas", "عدد الضيوف"),
  "2 סועדים": r("2 guests", "2 comensales", "2 pessoas", "ضيفان"),
  "3-4 סועדים": r("3-4 guests", "3-4 comensales", "3-4 pessoas", "3-4 ضيوف"),
  "5-6 סועדים": r("5-6 guests", "5-6 comensales", "5-6 pessoas", "5-6 ضيوف"),
  "7+ / אירוע": r("7+ / event", "7+ / evento", "7+ / evento", "7+ / مناسبة"),
  "בקשות מיוחדות": r("Special requests", "Peticiones especiales", "Pedidos especiais", "طلبات خاصة"),
  כתובת: r("Address", "Dirección", "Endereço", "عنوان"),
  "א׳–ה׳ 18:00–23:30 · ו׳–ש׳ 12:00–23:30": r(
    "Sun–Thu 18:00–23:30 · Fri–Sat 12:00–23:30",
    "Dom–jue 18:00–23:30 · vie–sáb 12:00–23:30",
    "Dom–qui 18:00–23:30 · sex–sáb 12:00–23:30",
    "أحد–خميس 18:00–23:30 · جمعة–سبت 12:00–23:30",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique51.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique51 rows`);
