import React from "react";
import { useTranslation } from "react-i18next";
import { getIntlLocale } from "../../i18n/localeUtils";

const RecentActivityTable = ({ activities = [] }) => {
  const { t, i18n } = useTranslation();

  if (!activities.length) {
    return (
      <p style={{ textAlign: "center" }}>{t("dashboard.recentActivitiesTable.empty")}</p>
    );
  }

  return (
    <div className="graph-box">
      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
        📝 {t("dashboard.recentActivitiesTable.title")}
      </h4>
      <table style={{ width: "100%", fontSize: "14px", direction: "ltr" }}>
        <thead>
          <tr>
            <th scope="col">{t("dashboard.recentActivitiesTable.date")}</th>
            <th scope="col">{t("dashboard.recentActivitiesTable.actionType")}</th>
            <th scope="col">{t("dashboard.recentActivitiesTable.details")}</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((item) => (
            <tr key={item.id || item._id || item.date /* or fallback */}>
              <td>
                {new Date(item.date).toLocaleDateString(getIntlLocale(i18n.language))}
              </td>
              <td>{item.type}</td>
              <td>{item.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
