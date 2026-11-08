import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "@api";
import "./CartPage.css";

const cartStorageKey = (businessId) => `bizuply_store_cart_${businessId}`;

function readStoredCart(businessId) {
  if (!businessId) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(cartStorageKey(businessId)) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function productIdOf(item) {
  return String(item?.productId || item?._id || item?.id || "");
}

const CartPage = ({ cart: cartProp, setCart: setCartProp, coupon: couponProp, setCoupon: setCouponProp }) => {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { t } = useTranslation();
  const ownsCart = !Array.isArray(cartProp);
  const [localCart, setLocalCart] = useState(() => (ownsCart ? readStoredCart(businessId) : []));
  const [localCoupon, setLocalCoupon] = useState({ code: "", discount: 0 });
  const [coupons, setCoupons] = useState([]);
  const [loadError, setLoadError] = useState("");
  const cart = Array.isArray(cartProp) ? cartProp : localCart;
  const setCart = setCartProp || setLocalCart;
  const coupon = couponProp || localCoupon;
  const setCoupon = setCouponProp || setLocalCoupon;

  useEffect(() => {
    if (!ownsCart || !businessId) return undefined;
    let alive = true;
    (async () => {
      try {
        const [productRes, couponRes] = await Promise.all([
          API.get("/business/my/products"),
          API.get("/business/my/coupons"),
        ]);
        if (!alive) return;
        const products = Array.isArray(productRes.data) ? productRes.data : [];
        const stored = readStoredCart(businessId);
        const priced = stored.map((item) => {
          const match = products.find((product) => {
            const id = productIdOf(product);
            return (id && id === productIdOf(item)) || product.name === item.name;
          });
          if (!match) return item;
          const price = Number(match.price);
          return {
            ...item,
            name: match.name || item.name,
            price: Number.isFinite(price) ? price : Number(item.price) || 0,
            image: match.image || item.image,
          };
        });
        setLocalCart(priced);
        setCoupons(Array.isArray(couponRes.data) ? couponRes.data : []);
        setLoadError("");
      } catch {
        if (alive) setLoadError(t("leftover.shop.loadError", "לא הצלחנו לטעון את נתוני החנות."));
      }
    })();
    return () => {
      alive = false;
    };
  }, [ownsCart, businessId, t]);

  useEffect(() => {
    if (!ownsCart || !businessId) return;
    localStorage.setItem(cartStorageKey(businessId), JSON.stringify(localCart));
  }, [ownsCart, businessId, localCart]);

  const handleRemove = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updated = [...cart];
    updated[index] = { ...updated[index], quantity: Math.max(1, Number(newQuantity) || 1) };
    setCart(updated);
  };

  const totalBefore = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const matchedCoupon = coupons.find((entry) => entry.code === coupon?.code);
  const discountRate = Number(matchedCoupon?.discount ?? coupon?.discount) || 0;
  const discount = matchedCoupon || couponProp ? totalBefore * (discountRate / 100) : 0;
  const final = totalBefore - discount;

  const handleCouponChange = (e) => {
    const code = e.target.value;
    const match = coupons.find((entry) => entry.code === code);
    setCoupon({ ...(coupon || {}), code, discount: Number(match?.discount) || 0 });
  };

  return (
    <div className="cart-page">
      <header className="cart-head">
        <h2>{t("leftover.shopChrome.shoppingCart")}</h2>
      </header>

      {loadError ? <p className="empty-cart">{loadError}</p> : null}

      {cart.length === 0 ? (
        <p className="empty-cart">{t("leftover.shopChrome.emptyCart")}</p>
      ) : (
        <div className="cart-list">
          {cart.map((item, i) => (
            <div key={productIdOf(item) || i} className="cart-item-card">
              {item.image ? (
                <img src={item.image} alt={item.name || ""} className="cart-thumb" />
              ) : (
                <div className="cart-thumb" />
              )}

              <div className="item-details">
                <h4>{item.name}</h4>
                {item.color && <p>{t("leftover.shopChrome.color")}: {item.color}</p>}
                {item.size && <p>{t("leftover.shopChrome.size")}: {item.size}</p>}
                <label>
                  {t("leftover.shopChrome.qtyLabel")}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(i, e.target.value)}
                  />
                </label>
                <p>{t("leftover.shopChrome.lineTotal", { amount: ((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2) })}</p>
              </div>

              <button type="button" className="remove-btn" onClick={() => handleRemove(i)}>
                {t("leftover.shopChrome.removeItem")}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="coupon-box">
        <input
          className="coupon-input"
          placeholder={t("leftover.shopChrome.couponPh")}
          value={coupon?.code || ""}
          onChange={handleCouponChange}
        />
      </div>

      <div className="summary">
        <p>{t("leftover.shopChrome.beforeDiscount", { amount: totalBefore.toFixed(2) })}</p>
        {discount > 0 && <p className="discount">{t("leftover.shopChrome.discountLine", { amount: discount.toFixed(2) })}</p>}
        <h3>{t("leftover.shopChrome.totalToPay", { amount: final.toFixed(2) })}</h3>
      </div>

      <div className="cart-actions">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>{t("leftover.shopChrome.backToStore")}</button>
        <button type="button" className="pay-btn">{t("leftover.shopChrome.proceedPayment")}</button>
      </div>
    </div>
  );
};

export default CartPage;
