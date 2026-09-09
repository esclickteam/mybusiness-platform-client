import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import './ShopPreview.css';
import PaymentSection from './PaymentSection';

const ShopPreview = ({ products, cart, setCart, coupon, business }) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const handleAddToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      existing.quantity += quantity;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const handleRemoveFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const allCategories = [...new Set(products.map(p => p.category || 'General'))];
  const filteredProducts = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products;

  const calculateTotal = () => {
    const base = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon && coupon.code === couponCode ? base * (coupon.discount / 100) : 0;
    const shippingCost = business?.shippingType === 'paid' ? Number(business.shippingCost || 0) : 0;
    return { base, discount, shippingCost, final: base - discount + shippingCost };
  };

  const { base, discount, shippingCost, final } = calculateTotal();

  return (
    <div className="shop-preview">
      <div className="shop-header-row">
        <h3 className="shop-section-title">🏍️ {t("leftover.shopChrome.yourStore")}</h3>
        <button
          className="cart-toggle-btn"
          onClick={() => {
            setShowCart(!showCart);
            setShowPayment(false);
          }}
        >
          {showCart ? `↩ ${t("leftover.shopChrome.backToStore")}` : `${t("leftover.shopChrome.viewCart", { count: cart.length })} 🛒`}
        </button>
      </div>

      {showPayment ? (
        <PaymentSection
          paymentMethod={business?.paymentMethod || "both"}
          cart={cart}
          business={business}
          onBack={() => setShowPayment(false)}
        />
      ) : showCart ? (
        <div className="cart-view-section">
          <h3>🛒 {t("leftover.shopChrome.shoppingCart")}</h3>

          {cart.length === 0 ? (
            <p className="empty-cart">{t("leftover.shopChrome.emptyCart")}</p>
          ) : (
            <div className="cart-list">
              {cart.map((item, i) => (
                <div key={i} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-thumb" />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{t("leftover.shopChrome.quantity", { count: item.quantity })}</p>
                    <p>{t("leftover.shopChrome.lineTotal", { amount: item.price * item.quantity })}</p>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveFromCart(i)}>🗑️</button>
                </div>
              ))}
            </div>
          )}

          <div className="coupon-box">
            <input
              className="coupon-input"
              placeholder={t("leftover.shopChrome.couponPh")}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>

          <div className="summary">
            <p>📟 {t("leftover.shopChrome.beforeDiscount", { amount: base.toFixed(2) })}</p>
            {discount > 0 && <p className="discount">💸 {t("leftover.shopChrome.discountLine", { amount: discount.toFixed(2) })}</p>}
            {shippingCost > 0 && <p>🚚 {t("leftover.shopChrome.shippingLine", { amount: shippingCost.toFixed(2) })}</p>}
            <h3>💰 {t("leftover.shopChrome.totalToPay", { amount: final.toFixed(2) })}</h3>
          </div>

          <button className="pay-btn" onClick={() => setShowPayment(true)}>{t("leftover.shopChrome.proceedPayment")} 💳</button>
        </div>
      ) : (
        <>
          {allCategories.length > 1 && (
            <div className="category-filter">
              <button
                className={!activeCategory ? 'active' : ''}
                onClick={() => setActiveCategory(null)}
              >
                {t("leftover.shopChrome.allCategories")}
              </button>
              {allCategories.map((cat, i) => (
                <button
                  key={i}
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="product-grid">
            {filteredProducts.map((p, i) => (
              <div key={i} className="product-card-preview">
                <div className="product-image-wrapper">
                  {p.image && <img src={p.image} alt={p.name} />}
                </div>
                <div className="product-info">
                  <h4>{p.name}</h4>
                  <p>{p.price} $</p>
                  {p.description && (
                    <details className="product-description">
                      <summary>{t("leftover.paymentFormChrome.showDescription")}</summary>
                      <p>{p.description}</p>
                    </details>
                  )}
                  <div className="cart-action">
                    <input
                      type="number"
                      min="1"
                      defaultValue="1"
                      className="quantity-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        const qty =
                          parseInt(
                            e.target.parentElement.querySelector('.quantity-input').value
                          ) || 1;
                        handleAddToCart(p, qty);
                      }}
                    >
                      {t("leftover.shopChrome.addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPreview;
