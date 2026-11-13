import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "../../components/home-experience/homeCopy";
import { CrmBoard, CrmWindow, WhatsAppOverlay, WhatsAppSplit } from "../../components/home-experience/MomentAlternatives";
import "../../styles/homeExperience.css";
import "../../styles/momentLab.css";

function LabSection({
  id,
  label,
  eyebrow,
  title,
  lead,
  points,
  cta,
  shot,
  flip = false,
  note,
}: {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
  cta: string;
  shot: ReactNode;
  flip?: boolean;
  note?: string;
}) {
  return (
    <article className="lab-block" id={id}>
      <p className="lab-label">{label}</p>
      <section className={`ht-feature${flip ? " is-flip" : ""}`}>
        <div className="ht-wrap ht-feature-grid">
          <div className="ht-feature-copy">
            <p className="ht-eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p className="ht-lead">{lead}</p>
            <ul className="ht-points">
              {points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            {note ? <p className="ht-note">{note}</p> : null}
            <div className="hx-actions">
              <Link className="hx-btn hx-btn-line text-inherit" to="/crm"><span>{cta}</span><i aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="ht-feature-media">{shot}</div>
        </div>
      </section>
    </article>
  );
}

export default function HomeMomentLab() {
  const { i18n } = useTranslation();
  const language = i18n.language || "he";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  return (
    <main className="hx-page lab-page" dir={getTextDirection(language)}>
      <LabSection
        id="crm-a"
        label={text("CRM · חלופה א · הלוח", "CRM · Option A · the board")}
        eyebrow={text("CRM וניהול לידים", "CRM and lead management")}
        title={text("כל ליד, כל שיחה, כל משימה — בכרטיס אחד.", "Every lead, conversation and task — on one record.")}
        lead={text(
          "רשימת לידים שאפשר לסנן, כרטיס לקוח עם סטטוס, מקור, הערות, משימות ופגישות, והיסטוריית פעילות שנשמרת אוטומטית.",
          "A lead list you can filter, a customer record with status, source, notes, tasks and meetings, and an activity history that saves itself.",
        )}
        points={[
          text("סטטוסים מותאמים לתהליך המכירה", "Statuses that match your sales process"),
          text("מקור הליד נשמר על כל רשומה", "The lead source is kept on every record"),
          text("הערות, תיעוד שיחות ומשימות עם מועד", "Notes, call logs and dated tasks"),
          text("ייבוא וייצוא ל־CSV ו־Excel", "Import and export with CSV and Excel"),
        ]}
        cta={text("להכיר את ה־CRM", "Explore the CRM")}
        shot={<CrmBoard />}
      />
      <LabSection
        id="crm-b"
        label={text("CRM · חלופה ב · החלון", "CRM · Option B · the window")}
        eyebrow={text("CRM וניהול לידים", "CRM and lead management")}
        title={text("כל ליד, כל שיחה, כל משימה — בכרטיס אחד.", "Every lead, conversation and task — on one record.")}
        lead={text(
          "רשימת לידים שאפשר לסנן, כרטיס לקוח עם סטטוס, מקור, הערות, משימות ופגישות, והיסטוריית פעילות שנשמרת אוטומטית.",
          "A lead list you can filter, a customer record with status, source, notes, tasks and meetings, and an activity history that saves itself.",
        )}
        points={[
          text("סטטוסים מותאמים לתהליך המכירה", "Statuses that match your sales process"),
          text("מקור הליד נשמר על כל רשומה", "The lead source is kept on every record"),
          text("הערות, תיעוד שיחות ומשימות עם מועד", "Notes, call logs and dated tasks"),
          text("ייבוא וייצוא ל־CSV ו־Excel", "Import and export with CSV and Excel"),
        ]}
        cta={text("להכיר את ה־CRM", "Explore the CRM")}
        shot={<CrmWindow />}
      />
      <LabSection
        id="wa-a"
        flip
        label={text("WhatsApp · חלופה א · שני משטחים", "WhatsApp · Option A · two surfaces")}
        eyebrow="WhatsApp Business API"
        title={text("השיחות עם הלקוחות, מחוברות לעסק.", "Customer conversations, connected to the business.")}
        lead={text(
          "חיבור רשמי ל־WhatsApp Business API דרך Meta: תיבת שיחות משותפת, תבניות הודעה, נתוני ביצועים וחיבור לכרטיס הלקוח.",
          "An official WhatsApp Business API connection through Meta: a shared inbox, message templates, performance data and a link to the customer record.",
        )}
        points={[
          text("תיבת דואר נכנס לכל הצוות", "One inbox for the whole team"),
          text("תבניות הודעה מאושרות לשליחה יזומה", "Approved templates for outbound messages"),
          text("נתוני שליחה, קריאה ותגובה", "Sent, read and reply data"),
        ]}
        note={text(
          "החיבור כפוף לתהליך האישור ולמדיניות של Meta. תשובות חופשיות אפשריות בחלון 24 השעות שאחרי הודעת הלקוח.",
          "The connection follows Meta's approval process and policies. Free-form replies are possible within 24 hours of the customer's last message.",
        )}
        cta={text("להכיר את WhatsApp API", "Explore the WhatsApp API")}
        shot={<WhatsAppSplit />}
      />
      <LabSection
        id="wa-b"
        flip
        label={text("WhatsApp · חלופה ב · השיחה מתוך הכרטיס", "WhatsApp · Option B · the thread from the record")}
        eyebrow="WhatsApp Business API"
        title={text("השיחות עם הלקוחות, מחוברות לעסק.", "Customer conversations, connected to the business.")}
        lead={text(
          "חיבור רשמי ל־WhatsApp Business API דרך Meta: תיבת שיחות משותפת, תבניות הודעה, נתוני ביצועים וחיבור לכרטיס הלקוח.",
          "An official WhatsApp Business API connection through Meta: a shared inbox, message templates, performance data and a link to the customer record.",
        )}
        points={[
          text("תיבת דואר נכנס לכל הצוות", "One inbox for the whole team"),
          text("תבניות הודעה מאושרות לשליחה יזומה", "Approved templates for outbound messages"),
          text("נתוני שליחה, קריאה ותגובה", "Sent, read and reply data"),
        ]}
        note={text(
          "החיבור כפוף לתהליך האישור ולמדיניות של Meta. תשובות חופשיות אפשריות בחלון 24 השעות שאחרי הודעת הלקוח.",
          "The connection follows Meta's approval process and policies. Free-form replies are possible within 24 hours of the customer's last message.",
        )}
        cta={text("להכיר את WhatsApp API", "Explore the WhatsApp API")}
        shot={<WhatsAppOverlay />}
      />
    </main>
  );
}
