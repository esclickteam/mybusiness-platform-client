// src/demo/dashboardDemoStats.js
const dashboardDemoStats = {
  businessName: "Bloom Events",

  views_count: 1284,
  reviews_count: 12,
  appointments_count: 37,
  messages_count: 4,
  notifications_count: 2,

  appointments: [
    {
      _id: "a1",
      clientName: "Sarah Cohen",
      serviceName: "Wedding Planning",
      date: "2026-01-14T10:00:00.000Z",
      status: "confirmed"
    },
    {
      _id: "a2",
      clientName: "Daniel Levi",
      serviceName: "Corporate Event",
      date: "2026-01-16T18:00:00.000Z",
      status: "confirmed"
    },
    {
      _id: "a3",
      clientName: "Noa Shapiro",
      serviceName: "Birthday Party",
      date: "2026-01-18T12:00:00.000Z",
      status: "pending"
    }
  ],

  reviews: [
    { _id: "r1", rating: 5, comment: "Amazing organization and attention to detail!" },
    { _id: "r2", rating: 4, comment: "Very professional and responsive." }
  ]
};

export default dashboardDemoStats;
