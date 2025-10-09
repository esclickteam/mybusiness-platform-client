import React from "react";
import "./EditSiteContent.css";
import { Link } from "react-router-dom";

function EditSiteContent() {
  const pages = [
    { name: "עמוד הבית", path: "/", editable: true },
    { name: "חבילות", path: "/plans", editable: true },
    { name: "תקנון", path: "/terms", editable: true },
    { name: "אודות", path: "/about", editable: true },
    { name: "שאלות נפוצות", path: "/faq", editable: true },
    { name: "צור קשר", path: "/contact", editable: true },
    { name: "לוח עבודות מהירות", path: "/quick-jobs", editable: true },
    { name: "טופס עבודה מהירה", path: "/quick-jobs/new", editable: false },
    { name: "הרשמה", path: "/register", editable: false },
    { name: "כניסת משתמש", path: "/login", editable: false }
  ];

  return (
    <div className="edit-site-content">
      <Link to="/admin/dashboard" className="back-dashboard">🔙 חזרה לדשבורד</Link>
      <h1>✍️ ניהול תוכן האתר</h1>

      <table className="content-table">
        <thead>
          <tr>
            <th>שם עמוד</th>
            <th>נתיב</th>
            <th>עריכה</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page, index) => (
            <tr key={index}>
              <td>{page.name}</td>
              <td>{page.path}</td>
              <td>
                {page.editable ? (
                  <Link to={page.path} className="edit-btn">✏️ ערוך</Link>
                ) : (
                  <span className="disabled">⛔</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditSiteContent;