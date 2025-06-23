import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import API from "../../../../api";

export default function CollabFindPartnerTab() {
  const navigate = useNavigate();

  const [myBusinessId, setMyBusinessId] = useState(null);
  const [partners, setPartners] = useState([]);

  // ניווט צד ימין (קבוע)
  const sideNavItems = [
    { label: "ניהול העסק", icon: "🛠️", link: "/dashboard" },
    { label: "צפייה בפרופיל", icon: "👀", link: "/profile" },
    { label: "דשבורד", icon: "📊", link: "/dashboard/stats" },
    { label: "עריכת עמוד עסק", icon: "🧱", link: "/dashboard/edit-business" },
    { label: "הודעות מלקוחות", icon: "💬", link: "/dashboard/messages" },
    { label: "שיתופי פעולה", icon: "🤝", link: "/dashboard/collab" },
    { label: "מערכת CRM", icon: "🗓️", link: "/dashboard/crm" },
    { label: "יועץ עסקי", icon: "🧠", link: "/dashboard/advisor" },
    { label: "תכנית שותפים", icon: "👥", link: "/dashboard/partners" },
    { label: "מרכז העזרה", icon: "❓", link: "/dashboard/help" },
  ];

  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get("/business/my");
        setMyBusinessId(res.data.business._id);
      } catch (err) {
        console.error("Error fetching my business:", err);
      }
    }

    async function fetchPartners() {
      try {
        const res = await API.get("/business/findPartners");
        setPartners(res.data.relevant || []);
      } catch (err) {
        console.error("Error fetching partners", err);
      }
    }

    fetchMyBusiness();
    fetchPartners();

    const intervalId = setInterval(fetchPartners, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleOpenProfile = (business) => {
    if (business._id) {
      navigate(`/business-profile/${business._id}`);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 4, p: 3, bgcolor: "#f7f5ff", minHeight: "80vh" }}>
      {/* ניווט צד ימין */}
      <Box
        sx={{
          width: 220,
          bgcolor: "#f0eaff",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgb(118 74 230 / 0.1)",
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1.5,
          fontWeight: "bold",
          color: "#5a469a",
          fontSize: 16,
          userSelect: "none",
        }}
      >
        {sideNavItems.map(({ label, icon, link }) => (
          <Button
            key={label}
            href={link}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: "600",
              fontSize: "1rem",
              color: "#5a469a",
              borderRadius: 2,
              mb: 0.5,
              px: 2,
              py: 1,
              ":hover": {
                bgcolor: "#d8cafc",
              },
            }}
          >
            <span style={{ marginRight: 8 }}>{icon}</span> {label}
          </Button>
        ))}
      </Box>

      {/* רשימת שותפים עסקיים */}
      <Box sx={{ flex: 1 }}>
        <h2 style={{ color: "#6d4fc4", fontWeight: "bold", marginBottom: 24, fontSize: "2.2rem" }}>
          מצא שותף עסקי
        </h2>

        {partners.length === 0 ? (
          <Box sx={{ color: "#999", fontSize: "1.1rem" }}>לא נמצאו שותפים.</Box>
        ) : (
          partners.map((business) => {
            const isMine = business._id === myBusinessId;
            return (
              <Box
                key={business._id || business.id}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)",
                  p: 3,
                  mb: 3,
                  maxWidth: "100%",
                  position: "relative",
                  border: isMine ? "2px solid #fdcb6e" : "2px solid transparent",
                  transition: "all 0.3s ease",
                  ":hover": {
                    boxShadow: "0 12px 26px rgba(0, 0, 0, 0.12)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <h3
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    color: "#6d4fc4",
                    marginBottom: 4,
                  }}
                >
                  {business.businessName}
                  {isMine && (
                    <span
                      style={{
                        backgroundColor: "#fdcb6e",
                        color: "#594006",
                        fontSize: "1rem",
                        padding: "0 0.6em",
                        marginLeft: 12,
                        borderRadius: "1em",
                        fontWeight: "600",
                        boxShadow: "0 1px 4px #f9e79f44",
                        verticalAlign: "middle",
                      }}
                    >
                      העסק שלי
                    </span>
                  )}
                </h3>
                <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: 4 }}>
                  {business.category}
                </p>
                <p style={{ fontSize: "1rem", color: "#555", marginBottom: 12 }}>
                  {business.description}
                </p>

                {!isMine && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenProfile(business)}
                    sx={{
                      borderRadius: 3,
                      borderColor: "#6d4fc4",
                      color: "#6d4fc4",
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "1rem",
                      ":hover": {
                        backgroundColor: "#f3e8ff",
                        borderColor: "#5a469a",
                        color: "#5a469a",
                      },
                    }}
                  >
                    צפייה בפרופיל
                  </Button>
                )}

                {isMine && (
                  <Box
                    sx={{
                      color: "#999",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      border: "1px dashed #ccc",
                      borderRadius: 3,
                      p: 1,
                      textAlign: "center",
                      maxWidth: 220,
                    }}
                  >
                    לא ניתן לשלוח לעצמך
                  </Box>
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
