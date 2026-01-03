import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
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
    amount: "",
    validUntil: "",
    contactName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // ---------- Debug helpers ----------
  const debugPrefix = "[ProposalForm]";
  const nowISO = () => new Date().toISOString();

  // Safe snapshot for logs (avoid huge objects / circular)
  const getDebugSnapshot = (override = {}) => {
    const snapshot = {
      time: nowISO(),
      user: {
        id: user?._id || user?.userId || null,
        role: user?.role || null,
        businessId: user?.businessId || null,
        businessName: user?.businessName || null,
      },
      props: {
        fromBusinessName: fromBusinessName || null,
        toBusinessId: toBusiness?._id || null,
        toBusinessName: toBusiness?.businessName || null,
      },
      formData: {
        ...formData,
        title: (override.title ?? formData.title ?? "").slice(0, 120),
        description: (override.description ?? formData.description ?? "").slice(0, 120),
      },
      ...override,
    };
    return snapshot;
  };

  // Log mounts / key changes
  useEffect(() => {
    console.log(`${debugPrefix} mounted`, getDebugSnapshot());
    return () => {
      console.log(`${debugPrefix} unmounted`, { time: nowISO() });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(`${debugPrefix} user changed`, {
      time: nowISO(),
      user: {
        id: user?._id || user?.userId || null,
        role: user?.role || null,
        businessId: user?.businessId || null,
        businessName: user?.businessName || null,
      },
    });
  }, [user]);

  useEffect(() => {
    console.log(`${debugPrefix} toBusiness prop changed`, {
      time: nowISO(),
      toBusinessId: toBusiness?._id || null,
      toBusinessName: toBusiness?.businessName || null,
      toBusiness,
    });
  }, [toBusiness]);

  // Keep toBusinessId in sync
  useEffect(() => {
    if (toBusiness?._id) {
      console.log(`${debugPrefix} syncing toBusinessId into formData`, {
        time: nowISO(),
        toBusinessId: toBusiness._id,
      });

      setFormData((prev) => ({
        ...prev,
        toBusinessId: toBusiness._id,
      }));
    }
  }, [toBusiness]);

  // Derived IDs (helps avoid surprises)
  const senderBusinessId = useMemo(() => user?.businessId || "", [user]);
  const receiverBusinessId = useMemo(() => formData.toBusinessId || "", [formData.toBusinessId]);

  // Change handler with logs
  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`${debugPrefix} handleChange`, {
      time: nowISO(),
      field: name,
      value,
    });

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMessage("");
  };

  // Validation helper with logs
  const validate = () => {
    const missing = [];

    if (!receiverBusinessId) missing.push("toBusinessId");
    if (!formData.title.trim()) missing.push("title");
    if (!formData.description.trim()) missing.push("description");
    if (!formData.validUntil) missing.push("validUntil");
    if (!formData.contactName.trim()) missing.push("contactName");
    if (!formData.phone.trim()) missing.push("phone");

    // NOTE: we do NOT require amount
    const ok = missing.length === 0;

    console.log(`${debugPrefix} validate`, {
      time: nowISO(),
      ok,
      missing,
      senderBusinessId: senderBusinessId || null,
      receiverBusinessId: receiverBusinessId || null,
    });

    return { ok, missing };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(`${debugPrefix} submit:start`, getDebugSnapshot());

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const { ok, missing } = validate();
    if (!ok) {
      const msg = `Please fill in all required fields (${missing.join(", ")})`;
      console.warn(`${debugPrefix} submit:blocked`, { time: nowISO(), missing });
      setError(msg);
      setLoading(false);
      return;
    }

    // Build payload (log it)
    const payload = {
      // You technically don't need fromBusinessId because backend uses token (req.user.businessId),
      // but we keep it for debugging consistency.
      fromBusinessId: senderBusinessId,
      toBusinessId: receiverBusinessId,
      message: {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget:
          formData.amount !== "" && formData.amount != null
            ? Number(formData.amount)
            : null,
        expiryDate: formData.validUntil || null,
      },
      contactName: formData.contactName.trim(),
      phone: formData.phone.trim(),
    };

    console.log(`${debugPrefix} submit:payload`, {
      time: nowISO(),
      payload,
    });

    try {
      console.log(`${debugPrefix} submit:POST /business/my/proposals`, {
        time: nowISO(),
      });

      const res = await API.post("/business/my/proposals", payload);

      console.log(`${debugPrefix} submit:response`, {
        time: nowISO(),
        status: res?.status,
        statusText: res?.statusText,
        data: res?.data,
        headers: res?.headers,
      });

      // Try to extract both proposalId (UUID) and _id (Mongo ObjectId)
      const proposalObjectId =
        res?.data?.proposal?._id ||
        res?.data?._id ||
        null;

      const proposalUUID =
        res?.data?.proposal?.proposalId ||
        res?.data?.proposalId ||
        null;

      // For your later accept route:
      // - Your PUT /my/proposals/:proposalId/status expects :proposalId to be proposalId (UUID)
      //   BUT we will send both up to the parent so you can decide.
      console.log(`${debugPrefix} submit:extractedIds`, {
        time: nowISO(),
        proposalObjectId,
        proposalUUID,
      });

      if (res.status === 200 || res.status === 201) {
        setSuccessMessage("Proposal sent successfully!");

        setFormData({
          toBusinessId: toBusiness?._id || "",
          title: "",
          description: "",
          amount: "",
          validUntil: "",
          contactName: "",
          phone: "",
        });

        // Call parent callback with full info (backward compatible: if parent expects 1 arg, it will ignore the extra)
        if (onSent) {
          console.log(`${debugPrefix} calling onSent(...)`, {
            time: nowISO(),
            proposalObjectId,
            proposalUUID,
          });

          // Prefer UUID if exists (because your status update route uses proposalId UUID)
          const bestIdForStatusRoute = proposalUUID || proposalObjectId;

          onSent(bestIdForStatusRoute, {
            proposalUUID,
            proposalObjectId,
            raw: res?.data,
          });
        }

        console.log(`${debugPrefix} submit:success - closing modal`, { time: nowISO() });
        onClose?.();
      } else {
        console.warn(`${debugPrefix} submit:unexpectedStatus`, {
          time: nowISO(),
          status: res?.status,
        });
        setError("Sending failed. Please try again.");
      }
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        null;

      console.error(`${debugPrefix} submit:error`, {
        time: nowISO(),
        message: err?.message,
        serverMsg,
        status: err?.response?.status,
        data: err?.response?.data,
        err,
      });

      setError(
        "Error sending proposal: " +
          (serverMsg || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
      console.log(`${debugPrefix} submit:end`, { time: nowISO() });
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
      }}
    >
      <Typography variant="h5" component="h2" textAlign="center" gutterBottom>
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

      {/* Debug (optional) - can remove later */}
      <TextField
        label="Receiver Business ID (debug)"
        value={receiverBusinessId || ""}
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
        sx={{ mt: 2 }}
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
