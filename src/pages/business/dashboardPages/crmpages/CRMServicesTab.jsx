import React, { useState, useEffect, useMemo } from "react";
import "./CRMServicesTab.css";
import API from "@api";

const DURATION_STEP = 15;
const MAX_DURATION = 12 * 60;

const CRMServicesTab = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: 30,     // ⏱ בדקות
    price: "",
    imageFile: null,
  });

  /* =========================
     Fetch Services
  ========================= */
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
      duration: 30,
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
      duration: service.duration || 30,
      price: service.price,
      imageFile: null,
    });
    setShowForm(true);
  };

  /* =========================
     Save Service
  ========================= */
  const saveService = async () => {
    if (!form.name || !form.price) return;

    setSaving(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("duration", form.duration);   // ✅ דקות
    data.append("price", form.price);

    if (form.imageFile) {
      data.append("image", form.imageFile);
    }

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

  /* =========================
     Render
  ========================= */
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
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* ⏱ Duration */}
          <div className="duration-field">
            <label>Duration</label>

            <select
              value={form.duration}
              onChange={e =>
                setForm({
                  ...form,
                  duration: Number(e.target.value),
                })
              }
            >
              {Array.from(
                { length: MAX_DURATION / DURATION_STEP },
                (_, i) => {
                  const minutes = (i + 1) * DURATION_STEP;
                  const h = Math.floor(minutes / 60);
                  const m = minutes % 60;

                  const label =
                    h > 0
                      ? `${h}h${m ? ` ${m}m` : ""}`
                      : `${minutes}m`;

                  return (
                    <option key={minutes} value={minutes}>
                      {label}
                    </option>
                  );
                }
              )}
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
            <button
              onClick={() => setShowForm(false)}
              className="secondary-btn"
            >
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
                <span>
                  ⏱️ {service.duration < 60
                    ? `${service.duration}m`
                    : `${Math.floor(service.duration / 60)}h${
                        service.duration % 60
                          ? ` ${service.duration % 60}m`
                          : ""
                      }`}
                </span>
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
