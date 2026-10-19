import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n/i18n";
import "./styles/index.css";
import AppointmentCalendarBoard, {
  type BoardAppointment,
} from "./pages/business/dashboardPages/crmpages/AppointmentCalendarBoard";
import type { CalendarView } from "./pages/business/dashboardPages/crmpages/appointmentCalendarLayout";
import { toIsoDate } from "./pages/business/dashboardPages/crmpages/appointmentCalendarLayout";
import "./pages/business/dashboardPages/crmpages/crmWorkspace.css";

const today = toIsoDate(new Date());

function makeAppointments(count: number): BoardAppointment[] {
  const names = ["נועה כהן", "יוסי לוי", "דנה מזרחי", "עמית ברק", "ליאור שמש"];
  const services = ["תספורת", "ייעוץ", "טיפול פנים", "צבע", "פגישת היכרות"];
  if (count === 1) {
    return [
      {
        _id: "one",
        date: today,
        time: "10:00",
        duration: 45,
        serviceName: "תספורת",
        status: "scheduled",
        label: "נועה כהן",
      },
    ];
  }
  return Array.from({ length: count }, (_, index) => {
    const dayOffset = index % 6;
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + dayOffset);
    const hour = 8 + (index % 10);
    const overlap = index % 5 === 0 ? 0 : index % 2;
    return {
      _id: `a-${index}`,
      date: toIsoDate(date),
      time: `${String(hour).padStart(2, "0")}:${overlap ? "15" : "00"}`,
      duration: 45,
      serviceName: services[index % services.length],
      status: index % 7 === 0 ? "completed" : "scheduled",
      paid: index % 4 === 0,
      label: names[index % names.length],
    };
  });
}

function makeServices(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    _id: `s-${index}`,
    name: count === 1 ? "תספורת קלאסית" : `שירות ${index + 1}`,
    category: ["שיער", "פנים", "ייעוץ"][index % 3],
    duration: 30 + (index % 4) * 15,
    price: 80 + index * 10,
    active: index !== 3,
    description: "שירות טיפול קצר",
  }));
}

function ServicesPreview({ count, cards }: { count: number; cards?: boolean }) {
  const rows = makeServices(count);
  return (
    <div className="crm-ops" dir="rtl">
      <header className="crm-ops-toolbar">
        <h2>שירותים</h2>
        <div className="crm-ops-stats">
          <span>
            סה״כ: <b>{rows.length}</b>
          </span>
        </div>
      </header>
      {cards ? (
        <div className="crm-svc-grid">
          {rows.map((row) => (
            <article key={row._id} className="crm-svc-card">
              <h4 className="text-sm font-black">{row.name}</h4>
              <p className="text-[11px] font-semibold text-slate-500">
                {row.category} · {row.active ? "פעיל" : "לא פעיל"}
              </p>
              <div className="mt-auto flex justify-between text-xs font-black">
                <span>{row.duration} דק׳</span>
                <span>₪{row.price}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
          <table className="crm-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>קטגוריה</th>
                <th>משך</th>
                <th>מחיר</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id}>
                  <td className="font-extrabold">{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.duration} דק׳</td>
                  <td>₪{row.price}</td>
                  <td>{row.active ? "פעיל" : "לא פעיל"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CalendarPreview({
  view,
  count,
  isMobile,
}: {
  view: CalendarView;
  count: number;
  isMobile?: boolean;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(today);
  const appointments = useMemo(() => makeAppointments(count), [count]);
  const labels = [
    t("crm.appointments.weekdaySun"),
    t("crm.appointments.weekdayMon"),
    t("crm.appointments.weekdayTue"),
    t("crm.appointments.weekdayWed"),
    t("crm.appointments.weekdayThu"),
    t("crm.appointments.weekdayFri"),
    t("crm.appointments.weekdaySat"),
  ];
  return (
    <div className="crm-ops space-y-2" dir="rtl">
      <header className="crm-ops-toolbar">
        <h2>יומן פגישות · {view}</h2>
      </header>
      <AppointmentCalendarBoard
        view={view}
        isMobile={Boolean(isMobile)}
        anchor={new Date()}
        selectedDate={selected}
        weekdayLabels={labels}
        todayIso={today}
        appointments={appointments}
        onSelectDate={setSelected}
        onOpenAppointment={() => undefined}
        onCreateAt={() => undefined}
        onDropAppointment={() => undefined}
      />
    </div>
  );
}

function Harness() {
  const scene = new URLSearchParams(window.location.search).get("scene") || "appointments-month-many";
  if (scene === "appointments-week") return <CalendarPreview view="week" count={24} />;
  if (scene === "appointments-day") return <CalendarPreview view="day" count={24} />;
  if (scene === "appointments-one") return <CalendarPreview view="month" count={1} />;
  if (scene === "appointments-mobile") return <CalendarPreview view="month" count={8} isMobile />;
  if (scene === "services-one") return <ServicesPreview count={1} />;
  if (scene === "services-many") return <ServicesPreview count={20} />;
  if (scene === "services-cards") return <ServicesPreview count={20} cards />;
  return <CalendarPreview view="month" count={24} />;
}

void i18n.changeLanguage("he");
ReactDOM.createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <div className="min-h-screen bg-[#F7F8FC] p-3">
      <Harness />
    </div>
  </I18nextProvider>
);
