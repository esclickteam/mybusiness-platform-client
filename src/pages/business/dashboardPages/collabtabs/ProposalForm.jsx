import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext"; // ודא ייבוא נכון
import "./ProposalForm.css";

export default function ProposalForm({
  fromBusinessName,
  toBusiness,
  onClose,
  onSent,
}) {
  const { user } = useAuth(); // מזהה העסק שלך

  const [formData, setFormData] = useState({
    toBusinessId: toBusiness?._id || "",
    title: "",
    description: "",
    amount: "",
    validUntil: "",
    contactName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (toBusiness?._id) {
      setFormData((prev) => ({ ...prev, toBusinessId: toBusiness._id }));
    }
  }, [toBusiness]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    // בדיקה של כל השדות הדרושים
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.validUntil ||
      !formData.contactName.trim() ||
      !formData.phone.trim()
    ) {
      setError("נא למלא את כל השדות הנדרשים");
      setLoading(false);
      return;
    }

    try {
      // שליחת ההצעה – **הערה: עכשיו נשלח גם את fromBusinessId**
      const res = await API.post("/business/my/proposals", {
        fromBusinessId: user?.businessId,             // ← מזהה העסק שלך (השולח)
        toBusinessId: formData.toBusinessId,          // ← מזהה העסק המקבל (הנמען)
        message: {
          title: formData.title,
          description: formData.description,
          budget: formData.amount ? Number(formData.amount) : null,
          expiryDate: formData.validUntil,
        },
        contactName: formData.contactName,
        phone: formData.phone,
      });

      console.log("Proposal POST response full data:", res.data);

      let proposalIdToSend = null;
      if (res.data.proposal && res.data.proposal._id) {
        proposalIdToSend = res.data.proposal._id;
      } else if (res.data._id) {
        proposalIdToSend = res.data._id;
      } else if (Array.isArray(res.data.proposalsSent) && res.data.proposalsSent.length > 0) {
        proposalIdToSend = res.data.proposalsSent[0]._id;
      }

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("ההצעה נשלחה בהצלחה!");
        setFormData({
          toBusinessId: toBusiness?._id || "",
          title: "",
          description: "",
          amount: "",
          validUntil: "",
          contactName: "",
          phone: "",
        });
        if (onSent) {
          onSent(proposalIdToSend);
        }
        onClose();
      } else {
        setError("שליחה נכשלה, נסה שוב.");
      }
    } catch (err) {
      setError("שגיאה בשליחה: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        direction: "rtl",
      }}
    >
      <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
        טופס הצעה בין עסק לעסק
      </Typography>

      <TextField
        label="עסק שולח (מאת)"
        value={fromBusinessName || ""}
        disabled
        fullWidth
      />

      <TextField
        label="עסק מקבל (אל)"
        value={toBusiness?.businessName || ""}
        disabled
        fullWidth
      />

      <TextField
        label="כותרת הצעה"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="תיאור הצעה"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        minRows={4}
        required
        fullWidth
      />

      <TextField
        label="סכום (אם רלוונטי)"
        name="amount"
        type="number"
        inputProps={{ min: 0, step: 0.01 }}
        value={formData.amount}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="תאריך תוקף"
        name="validUntil"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.validUntil}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="שם איש קשר"
        name="contactName"
        value={formData.contactName}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="טלפון"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        fullWidth
      />

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "שלח הצעה"}
      </Button>
    </Box>
  );
}
