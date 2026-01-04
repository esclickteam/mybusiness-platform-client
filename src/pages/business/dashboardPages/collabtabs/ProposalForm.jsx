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
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";
import "./ProposalForm.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ProposalForm({
  fromBusinessName,
  toBusiness,
  onClose,
  onSent,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* =========================
     State
  ========================= */
  const [formData, setFormData] = useState({
    toBusinessId: toBusiness?._id || null,
    title: "",
    description: "",
    giving: "",
    receiving: "",
    type: "Two-sided",
    payment: "",
    amount: "",
    startDate: "",
    endDate: "",
    validUntil: "",
    cancelAnytime: false,
    confidentiality: false,
    contactName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // success | error
  });

  /* =========================
     Effects
  ========================= */
  useEffect(() => {
    if (toBusiness?._id) {
      setFormData((prev) => ({
        ...prev,
        toBusinessId: toBusiness._id,
      }));
    }
  }, [toBusiness]);

  /* =========================
     Handlers
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    /* ===== Validation ===== */
    if (
      !formData.title ||
      !formData.description ||
      !formData.validUntil ||
      !formData.contactName ||
      !formData.phone
    ) {
      setToast({
        open: true,
        severity: "error",
        message: "Please fill in all required fields.",
      });
      setLoading(false);
      return;
    }

    /* ===== Payload ===== */
    const payload = {
      toBusinessId: formData.toBusinessId,

      title: formData.title.trim(),
      description: formData.description.trim(),

      giving: formData.giving
        ? [formData.giving.trim()]
        : [],

      receiving: formData.receiving
        ? [formData.receiving.trim()]
        : [],

      type: formData.type,
      payment: formData.payment || "",

      amount:
        formData.amount !== ""
          ? Number(formData.amount)
          : null,

      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      validUntil: formData.validUntil,

      cancelAnytime: Boolean(formData.cancelAnytime),
      confidentiality: Boolean(formData.confidentiality),

      contactName: formData.contactName.trim(),
      phone: formData.phone,
    };

    try {
      const res = await API.post(
        "/business/my/proposals",
        payload
      );

      if (res.status === 200 || res.status === 201) {
        setToast({
          open: true,
          severity: "success",
          message: "✅ Proposal sent successfully",
        });

        onSent?.(res.data?.proposal?.proposalId);

        
      } else {
        setToast({
          open: true,
          severity: "error",
          message: "Sending failed. Please try again.",
        });
      }
    } catch (err) {
      setToast({
        open: true,
        severity: "error",
        message:
          err.response?.data?.error ||
          "Error sending proposal. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Render
  ========================= */
  return (
    <>
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
        }}
      >
        {/* ===== Header ===== */}
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Business-to-Business Proposal
        </Typography>

        <Divider />

        {/* ===== Businesses ===== */}
        <TextField
          label="From"
          value={fromBusinessName || ""}
          disabled
        />

        <TextField
          label="To"
          value={toBusiness?.businessName || "Public Market"}
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

        {/* ===== Terms & Payment ===== */}
        <Typography variant="h6">Terms & Payment</Typography>

        <TextField
          label="Payment / Commission Details"
          name="payment"
          value={formData.payment}
          onChange={handleChange}
        />

        <TextField
          label="Amount (optional)"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
          }}
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

        <TextField
          label="Valid Until *"
          name="validUntil"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.validUntil}
          onChange={handleChange}
          required
        />

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

          <PhoneInput
            country="us"
            value={formData.phone}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                phone: value,
              }))
            }
            inputStyle={{
              width: "100%",
              height: "56px",
              borderRadius: "12px",
            }}
          />
        </Box>

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

      {/* ===== Toast ===== */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() =>
          setToast((prev) => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: "12px",
            fontWeight: "bold",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
