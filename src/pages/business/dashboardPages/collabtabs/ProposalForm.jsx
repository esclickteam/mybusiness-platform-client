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
  InputAdornment,
  Divider,
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
      !formData.title ||
      !formData.description ||
      !formData.validUntil ||
      !formData.contactName ||
      !formData.phone
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

      const proposalId =
        res.data?.proposal?._id ||
        res.data?._id ||
        res.data?.proposalsSent?.[0]?._id;

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("Proposal sent successfully!");
        if (onSent) onSent(proposalId);
        onClose();
      } else {
        setError("Sending failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error sending proposal. Try again."
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
        width: "100%",
        maxWidth: 720,
        mx: "auto",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        direction: "ltr",
        maxHeight: "calc(100vh - 48px)",
        overflowY: "auto",
      }}
    >
      {/* ===== Header ===== */}
      <Typography variant="h5" fontWeight="bold" textAlign="center">
        Business-to-Business Proposal
      </Typography>

      <Divider />

      {/* ===== Businesses ===== */}
      <TextField label="From" value={fromBusinessName || ""} disabled />
      <TextField
        label="To"
        value={toBusiness?.businessName || ""}
        disabled
      />

      {/* ===== Proposal Details ===== */}
      <Typography variant="h6">Proposal Details</Typography>

      <TextField
        label="Proposal Title *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <TextField
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        minRows={4}
        required
      />

      {/* ===== Collaboration ===== */}
      <Typography variant="h6">Collaboration</Typography>

      <TextField
        label="What You Will Provide"
        name="giving"
        value={formData.giving}
        onChange={handleChange}
      />

      <TextField
        label="What You Will Receive"
        name="receiving"
        value={formData.receiving}
        onChange={handleChange}
      />

      <TextField
        select
        label="Collaboration Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
      >
        <MenuItem value="One-sided">One-sided</MenuItem>
        <MenuItem value="Two-sided">Two-sided</MenuItem>
        <MenuItem value="With commissions">With commissions</MenuItem>
      </TextField>

      {/* ===== Payment & Dates ===== */}
      <Typography variant="h6">Terms & Payment</Typography>

      <TextField
        label="Payment / Commission Details"
        name="payment"
        value={formData.payment}
        onChange={handleChange}
      />

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate}
          onChange={handleChange}
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate}
          onChange={handleChange}
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
        label="Amount (optional)"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />

      <TextField
        label="Valid Until *"
        name="validUntil"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.validUntil}
        onChange={handleChange}
        required
      />

      {/* ===== Contact ===== */}
      <Typography variant="h6">Contact Details</Typography>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        <TextField
          label="Contact Person *"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {/* ===== Submit ===== */}
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.4,
          fontWeight: "bold",
          borderRadius: "12px",
          background: "#6b46c1",
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
