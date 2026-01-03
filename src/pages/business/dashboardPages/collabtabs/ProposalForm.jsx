import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";
import "./ProposalForm.css";

export default function ProposalForm({
  fromBusinessName,
  toBusiness,
  onClose,
  onSent,
}) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    toBusinessId: toBusiness?._id || "",
    title: "",
    description: "",
    giving: "",
    receiving: "",
    type: "Two-sided",
    payment: "",
    startDate: "",
    endDate: "",
    cancelAnytime: false,
    confidentiality: false,
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.validUntil ||
      !formData.contactName.trim() ||
      !formData.phone.trim()
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/business/my/proposals", {
        fromBusinessId: user?.businessId,
        toBusinessId: formData.toBusinessId,
        message: {
          title: formData.title,
          description: formData.description,
          budget: formData.amount ? Number(formData.amount) : null,
          expiryDate: formData.validUntil,
          giving: formData.giving,
          receiving: formData.receiving,
          type: formData.type,
          payment: formData.payment,
          startDate: formData.startDate,
          endDate: formData.endDate,
          cancelAnytime: formData.cancelAnytime,
          confidentiality: formData.confidentiality,
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
      } else if (
        Array.isArray(res.data.proposalsSent) &&
        res.data.proposalsSent.length > 0
      ) {
        proposalIdToSend = res.data.proposalsSent[0]._id;
      }

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("Proposal sent successfully!");
        setFormData({
          toBusinessId: toBusiness?._id || "",
          title: "",
          description: "",
          giving: "",
          receiving: "",
          type: "Two-sided",
          payment: "",
          startDate: "",
          endDate: "",
          cancelAnytime: false,
          confidentiality: false,
          amount: "",
          validUntil: "",
          contactName: "",
          phone: "",
        });
        if (onSent) onSent(proposalIdToSend);
        onClose();
      } else {
        setError("Sending failed. Please try again.");
      }
    } catch (err) {
      console.error("Error sending proposal:", err);
      setError(
        "Error sending proposal: " +
          (err.response?.data?.message || err.message)
      );
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
        direction: "ltr",
        maxHeight: "80vh",
        overflowY: "auto",
        scrollbarWidth: "thin",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Business-to-Business Proposal Form
      </Typography>

      <TextField
        label="From (Your Business)"
        value={fromBusinessName || ""}
        disabled
        fullWidth
      />

      <TextField
        label="To (Receiving Business)"
        value={toBusiness?.businessName || ""}
        disabled
        fullWidth
      />

      <TextField
        label="Proposal Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Proposal Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        minRows={4}
        required
        fullWidth
      />

      <TextField
        label="What You Will Provide"
        name="giving"
        value={formData.giving}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="What You Will Receive"
        name="receiving"
        value={formData.receiving}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        select
        label="Collaboration Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="One-sided">One-sided</MenuItem>
        <MenuItem value="Two-sided">Two-sided</MenuItem>
        <MenuItem value="With commissions">With commissions</MenuItem>
      </TextField>

      <TextField
        label="Commissions / Payment"
        name="payment"
        value={formData.payment}
        onChange={handleChange}
        fullWidth
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate}
          onChange={handleChange}
          fullWidth
        />
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.cancelAnytime}
            onChange={handleChange}
            name="cancelAnytime"
          />
        }
        label="Cancelable Anytime"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.confidentiality}
            onChange={handleChange}
            name="confidentiality"
          />
        }
        label="Include Confidentiality Clause"
      />

      <TextField
        label="Amount (if applicable)"
        name="amount"
        type="number"
        inputProps={{ min: 0, step: 0.01 }}
        value={formData.amount}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Valid Until"
        name="validUntil"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.validUntil}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Contact Person"
        name="contactName"
        value={formData.contactName}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Phone Number"
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
        sx={{
          mt: 2,
          background: "#6b46c1",
          fontWeight: "bold",
          ":hover": { background: "#553c9a" },
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Send Proposal"
        )}
      </Button>
    </Box>
  );
}
