import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 初始化 Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// ⚠️ Cloud Run + Stripe 必须使用 raw body 解析
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
    console.error("❌ Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`⚡ Stripe event received: ${event.type}`);

  // ================================
  //   🎯 根据事件类型进行处理
  // ================================
  switch (event.type) {
    case "checkout.session.completed":
      console.log("💰 Checkout completed:", event.data.object.id);
      break;

    case "payment_intent.succeeded":
      console.log("💸 Payment succeeded:", event.data.object.id);
      break;

    case "customer.subscription.created":
      console.log("📅 Subscription created:", event.data.object.id);
      break;

    default:
      console.log(`ℹ️ 未处理的事件：${event.type}`);
  }

  // 返回成功
  return res.json({ received: true });
});

// Cloud Run 监听端口
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Stripe Webhook Service running on port ${port}`);
});
