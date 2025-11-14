import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook 需要原始 body
app.use(
  express.raw({ type: "application/json" })
);

app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Webhook event received:", event.type);

  // 这里你可以根据事件做操作
  // if (event.type === "checkout.session.completed") {...}

  res.json({ received: true });
});

// Cloud Run 要监听 $PORT
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Stripe Webhook server running on port ${port}`);
});
