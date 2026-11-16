import { useTranslation } from "react-i18next";
import { publicContentAnalyticsEnabled } from "../../lib/publicContentAnalytics.mjs";
import { measurementNotice } from "../../lib/publicContentMeasurementNotice.mjs";
import { normalizeMarketingLocale } from "../../lib/localePath.mjs";

type NoticeProps = {
  className: string;
  headingClass: string;
  textClass: string;
};

export default function PublicContentMeasurementNotice({ className, headingClass, textClass }: NoticeProps) {
  const { i18n } = useTranslation();
  const copy = measurementNotice(normalizeMarketingLocale(i18n.language));
  const lead = publicContentAnalyticsEnabled() ? copy.leadOn : copy.leadOff;

  return (
    <section id="public-content-measurement" className={className}>
      <h2 className={headingClass}>{copy.title}</h2>
      <p className={textClass}>{lead}</p>
      <p className={textClass}>{copy.purpose}</p>
      <h3 className="mb-3 mt-7 text-xl font-semibold leading-snug tracking-[-0.02em] text-slate-950">{copy.eventsTitle}</h3>
      <ul className="mb-5 ms-5 max-w-3xl list-disc space-y-2 text-base leading-8 text-slate-700">
        {copy.events.map((event) => (
          <li key={event.id}>
            <bdi>{event.id}</bdi>
            {". "}
            {event.label}
          </li>
        ))}
      </ul>
      <p className={textClass}>{copy.identifier}</p>
      <p className={textClass}>{copy.notAnonymous}</p>
      <p className={textClass}>{copy.meta}</p>
      <p className={textClass}>{copy.consent}</p>
      <p className={textClass}>{copy.retention}</p>
      <p className={textClass}>{copy.withdraw}</p>
      <p className={textClass}>{copy.deletion}</p>
      <p className={textClass}>{copy.access}</p>
      <p className={textClass}>{copy.separation}</p>
      <h3 className="mb-3 mt-7 text-xl font-semibold leading-snug tracking-[-0.02em] text-slate-950">{copy.cookiesTitle}</h3>
      <div className="mb-5 max-w-3xl overflow-x-auto">
        <table className="w-full border-collapse text-start text-sm leading-6 text-slate-700">
          <thead>
            <tr>
              {copy.columns.map((column) => (
                <th key={column} className="border border-slate-200 px-3 py-2 font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.cookies.map((row) => (
              <tr key={row.name}>
                <td className="border border-slate-200 px-3 py-2"><bdi>{row.name}</bdi></td>
                <td className="border border-slate-200 px-3 py-2">{row.who}</td>
                <td className="border border-slate-200 px-3 py-2">{row.purpose}</td>
                <td className="border border-slate-200 px-3 py-2">{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={textClass}>{copy.change}</p>
    </section>
  );
}
