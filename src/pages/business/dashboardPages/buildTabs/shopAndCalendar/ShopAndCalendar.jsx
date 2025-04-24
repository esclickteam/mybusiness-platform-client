import React, { useState, useEffect } from 'react';
import './ShopAndCalendar.css';
import AppointmentsMain from './Appointments/AppointmentsMain';
import CalendarSetup from './Appointments/CalendarSetup';
import ShopTab from './Appointments/ShopTab';
import ShopPreview from './Appointments/ShopPreview';
import PaymentSection from './Appointments/PaymentSection';
import { useBusinessServices } from '../../../../../context/BusinessServicesContext';

const ShopAndCalendar = ({ isPreview = false, shopMode, setShopMode, setBusinessDetails }) => {
  const { services, setServices, products } = useBusinessServices();

  const mode = shopMode;
  const setMode = setShopMode;

  const [selectedService, setSelectedService] = useState(null);
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [demoHours, setDemoHours] = useState({});

  // 🔁 שולח את השירותים והמוצרים חזרה ל־BuildBusinessPage
  useEffect(() => {
    if (!isPreview && setBusinessDetails) {
      setBusinessDetails(prev => ({
        ...prev,
        services,
        products
      }));
    }
  }, [services, products, isPreview, setBusinessDetails]);

  useEffect(() => {
    if (isPreview) {
      const saved = localStorage.getItem("demoWorkHours");
      if (saved) {
        try {
          setDemoHours(JSON.parse(saved));
        } catch (e) {
          console.error("⚠️ demoWorkHours is not valid JSON");
        }
      }
    }
  }, [isPreview]);

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleRemoveFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const totalBeforeDiscount = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const discount = appliedCoupon ? (totalBeforeDiscount * (appliedCoupon.discount / 100)) : 0;
  const total = (totalBeforeDiscount - discount).toFixed(2);

  const handleApplyCoupon = () => {
    if (!appliedCoupon && couponCode === 'SUMMER10') {
      setAppliedCoupon({ code: 'SUMMER10', discount: 10 });
    }
  };

  return (
    <div className={`shop-calendar-wrapper ${isPreview ? 'preview-mode' : ''}`}>

      {!isPreview && !mode && (
        <div className="mode-select-wrapper">
          <h2 className="centered-title">איזה סוג שירות ברצונך לעצב?</h2>
          <div className="mode-options">
            <button onClick={() => handleSelectMode('store')}>🛒 חנות</button>
            <button onClick={() => handleSelectMode('appointments')}>🗕️ יומן</button>
          </div>
        </div>
      )}

      {!isPreview && mode && (
        <button onClick={() => setMode(null)} className="back-button">
          🔙 חזרה לבחירת שירות
        </button>
      )}

      {!isPreview && mode === 'appointments' && (
        <AppointmentsMain
          isPreview={false}
          services={services}
          setServices={setServices}
          onNext={(service) => {
            setSelectedService(service);
            setMode('calendar');
          }}
        />
      )}

      {!isPreview && mode === 'calendar' && (
        <div>
          <h3>🗕️ הגדרת יומן</h3>
          <CalendarSetup selectedService={selectedService} isPreview={false} />
          <button onClick={() => setMode('appointments')} className="back-button">
            🔙 חזרה לשירות
          </button>
        </div>
      )}

      {!isPreview && mode === 'store' && <ShopTab isPreview={false} />}

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
