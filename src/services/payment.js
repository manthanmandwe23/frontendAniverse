import api from "../lib/api";

// Create payment link
export async function createPaymentLink({ plan, customer }) {
  const amount = plan === "yearly" ? 1499 : 199; // ✅ correct amount per plan
  return api.post("/payments/razorpay/create-link", {
    plan,
    amount,
    currency: "INR",
    description: `AnimeVerse ${plan} plan`,
    customer: customer || {},
    notes: { plan },
  });
}

// Poll payment link for completed payments
export async function pollLinkPayments(linkId) {
  return api.get(`/payments/razorpay/link/${linkId}/poll`);
}

// Upgrade user’s plan
export async function upgradeUserPlan({ plan, paymentLinkId, paymentId }) {
  return api.patch("/users/upgrade", {
    plan,
    payment_link_id: paymentLinkId,
    payment_id: paymentId,
  });
}
