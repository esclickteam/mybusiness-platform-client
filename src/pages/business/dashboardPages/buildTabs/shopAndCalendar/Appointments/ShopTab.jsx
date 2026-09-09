import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API from '@api'; // axios instance with withCredentials: true and baseURL set to /api/business
import { useBusinessServices } from '@context/BusinessServicesContext';
import './ShopTab.css';

const ShopTab = () => {
  const { t } = useTranslation();
  const { products, setProducts } = useBusinessServices();
  const [categories, setCategories] = useState(['General']);
  const [newCategory, setNewCategory] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: 'General',
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

  // --- Load products and coupons on mount ---
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
        console.error('Error loading data:', err);
        alert(t('leftover.shop.loadError'));
      }
    };
    fetchData();
  }, [setProducts]);

  // --- Categories ---
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
      setFormData(prev => ({ ...prev, category: 'General' }));
    }
  };

  // --- Product form changes ---
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

  // --- Add product ---
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
      setFormData({ name: '', description: '', price: '', image: null, category: 'General' });
      setImagePreview(null);
    } catch (err) {
      console.error('Error adding product:', err);
      alert(t('leftover.shop.addProductError'));
    }
  };

  // --- Delete product ---
  const handleDeleteProduct = async productId => {
    if (!productId || !window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/business/my/products/${productId}`);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(t('leftover.shop.deleteProductError'));
    }
  };

  // --- Payment providers ---
  const handleProviderSelect = e => setSelectedProvider(e.target.value);
  const handleKeyChange = e => {
    setPaymentKeys(prev => ({ ...prev, [selectedProvider]: e.target.value }));
  };

  // --- Coupons ---
  const handleAddCoupon = async e => {
    e.preventDefault();
    if (!coupon.code || !coupon.discount) return;
    try {
      const res = await API.post('/business/my/coupons', coupon);
      setCoupons(prev => [...prev, res.data]);
      setCoupon({ code: '', discount: '', start: '', expiry: '' });
    } catch (err) {
      console.error('Error creating coupon:', err);
      alert(t('leftover.shop.createCouponError'));
    }
  };

  const handleDeleteCoupon = async id => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await API.delete(`/business/my/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c.id !== id && c._id !== id));
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert(t('leftover.shop.deleteCouponError'));
    }
  };

  return (
    <div className="shop-editor">
      <h2 className="title">🔧 Manage Your Store</h2>

      {/* Categories */}
      <div className="category-section">
        <label>📁 Categories</label>
        <form className="category-manager" onSubmit={handleAddCategory}>
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button type="submit">Add</button>
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

      {/* Add Product Form */}
      <form className="product-form" onSubmit={handleAddProduct}>
        <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Product name" required />
        <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Description..." rows={2} />
        <input name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder="Price $" required />
        <select name="category" value={formData.category} onChange={handleFormChange}>
          {categories.map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
        </select>
        <input type="file" name="image" accept="image/*" onChange={handleFormChange} />
        {imagePreview && <img src={imagePreview} alt="Product preview" className="preview-image" />}
        <button type="submit">💾 Save</button>
      </form>

      {/* Product List */}
      {products.length > 0 && (
        <div className="preview-products-list">
          <h3>📦 Existing Products</h3>
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
                      <span>{p.price} $</span>
                      <span>{p.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Settings */}
      <div className="payment-settings">
        <h4>💳 Payment Setup for Business</h4>
        <select
          value={selectedProvider || ""}
          onChange={handleProviderSelect}
          className="provider-select"
        >
          <option value="" disabled>Select Payment Provider</option>
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
              placeholder={t('leftover.shopChrome.keyFor', { provider: selectedProvider })}
              value={paymentKeys[selectedProvider] || ''}
              onChange={handleKeyChange}
            />
            <p className="payment-info">{t('leftover.shopChrome.savePaymentKey')}</p>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="payment-methods">
        <h4>⚙️ {t('leftover.shopChrome.paymentOptions')}</h4>
        <select
          className="select-input"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="online">{t('leftover.shopChrome.onlineOnly')}</option>
          <option value="phone">{t('leftover.shopChrome.phoneOnly')}</option>
          <option value="both">{t('leftover.shopChrome.both')}</option>
        </select>
      </div>

      {/* Shipping Settings */}
      <div className="shipping-settings">
        <h4>🚚 Shipping Options</h4>
        <p className="note">Shipping cost will be added to the final order price.</p>
        <select
          className="select-input"
          value={shippingType}
          onChange={e => setShippingType(e.target.value)}
        >
          <option value="free">Free Shipping</option>
          <option value="paid">Paid Shipping</option>
        </select>
        {shippingType === 'paid' && (
          <input
            type="number"
            className="shipping-cost-input"
            value={shippingCost}
            onChange={e => setShippingCost(Number(e.target.value))}
            placeholder="Amount $"
            min="0"
          />
        )}
      </div>

      {/* Coupons */}
      <form className="coupon-section" onSubmit={handleAddCoupon}>
        <h4>🎟️ {t('leftover.couponChrome.createTitle')}</h4>
        <input type="text" value={coupon.code} onChange={e => setCoupon(prev => ({ ...prev, code: e.target.value }))} placeholder={t('leftover.couponChrome.codePh')} required />
        <input type="number" value={coupon.discount} onChange={e => setCoupon(prev => ({ ...prev, discount: e.target.value }))} placeholder={t('leftover.couponChrome.discountPh')} required />
        <input type="date" value={coupon.start} onChange={e => setCoupon(prev => ({ ...prev, start: e.target.value }))} />
        <input type="date" value={coupon.expiry} onChange={e => setCoupon(prev => ({ ...prev, expiry: e.target.value }))} />
        <button type="submit">➕ {t('leftover.couponChrome.addCoupon')}</button>
      </form>

      {coupons.length > 0 && (
        <div className="coupons-table">
          <h4>🧾 {t('leftover.couponChrome.existingCoupons')}</h4>
          <table>
            <thead>
              <tr><th>{t('leftover.couponChrome.code')}</th><th>{t('leftover.couponChrome.discount')}</th><th>{t('leftover.couponChrome.from')}</th><th>{t('leftover.couponChrome.until')}</th><th>{t('leftover.couponChrome.delete')}</th></tr>
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
