import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./CRMServicesTab.css";
import API from "@api";
import { useAuth } from "../../../../context/AuthContext";

const CRMServicesTab = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    durationHours: "0",
    durationMinutes: "30",
    price: "",
    imageFile: null,
  });

  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/business/my/services");
        const servicesArray =
          res.data.services ||
          res.data.data ||
          (Array.isArray(res.data) ? res.data : []);
        setServices(servicesArray);
      } catch (err) {
        console.error("Error fetching services", err);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, services]);

  const resetForm = useCallback(() => {
    setNewService({
      name: "",
      description: "",
      durationHours: "0",
      durationMinutes: "30",
      price: "",
      imageFile: null,
    });
    setEditingService(null);
  }, []);

  const handleAddOrUpdateService = useCallback(async () => {
    if (!newService.name.trim() || newService.price === "") {
      alert("Please fill in both the service name and price");
      return;
    }

    const durationTotal =
      parseInt(newService.durationHours) * 60 +
      parseInt(newService.durationMinutes);

    try {
      const formData = new FormData();
      formData.append("name", newService.name.trim());
      formData.append("description", newService.description.trim());
      formData.append("duration", durationTotal.toString());
      formData.append("price", newService.price);
      if (newService.imageFile) {
        formData.append("image", newService.imageFile);
      }

      let res;
      if (editingService) {
        res = await API.put(`/business/my/services/${editingService._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.post("/business/my/services", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data && (res.data.services || res.data.data)) {
        const updatedServices =
          res.data.services || res.data.data || services;
        setServices(updatedServices);
      }

      setShowAddForm(false);
      resetForm();
    } catch (error) {
      alert("Error saving the service");
      console.error(error);
    }
  }, [newService, editingService, resetForm, services]);

  const handleEdit = useCallback((service) => {
    setEditingService(service);
    const hours = Math.floor(service.duration / 60).toString();
    const minutes = (service.duration % 60).toString();
    setNewService({
      name: service.name,
      description: service.description || "",
      durationHours: hours,
      durationMinutes: minutes,
      price: service.price,
      imageFile: null,
    });
    setShowAddForm(true);
  }, []);

  const handleDelete = useCallback(async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await API.delete(`/business/my/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
    } catch (err) {
      alert("Error deleting the service");
      console.error(err);
    }
  }, []);

  return (
    <div className="crm-services-tab" dir="ltr">
      <h2>🛠️ Services</h2>

      <div className="services-header">
        <input
          type="text"
          placeholder="Search by service name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="services-search-input"
          autoComplete="off"
        />
        <button
          className="add-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            resetForm();
          }}
        >
          {showAddForm
            ? "Cancel"
            : editingService
            ? "Edit Service"
            : "Add Service"}
        </button>
      </div>

      {showAddForm && (
        <form
          className="add-service-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateService();
          }}
        >
          <label>
            Service Name:
            <input
              type="text"
              value={newService.name}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Facial Treatment"
              required
            />
          </label>

          <label>
            Service Description:
            <input
              type="text"
              value={newService.description}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe the service..."
            />
          </label>

          <label>Service Duration:</label>
          <div className="duration-container">
            <select
              value={newService.durationHours}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, durationHours: e.target.value }))
              }
            >
              {[...Array(24)].map((_, i) => (
                <option key={i} value={i}>
                  {i} hours
                </option>
              ))}
            </select>
            <select
              value={newService.durationMinutes}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, durationMinutes: e.target.value }))
              }
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>
                  {m} minutes
                </option>
              ))}
            </select>
          </div>

          <label>
            Price (₪):
            <input
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="e.g., 250"
              min="0"
              required
            />
          </label>

          <label>
            Service Image (optional):
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, imageFile: e.target.files[0] }))
              }
            />
          </label>

          <button type="submit" className="add-btn">
            {editingService ? "Update Service" : "Save Service"}
          </button>
        </form>
      )}

      <table className="services-table">
        <thead>
          <tr>
            <th>Name + Image + Description</th>
            <th>Duration (min)</th>
            <th>Price (₪)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                No services found
              </td>
            </tr>
          ) : (
            filteredServices.map((service) => (
              <tr key={service._id}>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                  }}
                >
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <div style={{ textAlign: "left" }}>
                    <div className="service-name" style={{ fontWeight: "bold" }}>
                      {service.name}
                    </div>
                    <div
                      className="service-description"
                      style={{ fontSize: "12px", color: "#666" }}
                    >
                      {service.description || "-"}
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>{service.duration}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>{service.price}</td>
                <td
                  style={{ textAlign: "center", padding: "8px", whiteSpace: "nowrap" }}
                >
                  <button
                    onClick={() => handleEdit(service)}
                    className="action-btn edit-btn"
                    aria-label={`Edit service ${service.name}`}
                    title="Edit"
                  >
                    <span>Edit</span> <span>✏️</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="action-btn delete-btn"
                    aria-label={`Delete service ${service.name}`}
                    title="Delete"
                  >
                    <span>Delete</span> <span>❌</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMServicesTab;
