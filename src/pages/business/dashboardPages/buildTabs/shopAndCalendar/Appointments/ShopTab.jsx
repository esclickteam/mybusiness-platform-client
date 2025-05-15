import React, { useState } from 'react';
import API from '@api';  // ה-axios instance שלך
import { useBusinessServices } from '../../../../../../context/BusinessServicesContext';
import { useAuth } from '../../../../../../context/AuthContext';
import './ShopTab.css';

const ShopTab = () => {
  const { products, setProducts } = useBusinessServices();
  const { token } = useAuth(); // אם אתה שולח token ידנית, אחרת תוכל להסיר
  const [categories, setCategories] = useState(['כללי']);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: 'כללי'
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [paymentKeys, setPaymentKeys] = useState({});
  const [coupon, setCoupon] = useState({ code: '', discount: '', start: '', expiry: '' });
  const [coupons, setCoupons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('both');
  const [shippingType, setShippingType] = useState('free');
  const [shippingCost, setShippingCost] = useState(0);

  // --- קטגוריות ---
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (catToDelete) => {
    setCategories(categories.filter((cat) => cat !== catToDelete));
    if (formData.category === catToDelete) {
      setFormData({ ...formData, category: 'כללי' });
    }
  };

  // --- שינויי טופס ---
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0] || null;
      setFormData({ ...formData, image: file });
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
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

      const response = await API.post('/business/my/products', data, {
        headers: {
          Authorization: `Bearer ${token}`,           // אם משתמש ב-cookie בלבד, השורה הזו ניתנת להסרה
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('created product:', response.data);

      setProducts([...products, response.data]);
      setFormData({ name: '', description: '', price: '', image: null, category: 'כללי' });
      setImagePreview(null);
    } catch (err) {
      console.error('Error adding product:', err);
      alert('שגיאה בהוספת מוצר');
    }
  };

  // --- מחיקת מוצר ---
  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      console.error('No productId provided to delete');
      return;
    }
    if (!window.confirm("האם למחוק מוצר זה?")) return;

    try {
      const response = await API.delete(`/business/my/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`      // שוב, אם אין צורך ב-token תסיר
        }
      });
      console.log('deleted product:', response.data);

      setProducts(products.filter(p => (p._id || p.id) !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('שגיאה במחיקת מוצר');
    }
  };

  // --- סליקה ---
  const handleProviderSelect = (provider) => setSelectedProvider(provider);
  const handleKeyChange = (e) => setPaymentKeys({ ...paymentKeys, [selectedProvider]: e.target.value });

  // --- קופונים ---
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!coupon.code || !coupon.discount) return;
    setCoupons([...coupons, coupon]);
    setCoupon({ code: '', discount: '', start: '', expiry: '' });
  };
  const handleDeleteCoupon = (i) => {
    const updated = [...coupons];
    updated.splice(i, 1);
    setCoupons(updated);
  };

  const allProviders = ['Tranzila', 'Meshulam', 'Max', 'PayPlus', 'Cardcom', 'Isracard', 'Hyp'];

  return (
    <div className="shop-editor">
      <h2 className="title">🔧 ניהול החנות שלך</h2>

      <div className="category-section">
        <label>📁 קטגוריות</label>
        <form className="category-manager" onSubmit={handleAddCategory}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="שם קטגוריה חדשה"
          />
          <button type="submit">הוספה</button>
        </form>
        <div className="category-list">
          {categories.map((cat, i) => (
            <span key={i}>
              {cat}{' '}
              <button type="button" onClick={() => handleDeleteCategory(cat)}>
                ❌
              </button>
            </span>
          ))}
        </div>
      </div>

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
        <select name="category" value={formData.category} onChange={handleFormChange}>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input type="file" name="image" accept="image/*" onChange={handleFormChange} />
        {imagePreview && <img src={imagePreview} alt="תצוגה" className="preview-image" />}
        <button type="submit">💾 שמירה</button>
      </form>

      <div className="payment-settings">
        <h4>💳 הגדרת סליקה לעסק</h4>
        <div className="payment-providers">
          {allProviders.map((provider) => (
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
              onChange={(e) => setShippingCost(Number(e.target.value))}
              placeholder="סכום ₪"
              min="0"
            />
          )}
        </div>
      </div>

      <form className="coupon-section" onSubmit={handleAddCoupon}>
        <h4>🎟️ יצירת קופון הנחה</h4>
        <input
          type="text"
          value={coupon.code}
          onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
          placeholder="קוד קופון (SUMMER10)"
          required
        />
        <input
          type="number"
          value={coupon.discount}
          onChange={(e) => setCoupon({ ...coupon, discount: e.target.value })}
          placeholder="אחוז הנחה (למשל 10%)"
          required
        />
        <input
          type="date"
          value={coupon.start}
          onChange={(e) => setCoupon({ ...coupon, start: e.target.value })}
        />
        <input
          type="date"
          value={coupon.expiry}
          onChange={(e) => setCoupon({ ...coupon, expiry: e.target.value })}
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
                <th>מ־</th>
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
                      src={
                        typeof p.image === 'string'
                          ? p.image
                          : URL.createObjectURL(p.image)
                      }
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
    </div>
  );
};

export default ShopTab;
