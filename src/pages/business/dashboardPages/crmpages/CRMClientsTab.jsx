import React, { useState, useEffect } from "react";
import "./CRMClientsTab.css";
import API from "@api";

const CRMClientsTab = ({ businessId }) => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // מצב סינון סטטוס
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    async function fetchClients() {
      setLoading(true);
      try {
        // שליפת הלקוחות לפי סטטוס - שולחים status מהסטייט כדי שתתעדכן אוטומטית
        const res = await API.get(`/clients/from-clients?businessId=${businessId}&status=${statusFilter === "all" ? "" : statusFilter}`);
        const normalizedClients = res.data.map(c => ({
          fullName: c.name || "",
          phone: (c.phone || "").replace(/\s/g, ""),
          email: (c.email || "").replace(/\s/g, ""),
          address: c.address || "",
          status: c.status || "incomplete", // מצפה מהשרת סטטוס
          id: c._id || Date.now(),
        }));
        setClients(normalizedClients);
      } catch (error) {
        console.error("Error loading clients:", error.response || error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, [businessId, statusFilter]); // הוספת statusFilter לתלות useEffect כדי לעדכן בהתאם

  // סינון לפי חיפוש וסטטוס
  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search);
    // כאן הסינון בוצע כבר בצד שרת, אבל השארנו כפול גם פה להגנה
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="crm-tab-content">
      <h2>👥 לקוחות</h2>

      <div className="clients-header">
        <input
          type="text"
          placeholder="חפש לפי שם או טלפון..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {/* סינון סטטוס */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
          aria-label="Filter clients by status"
        >
          <option value="all">כל הלקוחות</option>
          <option value="completed">הושלם</option>
          <option value="incomplete">לא הושלם</option>
        </select>
      </div>

      {loading ? (
        <p>טוען לקוחות...</p>
      ) : (
        <table className="clients-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>טלפון</th>
              <th>כתובת</th>
              <th>אימייל</th>
              <th>סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="5">לא נמצאו לקוחות</td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.fullName}</td>
                  <td className="phone-cell">{client.phone}</td>
                  <td className="address-cell">{client.address}</td>
                  <td className="email-cell">{client.email}</td>
                  <td>{client.status === "completed" ? "הושלם" : "לא הושלם"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CRMClientsTab;
