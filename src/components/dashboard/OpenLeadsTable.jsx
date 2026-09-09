import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const STATUS_VALUES = ["Awaiting Response", "In Progress", "Closed"];

const STATUS_I18N = {
  "Awaiting Response": "awaitingResponse",
  "In Progress": "inProgress",
  Closed: "closed",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Awaiting Response":
      return "red";
    case "In Progress":
      return "orange";
    case "Closed":
      return "green";
    default:
      return "#555";
  }
};

const OpenLeadsTable = ({ leads = [] }) => {
  const { t, i18n } = useTranslation();
  const today = new Date();
  // Initialize leadList once without useEffect
  const [leadList, setLeadList] = useState(
    Array.isArray(leads) ? leads : []
  );

  const daysSince = (dateStr) => {
    const diff = (today - new Date(dateStr)) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  };

  const cycleStatus = (index) => {
    setLeadList((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const currentIndex = STATUS_VALUES.indexOf(updated[index]?.status);
      updated[index] = {
        ...updated[index],
        status: STATUS_VALUES[(currentIndex + 1) % STATUS_VALUES.length],
      };
      return updated;
    });
    // Future: persist status via API
  };

  const statusLabel = (status) => {
    const key = STATUS_I18N[status];
    return key ? t(`dashboard.openLeads.${key}`) : status;
  };

  // If no leads, show message
  if (!Array.isArray(leadList) || leadList.length === 0) {
    return (
      <div className="graph-box">
        <h4>📥 {t("dashboard.openLeads.title")}</h4>
        <div>{t("dashboard.openLeads.empty")}</div>
      </div>
    );
  }

  return (
    <div className="graph-box">
      <h4>📥 {t("dashboard.openLeads.title")}</h4>
      <table>
        <thead>
          <tr>
            <th>{t("dashboard.openLeads.name")}</th>
            <th>{t("dashboard.openLeads.date")}</th>
            <th>{t("dashboard.openLeads.status")}</th>
            <th>{t("dashboard.openLeads.action")}</th>
          </tr>
        </thead>
        <tbody>
          {leadList.map((lead, i) => (
            <tr key={lead.id || i}>
              <td>{lead.name}</td>
              <td>{new Date(lead.date).toLocaleDateString(i18n.language)}</td>
              <td
                style={{
                  color: getStatusColor(lead.status),
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => cycleStatus(i)}
                title={t("dashboard.openLeads.changeStatusTitle")}
              >
                {statusLabel(lead.status)}
              </td>
              <td>
                <button style={{ fontSize: "12px" }}>
                  {t("dashboard.openLeads.handleNow")}
                </button>
                {daysSince(lead.date) > 2 && (
                  <span
                    style={{ color: "red", fontSize: "12px", marginLeft: "8px" }}
                  >
                    ⏱️ {t("dashboard.openLeads.stale")}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenLeadsTable;
