const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Business = require("../models/Business");
const Appointment = require("../models/Appointment");
const Lead = require("../models/Lead");

// אימות טוקן
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "❌ אין טוקן" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "❌ טוקן לא תקין" });
    req.user = user;
    next();
  });
};

// יצירת עסק
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { business_name, owner, subscription_plan, services } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ אין הרשאה ליצור עסק" });
    }

    const permissions = {
      can_receive_requests: subscription_plan !== "free",
      can_use_chat: subscription_plan !== "free",
      can_view_analytics: subscription_plan !== "free",
      can_use_store: ["professional", "vip"].includes(subscription_plan),
      can_use_calendar: ["professional", "vip"].includes(subscription_plan),
      can_provide_home_service: ["professional", "vip"].includes(subscription_plan),
      can_collaborate: subscription_plan === "vip",
    };

    const newBusiness = new Business({
      business_name,
      owner,
      subscription_plan,
      permissions,
      services: services || {},
      views_count: 0,
      requests_count: 0,
      appointments_count: 0,
    });

    await newBusiness.save();
    res.status(201).json({ message: "✅ עסק נוצר בהצלחה!", business: newBusiness });
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה ביצירת עסק", error: error.message });
  }
});

// עדכון חבילה
router.put("/update-plan/:id", authenticateToken, async (req, res) => {
  try {
    const { subscription_plan } = req.body;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: "❌ עסק לא נמצא" });
    }

    business.subscription_plan = subscription_plan;
    business.permissions = {
      can_receive_requests: subscription_plan !== "free",
      can_use_chat: subscription_plan !== "free",
      can_view_analytics: subscription_plan !== "free",
      can_use_store: ["professional", "vip"].includes(subscription_plan),
      can_use_calendar: ["professional", "vip"].includes(subscription_plan),
      can_provide_home_service: ["professional", "vip"].includes(subscription_plan),
      can_collaborate: subscription_plan === "vip",
    };

    await business.save();
    res.json({ message: "✅ חבילה עודכנה בהצלחה!", business });
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה בעדכון חבילה", error: error.message });
  }
});

// סטטיסטיקות לדשבורד
router.get("/stats/:id", authenticateToken, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "❌ עסק לא נמצא" });
    }

    // שליפת פגישות ולידים
    const appointments = await Appointment.find({ businessId: business._id });
    const leads = await Lead.find({ businessId: business._id });

    // חישוב ממוצע בתחום
    let averageOrders = 0;
    if (business.businessType) {
      const similar = await Business.find({ businessType: business.businessType });
      if (similar.length > 0) {
        const total = similar.reduce((sum, b) => sum + (b.orders_count || 0), 0);
        averageOrders = Math.round(total / similar.length);
      }
    }

    // נתוני שבוע קודם
    const ordersLastWeek = business.orders_last_week || 3;
    const viewsLastWeek = business.views_last_week || 60;
    const requestsLastWeek = business.requests_last_week || 10;
    const reviewsLastWeek = business.reviews_last_week || 1;

    res.json({
      views_count: business.views_count || 0,
      views_last_week: viewsLastWeek,
      requests_count: business.requests_count || 0,
      requests_last_week: requestsLastWeek,
      orders_count: business.orders_count || 0,
      orders_last_week: ordersLastWeek,
      reviews_count: business.reviews_count || 0,
      reviews_last_week: reviewsLastWeek,
      appointments,
      leads,
      businessType: business.businessType || "כללי",
      average_orders_in_field: averageOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאה בקבלת נתונים", error: error.message });
  }
});

module.exports = router;
