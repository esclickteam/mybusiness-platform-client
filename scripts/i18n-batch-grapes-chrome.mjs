function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

function pickNested(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([id, fields]) => [
      id,
      Object.fromEntries(
        Object.entries(fields).map(([field, value]) => [field, value[locale] || value.en])
      ),
    ])
  );
}

const KIND_EXTRA = {
  savedSections: row("Saved sections", "סקשנים שמורים", "Secciones guardadas", "Seções salvas", "أقسام محفوظة"),
};

const NAV = {
  home: row("Home", "דף הבית", "Inicio", "Início", "الرئيسية"),
  about: row("About", "אודות", "Acerca de", "Sobre", "حول"),
  services: row("Services", "שירותים", "Servicios", "Serviços", "خدمات"),
  gallery: row("Gallery", "גלריה", "Galería", "Galeria", "معرض"),
  products: row("Products", "מוצרים", "Productos", "Produtos", "منتجات"),
  contact: row("Contact", "צור קשר", "Contacto", "Contato", "تواصل"),
  booking: row("Bookings", "תורים", "Citas", "Horários", "مواعيد"),
  cart: row("Cart", "עגלה", "Carrito", "Carrinho", "سلة"),
  store: row("Store", "חנות", "Tienda", "Loja", "متجر"),
  businessName: row("Business name", "שם העסק", "Nombre del negocio", "Nome do negócio", "اسم العمل"),
  businessField: row("Business field", "תחום העסק", "Área del negocio", "Área do negócio", "مجال العمل"),
};

const EMPTY_PAGE = {
  sectionTitle: row("Empty page", "עמוד ריק", "Página vacía", "Página vazia", "صفحة فارغة"),
  heading: row("New page", "עמוד חדש", "Página nueva", "Nova página", "صفحة جديدة"),
  hint: row(
    "Start adding sections from the side menu.",
    "התחילי להוסיף סקשנים מהתפריט בצד.",
    "Empieza a añadir secciones desde el menú lateral.",
    "Comece a adicionar seções pelo menu lateral.",
    "ابدئي بإضافة أقسام من القائمة الجانبية."
  ),
};

const SEED = {
  readyTitle: row("Ready business website", "אתר עסקי מוכן", "Sitio de negocio listo", "Site de negócio pronto", "موقع عمل جاهز"),
  readySubtitle: row(
    "A ready website template you can fully edit.",
    "תבנית אתר מוכנה לעריכה מלאה.",
    "Una plantilla de sitio lista para editar por completo.",
    "Um modelo de site pronto para edição completa.",
    "قالب موقع جاهز للتحرير بالكامل."
  ),
  blockHint: row(
    "A ready block from the template. Select it to edit texts, colors, and images.",
    "בלוק מוכן מתוך התבנית. אפשר לבחור אותו, לערוך טקסטים, לשנות צבעים ולהחליף תמונות.",
    "Un bloque listo de la plantilla. Selecciónalo para editar textos, colores e imágenes.",
    "Um bloco pronto do modelo. Selecione para editar textos, cores e imagens.",
    "كتلة جاهزة من القالب. اختاريها لتحرير النصوص والألوان والصور."
  ),
  mySite: row("My website", "האתר שלי", "Mi sitio", "Meu site", "موقعي"),
  variableN: row("Variable {{count}}", "משתנה {{count}}", "Variable {{count}}", "Variável {{count}}", "متغير {{count}}"),
};

const GRAPES = {
  sectionsCategory: row("Sections / {{label}}", "סקשנים / {{label}}", "Secciones / {{label}}", "Seções / {{label}}", "أقسام / {{label}}"),
  colorsBg: row("Colors and background", "צבעים ורקע", "Colores y fondo", "Cores e fundo", "ألوان وخلفية"),
  typography: row("Typography", "טיפוגרפיה", "Tipografía", "Tipografia", "طباعة"),
  sizePosition: row("Size and position", "גודל ומיקום", "Tamaño y posición", "Tamanho e posição", "الحجم والموضع"),
  flexGrid: row("Flex / Grid", "Flex / Grid", "Flex / Grid", "Flex / Grid", "Flex / Grid"),
  spacing: row("Spacing", "מרווחים", "Espaciado", "Espaçamento", "تباعد"),
  cornersBorderShadow: row("Corners, border and shadow", "פינות, גבול וצל", "Esquinas, borde y sombra", "Cantos, borda e sombra", "زوايا وحد وظل"),
  effectsMotion: row("Effects and motion", "אפקטים ותנועה", "Efectos y movimiento", "Efeitos e movimento", "تأثيرات وحركة"),
  effects: row("Effects", "אפקטים", "Efectos", "Efeitos", "تأثيرات"),
  colors: row("Colors", "צבעים", "Colores", "Cores", "ألوان"),
  styleEmpty: row("Select an element to edit design", "בחרי אלמנט כדי לערוך עיצוב", "Selecciona un elemento para editar el diseño", "Selecione um elemento para editar o design", "اختاري عنصراً لتعديل التصميم"),
  traitsEmpty: row("Select an element to edit settings", "בחרי אלמנט כדי לערוך הגדרות", "Selecciona un elemento para editar ajustes", "Selecione um elemento para editar configurações", "اختاري عنصراً لتعديل الإعدادات"),
  addImage: row("Add image", "הוספת תמונה", "Añadir imagen", "Adicionar imagem", "إضافة صورة"),
  mediaSource: row("Media source", "מקור מדיה", "Origen de media", "Origem da mídia", "مصدر الوسائط"),
  imageUrl: row("Image URL", "כתובת תמונה", "URL de imagen", "URL da imagem", "رابط الصورة"),
  mediaModal: row("Media manager", "ניהול מדיה", "Gestor de media", "Gerenciador de mídia", "إدارة الوسائط"),
  uploadDrop: row("Drop images or videos here", "גררי תמונות או סרטונים לכאן", "Suelta imágenes o vídeos aquí", "Solte imagens ou vídeos aqui", "اسحبي صوراً أو فيديوهات هنا"),
  uploadDropImages: row("Drop images here", "גררי תמונות לכאן", "Suelta imágenes aquí", "Solte imagens aqui", "اسحبي صوراً هنا"),
  headerName: row("Header", "הידר", "Cabecera", "Cabeçalho", "ترويسة"),
  headerDir: row("Header direction", "כיוון הידר", "Dirección de la cabecera", "Direção do cabeçalho", "اتجاه الترويسة"),
  rtl: row("Right to left", "ימין לשמאל", "Derecha a izquierda", "Direita para esquerda", "من اليمين إلى اليسار"),
  ltr: row("Left to right", "שמאל לימין", "Izquierda a derecha", "Esquerda para direita", "من اليسار إلى اليمين"),
  headerBg: row("Header background color", "צבע רקע Header", "Color de fondo de la cabecera", "Cor de fundo do cabeçalho", "لون خلفية الترويسة"),
  textColor: row("Text color", "צבע טקסט", "Color de texto", "Cor do texto", "لون النص"),
  mutedText: row("Secondary text color", "צבע טקסט משני", "Color de texto secundario", "Cor de texto secundária", "لون النص الثانوي"),
  borderColor: row("Border color", "צבע גבול", "Color de borde", "Cor da borda", "لون الحد"),
  buttonColor: row("Button color", "צבע כפתור", "Color del botón", "Cor do botão", "لون الزر"),
  buttonTextColor: row("Button text color", "צבע טקסט כפתור", "Color de texto del botón", "Cor do texto do botão", "لون نص الزر"),
  headerShape: row("Header shape", "צורת Header", "Forma de la cabecera", "Forma do cabeçalho", "شكل الترويسة"),
  fromTemplate: row("From the template", "לפי התבנית", "Según la plantilla", "Conforme o modelo", "حسب القالب"),
  sharpRect: row("Sharp rectangle", "מרובע חד", "Rectángulo nítido", "Retângulo nítido", "مستطيل حاد"),
  softRect: row("Soft rectangle", "מלבני עדין", "Rectángulo suave", "Retângulo suave", "مستطيل ناعم"),
  softRound: row("Soft rounded", "מעוגל עדין", "Redondeado suave", "Arredondado suave", "دائري ناعم"),
  capsule: row("Capsule", "קפסולה", "Cápsula", "Cápsula", "كبسولة"),
  headerWidth: row("Header width", "רוחב Header", "Ancho de la cabecera", "Largura do cabeçalho", "عرض الترويسة"),
  fullWidth: row("Full width", "רוחב מלא", "Ancho completo", "Largura total", "عرض كامل"),
  floatWide: row("Wide floating", "צף רחב", "Flotante ancho", "Flutuante largo", "عائم عريض"),
  floatNarrow: row("Narrow floating", "צף צר", "Flotante estrecho", "Flutuante estreito", "عائم ضيق"),
  headerShadow: row("Header shadow", "צל Header", "Sombra de la cabecera", "Sombra do cabeçalho", "ظل الترويسة"),
  noShadow: row("No shadow", "בלי צל", "Sin sombra", "Sem sombra", "بدون ظل"),
  softShadow: row("Soft shadow", "צל עדין", "Sombra suave", "Sombra suave", "ظل ناعم"),
  premiumShadow: row("Premium shadow", "צל פרימיום", "Sombra premium", "Sombra premium", "ظل فاخر"),
  headerHeight: row("Header height", "גובה Header", "Alto de la cabecera", "Altura do cabeçalho", "ارتفاع الترويسة"),
  low: row("Low", "נמוך", "Bajo", "Baixo", "منخفض"),
  regular: row("Regular", "רגיל", "Normal", "Normal", "عادي"),
  high: row("High", "גבוה", "Alto", "Alto", "مرتفع"),
  logo: row("Logo", "לוגו", "Logo", "Logo", "شعار"),
  logoArea: row("Logo area", "אזור לוגו", "Área del logo", "Área do logo", "منطقة الشعار"),
  pageLink: row("Page link", "קישור עמוד", "Enlace de página", "Link da página", "رابط الصفحة"),
  link: row("Link", "קישור", "Enlace", "Link", "رابط"),
  pageId: row("Page ID", "מזהה עמוד", "ID de página", "ID da página", "معرّف الصفحة"),
  loginButton: row("Sign-in button", "כפתור התחברות", "Botón de acceso", "Botão de entrada", "زر تسجيل الدخول"),
  logoutButton: row("Sign-out button", "כפתור התנתקות", "Botón de salida", "Botão de saída", "زر تسجيل الخروج"),
  actionButton: row("Action button", "כפתור פעולה", "Botón de acción", "Botão de ação", "زر إجراء"),
  selectHeaderThenLogo: row("Select the header, then tap Logo", "בחרי את ההידר ואז לחצי לוגו", "Selecciona la cabecera y luego Logo", "Selecione o cabeçalho e depois Logo", "اختاري الترويسة ثم الشعار"),
  logoAreaFailed: row("Could not create a logo area in this header", "לא הצלחתי ליצור אזור לוגו בהידר הזה", "No se pudo crear un área de logo en esta cabecera", "Não foi possível criar uma área de logo neste cabeçalho", "تعذّر إنشاء منطقة شعار في هذه الترويسة"),
  selectHeaderDir: row("Select a header to change direction", "בחרי Header כדי לשנות כיוון", "Selecciona una cabecera para cambiar la dirección", "Selecione um cabeçalho para mudar a direção", "اختاري ترويسة لتغيير الاتجاه"),
  selectHeaderColors: row("Select a header to change colors", "בחרי Header כדי לשנות צבעים", "Selecciona una cabecera para cambiar colores", "Selecione um cabeçalho para mudar as cores", "اختاري ترويسة لتغيير الألوان"),
  layout: row("Layout", "מבנה", "Estructura", "Estrutura", "هيكل"),
  chooseHeaderLayout: row("Choose a professional header layout", "בחירת מבנה Header מקצועי", "Elige una estructura de cabecera profesional", "Escolha uma estrutura de cabeçalho profissional", "اختاري هيكل ترويسة احترافي"),
  uploadHeaderLogo: row("Upload a logo to the header", "העלאת לוגו להידר", "Subir un logo a la cabecera", "Enviar um logo para o cabeçalho", "رفع شعار إلى الترويسة"),
  color: row("Color", "צבע", "Color", "Cor", "لون"),
  changeHeaderColors: row("Change header, text, and button colors", "שינוי צבע Header, טקסט וכפתור", "Cambiar colores de cabecera, texto y botón", "Alterar cores do cabeçalho, texto e botão", "تغيير ألوان الترويسة والنص والزر"),
  direction: row("Direction", "כיוון", "Dirección", "Direção", "اتجاه"),
  drag: row("Drag", "גרירה", "Arrastrar", "Arrastar", "سحب"),
  duplicate: row("Duplicate", "שכפול", "Duplicar", "Duplicar", "تكرار"),
  delete: row("Delete", "מחיקה", "Eliminar", "Excluir", "حذف"),
  chooseSectionLayout: row("Choose a professional section layout", "בחירת מבנה מקצועי לסקשן", "Elige una estructura profesional para la sección", "Escolha uma estrutura profissional para a seção", "اختاري هيكل قسم احترافي"),
  addMedia: row("+ Media", "+מדיה", "+ Media", "+ Mídia", "+ وسائط"),
  addMediaToSection: row("Add an image or video from your computer to the section", "הוספת תמונה או סרטון מהמחשב לסקשן", "Añade una imagen o vídeo del ordenador a la sección", "Adicione uma imagem ou vídeo do computador à seção", "أضيفي صورة أو فيديو من الجهاز إلى القسم"),
  background: row("Background", "רקע", "Fondo", "Fundo", "خلفية"),
  setSectionBackground: row("Set an image from your computer as the section background", "הגדרת תמונה מהמחשב כרקע לסקשן", "Usa una imagen del ordenador como fondo de la sección", "Defina uma imagem do computador como fundo da seção", "عيّني صورة من الجهاز كخلفية للقسم"),
  media: row("Media", "מדיה", "Media", "Mídia", "وسائط"),
  replaceMedia: row("Replace an image or video from your computer", "החלפת תמונה או סרטון מהמחשב", "Reemplaza una imagen o vídeo del ordenador", "Substitua uma imagem ou vídeo do computador", "استبدلي صورة أو فيديو من الجهاز"),
  replaceEditMedia: row("Replace image / video / edit media", "החלפת תמונה / וידאו / עריכת מדיה", "Reemplazar imagen / vídeo / editar media", "Substituir imagem / vídeo / editar mídia", "استبدال صورة / فيديو / تحرير الوسائط"),
  open: row("Open", "פתיחה", "Abrir", "Abrir", "فتح"),
  sameWindow: row("Same window", "באותו חלון", "Misma ventana", "Mesma janela", "نفس النافذة"),
  newTab: row("New tab", "בטאב חדש", "Nueva pestaña", "Nova aba", "تبويب جديد"),
  imageSource: row("Image source", "מקור תמונה", "Origen de imagen", "Origem da imagem", "مصدر الصورة"),
  altText: row("Alternative text", "טקסט חלופי", "Texto alternativo", "Texto alternativo", "نص بديل"),
  videoSource: row("Video source", "מקור וידאו", "Origen de vídeo", "Origem do vídeo", "مصدر الفيديو"),
  videoControls: row("Video controls", "פקדי וידאו", "Controles de vídeo", "Controles de vídeo", "عناصر تحكم الفيديو"),
  autoplay: row("Autoplay", "ניגון אוטומטי", "Reproducción automática", "Reprodução automática", "تشغيل تلقائي"),
  mute: row("Mute", "השתקה", "Silenciar", "Silenciar", "كتم"),
  loop: row("Loop", "לופ", "Bucle", "Loop", "تكرار"),
  whatsappLink: row("WhatsApp link", "קישור וואטסאפ", "Enlace de WhatsApp", "Link do WhatsApp", "رابط واتساب"),
  socialLink: row("Social network link", "קישור לרשת חברתית", "Enlace de red social", "Link de rede social", "رابط شبكة اجتماعية"),
  networkName: row("Network name", "שם רשת", "Nombre de la red", "Nome da rede", "اسم الشبكة"),
  miniSaasAction: row("Mini SaaS action", "פעולת Mini SaaS", "Acción Mini SaaS", "Ação Mini SaaS", "إجراء Mini SaaS"),
  section: row("Section", "סקשן", "Sección", "Seção", "قسم"),
  button: row("Button", "כפתור", "Botón", "Botão", "زر"),
  image: row("Image", "תמונה", "Imagen", "Imagem", "صورة"),
  video: row("Video", "וידאו", "Vídeo", "Vídeo", "فيديو"),
  imageOnly: row("Choose an image file only", "בחרי קובץ תמונה בלבד", "Elige solo un archivo de imagen", "Escolha apenas um arquivo de imagem", "اختاري ملف صورة فقط"),
  imageOrVideoOnly: row("Choose an image or video file only", "בחרי קובץ תמונה או סרטון בלבד", "Elige solo una imagen o un vídeo", "Escolha apenas uma imagem ou um vídeo", "اختاري ملف صورة أو فيديو فقط"),
  selectThenDesign: row("Select an element on the site, then tap Design", "בחרי אלמנט באתר ואז לחצי עיצוב", "Selecciona un elemento y luego Diseño", "Selecione um elemento e depois Design", "اختاري عنصراً ثم التصميم"),
  selectSectionLayout: row("Select a section to change its layout", "בחרי סקשן כדי לשנות לו מבנה", "Selecciona una sección para cambiar su estructura", "Selecione uma seção para mudar a estrutura", "اختاري قسماً لتغيير هيكله"),
  noLayoutsYet: row("There are no layouts for this section yet", "אין עדיין מבנים לסקשן הזה", "Aún no hay estructuras para esta sección", "Ainda não há estruturas para esta seção", "لا توجد هياكل لهذا القسم بعد"),
  selectSectionAddImage: row("Select a section to add an image", "בחרי סקשן כדי להוסיף אליו תמונה", "Selecciona una sección para añadir una imagen", "Selecione uma seção para adicionar uma imagem", "اختاري قسماً لإضافة صورة"),
  selectImageOrSection: row("Select an image or a section that contains an image", "בחרי תמונה או סקשן שיש בו תמונה", "Selecciona una imagen o una sección con imagen", "Selecione uma imagem ou uma seção com imagem", "اختاري صورة أو قسماً فيه صورة"),
  noMediaFound: row("No image or video was found in the selected element", "לא נמצאה תמונה או וידאו באלמנט הנבחר", "No hay imagen ni vídeo en el elemento seleccionado", "Não há imagem nem vídeo no elemento selecionado", "لا توجد صورة أو فيديو في العنصر المحدد"),
  selectSectionBackground: row("Select a section to set a background image", "בחרי סקשן כדי להגדיר לו תמונת רקע", "Selecciona una sección para definir una imagen de fondo", "Selecione uma seção para definir uma imagem de fundo", "اختاري قسماً لتعيين صورة خلفية"),
  layoutBadge: row("Layout", "מבנה", "Estructura", "Estrutura", "هيكل"),
  featLogo: row("Logo", "לוגו", "Logo", "Logo", "شعار"),
  featPages: row("Pages", "עמודים", "Páginas", "Páginas", "صفحات"),
  featAuth: row("Sign in/out", "כניסה/יציאה", "Acceso/salida", "Entrada/saída", "دخول/خروج"),
  featCta: row("CTA", "CTA", "CTA", "CTA", "دعوة"),
  featDir: row("RTL/LTR", "RTL/LTR", "RTL/LTR", "RTL/LTR", "RTL/LTR"),
  featText: row("Text", "טקסט", "Texto", "Texto", "نص"),
  featImage: row("Image", "תמונה", "Imagen", "Imagem", "صورة"),
  featButtons: row("Buttons", "כפתורים", "Botones", "Botões", "أزرار"),
  featFullEdit: row("Full editing", "עריכה מלאה", "Edición completa", "Edição completa", "تحرير كامل"),
  headerModeNote: row(
    "Header mode — all templates are shown together, without extra filters",
    "מצב Header — כל התבניות מוצגות יחד, בלי סינונים מיותרים",
    "Modo cabecera — todas las plantillas juntas, sin filtros extra",
    "Modo cabeçalho — todos os modelos juntos, sem filtros extras",
    "وضع الترويسة — تُعرض كل القوالب معاً دون فلاتر إضافية"
  ),
  chooseAria: row("Choose {{title}}", "בחירת {{title}}", "Elegir {{title}}", "Escolher {{title}}", "اختيار {{title}}"),
  realPreview: row("Live preview", "Preview אמיתי", "Vista previa real", "Pré-visualização real", "معاينة حقيقية"),
  chooseTemplate: row("Choose template", "בחרי תבנית", "Elegir plantilla", "Escolher modelo", "اختاري قالباً"),
  chooseProHeader: row("Choose a professional header", "בחרי Header מקצועי", "Elige una cabecera profesional", "Escolha um cabeçalho profissional", "اختاري ترويسة احترافية"),
  chooseProLayout: row("Choose a professional layout", "בחרי מבנה מקצועי", "Elige una estructura profesional", "Escolha uma estrutura profissional", "اختاري هيكلاً احترافياً"),
  headerPreviewHint: row(
    "See the header before choosing: logo, menu, sign-in/out, action button, and RTL/LTR.",
    "כאן רואים ממש את ההידר לפני הבחירה: לוגו, תפריט, התחברות/התנתקות, כפתור פעולה וכיוון RTL/LTR.",
    "Mira la cabecera antes de elegir: logo, menú, acceso, botón y RTL/LTR.",
    "Veja o cabeçalho antes de escolher: logo, menu, acesso, botão e RTL/LTR.",
    "شاهدي الترويسة قبل الاختيار: الشعار والقائمة وتسجيل الدخول والزر واتجاه RTL/LTR."
  ),
  layoutPreviewHint: row(
    "Choose a ready, clear template. The choice replaces the section on the site immediately.",
    "בחרי תבנית מוכנה, יפה וברורה. הבחירה מחליפה מיד את הסקשן באתר.",
    "Elige una plantilla lista. La selección reemplaza la sección al instante.",
    "Escolha um modelo pronto. A seleção substitui a seção na hora.",
    "اختاري قالباً جاهزاً وواضحاً. يستبدل القسم في الموقع فوراً."
  ),
  templates: row("Templates", "תבניות", "Plantillas", "Modelos", "قوالب"),
  selected: row("Selected", "נבחר", "Seleccionado", "Selecionado", "محدد"),
  largePreview: row("Large preview", "Preview גדול", "Vista previa grande", "Pré-visualização grande", "معاينة كبيرة"),
  headerTemplates: row("Header templates", "תבניות Header", "Plantillas de cabecera", "Modelos de cabeçalho", "قوالب الترويسة"),
  kindTemplates: row("{{label}} templates", "תבניות {{label}}", "Plantillas de {{label}}", "Modelos de {{label}}", "قوالب {{label}}"),
  clickHint: row(
    "Click a card to mark it, then tap “Choose template” to replace it on the site",
    "לחיצה על כרטיס מסמנת אותו, לחיצה על “בחרי תבנית” מחליפה באתר",
    "Pulsa una tarjeta para marcarla y luego “Elegir plantilla” para reemplazarla",
    "Clique em um cartão para marcar e depois em “Escolher modelo” para substituir",
    "انقري بطاقة لتحديدها ثم «اختاري قالباً» لاستبدالها في الموقع"
  ),
};

const GRAPES_STUDIO = {
  tagline: row("A professional no-code website editor", "עורך אתר מקצועי בלי קוד", "Editor de sitios profesional sin código", "Editor de sites profissional sem código", "محرر مواقع احترافي بدون كود"),
  undo: row("Undo", "ביטול", "Deshacer", "Desfazer", "تراجع"),
  redo: row("Redo", "בצע שוב", "Rehacer", "Refazer", "إعادة"),
  desktop: row("Desktop", "דסקטופ", "Escritorio", "Desktop", "سطح المكتب"),
  tablet: row("Tablet", "טאבלט", "Tableta", "Tablet", "لوحي"),
  mobile: row("Mobile", "מובייל", "Móvil", "Celular", "جوال"),
  media: row("Media", "מדיה", "Media", "Mídia", "وسائط"),
  preview: row("Preview", "תצוגה מקדימה", "Vista previa", "Pré-visualização", "معاينة"),
  reset: row("Reset", "איפוס", "Restablecer", "Redefinir", "إعادة تعيين"),
  aiBuild: row("AI site builder ✨", "AI לבניית אתר ✨", "IA para crear el sitio ✨", "IA para criar o site ✨", "ذكاء لبناء الموقع ✨"),
  saveDraft: row("Save as draft", "שמירה כטיוטה", "Guardar como borrador", "Salvar como rascunho", "حفظ كمسودة"),
  publish: row("Publish 🚀", "פרסום 🚀", "Publicar 🚀", "Publicar 🚀", "نشر 🚀"),
  slugHint: row(
    "Only lowercase English letters, numbers, and hyphens. For example: hadar-beauty",
    "מותר רק אותיות באנגלית קטנות, מספרים ומקף. לדוגמה: hadar-beauty",
    "Solo letras inglesas minúsculas, números y guiones. Ej.: hadar-beauty",
    "Somente letras minúsculas, números e hífen. Ex.: hadar-beauty",
    "أحرف إنجليزية صغيرة وأرقام وشرطات فقط. مثال: hadar-beauty"
  ),
  savedAt: row("Saved successfully at {{time}} · {{url}}", "נשמר בהצלחה בשעה {{time}} · {{url}}", "Guardado a las {{time}} · {{url}}", "Salvo às {{time}} · {{url}}", "حُفظ بنجاح في {{time}} · {{url}}"),
  clearConfirm: row("Delete the current design?", "למחוק את כל העיצוב הנוכחי?", "¿Borrar el diseño actual?", "Excluir o design atual?", "حذف التصميم الحالي؟"),
  templates: row("Templates", "תבניות", "Plantillas", "Modelos", "قوالב"),
  templatesHint: row("Choose a ready site layout and start editing", "בחרי מבנה אתר מוכן והתחילי לערוך", "Elige una estructura lista y empieza a editar", "Escolha uma estrutura pronta e comece a editar", "اختاري هيكل موقع جاهز وابدئي التحرير"),
  addElements: row("Add elements", "הוספת אלמנטים", "Añadir elementos", "Adicionar elementos", "إضافة عناصر"),
  addElementsHint: row("Drag elements or tap to add them to the site", "גררי אלמנטים או לחצי כדי להוסיף לאתר", "Arrastra o pulsa para añadir al sitio", "Arraste ou toque para adicionar ao site", "اسحبي العناصر أو انقري لإضافتها"),
  smartBlocks: row("Smart blocks", "בלוקים חכמים", "Bloques inteligentes", "Blocos inteligentes", "كتل ذكية"),
  smartBlocksHint: row("Blocks that connect to Bizuply modules", "בלוקים שמתחברים למודולים של Bizuply", "Bloques conectados a los módulos de Bizuply", "Blocos ligados aos módulos da Bizuply", "كتل تتصل بوحدات Bizuply"),
  pages: row("Pages", "דפים", "Páginas", "Páginas", "صفحات"),
  pagesHint: row("Manage site pages", "ניהול דפי האתר", "Gestionar páginas del sitio", "Gerenciar páginas do site", "إدارة صفحات الموقع"),
  mediaHint: row("Images and files for the site", "תמונות וקבצים לאתר", "Imágenes y archivos del sitio", "Imagens e arquivos do site", "صور وملفات الموقع"),
  openMedia: row("Open media manager", "פתיחת מנהל מדיה", "Abrir gestor de media", "Abrir gerenciador de mídia", "فتح مدير الوسائط"),
  commerce: row("Products and checkout", "מוצרים וסליקה", "Productos y cobro", "Produtos e pagamento", "منتجات ودفع"),
  commerceHint: row("Connect a store and checkout", "חיבור חנות וסליקה", "Conectar tienda y cobro", "Conectar loja e pagamento", "ربط متجر والدفع"),
  services: row("Services", "שירותים", "Servicios", "Serviços", "خدمات"),
  servicesHint: row("Connect services to the site", "חיבור השירותים לאתר", "Conectar servicios al sitio", "Conectar serviços ao site", "ربط الخدمات بالموقع"),
  booking: row("Bookings", "תיאום תורים", "Reservas", "Agendamentos", "تنسيق مواعيد"),
  bookingHint: row("Connect the site to the calendar", "חיבור האתר ליומן", "Conectar el sitio al calendario", "Conectar o site à agenda", "ربط الموقع بالتقويم"),
  club: row("Customer club", "מועדון לקוחות", "Club de clientes", "Clube de clientes", "نادي العملاء"),
  clubHint: row("Benefits and coupons", "הטבות וקופונים", "Beneficios y cupones", "Benefícios e cupons", "مزايا وكوبونات"),
  leads: row("Forms and leads", "טפסים ולידים", "Formularios y leads", "Formulários e leads", "نماذج وعملاء محتملون"),
  leadsHint: row("Forms that connect to the CRM", "טפסים שמתחברים ל־CRM", "Formularios conectados al CRM", "Formulários ligados ao CRM", "نماذج تتصل بنظام CRM"),
  seo: row("SEO", "SEO", "SEO", "SEO", "SEO"),
  seoHint: row("Search-engine visibility settings", "הגדרות נראות במנועי חיפוש", "Ajustes de visibilidad en buscadores", "Configurações de visibilidade em buscadores", "إعدادات الظهور في محركات البحث"),
  seoSoon: row(
    "SEO title, description, share image, and public URL will be connected here later.",
    "בהמשך נחבר כותרת SEO, תיאור, תמונת שיתוף וקישור ציבורי.",
    "Más adelante conectaremos título SEO, descripción, imagen y URL pública.",
    "Depois conectaremos título SEO, descrição, imagem e URL pública.",
    "لاحقاً سنربط عنوان SEO والوصف وصورة المشاركة والرابط العام."
  ),
  settings: row("Settings", "הגדרות", "Ajustes", "Configurações", "إعدادات"),
  settingsHint: row("General website settings", "הגדרות כלליות לאתר", "Ajustes generales del sitio", "Configurações gerais do site", "إعدادات الموقع العامة"),
  settingsSoon: row(
    "Language, domain, publish status, pixels, analytics, and permissions will be here.",
    "כאן יהיו שפה, דומיין, סטטוס פרסום, פיקסלים, אנליטיקס והרשאות.",
    "Aquí estarán idioma, dominio, publicación, píxeles, analítica y permisos.",
    "Aqui ficarão idioma, domínio, publicação, pixels, analytics e permissões.",
    "ستكون هنا اللغة والنطاق وحالة النشر والبكسل والتحليلات والصلاحيات."
  ),
  design: row("Design", "עיצוב", "Diseño", "Design", "تصميم"),
  designHint: row("Colors, sizes, corners, spacing, shadows, and effects", "צבעים, גדלים, פינות, ריווח, צללים ואפקטים", "Colores, tamaños, esquinas, espacio, sombras y efectos", "Cores, tamanhos, cantos, espaçamento, sombras e efeitos", "ألوان وأحجام وزوايا وتباعد وظلال وتأثيرات"),
  elementSettings: row("Element settings", "הגדרות אלמנט", "Ajustes del elemento", "Configurações do elemento", "إعدادات العنصر"),
  elementSettingsHint: row("Links, actions, images, fields, and advanced settings", "קישורים, פעולות, תמונות, שדות והגדרות מתקדמות", "Enlaces, acciones, imágenes, campos y ajustes avanzados", "Links, ações, imagens, campos e ajustes avançados", "روابط وإجراءات وصور وحقول وإعدادات متقدمة"),
  smartServices: row("Business services", "שירותים מהעסק", "Servicios del negocio", "Serviços do negócio", "خدمات العمل"),
  smartServicesText: row("Pulls services, prices, and times automatically", "מושך אוטומטית שירותים, מחירים וזמנים", "Trae servicios, precios y horarios automáticamente", "Puxa serviços, preços e horários automaticamente", "يسحب الخدمات والأسعار والأوقات تلقائياً"),
  smartBooking: row("Bookings", "תיאום תורים", "Reservas", "Agendamentos", "تنسيق مواعيد"),
  smartBookingText: row("Connected to the calendar, hours, and availability", "מחובר ליומן, שעות פעילות וזמינות", "Conectado al calendario, horario y disponibilidad", "Ligado à agenda, horário e disponibilidade", "متصل بالتقويم والساعات والتوفر"),
  smartProducts: row("Products and checkout", "מוצרים וסליקה", "Productos y cobro", "Produtos e pagamento", "منتجات ودفع"),
  smartProductsText: row("Products, checkout, and an add-to-cart button", "מוצרים, סליקה וכפתור הוספה לסל", "Productos, cobro y botón de añadir al carrito", "Produtos, pagamento e botão de adicionar ao carrinho", "منتجات ودفع وزر إضافة إلى السلة"),
  smartLead: row("Lead form", "טופס ליד", "Formulario de lead", "Formulário de lead", "نموذج عميل محتمل"),
  smartLeadText: row("Every inquiry enters the business CRM", "כל פנייה נכנסת ל־CRM של העסק", "Cada consulta entra al CRM del negocio", "Cada consulta entra no CRM do negócio", "كل استفسار يدخل نظام CRM"),
  smartClub: row("Customer club", "מועדון לקוחות", "Club de clientes", "Clube de clientes", "نادي العملاء"),
  smartClubText: row("Sign up for benefits, coupons, and updates", "הרשמה להטבות, קופונים ועדכונים", "Registro para beneficios, cupones y novedades", "Cadastro para benefícios, cupons e novidades", "التسجيل للمزايا والكوبونات والتحديثات"),
  addProductsBlock: row("Add a products block", "הוספת בלוק מוצרים", "Añadir bloque de productos", "Adicionar bloco de produtos", "إضافة كتلة منتجات"),
  addProductsBlockText: row("Products with a price and a buy button", "מוצרים עם מחיר וכפתור רכישה", "Productos con precio y botón de compra", "Produtos com preço e botão de compra", "منتجات بسعر وزر شراء"),
  addServicesBlock: row("Add a services block", "הוספת בלוק שירותים", "Añadir bloque de servicios", "Adicionar bloco de serviços", "إضافة كتلة خدمات"),
  addServicesBlockText: row("Services will be shown from the system", "השירותים יוצגו מתוך המערכת", "Los servicios se mostrarán desde el sistema", "Os serviços serão exibidos pelo sistema", "ستُعرض الخدمات من النظام"),
  addBooking: row("Add bookings", "הוספת תיאום תורים", "Añadir reservas", "Adicionar agendamentos", "إضافة تنسيق مواعيد"),
  addBookingText: row("Choose a service, date, and available time", "בחירת שירות, תאריך ושעה פנויה", "Elige servicio, fecha y hora disponible", "Escolha serviço, data e horário disponível", "اختاري خدمة وتاريخاً ووقتاً متاحاً"),
  addClub: row("Add a customer club", "הוספת מועדון לקוחות", "Añadir club de clientes", "Adicionar clube de clientes", "إضافة نادي عملاء"),
  addClubText: row("A small section for customer signup", "סקשן קטן להצטרפות לקוחות", "Una sección pequeña para el registro", "Uma seção pequena para cadastro", "قسم صغير لانضمام العملاء"),
  addLead: row("Add a lead form", "הוספת טופס ליד", "Añadir formulario de lead", "Adicionar formulário de lead", "إضافة نموذج عميل محتمل"),
  addLeadText: row("Name, phone, email, and a message", "שם, טלפון, אימייל והודעה", "Nombre, teléfono, email y mensaje", "Nome, telefone, e-mail e mensagem", "الاسم والهاتف والبريد والرسالة"),
  active: row("Active", "פעיל", "Activo", "Ativo", "نشط"),
  editing: row("Edit", "עריכה", "Editar", "Editar", "تعديل"),
  hero: row("Hero", "הירו", "Hero", "Hero", "Hero"),
  luxury: row("Luxury", "יוקרתי", "De lujo", "Luxo", "فاخر"),
  luxuryDesc: row("A luxury site for beauty businesses, clinics, and studios", "אתר יוקרתי לעסקי יופי, קליניקות וסטודיו", "Sitio de lujo para belleza, clínicas y estudios", "Site de luxo para beleza, clínicas e estúdios", "موقع فاخر للجمال والعيادات والاستوديوهات"),
  modern: row("Modern", "מודרני", "Moderno", "Moderno", "حديث"),
  modernDesc: row("A modern, clean, sales-ready layout", "מבנה מודרני, נקי ומכירתי", "Estructura moderna, limpia y comercial", "Estrutura moderna, limpa e comercial", "هيكل حديث ونظيف وبيعي"),
  modernCleanDesc: row("A modern, clean layout for professional businesses", "מבנה מודרני ונקי לעסקים מקצועיים", "Estructura moderna y limpia para negocios profesionales", "Estrutura moderna e limpa para negócios profissionais", "هيكل حديث ونظيف للأعمال المهنية"),
  minimal: row("Minimal", "מינימליסטי", "Minimalista", "Minimalista", "بسيط"),
  minimalDesc: row("A quiet, clean, elegant design", "עיצוב שקט, נקי ואלגנטי", "Diseño quieto, limpio y elegante", "Design quieto, limpo e elegante", "تصميم هادئ ونظيف وأنيق"),
  minimalQuietDesc: row("A clean, quiet, elegant design", "עיצוב נקי, שקט ואלגנטי", "Diseño limpio, quieto y elegante", "Design limpo, quieto e elegante", "تصميم نظيف وهادئ وأنيق"),
};

const BLOCKS = {
  categoryBizuply: row("Bizuply", "Bizuply", "Bizuply", "Bizuply", "Bizuply"),
  categorySmart: row("Bizuply Smart", "Bizuply Smart", "Bizuply Smart", "Bizuply Smart", "Bizuply Smart"),
  heroLuxury: row("Luxury hero", "Hero יוקרתי", "Hero de lujo", "Hero de luxo", "Hero فاخر"),
  about: row("About", "אודות", "Acerca de", "Sobre", "حول"),
  services: row("Business services", "שירותים מהעסק", "Servicios del negocio", "Serviços do negócio", "خدمات العمل"),
  products: row("Products and checkout", "מוצרים וסליקה", "Productos y cobro", "Produtos e pagamento", "منتجات ودفع"),
  gallery: row("Gallery", "גלריה", "Galería", "Galeria", "معرض"),
  reviews: row("Reviews", "ביקורות", "Reseñas", "Avaliações", "مراجعات"),
  booking: row("Bookings", "תיאום תורים", "Reservas", "Agendamentos", "تنسيق مواعيد"),
  leadForm: row("Lead form", "טופס ליד", "Formulario de lead", "Formulário de lead", "نموذج عميل محتمل"),
  club: row("Customer club", "מועדון לקוחות", "Club de clientes", "Clube de clientes", "نادي العملاء"),
  contact: row("Contact", "יצירת קשר", "Contacto", "Contato", "تواصل"),
};

const STUDIO_TEMPLATES = {
  "luxury-beauty": {
    name: row("Luxury", "יוקרתי", "De lujo", "Luxo", "فاخر"),
    description: row(
      "A luxury site for beauty businesses, clinics, and studios",
      "אתר יוקרתי לעסקי יופי, קליניקות וסטודיו",
      "Sitio de lujo para belleza, clínicas y estudios",
      "Site de luxo para beleza, clínicas e estúdios",
      "موقع فاخر للجمال والعيادات والاستوديوهات"
    ),
  },
  "modern-clean": {
    name: row("Modern", "מודרני", "Moderno", "Moderno", "حديث"),
    description: row(
      "A modern, clean layout for professional businesses",
      "מבנה מודרני ונקי לעסקים מקצועיים",
      "Estructura moderna y limpia para negocios profesionales",
      "Estrutura moderna e limpa para negócios profissionais",
      "هيكل حديث ونظيف للأعمال المهنية"
    ),
  },
  "modern-beauty": {
    name: row("Modern", "מודרני", "Moderno", "Moderno", "حديث"),
    description: row(
      "A modern, clean, sales-ready layout",
      "מבנה מודרני, נקי ומכירתי",
      "Estructura moderna, limpia y comercial",
      "Estrutura moderna, limpa e comercial",
      "هيكل حديث ونظيف وبيعي"
    ),
  },
  minimal: {
    name: row("Minimal", "מינימליסטי", "Minimalista", "Minimalista", "بسيط"),
    description: row(
      "A clean, quiet, elegant design",
      "עיצוב נקי, שקט ואלגנטי",
      "Diseño limpio, quieto y elegante",
      "Design limpo, quieto e elegante",
      "تصميم نظيف وهادئ وأنيق"
    ),
  },
  "minimal-premium": {
    name: row("Minimal", "מינימליסטי", "Minimalista", "Minimalista", "بسيط"),
    description: row(
      "A quiet, clean, elegant design",
      "עיצוב שקט, נקי ואלגנטי",
      "Diseño quieto, limpio y elegante",
      "Design quieto, limpo e elegante",
      "تصميم هادئ ونظيف وأنيق"
    ),
  },
};

const PAGE_PICKER = {
  "business-premium": {
    title: row("Full premium business", "עסק פרימיום מלא", "Negocio premium completo", "Negócio premium completo", "عمل فاخر كامل"),
    badge: row("Recommended", "מומלץ", "Recomendado", "Recomendado", "موصى به"),
    description: row(
      "A full business site with header, home, about, services, gallery, reviews, bookings, smart bot, and contact.",
      "אתר עסק מלא עם הידר, דף בית, אודות, שירותים, גלריה, ביקורות, תורים, בוט חכם ויצירת קשר.",
      "Sitio completo con cabecera, inicio, acerca de, servicios, galería, reseñas, citas, bot y contacto.",
      "Site completo com cabeçalho, início, sobre, serviços, galeria, avaliações, horários, bot e contato.",
      "موقع عمل كامل مع ترويسة والرئيسية وحول وخدمات ومعرض ومراجعات ومواعيد وبوت وتواصل."
    ),
    preview: row("Premium business", "עסק פרימיום", "Negocio premium", "Negócio premium", "عمل فاخر"),
  },
  "business-corporate": {
    title: row("Clean corporate business", "עסק נקי ומרובע", "Negocio corporativo limpio", "Negócio corporativo limpo", "عمل مؤسسي نظيف"),
    badge: row("Corporate", "Corporate", "Corporate", "Corporate", "Corporate"),
    description: row(
      "A clean, professional, less-rounded business site — good for lawyers, consultants, offices, accountants, and B2B.",
      "אתר עסקי נקי, מקצועי ופחות מעוגל — מתאים לעורכי דין, יועצים, משרדים, רואי חשבון ו־B2B.",
      "Sitio limpio y profesional, menos redondeado — para abogados, consultores, oficinas y B2B.",
      "Site limpo e profissional, menos arredondado — para advogados, consultores, escritórios e B2B.",
      "موقع نظيف ومهني أقل استدارة — للمحامين والمستشارين والمكاتب وB2B."
    ),
    preview: row("Corporate", "Corporate", "Corporate", "Corporate", "Corporate"),
  },
  "clinic-booking": {
    title: row("Clinic with bookings", "קליניקה עם תיאום תורים", "Clínica con reservas", "Clínica com agendamentos", "عيادة مع مواعيد"),
    badge: row("Bookings", "תורים", "Citas", "Horários", "مواعيد"),
    description: row(
      "A site for clinics, beauty, treatments, coaches, and service providers — with services, reviews, bookings, and WhatsApp.",
      "אתר לקליניקות, יופי, טיפולים, מאמנים ונותני שירות — עם שירותים, ביקורות, תורים ווואטסאפ.",
      "Sitio para clínicas, belleza y servicios — con servicios, reseñas, citas y WhatsApp.",
      "Site para clínicas, beleza e serviços — com serviços, avaliações, horários e WhatsApp.",
      "موقع للعيادات والجمال والخدمات — مع خدمات ومراجعات ومواعيد وواتساب."
    ),
    preview: row("Clinic", "Clinic", "Clinic", "Clinic", "Clinic"),
  },
  "store-luxury": {
    title: row("Premium store", "חנות פרימיום", "Tienda premium", "Loja premium", "متجر فاخر"),
    badge: row("Ecommerce", "Ecommerce", "Ecommerce", "Ecommerce", "Ecommerce"),
    description: row(
      "A store site with hero, products, promo, reviews, social, customer club, and signup.",
      "אתר חנות עם Hero, מוצרים, מבצע, ביקורות, סושיאל, מועדון לקוחות והרשמה.",
      "Tienda con hero, productos, promo, reseñas, social, club y registro.",
      "Loja com hero, produtos, promoção, avaliações, social, clube e cadastro.",
      "متجر مع Hero ومنتجات وعرض ومراجعات وتواصل ونادي وتسجيل."
    ),
    preview: row("Store", "Store", "Store", "Store", "Store"),
  },
  "landing-leads": {
    title: row("Lead landing page", "דף נחיתה ללידים", "Página de aterrizaje para leads", "Página de destino para leads", "صفحة هبوط للعملاء المحتملين"),
    badge: row("Leads", "Leads", "Leads", "Leads", "Leads"),
    description: row(
      "A converting landing page with hero, benefits, reviews, form, smart bot, and CTA.",
      "דף נחיתה ממיר עם Hero, יתרונות, ביקורות, טופס, בוט חכם ו־CTA.",
      "Landing de conversión con hero, ventajas, reseñas, formulario, bot y CTA.",
      "Landing de conversão com hero, vantagens, avaliações, formulário, bot e CTA.",
      "صفحة هبوط تحويلية مع Hero ومزايا ومراجعات ونموذج وبوت ودعوة."
    ),
    preview: row("Landing", "Landing", "Landing", "Landing", "Landing"),
  },
  "portfolio-gallery": {
    title: row("Portfolio / gallery", "פורטפוליו / גלריה", "Portafolio / galería", "Portfólio / galeria", "معرض أعمال / صور"),
    badge: row("Gallery", "Gallery", "Gallery", "Gallery", "Gallery"),
    description: row(
      "A display site for work, photos, projects, clients, about, and contact.",
      "אתר תצוגה לעבודות, תמונות, פרויקטים, לקוחות, אודות ויצירת קשר.",
      "Sitio de muestra para trabajos, fotos, proyectos, clientes y contacto.",
      "Site de exibição para trabalhos, fotos, projetos, clientes e contato.",
      "موقع عرض للأعمال والصور والمشاريع والعملاء والتواصل."
    ),
    preview: row("Portfolio", "Portfolio", "Portfolio", "Portfolio", "Portfolio"),
  },
  "course-digital": {
    title: row("Digital course", "קורס דיגיטלי", "Curso digital", "Curso digital", "دورة رقمية"),
    badge: row("Course", "Course", "Course", "Course", "Course"),
    description: row(
      "A digital-course site with hero, syllabus, benefits, pricing, reviews, and signup.",
      "אתר לקורס דיגיטלי עם Hero, סילבוס, יתרונות, מחירון, ביקורות והרשמה.",
      "Sitio de curso con hero, temario, ventajas, precios, reseñas y registro.",
      "Site de curso com hero, ementa, vantagens, preços, avaliações e cadastro.",
      "موقع دورة مع Hero ومنهج ومزايا وأسعار ومراجعات وتسجيل."
    ),
    preview: row("Course", "Course", "Course", "Course", "Course"),
  },
  "mini-saas": {
    title: row("Mini SaaS for business", "Mini SaaS לעסק", "Mini SaaS para el negocio", "Mini SaaS para o negócio", "Mini SaaS للعمل"),
    badge: row("SaaS", "SaaS", "SaaS", "SaaS", "SaaS"),
    description: row(
      "A small-system site: product, features, bot, signup, payment, and demo.",
      "אתר למערכת קטנה: הצגת מוצר, פיצ׳רים, בוט, הרשמה, תשלום ודמו.",
      "Sitio para un sistema pequeño: producto, funciones, bot, registro, pago y demo.",
      "Site para um sistema pequeno: produto, recursos, bot, cadastro, pagamento e demo.",
      "موقع لنظام صغير: منتج وميزات وبوت وتسجيل ودفع وعرض."
    ),
    preview: row("Mini SaaS", "Mini SaaS", "Mini SaaS", "Mini SaaS", "Mini SaaS"),
  },
  "restaurant-events": {
    title: row("Restaurant / events", "מסעדה / אירועים", "Restaurante / eventos", "Restaurante / eventos", "مطعم / فعاليات"),
    badge: row("Events", "Events", "Events", "Events", "Events"),
    description: row(
      "A site for a restaurant, hall, events, or workshops — with gallery, reservations, events, and contact.",
      "אתר למסעדה, אולם, אירועים או סדנאות — עם גלריה, הזמנות, אירועים ויצירת קשר.",
      "Sitio para restaurante, salón o talleres — con galería, reservas, eventos y contacto.",
      "Site para restaurante, salão ou oficinas — com galeria, reservas, eventos e contato.",
      "موقع لمطعم أو قاعة أو ورش — مع معرض وحجوزات وفعاليات وتواصل."
    ),
    preview: row("Events", "Events", "Events", "Events", "Events"),
  },
  "blank-professional": {
    title: row("Professional blank site", "אתר ריק מקצועי", "Sitio vacío profesional", "Site vazio profissional", "موقع فارغ احترافي"),
    badge: row("Blank", "Blank", "Blank", "Blank", "Blank"),
    description: row(
      "A clean base for a fast start — header, empty hero, basic, and contact.",
      "בסיס נקי להתחלה מהירה — Header, Hero ריק, Basic ויצירת קשר.",
      "Base limpia para empezar rápido — cabecera, hero vacío, básico y contacto.",
      "Base limpa para começar rápido — cabeçalho, hero vazio, básico e contato.",
      "أساس نظيف للبدء السريع — ترويسة وHero فارغ وأساسي وتواصل."
    ),
    preview: row("Blank", "Blank", "Blank", "Blank", "Blank"),
  },
};

const PAGE_PICKER_CHROME = {
  newSection: row("New section", "סקשן חדש", "Nueva sección", "Nova seção", "قسم جديد"),
  section: row("Section", "סקשן", "Sección", "Seção", "قسم"),
  missingTemplate: row(
    "No template was found for this type yet. You can edit it or change the layout later.",
    "לא נמצאה עדיין תבנית לסוג הזה. אפשר לערוך או להחליף מבנה בהמשך.",
    "Aún no hay plantilla para este tipo. Puedes editarla o cambiar la estructura después.",
    "Ainda não há modelo para este tipo. Você pode editar ou trocar a estrutura depois.",
    "لا يوجد قالب لهذا النوع بعد. يمكنكِ تحريره أو تغيير الهيكل لاحقاً."
  ),
};

const PALETTES = {
  "luxury-purple": {
    name: row("Luxury Purple", "Luxury Purple", "Luxury Purple", "Luxury Purple", "Luxury Purple"),
    description: row("Luxury, modern, good for beauty and premium businesses", "יוקרתי, מודרני, מתאים לעסקי יופי ופרימיום", "De lujo y moderno, para belleza y premium", "Luxuoso e moderno, para beleza e premium", "فاخر وحديث، مناسب للجمال والأعمال الراقية"),
  },
  "rose-gold": {
    name: row("Rose Gold", "Rose Gold", "Rose Gold", "Rose Gold", "Rose Gold"),
    description: row("Feminine, luxury, soft, and sales-ready", "נשי, יוקרתי, רך ומכירתי", "Femenino, de lujo, suave y comercial", "Feminino, luxuoso, suave e comercial", "أنثوي وفاخر وناعم وبيعي"),
  },
  "black-gold": {
    name: row("Black & Gold", "Black & Gold", "Black & Gold", "Black & Gold", "Black & Gold"),
    description: row("Elegant, dramatic, and especially luxurious", "אלגנטי, דרמטי ויוקרתי במיוחד", "Elegante, dramático y muy lujoso", "Elegante, dramático e especialmente luxuoso", "أنيق ودرامي وفاخر جداً"),
  },
  "nude-elegant": {
    name: row("Nude Elegant", "Nude Elegant", "Nude Elegant", "Nude Elegant", "Nude Elegant"),
    description: row("Clean, gentle, and professional", "נקי, עדין ומקצועי", "Limpio, suave y profesional", "Limpo, suave e profissional", "نظيف ولطيف ومهني"),
  },
  "ocean-modern": {
    name: row("Ocean Modern", "Ocean Modern", "Ocean Modern", "Ocean Modern", "Ocean Modern"),
    description: row("Modern, clean, and technical", "מודרני, נקי וטכנולוגי", "Moderno, limpio y tecnológico", "Moderno, limpo e tecnológico", "حديث ونظيف وتقني"),
  },
  "minimal-mono": {
    name: row("Minimal Monochrome", "Minimal Monochrome", "Minimal Monochrome", "Minimal Monochrome", "Minimal Monochrome"),
    description: row("Minimal, clean, and elegant", "מינימליסטי, נקי ואלגנטי", "Minimalista, limpio y elegante", "Minimalista, limpo e elegante", "بسيط ونظيف وأنيق"),
  },
  "cream-bronze": {
    name: row("Cream Bronze", "Cream Bronze", "Cream Bronze", "Cream Bronze", "Cream Bronze"),
    description: row("Cream and bronze, clean and very luxurious", "שמנת, ברונזה, נקי ויוקרתי מאוד", "Crema y bronce, limpio y muy lujoso", "Creme e bronze, limpo e muito luxuoso", "كريمي وبرونزي، نظيف وفاخر جداً"),
  },
  "emerald-luxury": {
    name: row("Emerald Luxury", "Emerald Luxury", "Emerald Luxury", "Emerald Luxury", "Emerald Luxury"),
    description: row("Luxury emerald green, deep and modern", "ירוק אמרלד יוקרתי, עמוק ומודרני", "Verde esmeralda de lujo, profundo y moderno", "Verde esmeralda luxuoso, profundo e moderno", "أخضر زمردي فاخر وعميق وحديث"),
  },
  "clean-blue": {
    name: row("Clean Blue", "Clean Blue", "Clean Blue", "Clean Blue", "Clean Blue"),
    description: row("Business-clean, good for service providers and SaaS", "עסקי, נקי, מתאים לנותני שירות ו־SaaS", "Empresarial y limpio, para servicios y SaaS", "Empresarial e limpo, para serviços e SaaS", "عملي ونظيف، مناسب لمقدمي الخدمات وSaaS"),
  },
  "soft-pink": {
    name: row("Soft Pink", "Soft Pink", "Soft Pink", "Soft Pink", "Soft Pink"),
    description: row("Soft pink, clean and modern for beauty and lifestyle", "ורוד עדין, נקי ומודרני לעסקי יופי ולייף סטייל", "Rosa suave, limpio y moderno para belleza y lifestyle", "Rosa suave, limpo e moderno para beleza e lifestyle", "وردي ناعم ونظيف وحديث للجمال ونمط الحياة"),
  },
  champagne: {
    name: row("Champagne", "Champagne", "Champagne", "Champagne", "Champagne"),
    description: row("Champagne, soft gold, and a clean premium look", "שמפניה, זהב רך ומראה פרימיום נקי", "Champán, oro suave y look premium limpio", "Champanhe, ouro suave e visual premium limpo", "شامبانيا وذهب ناعم ومظهر فاخر نظيف"),
  },
  "dark-violet": {
    name: row("Dark Violet", "Dark Violet", "Dark Violet", "Dark Violet", "Dark Violet"),
    description: row("Dark, technical, dramatic, and very modern", "כהה, טכנולוגי, דרמטי ומאוד מודרני", "Oscuro, tecnológico, dramático y muy moderno", "Escuro, tecnológico, dramático e muito moderno", "داكن وتقني ودرامي وحديث جداً"),
  },
  "pearl-luxury": {
    name: row("Pearl Luxury", "Pearl Luxury", "Pearl Luxury", "Pearl Luxury", "Pearl Luxury"),
    description: row("Pearl white, clean, elegant, and good for a premium brand", "לבן פנינה, נקי, אלגנטי ומתאים למותג פרימיום", "Blanco perla, limpio, elegante y premium", "Branco pérola, limpo, elegante e premium", "أبيض لؤلؤي نظيف وأنيق ومناسب لعلامة فاخرة"),
  },
  espresso: {
    name: row("Espresso", "Espresso", "Espresso", "Espresso", "Espresso"),
    description: row("Deep brown, luxury and warm for lifestyle, coffee, and design", "חום עמוק, יוקרתי וחמים לעסקי לייף סטייל, קפה ועיצוב", "Marrón profundo, lujoso y cálido para lifestyle, café y diseño", "Marrom profundo, luxuoso e quente para lifestyle, café e design", "بني عميق وفاخر ودافئ لنمط الحياة والقهوة والتصميم"),
  },
  "sage-modern": {
    name: row("Sage Modern", "Sage Modern", "Sage Modern", "Sage Modern", "Sage Modern"),
    description: row("Soft sage green, clean, natural, and calming", "ירוק מרווה עדין, נקי, טבעי ומרגיע", "Verde salvia suave, limpio, natural y calmante", "Verde sálvia suave, limpo, natural e calmante", "أخضر مريمية ناعم ونظيف وطبيعي ومهدئ"),
  },
  "royal-blue": {
    name: row("Royal Blue", "Royal Blue", "Royal Blue", "Royal Blue", "Royal Blue"),
    description: row("Deep blue, luxury, good for business, consulting, and real estate", "כחול עמוק, יוקרתי, מתאים לעסקים, ייעוץ ונדל״ן", "Azul profundo y de lujo, para negocios, consultoría e inmobiliaria", "Azul profundo e luxuoso, para negócios, consultoria e imóveis", "أزرق عميق وفاخر، مناسب للأعمال والاستشارات والعقارات"),
  },
  "midnight-gold": {
    name: row("Midnight Gold", "Midnight Gold", "Midnight Gold", "Midnight Gold", "Midnight Gold"),
    description: row("Black-blue with gold, a strong modern premium look", "שחור־כחול עם זהב, מראה פרימיום חזק ומודרני", "Negro-azul con oro, look premium moderno y fuerte", "Preto-azul com ouro, visual premium moderno e forte", "أسود-أزرق مع ذهب، مظهر فاخر حديث وقوي"),
  },
  "coral-fresh": {
    name: row("Coral Fresh", "Coral Fresh", "Coral Fresh", "Coral Fresh", "Coral Fresh"),
    description: row("Fresh coral, youthful, good for lifestyle, food, and events", "קורל רענן, צעיר, מתאים ללייף סטייל, אוכל ואירועים", "Coral fresco y joven, para lifestyle, comida y eventos", "Coral fresco e jovem, para lifestyle, comida e eventos", "مرجاني منعش وشاب، مناسب لنمط الحياة والطعام والفعاليات"),
  },
  "lavender-clean": {
    name: row("Lavender Clean", "Lavender Clean", "Lavender Clean", "Lavender Clean", "Lavender Clean"),
    description: row("Clean, soft lavender for beauty, clinics, and gentle brands", "לבנדר נקי ועדין, מתאים ליופי, קליניקות ומותגים רכים", "Lavanda limpia y suave para belleza, clínicas y marcas suaves", "Lavanda limpa e suave para beleza, clínicas e marcas suaves", "لافندر نظيف وناعم للجمال والعيادات والعلامات اللطيفة"),
  },
  "graphite-pro": {
    name: row("Graphite Pro", "Graphite Pro", "Graphite Pro", "Graphite Pro", "Graphite Pro"),
    description: row("Professional graphite gray, business-clean and very modern", "אפור גרפיט מקצועי, עסקי, נקי ומאוד מודרני", "Gris grafito profesional, empresarial, limpio y muy moderno", "Cinza grafite profissional, empresarial, limpo e muito moderno", "رمادي جرافيت مهني وعملي ونظيف وحديث جداً"),
  },
};

const FORM_DEFAULTS = {
  title: row("Contact form", "טופס יצירת קשר", "Formulario de contacto", "Formulário de contato", "نموذج تواصل"),
  submit: row("Send message", "שליחת הודעה", "Enviar mensaje", "Enviar mensagem", "إرسال رسالة"),
  success: row("Thank you! We received your inquiry and will get back to you soon.", "תודה! קיבלנו את הפנייה ונחזור אליך בהקדם.", "¡Gracias! Recibimos tu consulta y te responderemos pronto.", "Obrigado! Recebemos sua consulta e retornaremos em breve.", "شكراً! استلمنا استفسارك وسنعود إليك قريباً."),
  fieldN: row("Field {{count}}", "שדה {{count}}", "Campo {{count}}", "Campo {{count}}", "حقل {{count}}"),
  email: row("Email address", "כתובת אימייל", "Dirección de email", "Endereço de e-mail", "عنوان البريد"),
  phone: row("Phone", "טלפון", "Teléfono", "Telefone", "هاتف"),
  message: row("Message", "הודעה", "Mensaje", "Mensagem", "رسالة"),
  messagePh: row("Write here...", "כתבו כאן...", "Escribe aquí...", "Escreva aqui...", "اكتبي هنا..."),
  number: row("Number", "מספר", "Número", "Número", "رقم"),
  numberPh: row("Enter a number", "הזינו מספר", "Introduce un número", "Informe um número", "أدخلي رقماً"),
  date: row("Date", "תאריך", "Fecha", "Data", "تاريخ"),
  choice: row("Choice", "בחירה", "Elección", "Escolha", "اختيار"),
  option1: row("Option 1", "אפשרות 1", "Opción 1", "Opção 1", "الخيار 1"),
  option2: row("Option 2", "אפשרות 2", "Opción 2", "Opção 2", "الخيار 2"),
  option3: row("Option 3", "אפשרות 3", "Opción 3", "Opção 3", "الخيار 3"),
  consent: row("I agree", "אני מאשר/ת", "Acepto", "Eu concordo", "أوافق"),
  uploadFile: row("File upload", "העלאת קובץ", "Subida de archivo", "Envio de arquivo", "رفع ملف"),
  newField: row("New field", "שדה חדש", "Campo nuevo", "Novo campo", "حقل جديد"),
  typeHere: row("Type here", "הקלידו כאן", "Escribe aquí", "Digite aqui", "اكتبي هنا"),
  stepDetails: row("Details", "פרטים", "Datos", "Dados", "تفاصيل"),
  stepChoice: row("Choice", "בחירה", "Elección", "Escolha", "اختيار"),
  stepSubmit: row("Submit", "שליחה", "Envío", "Envio", "إرسال"),
};

const PORTAL_PAGE = {
  badge: row("Personal-area page", "עמוד אזור אישי", "Página de área personal", "Página da área pessoal", "صفحة المنطقة الشخصية"),
  regularPage: row("Regular page", "עמוד רגיל", "Página normal", "Página comum", "صفحة عادية"),
  status: row("Status", "סטטוס", "Estado", "Status", "الحالة"),
  variables: row("Variables", "משתנים", "Variables", "Variáveis", "متغيرات"),
  data: row("Data", "נתונים", "Datos", "Dados", "بيانات"),
  perClient: row("Personal per customer", "אישיים לפי לקוח", "Personales por cliente", "Pessoais por cliente", "شخصية حسب العميل"),
  global: row("Global", "גלובליים", "Globales", "Globais", "عامة"),
  title: row("Set up a dynamic customer page", "הגדרת עמוד דינמי ללקוחות", "Configurar una página dinámica", "Configurar uma página dinâmica", "إعداد صفحة ديناميكية للعملاء"),
  subtitle: row(
    "After sign-in each customer sees only their personal CRM-file data — not the same value for everyone.",
    "אחרי התחברות כל לקוח רואה רק את הנתונים האישיים שלו מתיק ה-CRM — לא אותו ערך לכולם.",
    "Tras entrar, cada cliente ve solo sus datos del CRM.",
    "Após entrar, cada cliente vê só os dados do CRM.",
    "بعد الدخول يرى كل عميل بياناته فقط من ملف CRM."
  ),
  sideHint: row(
    "Here the business defines which variables exist on the page. Later the CRM connects customers and the system pulls each customer's data.",
    "כאן העסק מגדיר אילו משתנים קיימים בעמוד. אחר כך ב־CRM מחברים לקוחות, והמערכת מושכת לכל לקוח את הנתונים שלו.",
    "Aquí el negocio define las variables. Luego el CRM conecta clientes y el sistema trae sus datos.",
    "Aqui o negócio define as variáveis. Depois o CRM conecta clientes e o sistema puxa os dados.",
    "هنا يعرّف العمل المتغيرات. لاحقاً يربط CRM العملاء ويسحب النظام بياناتهم."
  ),
  enableTitle: row("Turn into a personal-area page", "הפוך לעמוד אזור אישי", "Convertir en página de área personal", "Tornar página da área pessoal", "تحويل إلى صفحة المنطقة الشخصية"),
  enableText: row("The page will be available only to signed-in or assigned customers.", "העמוד יהיה זמין רק ללקוחות שמחוברים או משויכים.", "La página solo estará disponible para clientes conectados o asignados.", "A página ficará disponível só para clientes conectados ou atribuídos.", "ستكون الصفحة متاحة فقط للعملاء المتصلين أو المعيَّنين."),
  loginTitle: row("Require customer sign-in", "דורש התחברות לקוח", "Requiere acceso del cliente", "Exige entrada do cliente", "يتطلب تسجيل دخول العميل"),
  loginText: row("A customer will see the page only after signing in with email and password.", "לקוח יראה את העמוד רק אחרי התחברות עם מייל וסיסמה.", "El cliente verá la página solo después de entrar con email y contraseña.", "O cliente verá a página só após entrar com e-mail e senha.", "يرى العميل الصفحة فقط بعد الدخول بالبريد وكلمة المرور."),
  whoCanSee: row("Who can see it", "מי יכול לראות", "Quién puede verla", "Quem pode ver", "من يمكنه رؤيتها"),
  assignedOnly: row("Assigned customers only", "לקוחות משויכים בלבד", "Solo clientes asignados", "Somente clientes atribuídos", "العملاء المعيَّنون فقط"),
  paidOnly: row("Paying customers only", "לקוחות משלמים בלבד", "Solo clientes de pago", "Somente clientes pagantes", "العملاء الدافعون فقط"),
  allSignedIn: row("All signed-in customers", "כל הלקוחות המחוברים", "Todos los clientes conectados", "Todos os clientes conectados", "كل العملاء المتصلين"),
  dataType: row("Data type", "סוג נתונים", "Tipo de datos", "Tipo de dados", "نوع البيانات"),
  personalData: row("Personal data per customer", "נתונים אישיים לפי לקוח", "Datos personales por cliente", "Dados pessoais por cliente", "بيانات شخصية حسب العميل"),
  sharedData: row("One value for everyone", "נתון כללי לכולם", "Un valor para todos", "Um valor para todos", "قيمة واحدة للجميع"),
  monthlyPrice: row("Monthly page price", "מחיר חודשי לעמוד", "Precio mensual de la página", "Preço mensal da página", "السعر الشهري للصفحة"),
  dynamicVars: row("Dynamic page variables", "משתנים דינמיים בעמוד", "Variables dinámicas de la página", "Variáveis dinâmicas da página", "متغيرات الصفحة الديناميكية"),
  dynamicVarsHint: row(
    "Each variable is data the business can show to the customer or collect from them. For example: title, status, task list, file, date, payment, appointment.",
    "כל משתנה הוא דאטה שהעסק יכול להציג ללקוח או לקבל מהלקוח. לדוגמה: כותרת, סטטוס, רשימת משימות, קובץ, תאריך, תשלום, פגישה.",
    "Cada variable es un dato que el negocio puede mostrar o recoger. Ej.: título, estado, tareas, archivo, fecha, pago, cita.",
    "Cada variável é um dado que o negócio pode mostrar ou coletar. Ex.: título, status, tarefas, arquivo, data, pagamento, reunião.",
    "كل متغير بيان يمكن للعمل عرضه أو جمعه. مثال: عنوان، حالة، مهام، ملف، تاريخ، دفع، موعد."
  ),
  addVariable: row("+ Add variable", "+ הוספת משתנה", "+ Añadir variable", "+ Adicionar variável", "+ إضافة متغير"),
  noVariables: row("This page has no variables yet", "עדיין אין משתנים בעמוד", "Aún no hay variables en la página", "Ainda não há variáveis na página", "لا توجد متغيرات في الصفحة بعد"),
  noVariablesHint: row(
    "Tap “Add variable” so the business can define which information appears for the customer on this page.",
    "לחצי על “הוספת משתנה” כדי לאפשר לעסק להגדיר איזה מידע יופיע ללקוח בעמוד הזה.",
    "Pulsa “Añadir variable” para definir qué información verá el cliente.",
    "Toque em “Adicionar variável” para definir quais informações o cliente verá.",
    "انقري «إضافة متغير» لتعريف المعلومات التي يراها العميل."
  ),
  displayName: row("Display name", "שם לתצוגה", "Nombre visible", "Nome de exibição", "اسم العرض"),
  fieldType: row("Field type", "סוג שדה", "Tipo de campo", "Tipo de campo", "نوع الحقل"),
  dataSource: row("Data source", "מקור הנתון", "Origen del dato", "Origem do dado", "مصدر البيان"),
  technicalName: row("Technical variable name", "שם משתנה טכני", "Nombre técnico", "Nome técnico", "الاسم التقني"),
  dataScope: row("Data scope", "היקף נתונים", "Alcance de datos", "Escopo dos dados", "نطاق البيانات"),
  personalScope: row("Personal per customer", "אישי לפי לקוח", "Personal por cliente", "Pessoal por cliente", "شخصي حسب العميل"),
  globalScope: row("Shared for all customers", "כללי לכל הלקוחות", "Común para todos", "Comum para todos", "مشترك لكل العملاء"),
  placeholder: row("Placeholder", "Placeholder", "Placeholder", "Placeholder", "عنصر نائب"),
  shownToClient: row("Shown to the customer", "מוצג ללקוח", "Visible para el cliente", "Visível para o cliente", "ظاهر للعميل"),
  shownToClientText: row("The customer will see this variable on the page", "הלקוח יראה את המשתנה בעמוד", "El cliente verá esta variable en la página", "O cliente verá esta variável na página", "سيرى العميل هذا المتغير في الصفحة"),
  clientCanEdit: row("The customer can edit", "הלקוח יכול לערוך", "El cliente puede editar", "O cliente pode editar", "يمكن للعميل التعديل"),
  clientCanEditText: row("The customer will be able to enter or update the value", "הלקוח יוכל להזין או לעדכן את הערך", "El cliente podrá introducir o actualizar el valor", "O cliente poderá informar ou atualizar o valor", "سيتمكن العميل من إدخال القيمة أو تحديثها"),
  required: row("Required field", "שדה חובה", "Campo obligatorio", "Campo obrigatório", "حقل إلزامي"),
  requiredText: row("It cannot be submitted empty", "לא ניתן לשלוח בלי למלא", "No se puede enviar vacío", "Não pode ser enviado vazio", "لا يمكن الإرسال دون تعبئة"),
  insertToPage: row("Insert into the page", "הכנסה לעמוד", "Insertar en la página", "Inserir na página", "إدراج في الصفحة"),
  delete: row("Delete", "מחיקה", "Eliminar", "Excluir", "حذف"),
};

export function extraGrapesChromeLocaleObject(locale) {
  return {
    studio: {
      kind: pickLocaleMap(KIND_EXTRA, locale),
      nav: pickLocaleMap(NAV, locale),
      emptyPage: pickLocaleMap(EMPTY_PAGE, locale),
      seed: pickLocaleMap(SEED, locale),
      grapes: pickLocaleMap(GRAPES, locale),
      grapesStudio: pickLocaleMap(GRAPES_STUDIO, locale),
      blocks: pickLocaleMap(BLOCKS, locale),
      studioTemplates: pickNested(STUDIO_TEMPLATES, locale),
      pagePicker: {
        ...pickNested(PAGE_PICKER, locale),
        ...pickLocaleMap(PAGE_PICKER_CHROME, locale),
      },
      palettes: pickNested(PALETTES, locale),
      formBuilder: {
        defaults: pickLocaleMap(FORM_DEFAULTS, locale),
      },
      portalPage: pickLocaleMap(PORTAL_PAGE, locale),
    },
  };
}
