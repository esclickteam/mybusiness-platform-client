import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './CartPage.css';

const demoCart = [
  {
    name: "Sport Cap",
    price: 55,
    quantity: 1,
    image: "https://cdn.pixabay.com/photo/2016/11/29/01/41/cap-1866587_1280.jpg",
    color: "Black",
    size: "M"
  },
  {
    name: "Cotton T-Shirt",
    price: 89.9,
    quantity: 2,
    image: "https://cdn.pixabay.com/photo/2016/03/27/19/58/t-shirt-1280838_1280.jpg",
    color: "White",
    size: "L"
  },
  {
    name: "Running Shoes",
    price: 199,
    quantity: 1,
    image: "https://cdn.pixabay.com/photo/2015/09/02/12/45/running-shoes-918863_1280.jpg",
    color: "Gray",
    size: "42"
  }
];

const CartPage = ({ cart: cartProp, setCart: setCartProp, coupon: couponProp, setCoupon: setCouponProp }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [localCart, setLocalCart] = useState([]);
  const [localCoupon, setLocalCoupon] = useState({ code: "", discount: 10 });
  const cart = Array.isArray(cartProp) ? cartProp : localCart;
  const setCart = setCartProp || setLocalCart;
  const coupon = couponProp || localCoupon;
  const setCoupon = setCouponProp || setLocalCoupon;

  // If the cart is empty – load demo items
  useEffect(() => {
    if (cart.length === 0) {
      setCart(demoCart);
    }

    console.log("📦 Cart contents:", cart);
    cart.forEach((item, i) => {
      if (!item.image) {
        console.warn(`🖼️ Product [${item.name || "Unnamed"}] has no image (index ${i})`);
      }
    });
  }, [cart, setCart]);

  const handleRemove = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updated = [...cart];
    updated[index].quantity = Number(newQuantity);
    setCart(updated);
  };

  const totalBefore = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon?.code === "SUMMER10" ? totalBefore * (coupon.discount / 100) : 0;
  const final = totalBefore - discount;

  const handleCouponChange = (e) => {
    setCoupon({ ...coupon, code: e.target.value });
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="cart-page">
      <header className="cart-head">
        <h2>{t("leftover.shopChrome.shoppingCart")}</h2>
      </header>

      {cart.length === 0 ? (
        <p className="empty-cart">{t("leftover.shopChrome.emptyCart")}</p>
      ) : (
        <div className="cart-list">
          {cart.map((item, i) => (
            <div key={i} className="cart-item-card">
              <img
                src={item.image || "https://via.placeholder.com/100?text=No+Image"}
                alt={item.name || "Unnamed"}
                className="cart-thumb"
              />

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
                <p>{t("leftover.shopChrome.lineTotal", { amount: item.price * item.quantity })}</p>
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
          value={coupon.code}
          onChange={handleCouponChange}
        />
      </div>

      <div className="summary">
        <p>{t("leftover.shopChrome.beforeDiscount", { amount: totalBefore.toFixed(2) })}</p>
        {discount > 0 && <p className="discount">{t("leftover.shopChrome.discountLine", { amount: discount.toFixed(2) })}</p>}
        <h3>{t("leftover.shopChrome.totalToPay", { amount: final.toFixed(2) })}</h3>
      </div>

      <div className="cart-actions">
        <button type="button" className="back-btn" onClick={handleBack}>{t("leftover.shopChrome.backToStore")}</button>
        <button type="button" className="pay-btn">{t("leftover.shopChrome.proceedPayment")}</button>
      </div>
    </div>
  );
};

export default CartPage;
