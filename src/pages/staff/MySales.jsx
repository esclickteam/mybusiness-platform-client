import React from "react";
import "./MySales.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../hooks/useLocaleDir";
import LtrIsolate from "../../components/LtrIsolate";

function MySales() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const sales = [
    {
      id: 1,
      client: "עסק י.מ. פתרונות",
      phone: "0501234567",
      plan: "Premium",
      amount: 490,
      date: "2024-02-22",
      status: "closed",
    },
    {
      id: 2,
      client: "מיכל כהן",
      phone: "0549876543",
      plan: "Basic",
      amount: 99,
      date: "2024-02-18",
      status: "closed",
    },
    {
      id: 3,
      client: "Green Tech",
      phone: "0588888888",
      plan: "Advanced",
      amount: 199,
      date: "2024-02-10",
      status: "closed",
    },
  ];

  const totalSales = sales.length;
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const commissionRate = 0.05;
  const commission = totalAmount * commissionRate;

  return (
    <div className="my-sales" dir={dir}>
      <h1>{t("staff.salesTitle")}</h1>

      <Link to="/staff/dashboard" className="back-dashboard">
        {t("staff.backDashboard")}
      </Link>

      <div className="sales-summary">
        <p>
          {t("staff.salesCount")}: <strong>{totalSales}</strong>
        </p>
        <p>
          {t("staff.totalAmount")}: <strong>{totalAmount} $</strong>
        </p>
        <p>
          {t("staff.estimatedCommission")}:{" "}
          <strong>{commission.toFixed(2)} $</strong>
        </p>
      </div>

      <ul className="sales-list">
        {sales.map((sale) => (
          <li key={sale.id}>
            <p>
              <strong>{sale.client}</strong> –{" "}
              <LtrIsolate>{sale.phone}</LtrIsolate>
            </p>
            <p>
              {t("staff.package")}: {sale.plan} | {sale.amount} $ | {sale.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MySales;
