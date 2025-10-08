import React from "react";
import "./MySales.css";
import { Link } from "react-router-dom";

function MySales() {
  const sales = [
    {
      id: 1,
      client: "Y.M. Solutions Business",
      phone: "0501234567",
      plan: "Premium",
      amount: 490,
      date: "2024-02-22",
      status: "Closed"
    },
    {
      id: 2,
      client: "Michal Cohen",
      phone: "0549876543",
      plan: "Basic",
      amount: 99,
      date: "2024-02-18",
      status: "Closed"
    },
    {
      id: 3,
      client: "Green Tech",
      phone: "0588888888",
      plan: "Advanced",
      amount: 199,
      date: "2024-02-10",
      status: "Closed"
    }
  ];

  const totalSales = sales.length;
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const commissionRate = 0.05;
  const commission = totalAmount * commissionRate;

  return (
    <div className="my-sales">
      <h1>📦 Package Sales</h1>

      <Link to="/staff/dashboard" className="back-dashboard">🔙 Back to Dashboard</Link>

      <div className="sales-summary">
        <p>🔢 Number of Sales: <strong>{totalSales}</strong></p>
        <p>💰 Total Amount: <strong>{totalAmount} ₪</strong></p>
        <p>🧾 Estimated Commission (5%): <strong>{commission.toFixed(2)} ₪</strong></p>
      </div>

      <ul className="sales-list">
        {sales.map((sale) => (
          <li key={sale.id}>
            <p><strong>{sale.client}</strong> – {sale.phone}</p>
            <p>🛍️ Package: {sale.plan} | 💰 {sale.amount} ₪ | 📅 {sale.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MySales;
