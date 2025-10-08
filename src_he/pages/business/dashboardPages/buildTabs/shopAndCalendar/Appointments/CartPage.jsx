import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './CartPage.css';

const demoCart = [
  {
    name: "כובע ספורט",
    price: 55,
    quantity: 1,
    image: "https://cdn.pixabay.com/photo/2016/11/29/01/41/cap-1866587_1280.jpg",
    color: "שחור",
    size: "M"
  },
  {
    name: "חולצת כותנה",
    price: 89.9,
    quantity: 2,
    image: "https://cdn.pixabay.com/photo/2016/03/27/19/58/t-shirt-1280838_1280.jpg",
    color: "לבן",
    size: "L"
  },
  {
    name: "נעלי ריצה",
    price: 199,
    quantity: 1,
    image: "https://cdn.pixabay.com/photo/2015/09/02/12/45/running-shoes-918863_1280.jpg",
    color: "אפור",
    size: "42"
  }
];

const CartPage = ({ cart, setCart, coupon, setCoupon }) => {
  const navigate = useNavigate();

  // אם הסל ריק – נטען דמו
  useEffect(() => {
    if (cart.length === 0) {
      setCart(demoCart);
    }

    console.log("📦 תוכן הסל:", cart);
    cart.forEach((item, i) => {
      if (!item.image) {
        console.warn(`🖼️ מוצר [${item.name || "ללא שם"}] לא כולל תמונה (index ${i})`);
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
      <h2>🛒 סל הקניות שלך</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">העגלה שלך ריקה כרגע</p>
      ) : (
        <div className="cart-list">
          {cart.map((item, i) => (
            <div key={i} className="cart-item-card">
              <img
                src={item.image || "https://via.placeholder.com/100?text=No+Image"}
                alt={item.name || "ללא שם"}
                className="cart-thumb"
              />

              <div className="item-details">
                <h4>{item.name}</h4>
                {item.color && <p>צבע: {item.color}</p>}
                {item.size && <p>מידה: {item.size}</p>}
                <p>
                  כמות:
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(i, e.target.value)}
                    style={{
                      width: "50px",
                      marginRight: "8px",
                      marginLeft: "8px",
                      padding: "4px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "1rem"
                    }}
                  />
                </p>
                <p>סה"כ: ₪ {item.price * item.quantity}</p>
              </div>

              <button className="remove-btn" onClick={() => handleRemove(i)}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      <div className="coupon-box">
        <input
          className="coupon-input"
          placeholder="הכנס קוד קופון (למשל: SUMMER10)"
          value={coupon.code}
          onChange={handleCouponChange}
        />
      </div>

      <div className="summary">
        <p>🧾 לפני הנחה: {totalBefore.toFixed(2)} ₪</p>
        {discount > 0 && <p className="discount">💸 הנחה: {discount.toFixed(2)} ₪</p>}
        <h3>💰 סה"כ לתשלום: {final.toFixed(2)} ₪</h3>
      </div>

      <div className="cart-actions">
        <button className="back-btn" onClick={handleBack}>⬅️ חזרה לחנות</button>
        <button className="pay-btn">לתשלום 💳</button>
      </div>
    </div>
  );
};

export default CartPage;
