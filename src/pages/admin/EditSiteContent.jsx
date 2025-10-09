import React from "react";
import "./EditSiteContent.css";
import { Link } from "react-router-dom";

function EditSiteContent() {
  const pages = [
    { name: "Home", path: "/", editable: true },
    { name: "Plans", path: "/plans", editable: true },
    { name: "Terms", path: "/terms", editable: true },
    { name: "About", path: "/about", editable: true },
    { name: "FAQ", path: "/faq", editable: true },
    { name: "Contact", path: "/contact", editable: true },
    { name: "Quick Jobs Board", path: "/quick-jobs", editable: true },
    { name: "Quick Job Form", path: "/quick-jobs/new", editable: false },
    { name: "Register", path: "/register", editable: false },
    { name: "Login", path: "/login", editable: false }
  ];

  return (
    <div className="edit-site-content">
      <Link to="/admin/dashboard" className="back-dashboard">🔙 Back to Dashboard</Link>
      <h1>✍️ Site Content Management</h1>

      <table className="content-table">
        <thead>
          <tr>
            <th>Page Name</th>
            <th>Path</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page, index) => (
            <tr key={index}>
              <td>{page.name}</td>
              <td>{page.path}</td>
              <td>
                {page.editable ? (
                  <Link to={page.path} className="edit-btn">✏️ Edit</Link>
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
