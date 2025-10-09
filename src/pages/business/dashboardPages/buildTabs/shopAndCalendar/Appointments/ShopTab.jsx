import React, { useState, useEffect } from 'react';
import API from '@api'; // axios instance עם withCredentials: true ו-baseURL מותאם ל-/api/business
import { useBusinessServices } from '@context/BusinessServicesContext';
import './ShopTab.css';

const ShopTab = () => {
  const { products, setProducts } = useBusinessServices();
  const [categories, setCategories] = useState(['כללי']);
  const [newCategory, setNewCategory] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: 'כללי',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [selectedProvider, setSelectedProvider] = useState('');
  const [paymentKeys, setPaymentKeys] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('both');
  const [shippingType, setShippingType] = useState('free');
  const [shippingCost, setShippingCost] = useState(0);

  const [coupon, setCoupon] = useState({ code: '', discount: '', start: '', expiry: '' });
  const [coupons, setCoupons] = useState([]);

  const allProviders = ['Tranzila', 'Meshulam', 'Max', 'PayPlus', 'Cardcom', 'Isracard', 'Hyp'];

  // --- טען מוצרים וקופונים בהתחלה ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, couponRes] = await Promise.all([
          API.get('/business/my/products'),
          API.get('/business/my/coupons'),
        ]);
        setProducts(prodRes.data || []);
        setCoupons(couponRes.data || []);
      } catch (err) {
        console.error('שגיאה בטעינת נתונים:', err);
        alert('שגיאה בטעינת נתונים');
      }
    };
    fetchData();
  }, [setProducts]);

  // --- קטגוריות ---
  const handleAddCategory = e => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = cat => {
    setCategories(prev => prev.filter(c => c !== cat));
    if (formData.category === cat) {
      setFormData(prev => ({ ...prev, category: 'כללי' }));
    }
  };

  // --- שינויי טופס מוצר ---
  const handleFormChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0] || null;
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- הוספת מוצר ---
  const handleAddProduct = async e => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val != null) data.append(key, val);
      });
      const res = await API.post('/business/my/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts(prev => [...prev, res.data]);
      setFormData({ name: '', description: '', price: '', image: null, category: 'כללי' });
      setImagePreview(null);
    } catch (err) {
      console.error('שגיאה בהוספת מוצר:', err);
      alert('שגיאה בהוספת מוצר');
    }
  };

  // --- מחיקת מוצר ---
  const handleDeleteProduct = async productId => {
    if (!productId || !window.confirm('האם למחוק מוצר זה?')) return;
    try {
      await API.delete(`/business/my/products/${productId}`);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== productId));
    } catch (err) {
      console.error('שגיאה במחיקת מוצר:', err);
      alert('שגיאה במחיקת מוצר');
    }
  };

  // --- סליקה ---
  const handleProviderSelect = e => setSelectedProvider(e.target.value);
  const handleKeyChange = e => {
    setPaymentKeys(prev => ({ ...prev, [selectedProvider]: e.target.value }));
  };

  // --- קופונים ---
  const handleAddCoupon = async e => {
    e.preventDefault();
    if (!coupon.code || !coupon.discount) return;
    try {
      const res = await API.post('/business/my/coupons', coupon);
      setCoupons(prev => [...prev, res.data]);
      setCoupon({ code: '', discount: '', start: '', expiry: '' });
    } catch (err) {
      console.error('שגיאה ביצירת קופון:', err);
      alert('שגיאה ביצירת קופון');
    }
  };

  const handleDeleteCoupon = async id => {
    if (!window.confirm('האם למחוק קופון זה?')) return;
    try {
      await API.delete(`/business/my/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c.id !== id && c._id !== id));
    } catch (err) {
      console.error('שגיאה במחיקת קופון:', err);
      alert('שגיאה במחיקת קופון');
    }
  };

  return (
    <div className="shop-editor">
      <h2 className="title">🔧 ניהול החנות שלך</h2>
      {/* קטגוריות */}
      <div className="category-section">
        <label>📁 קטגוריות</label>
        <form className="category-manager" onSubmit={handleAddCategory}>
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="שם קטגוריה חדשה"
          />
          <button type="submit">הוספה</button>
        </form>
        <div className="category-list">
          {categories.map((cat, i) => (
            <span key={i} className="category-item">
              {cat}
              <button type="button" onClick={() => handleDeleteCategory(cat)}>❌</button>
            </span>
          ))}
        </div>
      </div>

      {/* טופס הוספת מוצר */}
      <form className="product-form" onSubmit={handleAddProduct}>
        <input name="name" value={formData.name} onChange={handleFormChange} placeholder="שם המוצר" required />
        <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="תיאור..." rows={2} />
        <input name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder="מחיר ₪" required />
        <select name="category" value={formData.category} onChange={handleFormChange}>
          {categories.map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
        </select>
        <input type="file" name="image" accept="image/*" onChange={handleFormChange} />
        {imagePreview && <img src={imagePreview} alt="תצוגת מוצר" className="preview-image" />}
        <button type="submit">💾 שמירה</button>
      </form>

      {/* רשימת מוצרים קיימים */}
      {products.length > 0 && (
        <div className="preview-products-list">
          <h3>📦 מוצרים קיימים</h3>
          <div className="product-cards-list">
            {products.map((p, i) => {
              const pid = p._id || p.id;
              return (
                <div key={pid || i} className="product-card-admin">
                  <button type="button" className="delete-btn" onClick={() => handleDeleteProduct(pid)}>🗑️</button>
                  {p.image && (
                    <img src={typeof p.image === 'string' ? p.image : URL.createObjectURL(p.image)} alt={p.name} className="product-image" />
                  )}
                  <div className="card-content">
                    <h4>{p.name}</h4>
                    <p className="description">{p.description}</p>
                    <div className="info-row">
                      <span>{p.price} ₪</span>
                      <span>{p.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* הגדרות סליקה */}
      <div className="payment-settings">
        <h4>💳 הגדרת סליקה לעסק</h4>
        <select
          value={selectedProvider || ""}
          onChange={handleProviderSelect}
          className="provider-select"
        >
          <option value="" disabled>בחר ספק סליקה</option>
          {allProviders.map(provider => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
        {selectedProvider && (
          <div className="payment-inputs">
            <input
              type="text"
              placeholder={`מפתח עבור ${selectedProvider}`}
              value={paymentKeys[selectedProvider] || ''}
              onChange={handleKeyChange}
            />
            <p className="payment-info">שמור את המפתח לאימות תשלומים.</p>
          </div>
        )}
      </div>

      {/* סוגי תשלום */}
      <div className="payment-methods">
        <h4>⚙️ סוג תשלום זמין ללקוחות</h4>
        <select
          className="select-input"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="online">תשלום אונליין בלבד</option>
          <option value="phone">תשלום טלפוני בלבד</option>
          <option value="both">שניהם</option>
        </select>
      </div>

      {/* הגדרות משלוח */}
      <div className="shipping-settings">
        <h4>🚚 אפשרות משלוח</h4>
        <p className="note">עלות המשלוח תתווסף למחיר הסופי של ההזמנה.</p>
        <select
          className="select-input"
          value={shippingType}
          onChange={e => setShippingType(e.target.value)}
        >
          <option value="free">משלוח חינם</option>
          <option value="paid">משלוח בתשלום</option>
        </select>
        {shippingType === 'paid' && (
          <input
            type="number"
            className="shipping-cost-input"
            value={shippingCost}
            onChange={e => setShippingCost(Number(e.target.value))}
            placeholder="סכום ₪"
            min="0"
          />
        )}
      </div>

      {/* קופונים */}
      <form className="coupon-section" onSubmit={handleAddCoupon}>
        <h4>🎟️ יצירת קופון הנחה</h4>
        <input type="text" value={coupon.code} onChange={e => setCoupon(prev => ({ ...prev, code: e.target.value }))} placeholder="קוד קופון (SUMMER10)" required />
        <input type="number" value={coupon.discount} onChange={e => setCoupon(prev => ({ ...prev, discount: e.target.value }))} placeholder="אחוז הנחה (10)" required />
        <input type="date" value={coupon.start} onChange={e => setCoupon(prev => ({ ...prev, start: e.target.value }))} />
        <input type="date" value={coupon.expiry} onChange={e => setCoupon(prev => ({ ...prev, expiry: e.target.value }))} />
        <button type="submit">➕ הוספת קופון</button>
      </form>

      {coupons.length > 0 && (
        <div className="coupons-table">
          <h4>🧾 קופונים קיימים</h4>
          <table>
            <thead>
              <tr><th>קוד</th><th>הנחה</th><th>מתאריך</th><th>עד</th><th>מחיקה</th></tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <tr key={c._id || c.id || i}>
                  <td>{c.code}</td>
                  <td>{c.discount}%</td>
                  <td>{c.start ? new Date(c.start).toLocaleDateString() : '-'}</td>
                  <td>{c.expiry ? new Date(c.expiry).toLocaleDateString() : '-'}</td>
                  <td><button type="button" onClick={() => handleDeleteCoupon(c._id || c.id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShopTab;
