// src/demo/dashboardDemoStats.js

const dashboardDemoStats = {
  businessName: "Bloom Events",

  // 📊 KPI CARDS
  views_count: 1284,
  reviews_count: 12,
  appointments_count: 12,
  messages_count: 4,
  notifications_count: 2,

  // 📅 Appointments (גרף + יומן + Schedule)
  appointments: [
    // ===== January 2025 (busiest month) =====
    {
      _id: "a1",
      clientName: "Sarah Miller",
      serviceName: "Wedding Planning",
      date: "2025-01-10T10:00:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a2",
      clientName: "Daniel Thompson",
      serviceName: "Corporate Event",
      date: "2025-01-14T18:00:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a3",
      clientName: "Emily Johnson",
      serviceName: "Birthday Party",
      date: "2025-01-18T12:00:00.000Z",
      status: "pending",
    },

    // 🟣 Busy Day – Jan 26 (Schedule looks alive)
    {
      _id: "a4",
      clientName: "Michael Anderson",
      serviceName: "Luxury Private Event",
      date: "2025-01-26T09:30:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a5",
      clientName: "Jessica Brown",
      serviceName: "Event Styling Consultation",
      date: "2025-01-26T13:00:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a6",
      clientName: "Ryan Wilson",
      serviceName: "Wedding Follow-up Meeting",
      date: "2025-01-26T16:30:00.000Z",
      status: "pending",
    },

    // ===== February 2025 (growth) =====
    {
      _id: "a7",
      clientName: "Christopher Moore",
      serviceName: "Engagement Party",
      date: "2025-02-05T20:00:00.000Z",
      status: "confirmed",
    },
    {
      _id: "a8",
      clientName: "Amanda Davis",
      serviceName: "Private Dinner Event",
      date: "2025-02-11T19:30:00.000Z",
      status: "confirmed",
    },

    // ===== March 2025 (pipeline building) =====
    {
      _id: "a9",
      clientName: "Jason Martinez",
      serviceName: "Product Launch",
      date: "2025-03-03T09:00:00.000Z",
      status: "pending",
    },
  ],

  // ⭐ Reviews
  reviews: [
    {
      _id: "r1",
      rating: 5,
      comment: "Outstanding organization and attention to detail.",
    },
    {
      _id: "r2",
      rating: 4,
      comment: "Very professional and easy to work with.",
    },
    {
      _id: "r3",
      rating: 5,
      comment: "Highly recommended for premium events.",
    },
  ],
};

export default dashboardDemoStats;
