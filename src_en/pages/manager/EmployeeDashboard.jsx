```javascript
import React, { useState, useEffect } from "react";
import API from "../api"; // Assume this is your library for sending API requests

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Loading employee details
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

  // Time in call and time on break
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
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup the interval
  }, [employees]);

  if (loading) {
    return <div>🔄 Loading data...</div>;
  }

  return (
    <div className="employee-dashboard">
      <h2>Employee Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Time in Call</th>
            <th>Time on Break</th>
            <th>Action</th>
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
                <button onClick={() => handleChangeStatus(employee._id, "inCall")}>Start Call</button>
                <button onClick={() => handleChangeStatus(employee._id, "onBreak")}>Break</button>
                <button onClick={() => handleChangeStatus(employee._id, "available")}>Available</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```