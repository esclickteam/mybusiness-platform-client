/** Visible FAQ for /partners. Answers follow the published partner terms. */

const en = [
  [
    "What does the membership include?",
    "After approval, a signed agreement and verified payment, International Partner membership (Business Partner) opens the Partner Center and the published partner resources while the membership is active. You may introduce the products the agreement allows and earn the published commission on eligible revenue that was actually received. Membership does not include source code, white-label rights, an exclusive territory, or a guaranteed income. The Affiliate percent track has no membership fee and is a different appointment.",
  ],
  [
    "How much does it cost to join?",
    "The application is free. Business Partner is $299 per month or $2,990 per year after approval. Twelve monthly payments are $3,588, so the annual membership is $598 less. Affiliate has no membership fee on the percent track. Reseller, White Label, Exclusive Territory and Strategic Partner follow the plan named in the signed agreement. When a fee applies, it is collected manually outside this website, and only after approval. The page does not charge a card.",
  ],
  [
    "How are commissions calculated?",
    "On eligible subscription revenue that has actually been received, the International Partner tiers are 30% for 1–19 active paying customers, 35% for 20–39, and 40% for 40 or more. Eligible one-time transactions earn 10%. The signed agreement decides what is eligible. The Affiliate percent track is currently 15% of eligible sales in the catalog, and it does not use this tier table. This page does not change the formulas. Earnings are not guaranteed.",
  ],
  [
    "Can I receive recurring monthly commission?",
    "Recurring commission is calculated on eligible subscription revenue that was actually received, while the customer remains attributed and eligible. It can continue from month to month on that basis. There is no guaranteed monthly income. The calculator on this page is an illustration only. It is not a forecast and it is not net profit after expenses.",
  ],
  [
    "How do partners move between commission tiers?",
    "The rate follows the current number of active paying customers under the signed agreement. 1–19 customers: 30%. 20–39 customers: 35%. 40 or more: 40%. Crossing into the next band uses the higher rate. Dropping below a band uses the lower rate. You do not purchase a tier. These are commission rates, not three subscription prices. Only eligible subscription revenue that was actually received is counted.",
  ],
  [
    "Which products can partners sell?",
    "When the signed agreement allows it, partners can introduce CRM and lead management, WhatsApp Business API, Meta campaign tools for Facebook and Instagram ads, business automations, and websites available in Bizuply today. Meta campaign tools are included with the Bizuply Business plan after an authorized Meta ad account is connected. Meta bills media spend. Partners earn on eligible Bizuply subscription revenue, not on Meta ad spend. WhatsApp use is subject to Meta policy, approvals and messaging costs. BeautyFlow, Global Properties, Dinevo, TableFlow and Cliny are industry platforms in the Bizuply catalog. A partner introduces one only when the signed agreement allows that platform. Membership does not include source code, white-label rights or a distribution right.",
  ],
  [
    "When are commissions paid?",
    "Eligible commissions are tracked in the partner ledger. Withdrawals and payouts follow the partner system rules and the signed agreement. Commission follows revenue that was received. Refunds and cancellations reduce or reverse unpaid commission as the agreement and the ledger require. Membership fees are a separate payment, collected manually outside this website after approval.",
  ],
  [
    "Who supports the customers?",
    "Bizuply provides platform support at support@bizuply.com. The signed agreement sets the partner's responsibilities. WhatsApp and Meta remain subject to those providers' policies. Membership does not transfer ownership of the software or add a support service the agreement does not cover.",
  ],
  [
    "Can partners market worldwide?",
    "Only inside the territory named in the agreement, unless Bizuply gives prior written approval for another territory. Permission to work in another territory does not itself grant exclusivity. Monthly and annual membership do not choose a territory.",
  ],
  [
    "How do I cancel a membership?",
    "Ending the membership closes benefits that require an active membership, including the Partner Center. It does not rewrite payments already recorded. Commission remains payable only for customers and periods that were already eligible under the agreement. After a customer cancels a subscription, future recurring commission on that subscription stops. Any notice or termination terms are the ones in the signed agreement. This page does not add a cancellation promise.",
  ],
  [
    "Is there regional exclusivity?",
    "Not by default. Monthly and annual Business Partner membership do not include exclusivity. An exclusive territory exists only when the signed agreement says exclusive, the territory is available, both parties have signed, and the required payment is complete.",
  ],
  [
    "Does the partner receive ownership of the source code?",
    "No. Selling SaaS grants the customer a right to use the software under the license. It does not transfer ownership of Bizuply source code or intellectual property to the partner or the customer. White-label branding is a capability of entitled plans such as Partner Premium, and International Partner membership alone does not include it.",
  ],
  [
    "How are customers attributed to partners?",
    "A customer is attributed when that customer is recorded through the existing partner attribution in the partner system. Commission follows that record and the signed agreement. Opening this page, or sending someone to it, does not by itself attribute a customer.",
  ],
  [
    "Who can apply?",
    "Marketing agencies, business consultants, development and website companies, automation specialists, software marketers, and other businesses that want to introduce Bizuply. Every application is reviewed. Submitting the form does not approve the partnership.",
  ],
];

const he = [
  [
    "מה כוללת החברות?",
    "אחרי אישור, הסכם חתום ותשלום שאומת, חברות השותף הבינלאומי (Business Partner) פותחת את מרכז השותפים ואת המשאבים שפורסמו, כל עוד החברות פעילה. אפשר להציג את המוצרים שההסכם מתיר ולהרוויח את העמלה שפורסמה על הכנסה זכאית שהתקבלה בפועל. החברות אינה כוללת קוד מקור, זכויות White Label, טריטוריה בלעדית או הבטחת הכנסה. מסלול Affiliate הוא מינוי אחר, בלי דמי חברות.",
  ],
  [
    "כמה עולה להצטרף?",
    "הגשת הבקשה ללא תשלום. Business Partner עולה 299 דולר לחודש או 2,990 דולר לשנה אחרי אישור. שנים־עשר תשלומים חודשיים הם 3,588 דולר, ולכן המסלול השנתי זול ב־598 דולר. במסלול Affiliate אין דמי חברות. Reseller, White Label, Exclusive Territory ו־Strategic Partner לפי המסלול שנקבע בהסכם החתום. כשיש דמי חברות, הם נגבים ידנית מחוץ לאתר ורק אחרי אישור. העמוד הזה אינו מתחיל חיוב.",
  ],
  [
    "איך מחושבות העמלות?",
    "על הכנסת מנוי זכאית שהתקבלה בפועל, המדרגות לשותף הבינלאומי הן 30% עבור 1 עד 19 לקוחות משלמים פעילים, 35% עבור 20 עד 39, ו־40% עבור 40 או יותר. עסקאות חד־פעמיות זכאיות מזכות ב־10%. ההסכם החתום קובע מה זכאי. מסלול Affiliate הוא כיום 15% ממכירות זכאיות לפי הקטלוג, והוא אינו משתמש בטבלת המדרגות הזו. העמוד אינו משנה את הנוסחאות. אין הבטחת הכנסה.",
  ],
  [
    "האם אפשר לקבל עמלה חודשית חוזרת?",
    "עמלה חוזרת מחושבת על הכנסת מנוי זכאית שהתקבלה בפועל, כל עוד הלקוח משויך וזכאי. היא יכולה להמשיך מחודש לחודש על הבסיס הזה. אין הבטחת הכנסה חודשית. המחשבון בעמוד הוא המחשה בלבד. הוא אינו תחזית ואינו רווח נקי אחרי הוצאות.",
  ],
  [
    "איך עוברים בין המדרגות?",
    "השיעור עוקב אחרי המספר העדכני של לקוחות משלמים פעילים, לפי ההסכם החתום. עד 19 לקוחות השיעור הוא 30 אחוז. מ־20 ועד 39 השיעור הוא 35 אחוז. מ־40 לקוחות השיעור הוא 40 אחוז. מעבר לטווח הבא מעלה את השיעור, וירידה מתחת לטווח מורידה אותו. לא רוכשים מדרגה. אלה שיעורי עמלה, לא שלושה מחירי מנוי. נספרת רק הכנסת מנוי זכאית שהתקבלה בפועל.",
  ],
  [
    "אילו מוצרים אפשר למכור?",
    "כשההסכם מתיר זאת, אפשר להציג CRM וניהול לידים, WhatsApp Business API, כלי קמפיין של Meta ל־Facebook ול־Instagram, אוטומציות עסקיות ואתרים שזמינים ב־Bizuply היום. כלי הקמפיין של Meta כלולים בחבילת Business אחרי חיבור חשבון מודעות מורשה. את הוצאת המדיה גובה Meta. העמלה נגזרת מהכנסת מנוי זכאית של Bizuply, לא מהוצאת הפרסום. השימוש ב־WhatsApp כפוף למדיניות Meta, לאישורים ולעלויות ההודעות. BeautyFlow, Global Properties, Dinevo, TableFlow ו־Cliny הן פלטפורמות תחום בקטלוג של Bizuply. שותף מציג אחת מהן רק כשההסכם החתום מתיר את הפלטפורמה. החברות אינה כוללת קוד מקור, זכויות White Label או זכות הפצה.",
  ],
  [
    "מתי משלמים עמלות?",
    "עמלות זכאיות נרשמות בספרי השותף. משיכות ותשלומים נעשים לפי כללי מערכת השותפים ולפי ההסכם. העמלה נגזרת מהכנסה שהתקבלה. החזרים וביטולים מפחיתים או הופכים עמלה שלא שולמה, לפי ההסכם ולפי הספרים. דמי החברות הם תשלום נפרד, ידני, מחוץ לאתר, אחרי אישור.",
  ],
  [
    "מי נותן תמיכה ללקוחות?",
    "תמיכה בפלטפורמה ניתנת על ידי Bizuply בכתובת support@bizuply.com. ההסכם החתום קובע את האחריות של השותף. WhatsApp ו־Meta כפופים למדיניות שלהם. החברות אינה מעבירה בעלות על התוכנה ואינה מוסיפה שירות תמיכה שההסכם אינו מכסה.",
  ],
  [
    "האם אפשר לשווק בעולם?",
    "רק בתוך הטריטוריה שמופיעה בהסכם, אלא אם Bizuply אישרה בכתב מראש טריטוריה נוספת. אישור לפעול במקום אחר אינו מעניק בלעדיות. החברות החודשית והשנתית אינן בוחרות טריטוריה.",
  ],
  [
    "איך מבטלים חברות?",
    "סיום החברות סוגר הטבות שדורשות חברות פעילה, כולל מרכז השותפים. הוא אינו משכתב תשלומים שכבר תועדו. עמלה ממשיכה רק עבור לקוחות ותקופות שכבר היו זכאים לפי ההסכם. אחרי שלקוח מבטל מנוי, עמלה חוזרת עתידית על אותו מנוי נעצרת. תנאי הודעה מוקדמת או סיום הם אלה שבהסכם החתום. העמוד אינו מוסיף הבטחת ביטול.",
  ],
  [
    "האם יש בלעדיות אזורית?",
    "לא כברירת מחדל. חברות Business Partner חודשית או שנתית אינה כוללת בלעדיות. טריטוריה בלעדית קיימת רק כשההסכם החתום קובע בלעדיות, הטריטוריה פנויה, שני הצדדים חתמו, והתשלום הנדרש הושלם.",
  ],
  [
    "האם השותף מקבל בעלות על קוד המקור?",
    "לא. מכירת SaaS מעניקה ללקוח זכות שימוש לפי הרישיון. היא אינה מעבירה בעלות על קוד המקור או על הקניין הרוחני של Bizuply. מיתוג White Label הוא יכולת של מסלולים זכאים, כמו Partner Premium. חברות השותף הבינלאומי לבדה אינה כוללת אותו.",
  ],
  [
    "איך לקוחות משויכים לשותף?",
    "לקוח משויך כשהוא נרשם במנגנון השיוך הקיים במערכת השותפים. העמלה נגזרת מהרישום ומההסכם. כניסה לעמוד הזה, או שליחת מישהו אליו, אינה משייכת לקוח בפני עצמה.",
  ],
  [
    "מי יכול להגיש מועמדות?",
    "סוכנויות שיווק, יועצים עסקיים, חברות פיתוח ואתרים, מומחי אוטומציות, משווקי תוכנה ועסקים נוספים שרוצים להציג את Bizuply. כל בקשה נבדקת. שליחת הטופס אינה מאשרת את השותפות.",
  ],
];

export function partnerFaqPairs(language) {
  return String(language || "").startsWith("he") ? he : en;
}
