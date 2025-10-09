import React, { useState } from "react";
import "./AdminPlans.css";
import { Link } from "react-router-dom";

function AdminPlans() {
  const [plans, setPlans] = useState([
    { id: 1, name: "בסיסית", price: 49, duration: "חודש", features: ["עמוד עסקי", "תיאום תורים"], trialDays: 0 },
    { id: 2, name: "פרימיום", price: 99, duration: "חודש", features: ["צ'אט עם לקוחות", "באנרים מותאמים"], trialDays: 7 }
  ]);

  const [form, setForm] = useState({ name: "", price: "", duration: "חודש", features: "", trialDays: "" });
  const [editId, setEditId] = useState(null);
  const [coupon, setCoupon] = useState({ code: "", discount: "", type: "₪", plans: [], start: "", end: "" });
  const [coupons, setCoupons] = useState([]);
  const [editCouponId, setEditCouponId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const newPlan = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      trialDays: Number(form.trialDays),
      features: form.features.split(",")
    };
    setPlans([...plans, newPlan]);
    setForm({ name: "", price: "", duration: "חודש", features: "", trialDays: "" });
  };

  const handleDelete = (id) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const handleCouponChange = (e) => {
    const { name, value } = e.target;
    setCoupon(prev => ({ ...prev, [name]: value }));
  };

  const toggleCouponPlan = (id) => {
    setCoupon(prev => ({
      ...prev,
      plans: prev.plans.includes(id)
        ? prev.plans.filter(pid => pid !== id)
        : [...prev.plans, id]
    }));
  };

  const handleAddCoupon = () => {
    if (editCouponId) {
      setCoupons(coupons.map(c => c.id === editCouponId ? { ...coupon, id: editCouponId } : c));
    } else {
      const newCoupon = { ...coupon, id: Date.now() };
      setCoupons([...coupons, newCoupon]);
    }
    setCoupon({ code: "", discount: "", type: "₪", plans: [], start: "", end: "" });
    setEditCouponId(null);
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const handleEditCoupon = (id) => {
    const found = coupons.find(c => c.id === id);
    setCoupon(found);
    setEditCouponId(id);
  };

  const handleEditPlan = (id, field, value) => {
    setPlans(plans.map(p =>
      p.id === id ? { ...p, [field]: field === "features" ? value.split(",") : value } : p
    ));
  };

  return (
    <div className="admin-plans">
      <Link to="/admin/dashboard" className="back-dashboard">🔙 חזרה לדשבורד</Link>
      <h1>📦 ניהול חבילות</h1>

      <div className="plan-form">
        <input type="text" name="name" placeholder="שם חבילה" value={form.name} onChange={handleChange} />
        <input type="number" name="price" placeholder="מחיר (₪)" value={form.price} onChange={handleChange} />
        <select name="duration" value={form.duration} onChange={handleChange}>
          <option value="חודש">חודש</option>
          <option value="3 חודשים">3 חודשים</option>
          <option value="6 חודשים">6 חודשים</option>
          <option value="12 חודשים">12 חודשים</option>
        </select>
        <input type="text" name="features" placeholder="מאפיינים (מופרד בפסיקים)" value={form.features} onChange={handleChange} />
        <input type="number" name="trialDays" placeholder="ימי ניסיון" value={form.trialDays} onChange={handleChange} />
        <button onClick={handleAdd}>➕ הוסף חבילה</button>
      </div>

      <table className="plans-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>מחיר</th>
            <th>תקופה</th>
            <th>ימי ניסיון</th>
            <th>מאפיינים</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
              <td><input value={plan.name} onChange={(e) => handleEditPlan(plan.id, "name", e.target.value)} /></td>
              <td><input type="number" value={plan.price} onChange={(e) => handleEditPlan(plan.id, "price", e.target.value)} /></td>
              <td>
                <select value={plan.duration} onChange={(e) => handleEditPlan(plan.id, "duration", e.target.value)}>
                  <option value="חודש">חודש</option>
                  <option value="3 חודשים">3 חודשים</option>
                  <option value="6 חודשים">6 חודשים</option>
                  <option value="12 חודשים">12 חודשים</option>
                </select>
              </td>
              <td><input type="number" value={plan.trialDays} onChange={(e) => handleEditPlan(plan.id, "trialDays", e.target.value)} /></td>
              <td><input value={plan.features.join(",")} onChange={(e) => handleEditPlan(plan.id, "features", e.target.value)} /></td>
              <td><button className="delete-btn" onClick={() => handleDelete(plan.id)}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="coupon-section">
        <h2>🎁 {editCouponId ? "עריכת קופון" : "הוספת קופון הנחה"}</h2>
        <input type="text" name="code" placeholder="שם קופון" value={coupon.code} onChange={handleCouponChange} />
        <input type="number" name="discount" placeholder="הנחה" value={coupon.discount} onChange={handleCouponChange} />
        <select name="type" value={coupon.type} onChange={handleCouponChange}>
          <option value="₪">₪ (שקלים)</option>
          <option value="%">% (אחוזים)</option>
        </select>
        <input type="date" name="start" value={coupon.start} onChange={handleCouponChange} />
        <input type="date" name="end" value={coupon.end} onChange={handleCouponChange} />

        <div className="coupon-plans">
          <p>בחר חבילות לקופון:</p>
          {plans.map(p => (
            <label key={p.id}>
              <input
                type="checkbox"
                checked={coupon.plans.includes(p.id)}
                onChange={() => toggleCouponPlan(p.id)}
              /> {p.name}
            </label>
          ))}
        </div>
        <button onClick={handleAddCoupon}>{editCouponId ? "💾 עדכן קופון" : "➕ שמור קופון"}</button>

        <table className="plans-table" style={{ marginTop: "40px" }}>
          <thead>
            <tr>
              <th>שם קופון</th>
              <th>הנחה</th>
              <th>תקף מ-עד</th>
              <th>חבילות</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.discount} {c.type}</td>
                <td>{c.start} - {c.end}</td>
                <td>{c.plans.map(pid => plans.find(p => p.id === pid)?.name).join(", ")}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteCoupon(c.id)}>🗑️</button>
                  <button className="edit-btn" onClick={() => handleEditCoupon(c.id)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPlans;