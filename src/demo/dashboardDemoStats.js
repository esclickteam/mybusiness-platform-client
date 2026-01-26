// src/demo/dashboardDemoStats.js

const dashboardDemoStats = {
  businessName: "Bloom Events",

  // 📊 KPI CARDS
  views_count: 1284,
  reviews_count: 12,
  appointments_count: 12, // ⬅️ מיושר לגרף ולדמו
  messages_count: 4,
  notifications_count: 2,

  // 📅 Appointments (משמש גם לגרף וגם ליומן)
  appointments: [
    // ===== January (busiest month) =====
    {
      _id: "a1",
      clientName: "Sarah Cohen",
      serviceName: "Wedding Planning",
      date: "2026-01-10T10:00:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a2",
      clientName: "Daniel Levi",
      serviceName: "Corporate Event",
      date: "2026-01-14T18:00:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a3",
      clientName: "Noa Shapiro",
      serviceName: "Birthday Party",
      date: "2026-01-18T12:00:00.000Z",
      status: "pending",
    },

    // ===== February (growth) =====
    {
      _id: "a4",
      clientName: "Eyal Ronen",
      serviceName: "Engagement Party",
      date: "2026-02-05T20:00:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a5",
      clientName: "Maya Azulay",
      serviceName: "Private Dinner",
      date: "2026-02-11T19:30:00.000Z",
      status: "confirmed",
    },

    // ===== March (pipeline building) =====
    {
      _id: "a6",
      clientName: "Tom Hirsch",
      serviceName: "Product Launch",
      date: "2026-03-03T09:00:00.000Z",
      status: "pending",
    },
  ],

  // ⭐ Reviews
  reviews: [
    {
      _id: "r1",
      rating: 5,
      comment: "Amazing organization and attention to detail!",
    },
    {
      _id: "r2",
      rating: 4,
      comment: "Very professional and responsive.",
    },
    {
      _id: "r3",
      rating: 5,
      comment: "Highly recommended for premium events.",
    },
  ],
};

export default dashboardDemoStats;
