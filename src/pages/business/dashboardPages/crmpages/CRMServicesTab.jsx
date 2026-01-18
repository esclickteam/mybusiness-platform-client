import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./CRMServicesTab.css";
import API from "@api";

const CRMServicesTab = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    durationHours: "0",
    durationMinutes: "30",
    price: "",
    imageFile: null,
  });

  useEffect(() => {
    API.get("/business/my/services").then(res => {
      setServices(res.data.services || res.data.data || []);
    });
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      durationHours: "0",
      durationMinutes: "30",
      price: "",
      imageFile: null,
    });
    setEditingService(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = service => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description || "",
      durationHours: Math.floor(service.duration / 60).toString(),
      durationMinutes: (service.duration % 60).toString(),
      price: service.price,
      imageFile: null,
    });
    setShowForm(true);
  };

  const saveService = async () => {
    if (!form.name || !form.price) return;

    setSaving(true);
    const duration =
      parseInt(form.durationHours) * 60 +
      parseInt(form.durationMinutes);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("duration", duration);
    data.append("price", form.price);
    if (form.imageFile) data.append("image", form.imageFile);

    try {
      const res = editingService
        ? await API.put(`/business/my/services/${editingService._id}`, data)
        : await API.post("/business/my/services", data);

      setServices(res.data.services || res.data.data || services);
      setShowForm(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async id => {
    await API.delete(`/business/my/services/${id}`);
    setServices(prev => prev.filter(s => s._id !== id));
  };

  return (
    <div className="crm-services-tab" dir="ltr">
      <div className="services-top">
        <h2>🛠️ Services</h2>

        <div className="services-actions">
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="primary-btn" onClick={openAdd}>
            + Add Service
          </button>
        </div>
      </div>

      {showForm && (
        <div className="service-form">
          <h3>{editingService ? "Edit Service" : "New Service"}</h3>

          <input
            placeholder="Service name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <div className="duration-row">
            <select
              value={form.durationHours}
              onChange={e =>
                setForm({ ...form, durationHours: e.target.value })
              }
            >
              {[...Array(24)].map((_, i) => (
                <option key={i} value={i}>
                  {i}h
                </option>
              ))}
            </select>

            <select
              value={form.durationMinutes}
              onChange={e =>
                setForm({ ...form, durationMinutes: e.target.value })
              }
            >
              {[0, 15, 30, 45].map(m => (
                <option key={m} value={m}>
                  {m}m
                </option>
              ))}
            </select>
          </div>

          <input
            type="number"
            placeholder="Price ($)"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={e =>
              setForm({ ...form, imageFile: e.target.files[0] })
            }
          />

          <div className="form-actions">
            <button onClick={() => setShowForm(false)} className="secondary-btn">
              Cancel
            </button>
            <button
              onClick={saveService}
              className="primary-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="services-grid">
        {filteredServices.map(service => (
          <div key={service._id} className="service-card">
            {service.imageUrl && (
              <img src={service.imageUrl} alt={service.name} />
            )}

            <div className="card-body">
              <h4>{service.name}</h4>
              <p>{service.description || "—"}</p>

              <div className="meta">
                <span>{service.duration} min</span>
                <span>${service.price}</span>
              </div>
            </div>

            <div className="card-actions">
              <button onClick={() => openEdit(service)}>✏️</button>
              <button onClick={() => deleteService(service._id)}>🗑️</button>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="empty-state">No services yet</div>
        )}
      </div>
    </div>
  );
};

export default CRMServicesTab;
