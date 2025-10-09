const express = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment"); // Don't forget to install: npm install moment
const router = express.Router();
const Business = require("../models/Business");
const Appointment = require("../models/Appointment");
const Lead = require("../models/Lead");

// Token authentication
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "❌ No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "❌ Invalid token" });
    req.user = user;
    next();
  });
};

// Dashboard stats including weekly data
router.get("/stats/:id", authenticateToken, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: "❌ Business not found" });
    }

    // Fetch appointments and leads
    const appointments = await Appointment.find({ businessId: business._id });
    const leads = await Lead.find({ businessId: business._id });

    // Average orders in the same field
    let averageOrders = 0;
    if (business.businessType) {
      const similar = await Business.find({ businessType: business.businessType });
      if (similar.length > 0) {
        const total = similar.reduce((sum, b) => sum + (b.orders_count || 0), 0);
        averageOrders = Math.round(total / similar.length);
      }
    }

    // Last week's figures – replace with real data if available
    const ordersLastWeek = business.orders_last_week || 3;
    const viewsLastWeek = business.views_last_week || 60;
    const requestsLastWeek = business.requests_last_week || 10;
    const reviewsLastWeek = business.reviews_last_week || 1;

    // Compute data for the last week (7 days, starting Sunday)
    const startOfWeek = moment().startOf("week");
    const weekly_labels = [];
    const weekly_views = [];
    const weekly_requests = [];
    const weekly_orders = [];

    for (let i = 0; i < 7; i++) {
      const day = moment(startOfWeek).add(i, "days");
      weekly_labels.push(day.format("dd")); // e.g., 'Su', 'Mo', etc.

      // Count appointments on that day
      const appointmentsOnDay = appointments.filter(
        (appt) => appt.date && moment(appt.date).isSame(day, "day")
      );
      weekly_orders.push(appointmentsOnDay.length);

      // Add real logic here if you have actual data
      weekly_views.push(0);
      weekly_requests.push(0);
    }

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
      businessType: business.businessType || "General",
      average_orders_in_field: averageOrders,
      weekly_labels,
      weekly_views,
      weekly_requests,
      weekly_orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ Error fetching data", error: error.message });
  }
});

module.exports = router;
