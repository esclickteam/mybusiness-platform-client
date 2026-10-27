/**
 * Deeper guide copy for /website-builder.
 * Prices match the public pricing data: website only $129/year,
 * website add-on $99/year, business plan $99/month or $990/year,
 * expert website build $399 one-time.
 */

function section(title, lead, items, steps) {
  return { title, lead, items, steps };
}

const links = [
  { href: "/guides/build-a-website-without-code", label: "How to edit a Bizuply website" },
  { href: "/guides/website-form-to-crm", label: "How a website form becomes a lead" },
  { href: "/guides/what-is-a-crm", label: "What a CRM is" },
  { href: "/pricing", label: "Pricing" },
  { href: "/crm", label: "CRM" },
  { href: "/appointments", label: "Appointments" },
];

const en = {
  linksTitle: "Related reading",
  links,
  sections: [
    section(
      "Why a business needs its own website",
      "A social profile is useful for attention. A website is the address you own: a place where services, products, and a next step stay available after a post has moved down the feed.",
      [
        { title: "A page you control", text: "You decide the structure, the words, and the action you want a visitor to take. A social network decides the layout, the reach, and what happens to the page if the account changes." },
        { title: "A path, not only a post", text: "Visitors can move from a clear offer to services, a product, a booking request, or a contact form. That path is harder to build inside a single profile." },
        { title: "A record of the inquiry", text: "When a supported form is connected, the inquiry can enter a CRM lead instead of staying as a comment or a direct message." },
      ],
    ),
    section(
      "How to build a business website in Bizuply",
      "The practical path is short. You start from a real template, shape it in the visual editor, check it on more than one screen, and publish when the page is ready for a visitor.",
      null,
      [
        "Choose a template that matches the business and the action you want visitors to take.",
        "Edit the text, images, colors, and sections so the page sounds like the business.",
        "Preview the desktop and mobile views in the editor before you publish.",
        "Add a contact or inquiry form if the site should create a lead.",
        "Publish to a Bizuply address, or connect a domain that the plan supports.",
        "Keep editing after launch. Saving keeps a draft. Publishing is what a visitor can open.",
      ],
    ),
    section(
      "Brochure site, store, service site, landing page, or booking site",
      "These are different jobs. The right starting template depends on what the visitor should understand and do. Store and booking features depend on the template and the setup.",
      [
        { title: "Brochure site", text: "Presents the business, the services, and a clear way to get in touch. It is the usual starting point for a professional presence." },
        { title: "Online store", text: "Presents products and a shopping experience through the commerce options available in that setup. Payments and catalog tools vary by plan." },
        { title: "Service site", text: "Explains the work, who it is for, and how an engagement starts. A form or a consultation request is usually the main action." },
        { title: "Landing page", text: "Focuses on one offer and one next step. It is useful when a campaign or a single service needs a dedicated page." },
        { title: "Booking site", text: "Helps people discover a service and request or schedule a time through the scheduling features available in the configuration." },
      ],
    ),
    section(
      "How to choose a template",
      "Start from the visitor's job, then from the look. A handsome template that hides the next step is a weak starting point.",
      [
        { title: "Match the business", text: "A clinic, a restaurant, a store, and a software company do not need the same first screen. Pick a layout that already speaks that industry." },
        { title: "Match the action", text: "If the goal is a reservation, a product, or a consultation, the template should make that action visible without a hunt." },
        { title: "Check the first screen", text: "The headline, the navigation, and the button should be readable in the frame. Then look at the same template on a phone." },
      ],
    ),
    section(
      "What the visual editor can change",
      "Bizuply's editor is a visual workspace for the pages in your site. It is built for the changes a business makes often, not for writing the site as custom code.",
      [
        { title: "Text, images, and color", text: "You can change headings and body text, replace images, and adjust colors so the template reflects the brand." },
        { title: "Sections and pages", text: "You organize the sections the template provides and shape the pages around the content you actually need." },
        { title: "A preview before publish", text: "The editor includes desktop and mobile preview, so you can review the layout before a visitor sees it." },
      ],
    ),
    section(
      "Desktop, tablet, and phone",
      "The published website plans include mobile, tablet, and desktop layouts. The editor's device preview is there so you can check the same page before it goes live.",
      [
        { title: "Read the first screen on a phone", text: "Navigation, the headline, and the main button should stay understandable without pinching." },
        { title: "Keep the action visible", text: "A contact form, a product, or a booking request should still be reachable on a narrow screen." },
        { title: "Review the template you chose", text: "Layouts differ. Preview the specific template you are publishing instead of assuming every design behaves the same way." },
      ],
    ),
    section(
      "A website builder and a custom-built website",
      "A builder is a structured way to create and maintain pages. A custom build can go further technically, and it usually costs more time and development work. Bizuply also offers a separate expert-setup service on top of the platform. That service is not included in the subscription.",
      [
        { title: "Builder", text: "Fits a business that wants a professional site, its own content, and the ability to update pages without a development project." },
        { title: "Custom development", text: "Fits a product with requirements the template system does not cover. It trades speed for flexibility." },
        { title: "Expert setup", text: "A Bizuply specialist builds from an existing template, using content you provide. The published one-time service is separate from the yearly website plan." },
      ],
    ),
    section(
      "What happens after a visitor sends a form",
      "A published form can create a lead whose source is the website, once CRM is part of the setup. The website plan's published feature list includes a site lead form linked to CRM. The full CRM product is priced on its own.",
      [
        { title: "The visitor sends the form", text: "The form should ask only for what the team needs in order to reply." },
        { title: "A lead can be created", text: "Supported submissions enter the CRM with the website as the source. The usual first status for a new lead is New." },
        { title: "The team continues the conversation", text: "From the lead, the team can follow up with the tools connected to that account, including appointments where that module is part of the plan." },
      ],
    ),
    section(
      "Domain and publishing",
      "Publishing is the moment a visitor can open the site. Until then, saving keeps a draft in the editor.",
      [
        { title: "A Bizuply address or your domain", text: "The website plans support publishing on a Bizuply address or connecting your own domain. The exact setup depends on the plan and the domain." },
        { title: "A domain for the first year", text: "The published website plan and the website add-on include a free domain for the first year." },
        { title: "After the included year", text: "Renewal terms are the ones shown on the pricing page. This page does not add a separate domain price." },
      ],
    ),
    section(
      "What makes a website clear",
      "These are editing principles, not extra product features. They are the difference between a template and a site a customer can use.",
      [
        { title: "One idea on the first screen", text: "Say what the business does and what the visitor can do next." },
        { title: "Few, obvious actions", text: "A reservation, a product, or a question should not compete with five equal buttons." },
        { title: "Real words", text: "Replace the template's sample sentences with the services, the place, and the terms you actually offer." },
        { title: "Readable type", text: "Contrast and size matter on a phone as much as they do on a desktop." },
      ],
    ),
    section(
      "SEO when you launch a website",
      "Search visibility starts with a page that is understandable. The website plan includes basic page SEO. It does not replace a separate marketing program.",
      [
        { title: "A specific title and description", text: "Each important page should say what it is about in the title and the description a search result can show." },
        { title: "Headings that match the page", text: "One clear main heading, then sections that answer the questions a visitor actually has." },
        { title: "A page people can use", text: "Mobile layout, working links, and a real way to enquire matter as much as the wording." },
      ],
    ),
    section(
      "Costs to plan for",
      "These are the published prices. A business plan does not include the website, and expert setup is not included in either subscription.",
      [
        { title: "Website only", text: "$129 per year. Visual builder, templates, publishing, a lead form linked to CRM, and a free domain for the first year. It renews yearly and can be cancelled." },
        { title: "Website add-on", text: "$99 per year when a website is added to a business plan. It also includes a free domain for the first year." },
        { title: "Business system", text: "$99 per month or $990 per year for CRM, appointments, collaborations, and automations. The website is a separate add-on." },
        { title: "Expert website build", text: "$399 once, for a site of up to five pages from an existing template, with your content, a lead form, CRM connection, domain connection, and up to two revision rounds. An extra page is $49. Content writing is $149. A basic store is an additional $399. Advanced custom design is an additional $799." },
      ],
    ),
  ],
  extraFaq: [
    ["Why have a website if the business already has a social page?", "A social page helps people notice you. A website is a destination you structure yourself, with your services, products, and a direct way to enquire. It also stays available when a social post is no longer at the top of a feed."],
    ["What does a Bizuply website cost?", "The published website-only plan is $129 per year. Adding a website to a business plan is $99 per year. The business system itself is $99 per month or $990 per year and does not include the website. Current prices are on the pricing page."],
    ["Is professional website setup included in the subscription?", "No. Expert website setup is a separate one-time service. The published price is $399 for a site of up to five pages built from an existing template. Scope and any extras are confirmed before the work starts."],
    ["What happens after someone submits a form on the website?", "A published form can create a CRM lead with the website as its source when CRM is part of the setup. A new lead normally starts with the status New, and the team continues from that record."],
    ["How do I put the website on my own domain?", "Website plans can publish on a Bizuply address or connect a domain. They include a free domain for the first year. The available setup depends on the plan and on the domain configuration."],
  ],
};

const he = {
  linksTitle: "קריאה קשורה",
  links: [
    { href: "/guides/build-a-website-without-code", label: "איך עורכים אתר ב־Bizuply" },
    { href: "/guides/website-form-to-crm", label: "איך טופס באתר הופך לליד" },
    { href: "/guides/what-is-a-crm", label: "מהו CRM" },
    { href: "/pricing", label: "מחירים" },
    { href: "/crm", label: "CRM" },
    { href: "/appointments", label: "תורים" },
  ],
  sections: [
    section("למה לעסק צריך אתר משלו", "עמוד ברשת חברתית טוב לתשומת לב. אתר הוא כתובת שבבעלותכם: מקום שבו השירותים, המוצרים והצעד הבא נשארים זמינים גם אחרי שהפוסט ירד בפיד.", [
      { title: "עמוד שאתם קובעים", text: "אתם מחליטים על המבנה, על המילים ועל הפעולה שמבקר אמור לבצע. הרשת החברתית מחליטה על הפריסה, על החשיפה ועל מה שקורה לעמוד אם החשבון משתנה." },
      { title: "מסלול, לא רק פוסט", text: "מבקר יכול לעבור מהצעה ברורה אל שירות, מוצר, בקשת תור או טופס. את המסלול הזה קשה לבנות בתוך פרופיל אחד." },
      { title: "תיעוד של הפנייה", text: "כשטופס נתמך מחובר, הפנייה יכולה להיכנס כליד ב־CRM במקום להישאר כתגובה או כהודעה." },
    ]),
    section("איך בונים אתר עסקי ב־Bizuply", "הדרך המעשית קצרה. מתחילים מתבנית אמיתית, מעצבים אותה בעורך, בודקים ביותר ממסך אחד, ומפרסמים כשהעמוד מוכן למבקר.", null, [
      "בוחרים תבנית שמתאימה לעסק ולפעולה שרוצים שהמבקרים יבצעו.",
      "עורכים טקסט, תמונות, צבעים ואזורים כך שהעמוד יישמע כמו העסק.",
      "בודקים תצוגת מחשב ומובייל בעורך לפני הפרסום.",
      "מוסיפים טופס יצירת קשר אם האתר צריך ליצור ליד.",
      "מפרסמים לכתובת של Bizuply, או מחברים דומיין שהמסלול תומך בו.",
      "ממשיכים לערוך אחרי ההשקה. שמירה שומרת טיוטה. פרסום הוא מה שמבקר יכול לפתוח.",
    ]),
    section("אתר תדמית, חנות, אתר שירות, דף נחיתה או אתר עם תורים", "אלה משימות שונות. התבנית הנכונה תלויה במה שהמבקר צריך להבין ולעשות. חנות ותורים תלויים בתבנית ובהגדרה.", [
      { title: "אתר תדמית", text: "מציג את העסק, את השירותים ודרך ברורה ליצור קשר. זה בדרך כלל נקודת הפתיחה לנוכחות מקצועית." },
      { title: "חנות אונליין", text: "מציגה מוצרים וחוויית קנייה לפי יכולות המסחר הזמינות בהגדרה. תשלומים וקטלוג משתנים לפי המסלול." },
      { title: "אתר שירותים", text: "מסביר את העבודה, למי היא מתאימה ואיך מתחילים. טופס או בקשת ייעוץ הם בדרך כלל הפעולה המרכזית." },
      { title: "דף נחיתה", text: "מתמקד בהצעה אחת ובצעד הבא אחד. הוא מתאים כשקמפיין או שירות יחיד צריכים עמוד משלהם." },
      { title: "אתר עם תורים", text: "עוזר לגלות שירות ולבקש או לקבוע זמן באמצעות יכולות התיאום הזמינות בהגדרה." },
    ]),
    section("איך בוחרים תבנית", "מתחילים מהמשימה של המבקר, ואחר כך מהמראה. תבנית יפה שמסתירה את הצעד הבא היא נקודת פתיחה חלשה.", [
      { title: "התאמה לעסק", text: "קליניקה, מסעדה, חנות וחברת תוכנה לא צריכות את אותו מסך פתיחה. בוחרים פריסה שכבר מדברת את השפה של התחום." },
      { title: "התאמה לפעולה", text: "אם המטרה היא הזמנה, מוצר או ייעוץ, התבנית צריכה להראות את הפעולה בלי חיפוש." },
      { title: "בדיקה של המסך הראשון", text: "הכותרת, הניווט והכפתור צריכים להיות קריאים בתוך המסגרת. אחר כך בודקים את אותה תבנית בטלפון." },
    ]),
    section("מה אפשר לשנות בעורך", "העורך של Bizuply הוא סביבת עבודה ויזואלית לעמודים באתר. הוא בנוי לשינויים שעסק עושה לעיתים קרובות, לא לכתיבת האתר כקוד מותאם.", [
      { title: "טקסט, תמונות וצבע", text: "אפשר לשנות כותרות וטקסט, להחליף תמונות ולהתאים צבעים כך שהתבנית תשקף את המותג." },
      { title: "אזורים ועמודים", text: "מארגנים את האזורים שהתבנית מספקת ובונים את העמודים סביב התוכן שבאמת נחוץ." },
      { title: "תצוגה לפני פרסום", text: "בעורך יש תצוגת מחשב ומובייל, כדי לבדוק את הפריסה לפני שמבקר רואה אותה." },
    ]),
    section("מחשב, טאבלט וטלפון", "מסלולי האתר שפורסמו כוללים פריסה למובייל, לטאבלט ולמחשב. תצוגת המכשירים בעורך נועדה לבדיקה של אותו עמוד לפני שהוא עולה.", [
      { title: "לקרוא את המסך הראשון בטלפון", text: "ניווט, כותרת והכפתור הראשי צריכים להישאר מובנים בלי צביטה." },
      { title: "להשאיר את הפעולה בהישג יד", text: "טופס, מוצר או בקשת תור צריכים להישאר נגישים גם במסך צר." },
      { title: "לבדוק את התבנית שנבחרה", text: "פריסות נבדלות. בודקים את התבנית שמפרסמים, ולא מניחים שכל עיצוב מתנהג אותו דבר." },
    ]),
    section("בונה אתרים ואתר בפיתוח מותאם", "בונה אתרים הוא דרך מסודרת ליצור ולתחזק עמודים. פיתוח מותאם יכול להגיע רחוק יותר מבחינה טכנית, ובדרך כלל דורש יותר זמן ועבודת פיתוח. ל־Bizuply יש גם שירות הקמה נפרד מעל הפלטפורמה. הוא אינו כלול במנוי.", [
      { title: "בונה אתרים", text: "מתאים לעסק שרוצה אתר מקצועי, תוכן משלו ויכולת לעדכן עמודים בלי פרויקט פיתוח." },
      { title: "פיתוח מותאם", text: "מתאים למוצר עם דרישות שמערכת התבניות לא מכסה. הוא מחליף מהירות בגמישות." },
      { title: "הקמה על ידי מומחה", text: "מומחה של Bizuply בונה מתבנית קיימת, עם תוכן שאתם מספקים. השירות החד־פעמי שפורסם נפרד ממסלול האתר השנתי." },
    ]),
    section("מה קורה אחרי ששולחים טופס", "טופס שפורסם יכול ליצור ליד שהמקור שלו הוא האתר, כש־CRM הוא חלק מההגדרה. ברשימת היכולות של מסלול האתר מופיע טופס לידים שמקושר ל־CRM. מוצר ה־CRM המלא מתומחר בנפרד.", [
      { title: "המבקר שולח את הטופס", text: "הטופס צריך לבקש רק את מה שהצוות צריך כדי לחזור." },
      { title: "אפשר ליצור ליד", text: "פניות נתמכות נכנסות ל־CRM כשהמקור הוא האתר. הסטטוס הראשון של ליד חדש הוא בדרך כלל חדש." },
      { title: "הצוות ממשיך את השיחה", text: "מתוך הליד אפשר להמשיך עם הכלים שמחוברים לחשבון, כולל תורים אם המודול הזה חלק מהמסלול." },
    ]),
    section("דומיין ופרסום", "פרסום הוא הרגע שבו מבקר יכול לפתוח את האתר. עד אז, שמירה מחזיקה טיוטה בעורך.", [
      { title: "כתובת של Bizuply או הדומיין שלכם", text: "מסלולי האתר תומכים בפרסום לכתובת של Bizuply או בחיבור דומיין משלכם. ההקמה תלויה במסלול ובדומיין." },
      { title: "דומיין לשנה הראשונה", text: "מסלול האתר ותוספת האתר כוללים דומיין חינם לשנה הראשונה." },
      { title: "אחרי השנה הכלולה", text: "תנאי החידוש הם אלה שמופיעים בעמוד המחירים. העמוד הזה לא מוסיף מחיר דומיין נפרד." },
    ]),
    section("מה הופך אתר לברור", "אלה עקרונות עריכה, לא יכולות מוצר נוספות. הם ההבדל בין תבנית לאתר שלקוח יכול להשתמש בו.", [
      { title: "רעיון אחד במסך הראשון", text: "אומרים מה העסק עושה ומה המבקר יכול לעשות עכשיו." },
      { title: "מעט פעולות ברורות", text: "הזמנה, מוצר או שאלה לא צריכים להתחרות בחמישה כפתורים שווים." },
      { title: "מילים אמיתיות", text: "מחליפים את משפטי הדוגמה בשירותים, במקום ובתנאים שאתם באמת מציעים." },
      { title: "קריאה נוחה", text: "ניגודיות וגודל חשובים בטלפון לא פחות מאשר במחשב." },
    ]),
    section("SEO בהקמת אתר", "נראות בחיפוש מתחילה בעמוד שאפשר להבין. מסלול האתר כולל SEO בסיסי לעמודים. הוא לא מחליף תוכנית שיווק נפרדת.", [
      { title: "כותרת ותיאור מדויקים", text: "כל עמוד חשוב צריך לומר במה הוא עוסק בכותרת ובתיאור שיכולים להופיע בתוצאת חיפוש." },
      { title: "כותרות שמתאימות לעמוד", text: "כותרת ראשית אחת ברורה, ואחר כך אזורים שעונים על השאלות של המבקר." },
      { title: "עמוד שאפשר להשתמש בו", text: "פריסת מובייל, קישורים תקינים ודרך אמיתית לפנות חשובים כמו הניסוח." },
    ]),
    section("עלויות שכדאי להביא בחשבון", "אלה המחירים שפורסמו. המסלול העסקי אינו כולל אתר, והקמה מקצועית אינה כלולה באף אחד מהמנויים.", [
      { title: "אתר בלבד", text: "129 דולר לשנה. עורך ויזואלי, תבניות, פרסום, טופס לידים שמקושר ל־CRM, ודומיין חינם לשנה הראשונה. החיוב שנתי וניתן לביטול." },
      { title: "תוספת אתר", text: "99 דולר לשנה כשמוסיפים אתר למסלול עסקי. גם כאן כלול דומיין חינם לשנה הראשונה." },
      { title: "המערכת העסקית", text: "99 דולר לחודש או 990 דולר לשנה עבור CRM, תורים, שיתופי פעולה ואוטומציות. האתר הוא תוספת נפרדת." },
      { title: "הקמת אתר על ידי מומחה", text: "399 דולר פעם אחת, לאתר של עד חמישה עמודים מתבנית קיימת, עם התוכן שלכם, טופס לידים, חיבור ל־CRM, חיבור דומיין ועד שני סבבי תיקונים. עמוד נוסף עולה 49 דולר. כתיבת תוכן עולה 149 דולר. חנות בסיסית היא תוספת של 399 דולר. עיצוב אישי מתקדם הוא תוספת של 799 דולר." },
    ]),
  ],
  extraFaq: [
    ["למה צריך אתר אם לעסק כבר יש עמוד ברשת חברתית?", "עמוד חברתי עוזר שישימו לב אליכם. אתר הוא יעד שאתם בונים בעצמכם, עם השירותים, המוצרים ודרך ישירה לפנות. הוא נשאר זמין גם כשפוסט כבר לא בראש הפיד."],
    ["כמה עולה אתר ב־Bizuply?", "מסלול אתר בלבד שפורסם הוא 129 דולר לשנה. הוספת אתר למסלול עסקי היא 99 דולר לשנה. המערכת העסקית עצמה עולה 99 דולר לחודש או 990 דולר לשנה ואינה כוללת אתר. המחירים העדכניים בעמוד המחירים."],
    ["הקמה מקצועית כלולה במנוי?", "לא. הקמת אתר על ידי מומחה היא שירות חד־פעמי נפרד. המחיר שפורסם הוא 399 דולר לאתר של עד חמישה עמודים מתבנית קיימת. ההיקף והתוספות נקבעים לפני תחילת העבודה."],
    ["מה קורה אחרי שמישהו שולח טופס באתר?", "טופס שפורסם יכול ליצור ליד ב־CRM כשהמקור הוא האתר, אם CRM הוא חלק מההגדרה. ליד חדש מתחיל בדרך כלל בסטטוס חדש, והצוות ממשיך מתוך הרשומה."],
    ["איך מפרסמים את האתר על הדומיין שלי?", "מסלולי האתר יכולים לפרסם לכתובת של Bizuply או לחבר דומיין. הם כוללים דומיין חינם לשנה הראשונה. ההקמה הזמינה תלויה במסלול ובהגדרת הדומיין."],
  ],
};

const es = {
  linksTitle: "Lecturas relacionadas",
  links: [
    { href: "/guides/build-a-website-without-code", label: "Cómo editar un sitio en Bizuply" },
    { href: "/guides/website-form-to-crm", label: "Cómo un formulario se convierte en un lead" },
    { href: "/guides/what-is-a-crm", label: "Qué es un CRM" },
    { href: "/pricing", label: "Precios" },
    { href: "/crm", label: "CRM" },
    { href: "/appointments", label: "Citas" },
  ],
  sections: [
    section("Por qué un negocio necesita su propio sitio", "Un perfil social sirve para que le vean. Un sitio es una dirección propia: un lugar donde los servicios, los productos y el siguiente paso siguen disponibles cuando una publicación ya no está arriba del feed.", [
      { title: "Una página que usted ordena", text: "Usted decide la estructura, las palabras y la acción que quiere que haga la visita. La red social decide el diseño, el alcance y qué pasa con la página si cambia la cuenta." },
      { title: "Un recorrido, no solo una publicación", text: "La visita puede pasar de una oferta clara a un servicio, un producto, una reserva o un formulario. Ese recorrido es difícil de armar dentro de un solo perfil." },
      { title: "Un registro de la consulta", text: "Cuando un formulario compatible está conectado, la consulta puede entrar como lead en el CRM en lugar de quedar como un comentario o un mensaje." },
    ]),
    section("Cómo crear un sitio de negocio en Bizuply", "El camino práctico es corto. Se empieza con una plantilla real, se ajusta en el editor, se revisa en más de una pantalla y se publica cuando la página está lista para una visita.", null, [
      "Elija una plantilla acorde al negocio y a la acción que quiere que hagan las visitas.",
      "Edite textos, imágenes, colores y secciones para que la página suene al negocio.",
      "Revise la vista de escritorio y de móvil en el editor antes de publicar.",
      "Añada un formulario de contacto si el sitio debe crear un lead.",
      "Publique en una dirección de Bizuply o conecte un dominio que admita el plan.",
      "Siga editando después del lanzamiento. Guardar conserva un borrador. Publicar es lo que una visita puede abrir.",
    ]),
    section("Sitio de presentación, tienda, servicios, landing o reservas", "Son trabajos distintos. La plantilla de partida depende de lo que la visita debe entender y hacer. La tienda y las reservas dependen de la plantilla y de la configuración.", [
      { title: "Sitio de presentación", text: "Muestra el negocio, los servicios y una forma clara de contacto. Suele ser el punto de partida de una presencia profesional." },
      { title: "Tienda en línea", text: "Presenta productos y una experiencia de compra con las opciones de comercio de esa configuración. Pagos y catálogo varían según el plan." },
      { title: "Sitio de servicios", text: "Explica el trabajo, para quién es y cómo empieza. Un formulario o una solicitud de consulta suelen ser la acción principal." },
      { title: "Landing page", text: "Se concentra en una oferta y un siguiente paso. Sirve cuando una campaña o un servicio necesitan una página propia." },
      { title: "Sitio con reservas", text: "Ayuda a descubrir un servicio y a pedir o agendar una hora con las funciones de agenda disponibles." },
    ]),
    section("Cómo elegir una plantilla", "Empiece por la tarea de la visita y después por el aspecto. Una plantilla bonita que esconde el siguiente paso es un mal comienzo.", [
      { title: "Que encaje con el negocio", text: "Una clínica, un restaurante, una tienda y una empresa de software no necesitan la misma primera pantalla." },
      { title: "Que encaje con la acción", text: "Si el objetivo es una reserva, un producto o una consulta, la plantilla debe mostrar esa acción sin buscarla." },
      { title: "Revise la primera pantalla", text: "El título, la navegación y el botón deben leerse dentro del marco. Después mire la misma plantilla en un teléfono." },
    ]),
    section("Qué puede cambiar el editor visual", "El editor de Bizuply es un espacio visual para las páginas del sitio. Está pensado para los cambios frecuentes de un negocio, no para escribir el sitio como código a medida.", [
      { title: "Texto, imágenes y color", text: "Puede cambiar títulos y textos, sustituir imágenes y ajustar colores para que la plantilla refleje la marca." },
      { title: "Secciones y páginas", text: "Organiza las secciones que aporta la plantilla y da forma a las páginas con el contenido que de verdad necesita." },
      { title: "Una vista previa antes de publicar", text: "El editor incluye vista de escritorio y de móvil para revisar el diseño antes de que lo vea una visita." },
    ]),
    section("Ordenador, tableta y teléfono", "Los planes de sitio publicados incluyen diseños para móvil, tableta y escritorio. La vista previa del editor sirve para comprobar esa página antes de publicarla.", [
      { title: "Lea la primera pantalla en el teléfono", text: "La navegación, el título y el botón principal deben entenderse sin hacer zoom." },
      { title: "Deje la acción a mano", text: "Un formulario, un producto o una reserva deben seguir siendo alcanzables en una pantalla estrecha." },
      { title: "Revise la plantilla elegida", text: "Los diseños no son iguales. Compruebe la plantilla que va a publicar en lugar de suponer que todas se comportan igual." },
    ]),
    section("Un creador de sitios y un sitio a medida", "Un creador es una forma estructurada de crear y mantener páginas. Un desarrollo a medida puede llegar más lejos en lo técnico y suele exigir más tiempo de desarrollo. Bizuply también ofrece un servicio de puesta en marcha aparte. No está incluido en la suscripción.", [
      { title: "Creador", text: "Sirve a un negocio que quiere un sitio profesional, su propio contenido y la posibilidad de actualizar páginas sin un proyecto de desarrollo." },
      { title: "Desarrollo a medida", text: "Sirve a un producto con requisitos que el sistema de plantillas no cubre. Cambia velocidad por flexibilidad." },
      { title: "Puesta en marcha profesional", text: "Un especialista de Bizuply construye a partir de una plantilla existente, con el contenido que usted aporta. El servicio único publicado es independiente del plan anual del sitio." },
    ]),
    section("Qué ocurre después de enviar un formulario", "Un formulario publicado puede crear un lead cuyo origen es el sitio, cuando el CRM forma parte de la configuración. La lista pública del plan de sitio incluye un formulario de leads vinculado al CRM. El producto CRM completo tiene su propio precio.", [
      { title: "La visita envía el formulario", text: "El formulario debe pedir solo lo que el equipo necesita para responder." },
      { title: "Se puede crear un lead", text: "Los envíos compatibles entran al CRM con el sitio como origen. El primer estado habitual de un lead nuevo es Nuevo." },
      { title: "El equipo sigue la conversación", text: "Desde el lead se continúa con las herramientas de la cuenta, incluidas las citas si ese módulo forma parte del plan." },
    ]),
    section("Dominio y publicación", "Publicar es el momento en que una visita puede abrir el sitio. Hasta entonces, guardar conserva un borrador en el editor.", [
      { title: "Una dirección de Bizuply o su dominio", text: "Los planes de sitio permiten publicar en una dirección de Bizuply o conectar su dominio. La configuración depende del plan y del dominio." },
      { title: "Un dominio el primer año", text: "El plan de sitio y el complemento de sitio incluyen un dominio gratis durante el primer año." },
      { title: "Después del año incluido", text: "Las condiciones de renovación son las de la página de precios. Esta página no añade un precio de dominio aparte." },
    ]),
    section("Qué hace que un sitio sea claro", "Son principios de edición, no funciones extra. Marcan la diferencia entre una plantilla y un sitio que un cliente puede usar.", [
      { title: "Una idea en la primera pantalla", text: "Diga qué hace el negocio y qué puede hacer la visita a continuación." },
      { title: "Pocas acciones evidentes", text: "Una reserva, un producto o una pregunta no deberían competir con cinco botones iguales." },
      { title: "Palabras reales", text: "Sustituya las frases de ejemplo por los servicios, el lugar y las condiciones que de verdad ofrece." },
      { title: "Texto legible", text: "El contraste y el tamaño importan en el teléfono tanto como en el escritorio." },
    ]),
    section("SEO al lanzar un sitio", "La visibilidad en buscadores empieza por una página comprensible. El plan de sitio incluye SEO básico de página. No sustituye un programa de marketing aparte.", [
      { title: "Un título y una descripción concretos", text: "Cada página importante debe decir de qué trata en el título y en la descripción que puede mostrar un resultado de búsqueda." },
      { title: "Encabezados acordes a la página", text: "Un encabezado principal claro y después secciones que respondan a las preguntas de la visita." },
      { title: "Una página que se pueda usar", text: "El diseño móvil, los enlaces que funcionan y una forma real de consultar importan tanto como el texto." },
    ]),
    section("Costes que conviene prever", "Estos son los precios publicados. El plan de negocio no incluye el sitio, y la puesta en marcha profesional no está incluida en ninguna suscripción.", [
      { title: "Solo sitio", text: "129 dólares al año. Editor visual, plantillas, publicación, formulario de leads vinculado al CRM y dominio gratis el primer año. Se renueva cada año y se puede cancelar." },
      { title: "Complemento de sitio", text: "99 dólares al año cuando se añade un sitio a un plan de negocio. También incluye dominio gratis el primer año." },
      { title: "Sistema de negocio", text: "99 dólares al mes o 990 dólares al año para CRM, citas, colaboraciones y automatizaciones. El sitio es un complemento aparte." },
      { title: "Sitio creado por un especialista", text: "399 dólares una sola vez, para un sitio de hasta cinco páginas a partir de una plantilla, con su contenido, formulario, conexión al CRM, dominio y hasta dos rondas de cambios. Una página extra cuesta 49 dólares. La redacción cuesta 149. Una tienda básica suma 399. Un diseño avanzado a medida suma 799." },
    ]),
  ],
  extraFaq: [
    ["¿Para qué un sitio si el negocio ya tiene una página social?", "Una página social ayuda a que le descubran. Un sitio es un destino que usted estructura, con sus servicios, productos y una forma directa de consultar. Sigue disponible cuando una publicación ya no está arriba del feed."],
    ["¿Cuánto cuesta un sitio en Bizuply?", "El plan publicado de solo sitio es de 129 dólares al año. Añadir un sitio a un plan de negocio cuesta 99 dólares al año. El sistema de negocio cuesta 99 dólares al mes o 990 al año y no incluye el sitio. Los precios actuales están en la página de precios."],
    ["¿La puesta en marcha profesional está incluida en la suscripción?", "No. Es un servicio único aparte. El precio publicado es de 399 dólares para un sitio de hasta cinco páginas a partir de una plantilla existente. El alcance y los extras se confirman antes de empezar."],
    ["¿Qué pasa cuando alguien envía un formulario del sitio?", "Un formulario publicado puede crear un lead en el CRM con el sitio como origen, si el CRM forma parte de la configuración. Un lead nuevo suele empezar en el estado Nuevo y el equipo continúa desde ese registro."],
    ["¿Cómo publico el sitio en mi dominio?", "Los planes de sitio pueden publicarse en una dirección de Bizuply o conectar un dominio. Incluyen un dominio gratis el primer año. La configuración depende del plan y del dominio."],
  ],
};

const pt = {
  linksTitle: "Leitura relacionada",
  links: [
    { href: "/guides/build-a-website-without-code", label: "Como editar um site na Bizuply" },
    { href: "/guides/website-form-to-crm", label: "Como um formulário vira um lead" },
    { href: "/guides/what-is-a-crm", label: "O que é um CRM" },
    { href: "/pricing", label: "Preços" },
    { href: "/crm", label: "CRM" },
    { href: "/appointments", label: "Agenda" },
  ],
  sections: [
    section("Por que uma empresa precisa do próprio site", "Um perfil social serve para chamar atenção. Um site é um endereço seu: um lugar em que serviços, produtos e o próximo passo continuam disponíveis depois que uma publicação saiu do topo do feed.", [
      { title: "Uma página que você organiza", text: "Você decide a estrutura, as palavras e a ação que a visita deve fazer. A rede social decide o layout, o alcance e o que acontece com a página se a conta mudar." },
      { title: "Um caminho, não só uma publicação", text: "A visita pode ir de uma oferta clara para um serviço, um produto, um horário ou um formulário. Esse caminho é difícil de montar dentro de um único perfil." },
      { title: "Um registro do contato", text: "Quando um formulário compatível está ligado, o contato pode entrar como lead no CRM em vez de ficar como comentário ou mensagem." },
    ]),
    section("Como criar um site empresarial na Bizuply", "O caminho prático é curto. Começa-se com um modelo real, ajusta-se no editor, confere-se em mais de uma tela e publica-se quando a página está pronta para uma visita.", null, [
      "Escolha um modelo adequado ao negócio e à ação que você quer das visitas.",
      "Edite textos, imagens, cores e seções para a página soar como a empresa.",
      "Veja as visões de computador e de celular no editor antes de publicar.",
      "Inclua um formulário de contato se o site deve criar um lead.",
      "Publique em um endereço da Bizuply ou conecte um domínio que o plano aceite.",
      "Continue editando depois do lançamento. Salvar guarda um rascunho. Publicar é o que a visita pode abrir.",
    ]),
    section("Site institucional, loja, serviços, landing ou agendamento", "São trabalhos diferentes. O modelo certo depende do que a visita precisa entender e fazer. Loja e agendamento dependem do modelo e da configuração.", [
      { title: "Site institucional", text: "Apresenta a empresa, os serviços e um caminho claro de contato. Costuma ser o começo de uma presença profissional." },
      { title: "Loja online", text: "Apresenta produtos e uma experiência de compra com as opções de comércio daquela configuração. Pagamentos e catálogo variam conforme o plano." },
      { title: "Site de serviços", text: "Explica o trabalho, para quem ele serve e como começa. Um formulário ou um pedido de conversa costuma ser a ação principal." },
      { title: "Landing page", text: "Concentra uma oferta e um próximo passo. Serve quando uma campanha ou um serviço precisam de uma página própria." },
      { title: "Site com agendamento", text: "Ajuda a conhecer um serviço e a pedir ou marcar um horário com os recursos de agenda disponíveis." },
    ]),
    section("Como escolher um modelo", "Comece pela tarefa da visita e depois pela aparência. Um modelo bonito que esconde o próximo passo é um começo fraco.", [
      { title: "Combine com o negócio", text: "Uma clínica, um restaurante, uma loja e uma empresa de software não precisam da mesma primeira tela." },
      { title: "Combine com a ação", text: "Se o objetivo é uma reserva, um produto ou uma consulta, o modelo deve mostrar essa ação sem procura." },
      { title: "Olhe a primeira tela", text: "O título, a navegação e o botão precisam ser legíveis dentro da moldura. Depois veja o mesmo modelo no telefone." },
    ]),
    section("O que o editor visual muda", "O editor da Bizuply é um espaço visual para as páginas do site. Ele serve às mudanças frequentes de uma empresa, não a escrever o site como código sob medida.", [
      { title: "Texto, imagens e cor", text: "Dá para mudar títulos e textos, trocar imagens e ajustar cores para o modelo refletir a marca." },
      { title: "Seções e páginas", text: "Você organiza as seções que o modelo traz e monta as páginas em torno do conteúdo que realmente precisa." },
      { title: "Uma prévia antes de publicar", text: "O editor inclui visão de computador e de celular para revisar o layout antes de uma visita ver." },
    ]),
    section("Computador, tablet e telefone", "Os planos de site publicados incluem layouts para celular, tablet e computador. A prévia de dispositivo do editor existe para conferir essa página antes de publicar.", [
      { title: "Leia a primeira tela no telefone", text: "Navegação, título e botão principal precisam continuar claros sem pinça." },
      { title: "Deixe a ação ao alcance", text: "Um formulário, um produto ou um horário precisam continuar acessíveis numa tela estreita." },
      { title: "Revise o modelo escolhido", text: "Os layouts diferem. Confira o modelo que vai publicar em vez de supor que todos se comportam igual." },
    ]),
    section("Um criador de sites e um site sob medida", "Um criador é um modo estruturado de criar e manter páginas. Um desenvolvimento sob medida pode ir mais longe no técnico e costuma exigir mais tempo de desenvolvimento. A Bizuply também oferece uma implantação profissional à parte. Ela não entra na assinatura.", [
      { title: "Criador", text: "Serve a uma empresa que quer um site profissional, o próprio conteúdo e a possibilidade de atualizar páginas sem um projeto de desenvolvimento." },
      { title: "Desenvolvimento sob medida", text: "Serve a um produto com exigências que o sistema de modelos não cobre. Troca velocidade por flexibilidade." },
      { title: "Implantação profissional", text: "Um especialista da Bizuply monta a partir de um modelo existente, com o conteúdo que você fornece. O serviço avulso publicado é independente do plano anual do site." },
    ]),
    section("O que acontece depois do envio de um formulário", "Um formulário publicado pode criar um lead cuja origem é o site, quando o CRM faz parte da configuração. A lista pública do plano de site inclui um formulário de leads ligado ao CRM. O produto completo de CRM tem preço próprio.", [
      { title: "A visita envia o formulário", text: "O formulário deve pedir só o que a equipe precisa para responder." },
      { title: "Um lead pode ser criado", text: "Envios compatíveis entram no CRM com o site como origem. O primeiro status habitual de um lead novo é Novo." },
      { title: "A equipe continua a conversa", text: "A partir do lead, a equipe segue com as ferramentas da conta, inclusive a agenda quando esse módulo faz parte do plano." },
    ]),
    section("Domínio e publicação", "Publicar é o momento em que uma visita pode abrir o site. Até lá, salvar guarda um rascunho no editor.", [
      { title: "Um endereço da Bizuply ou o seu domínio", text: "Os planos de site publicam em um endereço da Bizuply ou conectam o seu domínio. A configuração depende do plano e do domínio." },
      { title: "Um domínio no primeiro ano", text: "O plano de site e o complemento de site incluem um domínio grátis no primeiro ano." },
      { title: "Depois do ano incluído", text: "As condições de renovação são as da página de preços. Esta página não acrescenta um preço separado de domínio." },
    ]),
    section("O que torna um site claro", "São princípios de edição, não recursos extras. É a diferença entre um modelo e um site que o cliente consegue usar.", [
      { title: "Uma ideia na primeira tela", text: "Diga o que a empresa faz e o que a visita pode fazer em seguida." },
      { title: "Poucas ações óbvias", text: "Uma reserva, um produto ou uma pergunta não devem competir com cinco botões iguais." },
      { title: "Palavras reais", text: "Troque as frases de exemplo pelos serviços, pelo lugar e pelas condições que você realmente oferece." },
      { title: "Texto legível", text: "Contraste e tamanho importam no telefone tanto quanto no computador." },
    ]),
    section("SEO ao lançar um site", "A visibilidade na busca começa com uma página compreensível. O plano de site inclui SEO básico de página. Isso não substitui um programa de marketing separado.", [
      { title: "Título e descrição específicos", text: "Cada página importante deve dizer do que trata no título e na descrição que um resultado de busca pode mostrar." },
      { title: "Títulos que combinam com a página", text: "Um título principal claro e depois seções que respondem às perguntas da visita." },
      { title: "Uma página que dá para usar", text: "Layout no celular, links que funcionam e um caminho real de contato importam tanto quanto o texto." },
    ]),
    section("Custos para prever", "Estes são os preços publicados. O plano de negócios não inclui o site, e a implantação profissional não entra em nenhuma assinatura.", [
      { title: "Somente site", text: "US$ 129 por ano. Editor visual, modelos, publicação, formulário de leads ligado ao CRM e domínio grátis no primeiro ano. Renova todo ano e pode ser cancelado." },
      { title: "Complemento de site", text: "US$ 99 por ano quando um site é acrescentado a um plano de negócios. Também inclui domínio grátis no primeiro ano." },
      { title: "Sistema de negócios", text: "US$ 99 por mês ou US$ 990 por ano para CRM, agenda, colaborações e automações. O site é um complemento à parte." },
      { title: "Site feito por um especialista", text: "US$ 399 uma vez, para um site de até cinco páginas a partir de um modelo, com o seu conteúdo, formulário, ligação ao CRM, domínio e até duas rodadas de ajustes. Uma página extra custa US$ 49. Redação custa US$ 149. Uma loja básica soma US$ 399. Design avançado sob medida soma US$ 799." },
    ]),
  ],
  extraFaq: [
    ["Por que ter um site se a empresa já tem uma página social?", "Uma página social ajuda as pessoas a notarem você. Um site é um destino que você estrutura, com serviços, produtos e um caminho direto de contato. Ele continua disponível quando uma publicação já não está no topo do feed."],
    ["Quanto custa um site na Bizuply?", "O plano publicado só de site é de US$ 129 por ano. Acrescentar um site a um plano de negócios custa US$ 99 por ano. O sistema de negócios custa US$ 99 por mês ou US$ 990 por ano e não inclui o site. Os preços atuais estão na página de preços."],
    ["A implantação profissional está incluída na assinatura?", "Não. É um serviço avulso. O preço publicado é de US$ 399 para um site de até cinco páginas a partir de um modelo existente. O escopo e os extras são confirmados antes do trabalho."],
    ["O que acontece quando alguém envia um formulário do site?", "Um formulário publicado pode criar um lead no CRM com o site como origem, se o CRM fizer parte da configuração. Um lead novo costuma começar no status Novo, e a equipe segue a partir desse registro."],
    ["Como publico o site no meu domínio?", "Os planos de site podem publicar em um endereço da Bizuply ou conectar um domínio. Incluem um domínio grátis no primeiro ano. A configuração depende do plano e do domínio."],
  ],
};

const ar = {
  linksTitle: "قراءات ذات صلة",
  links: [
    { href: "/guides/build-a-website-without-code", label: "كيف تحرّرون موقعاً في Bizuply" },
    { href: "/guides/website-form-to-crm", label: "كيف يصبح نموذج الموقع عميلاً محتملاً" },
    { href: "/guides/what-is-a-crm", label: "ما هو CRM" },
    { href: "/pricing", label: "الأسعار" },
    { href: "/crm", label: "CRM" },
    { href: "/appointments", label: "المواعيد" },
  ],
  sections: [
    section("لماذا يحتاج النشاط إلى موقعه الخاص", "الصفحة على شبكة اجتماعية مفيدة للانتباه. الموقع عنوان تملكونه: مكان تبقى فيه الخدمات والمنتجات والخطوة التالية متاحة بعد أن يبتعد المنشور عن أعلى الصفحة.", [
      { title: "صفحة ترتبونها أنتم", text: "أنتم تقررون البنية والكلمات والإجراء الذي تريدون من الزائر. الشبكة الاجتماعية تقرر التخطيط والوصول وما يحدث للصفحة إذا تغيّر الحساب." },
      { title: "مسار، لا منشور فقط", text: "يستطيع الزائر الانتقال من عرض واضح إلى خدمة أو منتج أو طلب موعد أو نموذج. يصعب بناء هذا المسار داخل ملف واحد." },
      { title: "سجل للاستفسار", text: "حين يكون النموذج المدعوم متصلاً، يمكن أن يدخل الاستفسار كعميل محتمل في CRM بدلاً من أن يبقى تعليقاً أو رسالة." },
    ]),
    section("كيف يُبنى موقع أعمال في Bizuply", "المسار العملي قصير. تبدأون من قالب حقيقي، وتعدّلونه في المحرر، وتراجعونه على أكثر من شاشة، وتنشرون حين تصبح الصفحة جاهزة للزائر.", null, [
      "اختاروا قالباً يناسب النشاط والإجراء الذي تريدون من الزوار.",
      "عدّلوا النصوص والصور والألوان والأقسام ليبدو الصفحة بصوت النشاط.",
      "راجعوا عرض الحاسوب والجوال في المحرر قبل النشر.",
      "أضيفوا نموذج تواصل إذا كان الموقع سيُنشئ عميلاً محتملاً.",
      "انشروا على عنوان Bizuply أو اربطوا نطاقاً تدعمه الخطة.",
      "واصلوا التعديل بعد الإطلاق. الحفظ يُبقي مسودة. النشر هو ما يستطيع الزائر فتحه.",
    ]),
    section("موقع تعريفي أو متجر أو خدمات أو صفحة هبوط أو موقع مواعيد", "هذه مهام مختلفة. القالب المناسب يعتمد على ما يجب أن يفهمه الزائر ويفعله. المتجر والمواعيد يعتمدان على القالب والإعداد.", [
      { title: "موقع تعريفي", text: "يعرض النشاط والخدمات وطريقة واضحة للتواصل. هو عادة بداية الحضور المهني." },
      { title: "متجر إلكتروني", text: "يعرض المنتجات وتجربة شراء بحسب خيارات التجارة في ذلك الإعداد. الدفع والكتالوج يختلفان حسب الخطة." },
      { title: "موقع خدمات", text: "يشرح العمل ولمن هو وكيف يبدأ. النموذج أو طلب الاستشارة هما عادة الإجراء الأساسي." },
      { title: "صفحة هبوط", text: "تركّز على عرض واحد وخطوة تالية واحدة. تناسب حملة أو خدمة تحتاج صفحة خاصة." },
      { title: "موقع مواعيد", text: "يساعد على اكتشاف الخدمة وطلب وقت أو جدولته عبر ميزات الجدولة المتاحة." },
    ]),
    section("كيف تختارون قالباً", "ابدأوا بمهمة الزائر ثم بالمظهر. القالب الجميل الذي يخفي الخطوة التالية بداية ضعيفة.", [
      { title: "مطابقة النشاط", text: "العيادة والمطعم والمتجر وشركة البرمجيات لا تحتاج الشاشة الأولى نفسها." },
      { title: "مطابقة الإجراء", text: "إذا كان الهدف حجزاً أو منتجاً أو استشارة، يجب أن يُظهر القالب هذا الإجراء من دون بحث." },
      { title: "راجعوا الشاشة الأولى", text: "العنوان والتنقل والزر يجب أن تُقرأ داخل الإطار. ثم انظروا إلى القالب نفسه على الهاتف." },
    ]),
    section("ماذا يغيّر المحرر المرئي", "محرر Bizuply مساحة مرئية لصفحات الموقع. هو مبني للتغييرات المتكررة في نشاط، لا لكتابة الموقع كرمز مخصص.", [
      { title: "نص وصور ولون", text: "يمكن تغيير العناوين والنصوص واستبدال الصور وضبط الألوان ليعبّر القالب عن العلامة." },
      { title: "أقسام وصفحات", text: "ترتّبون الأقسام التي يوفّرها القالب وتشكّلون الصفحات حول المحتوى الذي تحتاجونه فعلاً." },
      { title: "معاينة قبل النشر", text: "يتضمن المحرر معاينة للحاسوب والجوال لمراجعة التخطيط قبل أن يراه الزائر." },
    ]),
    section("حاسوب وجهاز لوحي وهاتف", "خطط الموقع المنشورة تتضمن تخطيطات للجوال والجهاز اللوحي والحاسوب. معاينة الجهاز في المحرر موجودة لفحص الصفحة نفسها قبل النشر.", [
      { title: "اقرأوا الشاشة الأولى على الهاتف", text: "التنقل والعنوان والزر الرئيسي يجب أن يبقوا مفهومين من دون تكبير." },
      { title: "أبقوا الإجراء في المتناول", text: "النموذج أو المنتج أو طلب الموعد يجب أن يبقوا ممكنين على شاشة ضيقة." },
      { title: "راجعوا القالب الذي اخترتموه", text: "التخطيطات تختلف. افحصوا القالب الذي ستنشرونه بدلاً من افتراض أن كل تصميم يتصرف بالطريقة نفسها." },
    ]),
    section("منشئ مواقع وموقع مبني حسب الطلب", "المنشئ طريقة منظمة لإنشاء الصفحات وصيانتها. البناء المخصص يمكن أن يذهب أبعد تقنياً، وعادة يحتاج وقت تطوير أكبر. لدى Bizuply أيضاً خدمة إعداد منفصلة فوق المنصة. وهي غير مشمولة في الاشتراك.", [
      { title: "المنشئ", text: "يناسب نشاطاً يريد موقعاً مهنياً ومحتواه الخاص والقدرة على تحديث الصفحات من دون مشروع تطوير." },
      { title: "تطوير مخصص", text: "يناسب منتجاً بمتطلبات لا يغطيها نظام القوالب. يستبدل السرعة بمرونة أكبر." },
      { title: "إعداد على يد متخصص", text: "يبني متخصص من Bizuply انطلاقاً من قالب موجود وبالمحتوى الذي تقدّمونه. الخدمة المنشورة لمرة واحدة منفصلة عن خطة الموقع السنوية." },
    ]),
    section("ماذا يحدث بعد إرسال النموذج", "يمكن لنموذج منشور أن ينشئ عميلاً محتملاً مصدره الموقع، حين يكون CRM جزءاً من الإعداد. قائمة ميزات خطة الموقع المنشورة تتضمن نموذج عملاء مرتبطاً بـ CRM. منتج CRM الكامل له سعره الخاص.", [
      { title: "يرسل الزائر النموذج", text: "ينبغي أن يطلب النموذج فقط ما يحتاجه الفريق للرد." },
      { title: "يمكن إنشاء عميل محتمل", text: "تدخل الإرسالات المدعومة إلى CRM والمصدر هو الموقع. الحالة الأولى المعتادة لعميل جديد هي جديد." },
      { title: "يواصل الفريق الحديث", text: "من بطاقة العميل يواصل الفريق بالأدوات المرتبطة بالحساب، بما فيها المواعيد إذا كانت هذه الوحدة جزءاً من الخطة." },
    ]),
    section("النطاق والنشر", "النشر هو اللحظة التي يستطيع فيها الزائر فتح الموقع. حتى ذلك الحين، الحفظ يُبقي مسودة في المحرر.", [
      { title: "عنوان Bizuply أو نطاقكم", text: "خطط الموقع تنشر على عنوان Bizuply أو تربط نطاقكم. الإعداد يعتمد على الخطة والنطاق." },
      { title: "نطاق للسنة الأولى", text: "خطة الموقع وإضافة الموقع تشملان نطاقاً مجانياً للسنة الأولى." },
      { title: "بعد السنة المشمولة", text: "شروط التجديد هي الظاهرة في صفحة الأسعار. هذه الصفحة لا تضيف سعر نطاق منفصلاً." },
    ]),
    section("ما الذي يجعل الموقع واضحاً", "هذه مبادئ تحرير وليست ميزات إضافية. هي الفرق بين قالب وموقع يستطيع العميل استخدامه.", [
      { title: "فكرة واحدة في الشاشة الأولى", text: "قولوا ماذا يفعل النشاط وما الذي يستطيع الزائر فعله بعد ذلك." },
      { title: "إجراءات قليلة وواضحة", text: "لا ينبغي لحجز أو منتج أو سؤال أن يتنافس مع خمسة أزرار متساوية." },
      { title: "كلمات حقيقية", text: "استبدلوا جمل المثال بالخدمات والمكان والشروط التي تقدمونها فعلاً." },
      { title: "نص مقروء", text: "التباين والحجم مهمان على الهاتف بقدر أهميتهما على الحاسوب." },
    ]),
    section("SEO عند إطلاق موقع", "الظهور في البحث يبدأ بصفحة يمكن فهمها. خطة الموقع تتضمن SEO أساسياً للصفحات. وهو لا يحل محل برنامج تسويق منفصل.", [
      { title: "عنوان ووصف محددان", text: "كل صفحة مهمة ينبغي أن تقول موضوعها في العنوان والوصف الذي قد تعرضه نتيجة البحث." },
      { title: "عناوين تطابق الصفحة", text: "عنوان رئيسي واحد واضح، ثم أقسام تجيب عن أسئلة الزائر." },
      { title: "صفحة يمكن استخدامها", text: "تخطيط الجوال والروابط العاملة وطريقة حقيقية للاستفسار مهمة بقدر الصياغة." },
    ]),
    section("تكاليف يجدر حسابها", "هذه الأسعار المنشورة. الخطة التجارية لا تشمل الموقع، والإعداد المهني غير مشمول في أي اشتراك.", [
      { title: "الموقع وحده", text: "129 دولاراً في السنة. محرر مرئي وقوالب ونشر ونموذج عملاء مرتبط بـ CRM ونطاق مجاني للسنة الأولى. يتجدد سنوياً ويمكن إلغاؤه." },
      { title: "إضافة موقع", text: "99 دولاراً في السنة عند إضافة موقع إلى خطة تجارية. وتشمل أيضاً نطاقاً مجانياً للسنة الأولى." },
      { title: "النظام التجاري", text: "99 دولاراً في الشهر أو 990 دولاراً في السنة لـ CRM والمواعيد والتعاون والأتمتة. الموقع إضافة منفصلة." },
      { title: "بناء الموقع على يد متخصص", text: "399 دولاراً لمرة واحدة، لموقع حتى خمس صفحات من قالب موجود، مع محتواكم ونموذج وربط CRM وربط نطاق وحتى جولتي تعديل. الصفحة الإضافية 49 دولاراً. كتابة المحتوى 149. المتجر الأساسي إضافة 399. التصميم المخصص المتقدم إضافة 799." },
    ]),
  ],
  extraFaq: [
    ["لماذا موقع إذا كان للنشاط صفحة على شبكة اجتماعية؟", "الصفحة الاجتماعية تساعد الناس على ملاحظتكم. الموقع وجهة ترتبونها بأنفسكم، بخدماتكم ومنتجاتكم وطريق مباشر للاستفسار. يبقى متاحاً حين لا يعود المنشور في أعلى الصفحة."],
    ["كم يكلف موقع Bizuply؟", "خطة الموقع وحده المنشورة هي 129 دولاراً في السنة. إضافة موقع إلى خطة تجارية تكلف 99 دولاراً في السنة. النظام التجاري نفسه 99 دولاراً في الشهر أو 990 في السنة ولا يشمل الموقع. الأسعار الحالية في صفحة الأسعار."],
    ["هل الإعداد المهني مشمول في الاشتراك؟", "لا. إعداد الموقع على يد متخصص خدمة منفصلة لمرة واحدة. السعر المنشور 399 دولاراً لموقع حتى خمس صفحات من قالب موجود. يُؤكد النطاق والإضافات قبل بدء العمل."],
    ["ماذا يحدث بعد أن يرسل أحدهم نموذجاً في الموقع؟", "يمكن لنموذج منشور أن ينشئ عميلاً محتملاً في CRM مصدره الموقع، إذا كان CRM جزءاً من الإعداد. يبدأ العميل الجديد عادة بحالة جديد، ويواصل الفريق من ذلك السجل."],
    ["كيف أنشر الموقع على نطاقي؟", "يمكن لخطط الموقع النشر على عنوان Bizuply أو ربط نطاق. وهي تشمل نطاقاً مجانياً للسنة الأولى. يعتمد الإعداد المتاح على الخطة وعلى إعداد النطاق."],
  ],
};

export const WB_DEPTH = { en, he, es, "pt-BR": pt, ar };
