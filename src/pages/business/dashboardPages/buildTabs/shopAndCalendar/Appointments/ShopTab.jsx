import React, { useState, useEffect } from 'react';
import API from '@api'; // axios instance עם baseURL מותאם ל־/api/business
import { useBusinessServices } from '../../../../../../context/BusinessServicesContext';
import { useAuth } from '../../../../../../context/AuthContext';
import './ShopTab.css';

const ShopTab = () => {
  const { products, setProducts } = useBusinessServices();
  const { token } = useAuth(); // אם משתמשים ב־cookie של withCredentials, אפשר להסיר את ההגדרה הזו
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

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [paymentKeys, setPaymentKeys] = useState({});
  const [coupon, setCoupon] = useState({ code: '', discount: '', start: '', expiry: '' });
  const [coupons, setCoupons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('both');
  const [shippingType, setShippingType] = useState('free');
  const [shippingCost, setShippingCost] = useState(0);

  // טען מוצרים בתחילת הטאב
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await API.get('/my/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error('שגיאה בטעינת מוצרים:', err);
      }
    }
    fetchProducts();
  }, [setProducts, token]);

  // --- קטגוריות ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
      setNewCategory('');
    }
  };
  const handleDeleteCategory = (cat) => {
    setCategories(prev => prev.filter(c => c !== cat));
    if (formData.category === cat) {
      setFormData(prev => ({ ...prev, category: 'כללי' }));
    }
  };

  // --- שינויי טופס מוצר ---
  const handleFormChange = (e) => {
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
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      if (formData.image) data.append('image', formData.image);

      const res = await API.post('/my/products', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('created product:', res.data);
      setProducts(prev => [...prev, res.data]);
      setFormData({ name: '', description: '', price: '', image: null, category: 'כללי' });
      setImagePreview(null);
    } catch (err) {
      console.error('שגיאה בהוספת מוצר:', err);
      alert('שגיאה בהוספת מוצר');
    }
  };

  // --- מחיקת מוצר ---
  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      console.error('No productId provided to delete');
      return;
    }
    if (!window.confirm('האם למחוק מוצר זה?')) return;
    try {
      await API.delete(`/my/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => (p._id || p.id) !== productId));
    } catch (err) {
      console.error('שגיאה במחיקת מוצר:', err);
      alert('שגיאה במחיקת מוצר');
    }
  };

  // --- סליקה ---
  const handleProviderSelect = (prov) => setSelectedProvider(prov);
  const handleKeyChange = (e) => {
    setPaymentKeys(prev => ({ ...prev, [selectedProvider]: e.target.value }));
  };

  // --- קופונים ---
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!coupon.code || !coupon.discount) return;
    setCoupons(prev => [...prev, coupon]);
    setCoupon({ code: '', discount: '', start: '', expiry: '' });
  };
  const handleDeleteCoupon = (idx) => {
    setCoupons(prev => prev.filter((_, i) => i !== idx));
  };

  const allProviders = ['Tranzila', 'Meshulam', 'Max', 'PayPlus', 'Cardcom', 'Isracard', 'Hyp'];

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
        <input
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder="שם המוצר"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          placeholder="תיאור..."
          rows={2}
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleFormChange}
          placeholder="מחיר ₪"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleFormChange}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFormChange}
        />
        {imagePreview && (
          <img src={imagePreview} alt="תצוגת מוצר" className="preview-image" />
        )}
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
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(pid)}
                  >
                    🗑️
                  </button>
                  {p.image && (
                    <img
                      src={typeof p.image === 'string' ? p.image : URL.createObjectURL(p.image)}
                      alt={p.name}
                      className="product-image"
                    />
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
        <div className="payment-providers">
          {allProviders.map(provider => (
            <button
              key={provider}
              type="button"
              onClick={() => handleProviderSelect(provider)}
              className={selectedProvider === provider ? 'active' : ''}
            >
              {provider}
            </button>
          ))}
        </div>
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
        <div className="options">
          <label>
            <input
              type="radio"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={() => setPaymentMethod('online')}
            />
            תשלום אונליין בלבד
          </label>
          <label>
            <input
              type="radio"
              value="phone"
              checked={paymentMethod === 'phone'}
              onChange={() => setPaymentMethod('phone')}
            />
            תשלום טלפוני בלבד
          </label>
          <label>
            <input
              type="radio"
              value="both"
              checked={paymentMethod === 'both'}
              onChange={() => setPaymentMethod('both')}
            />
            שניהם
          </label>
        </div>
      </div>

      {/* הגדרות משלוח */}
      <div className="shipping-settings">
        <h4>🚚 אפשרות משלוח</h4>
        <p className="note">עלות המשלוח תתווסף למחיר הסופי של ההזמנה.</p>
        <div className="options">
          <label>
            <input
              type="radio"
              value="free"
              checked={shippingType === 'free'}
              onChange={() => {
                setShippingType('free');
                setShippingCost(0);
              }}
            />
            משלוח חינם
          </label>
          <label>
            <input
              type="radio"
              value="paid"
              checked={shippingType === 'paid'}
              onChange={() => setShippingType('paid')}
            />
            משלוח בתשלום
          </label>
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
      </div>

      {/* קופונים */}
      <form className="coupon-section" onSubmit={handleAddCoupon}>
        <h4>🎟️ יצירת קופון הנחה</h4>
        <input
          type="text"
          value={coupon.code}
          onChange={e => setCoupon(prev => ({ ...prev, code: e.target.value }))}
          placeholder="קוד קופון (SUMMER10)"
          required
        />
        <input
          type="number"
          value={coupon.discount}
          onChange={e => setCoupon(prev => ({ ...prev, discount: e.target.value }))}
          placeholder="אחוז הנחה (10)"
          required
        />
        <input
          type="date"
          value={coupon.start}
          onChange={e => setCoupon(prev => ({ ...prev, start: e.target.value }))}
        />
        <input
          type="date"
          value={coupon.expiry}
          onChange={e => setCoupon(prev => ({ ...prev, expiry: e.target.value }))}
        />
        <button type="submit">➕ הוספת קופון</button>
      </form>

      {coupons.length > 0 && (
        <div className="coupons-table">
          <h4>🧾 קופונים קיימים</h4>
          <table>
            <thead>
              <tr>
                <th>קוד</th>
                <th>הנחה</th>
                <th>מתאריך</th>
                <th>עד</th>
                <th>מחיקה</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <tr key={i}>
                  <td>{c.code}</td>
                  <td>{c.discount}%</td>
                  <td>{c.start}</td>
                  <td>{c.expiry}</td>
                  <td>
                    <button type="button" onClick={() => handleDeleteCoupon(i)}>
                      🗑️
                    </button>
                  </td>
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
