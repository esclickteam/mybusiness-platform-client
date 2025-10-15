const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User");

/**
 * 🧠 אימות חתימה מול PayPal
 */
async function verifyPaypalWebhook(req, event) {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const { data } = await axios.post(
      `${process.env.PAYPAL_API_BASE || "https://api-m.paypal.com"}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: req.headers["paypal-transmission-id"],
        transmission_time: req.headers["paypal-transmission-time"],
        cert_url: req.headers["paypal-cert-url"],
        auth_algo: req.headers["paypal-auth-algo"],
        transmission_sig: req.headers["paypal-transmission-sig"],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return data.verification_status === "SUCCESS";
  } catch (err) {
    console.error("❌ PayPal verification error:", err.response?.data || err.message);
    return false;
  }
}

/**
 * 💳 יצירת הזמנה (Order)
 * שולחת ל-PayPal גם את מזהה המשתמש שלנו (userId)
 */
router.post("/create-order", async (req, res) => {
  try {
    const { amount, planName, userId } = req.body; // כולל userId

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const { data } = await axios.post(
      `${process.env.PAYPAL_API_BASE || "https://api-m.paypal.com"}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            description: planName || "BizUply Subscription",
            amount: {
              currency_code: "USD",
              value: amount || "150.00",
            },
            custom_id: userId, // ✅ שומר את מזהה המשתמש בתוך ההזמנה
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    res.json({ id: data.id });
  } catch (err) {
    console.error("❌ PayPal create-order error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

/**
 * 💰 אישור עסקה (CAPTURE)
 */
router.post("/capture/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const { data } = await axios.post(
      `${process.env.PAYPAL_API_BASE || "https://api-m.paypal.com"}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    console.log("✅ Payment Captured:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ PayPal capture error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
});

/**
 * ✅ Webhook מ־PayPal
 * מזהה את המשתמש ששילם לפי custom_id ומעדכן את המסד
 */
router.post("/webhook", async (req, res) => {
  try {
    const event =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const isValid = await verifyPaypalWebhook(req, event);
    if (!isValid) {
      console.warn("⚠️ Invalid PayPal webhook signature");
      return res.sendStatus(400);
    }

    console.log("[Webhook] Event received:", event.event_type);

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const paidAmount =
        Number(event.resource?.amount?.value) ||
        Number(event.resource?.purchase_units?.[0]?.amount?.value) ||
        0;

      // ✅ נזהה לפי custom_id שהכנסנו בזמן יצירת ההזמנה
      const userId = event.resource?.supplementary_data?.related_ids?.custom_id
        || event.resource?.purchase_units?.[0]?.custom_id;

      console.log("💰 Payment confirmed for userId:", userId, "Amount:", paidAmount);

      if (!userId) {
        console.warn("⚠️ Missing userId in webhook event");
        return res.sendStatus(400);
      }

      // 🔄 עדכון המשתמש במונגו
      const user = await User.findById(userId);
      if (!user) {
        console.warn("⚠️ No user found with ID:", userId);
        return res.sendStatus(404);
      }

      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1); // חודש קדימה

      user.subscriptionPlan = "monthly";
      user.paymentStatus = "paid";
      user.hasPaid = true;
      user.subscriptionStart = now;
      user.subscriptionEnd = nextMonth;
      user.lastPrice = paidAmount;
      user.lastPaymentCreatedAt = now;
      user.lastReturnValue = "success";
      user.lastPaymentUrl = "paypal";
      user.lastLowProfileCode = null;

      await user.save();

      console.log(
        `✅ Updated user ${user.email} subscription → active until ${nextMonth.toISOString()}`
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("[Webhook] Error:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
