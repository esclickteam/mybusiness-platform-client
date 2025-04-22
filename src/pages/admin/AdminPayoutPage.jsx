import React, { useState } from "react";
import { CSVLink } from "react-csv";
import "./AdminPayoutPage.css";

const mockData = [
  {
    businessName: "פתרונות יוסי",
    phone: "050-1234567",
    amount: 432,
    bankName: "בנק הפועלים",
    branch: "123",
    account: "12345678",
    idNumber: "302114567",
    receiptUrl: "/receipts/abcd1234/2025-04.pdf",
  },
  {
    businessName: "בית הקפה של דנה",
    phone: "052-9988877",
    amount: 310,
    bankName: "בנק לאומי",
    branch: "456",
    account: "9876543",
    idNumber: "284563218",
    receiptUrl: "",
  },
];

const AdminPayoutPage = () => {
  const [month, setMonth] = useState("2025-04");

  const headers = [
    { label: "שם העסק", key: "businessName" },
    { label: "טלפון", key: "phone" },
    { label: "סכום עמלות", key: "amount" },
    { label: "בנק", key: "bankName" },
    { label: "סניף", key: "branch" },
    { label: "מס' חשבון", key: "account" },
    { label: "ת.ז / ח.פ", key: "idNumber" },
    { label: "קובץ קבלה", key: "receiptUrl" },
  ];

  return (
    <div className="admin-payout-page">
      <h1>דו"ח תשלומים לשותפים</h1>

      <label htmlFor="month">בחר חודש:</label>
      <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="2025-04">אפריל 2025</option>
        <option value="2025-03">מרץ 2025</option>
        <option value="2025-02">פברואר 2025</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>שם עסק</th>
            <th>טלפון</th>
            <th>סכום</th>
            <th>בנק</th>
            <th>סניף</th>
            <th>חשבון</th>
            <th>ת.ז</th>
            <th>קבלה</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((partner, idx) => (
            <tr key={idx}>
              <td>{partner.businessName}</td>
              <td>{partner.phone}</td>
              <td>₪{partner.amount}</td>
              <td>{partner.bankName}</td>
              <td>{partner.branch}</td>
              <td>{partner.account}</td>
              <td>{partner.idNumber}</td>
              <td>
                {partner.receiptUrl ? (
                  <a href={partner.receiptUrl} target="_blank" rel="noreferrer">
                    📎 צפייה
                  </a>
                ) : (
                  "אין קבלה"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="export-button">
        <CSVLink data={mockData} headers={headers} filename={`payouts-${month}.csv`}>
          📤 ייצוא ל-CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default AdminPayoutPage;
