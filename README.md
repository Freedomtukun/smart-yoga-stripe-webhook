# Smart Yoga Stripe Webhook

This service handles Stripe Webhook events using Node.js + Express,
designed for deployment on **Google Cloud Run**.

## Environment Variables

Create a `.env` file with:

```
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PORT=8080
```

## Local Development

```bash
npm install
npm start
```

## Deploy to Google Cloud Run

```bash
gcloud run deploy smart-yoga-webhook \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars STRIPE_SECRET_KEY=sk_live_xxx,STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Webhook Endpoint

Once deployed, configure your Stripe webhook URL to:
```
https://your-cloud-run-url/webhook
```

## Events Handled

Currently logs all events. Customize in `index.js` to handle specific events like:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `customer.subscription.created`
