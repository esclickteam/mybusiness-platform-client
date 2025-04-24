import React, { useState, useEffect } from "react";
import API from "../api"; // נניח שזו הספרייה שלך לשליחת בקשות ל-API

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // טעינת פרטי העובדים
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChangeStatus = async (employeeId, status) => {
    try {
      await API.post("/employees/status", { employeeId, status });
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp._id === employeeId ? { ...emp, status } : emp
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // זמן בשיחה וזמן בהפסקה
  const updateTime = (employeeId) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp._id === employeeId
          ? { ...emp, timeInCall: emp.status === "inCall" ? emp.timeInCall + 1 : emp.timeInCall, timeInBreak: emp.status === "onBreak" ? emp.timeInBreak + 1 : emp.timeInBreak }
          : emp
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      employees.forEach(emp => updateTime(emp._id));
    }, 1000); // עדכון כל שנייה

    return () => clearInterval(interval); // ניקוי ה־interval
  }, [employees]);

  if (loading) {
    return <div>🔄 טוען נתונים...</div>;
  }

  return (
    <div className="employee-dashboard">
      <h2>ניהול עובדים</h2>
      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>סטטוס</th>
            <th>זמן בשיחה</th>
            <th>זמן בהפסקה</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.status}</td>
              <td>{employee.timeInCall}s</td>
              <td>{employee.timeInBreak}s</td>
              <td>
                <button onClick={() => handleChangeStatus(employee._id, "inCall")}>התחל שיחה</button>
                <button onClick={() => handleChangeStatus(employee._id, "onBreak")}>הפסקה</button>
                <button onClick={() => handleChangeStatus(employee._id, "available")}>זמין</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
