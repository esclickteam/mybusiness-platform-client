import React, { useState, useEffect } from 'react';
// סגנונות כלליים של עמוד הבניה
import '../../build/Build.css';
// סגנונות ספציפיים לטאב החנות/יומן
import './ShopAndCalendar.css';

import AppointmentsMain from './Appointments/AppointmentsMain';
import ShopTab         from './Appointments/ShopTab';
import ShopPreview     from './Appointments/ShopPreview';
import PaymentSection  from './Appointments/PaymentSection';
import { useBusinessServices } from '../../../../../context/BusinessServicesContext';

const ShopAndCalendar = ({ isPreview = false, shopMode, setShopMode, setBusinessDetails }) => {
  const { services, setServices, products } = useBusinessServices();

  // פה כבר לא עושים ברירת-מחדל ל-'store'
  const mode = shopMode;           
  const setMode = setShopMode;

  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [demoHours, setDemoHours] = useState({});

  // סנכרון עם ה־Build
  useEffect(() => {
    if (!isPreview && setBusinessDetails) {
      setBusinessDetails(prev => ({
        ...prev,
        services,
        products
      }));
    }
  }, [services, products, isPreview, setBusinessDetails]);

  // טעינת שעות לדמו
  useEffect(() => {
    if (isPreview) {
      const saved = localStorage.getItem("demoWorkHours");
      if (saved) {
        try {
          setDemoHours(JSON.parse(saved));
        } catch {
          console.error("⚠️ demoWorkHours is not valid JSON");
        }
      }
    }
  }, [isPreview]);

  // אם עדיין לא נבחר מצב – הצג את מסך הבחירה
  if (!isPreview && !mode) {
    return (
      <div className="mode-select-wrapper">
        <h2 className="centered-title">איזה סוג שירות ברצונך לעצב?</h2>
        <div className="mode-options">
          <button
            className="gradient-btn"
            onClick={() => setMode('store')}
          >
            🛒 חנות
          </button>
          <button
            className="gradient-btn"
            onClick={() => setMode('appointments')}
          >
            🗕️ יומן
          </button>
        </div>
      </div>
    );
  }

  // חישובי עגלת קניות
  const totalBefore = cart.reduce((sum, i) => sum + Number(i.price), 0);
  const discount    = appliedCoupon ? totalBefore * (appliedCoupon.discount / 100) : 0;
  const total       = (totalBefore - discount).toFixed(2);

  return (
    <div className={`shop-calendar-wrapper ${isPreview ? 'preview-mode' : ''}`}>
      {/* כפתור חזרה לבחירת שירות */}
      {!isPreview && (
        <button
          className="back-button"
          onClick={() => setMode(null)}
        >
          🔙 חזרה לבחירת שירות
        </button>
      )}

      {/* FORM (לא Preview) */}
      {!isPreview && mode === 'appointments' && (
        <AppointmentsMain
          isPreview={false}
          services={services}
          setServices={setServices}
          onNext={() => setMode('calendar')}
        />
      )}
      {!isPreview && mode === 'store' && (
        <ShopTab isPreview={false} />
      )}

      {/* PREVIEW */}
      {isPreview && mode === 'store' && !showPayment && (
        <ShopPreview
          products={products}
          cart={cart}
          setCart={setCart}
          coupon={appliedCoupon}
          showCart={showCart}
          setShowCart={setShowCart}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          discount={discount}
          total={total}
          showPayment={showPayment}
          setShowPayment={setShowPayment}
          business={{ name: 'העסק שלך', shippingType: 'paid', shippingCost: 20 }}
        />
      )}
      {isPreview && mode === 'store' && showPayment && (
        <PaymentSection
          paymentMethod="both"
          cart={cart}
          business={{ name: 'העסק שלך', shippingType: 'paid', shippingCost: 20 }}
          onBack={() => setShowPayment(false)}
        />
      )}
      {isPreview && (mode === 'appointments' || mode === 'calendar') && (
        <AppointmentsMain
          isPreview={true}
          services={services}
          workHours={demoHours}
        />
      )}
    </div>
  );
};

export default ShopAndCalendar;
