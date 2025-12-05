import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setUser } from "../../store/slices/authSlice";
import api from "../../lib/api";
import {
  createPaymentLink,
  pollLinkPayments,
  upgradeUserPlan,
} from "../../services/payment";
import Header from "../../components/Header";

const PRICING = {
  monthly: 199,
  yearly: 1499,
};

export default function UpgradePage() {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.auth.user);

  useEffect(() => {
    async function fetchUserStatus() {
      try {
        const res = await api.get("/users/me");
        const updatedUser = res.data?.user || res.data;
        if (updatedUser?.plan) {
          dispatch(setUser(updatedUser));
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.warn("Failed to fetch user plan:", err);
      }
    }

    // Fetch user data if not loaded or plan missing
    if (!me?.plan || !me?.plan_expiry) {
      fetchUserStatus();
    }
  }, [me, dispatch]);

  const [activePlan, setActivePlan] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [msgVisible, setMsgVisible] = useState(false);
  const [err, setErr] = useState(null);

  const customer = useMemo(
    () => ({
      name: me?.username || me?.name || "",
      email: me?.email || "",
    }),
    [me]
  );

  const isActivePlan = (plan) => {
    if (!me?.plan || !me?.plan_expiry) return false;
    return me.plan === plan && new Date(me.plan_expiry) > new Date();
  };

  function resetStatus() {
    setErr(null);
    setVerified(false);
    setMsgVisible(false);
  }

  async function startPay(plan) {
    resetStatus();
    setActivePlan(plan);
    setPaymentLink(null);
    try {
      setLoading(true);
      const res = await createPaymentLink({ plan, customer });
      const link = res.data?.data || res.data;
      if (!link?.short_url || !link?.id)
        throw new Error("Payment link not created");

      setPaymentLink(link);
      window.open(link.short_url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to create payment link"
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyPayment() {
    resetStatus();
    if (!paymentLink?.id) {
      setErr("Missing payment link. Start payment first.");
      return;
    }
    try {
      setLoading(true);
      const poll = await pollLinkPayments(paymentLink.id);

      let payments = [];
      if (poll.data?.data?.payments) payments = poll.data.data.payments;
      else if (poll.data?.payments) payments = poll.data.payments;
      else if (poll.data?.data?.items) payments = poll.data.data.items;
      else if (Array.isArray(poll.data)) payments = poll.data;
      else payments = [];

      const paid = payments.find(
        (p) =>
          p.status === "captured" ||
          p.status === "paid" ||
          p?.acquirer_data?.upi_transaction_id
      );

      if (!paid) throw new Error("Payment not found yet. Try again shortly.");

      const upgrade = await upgradeUserPlan({
        plan: activePlan,
        paymentLinkId: paymentLink.id,
        paymentId: paid.id,
      });

      const updatedUser =
        upgrade.data?.data?.user || upgrade.data?.user || upgrade.data;

      if (updatedUser) {
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setVerified(true);
      setMsgVisible(true);

      // Hide message after 5 seconds
      setTimeout(() => setMsgVisible(false), 5000);
    } catch (e) {
      const m =
        e?.response?.data?.message ||
        e?.message ||
        "Verification failed. Try again.";
      setErr(m);
    } finally {
      setLoading(false);
    }
  }

  const expiryDisplay =
    me?.plan_expiry &&
    new Date(me.plan_expiry).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  useEffect(() => {
    // Refresh from localStorage if Redux lost it (e.g., after re-login)
    if (!me?.plan && localStorage.getItem("user")) {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser?.plan && new Date(localUser.plan_expiry) > new Date()) {
        dispatch(setUser(localUser));
      }
    }
  }, [me, dispatch]);

  return (
    <div>
      <Header/>
      <div className="relative pt-16 min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-25 bg-fuchsia-600/40 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-25 bg-indigo-600/40 animate-pulse" />

        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white glow">
              Go <span className="text-fuchsia-400">Premium</span>
            </h1>
            <p className="mt-3 text-white/80">
              Unlock creator tools, priority notifications, premium polls, and a
              shiny badge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlanCard
              title="Monthly"
              price={`₹${PRICING.monthly}`}
              sub="Billed every month"
              active={isActivePlan("monthly")}
              expiry={isActivePlan("monthly") ? expiryDisplay : null}
              bullet={[
                "All creator tools",
                "Premium polls access",
                "Priority notifications",
              ]}
              onPay={() => startPay("monthly")}
              disabled={isActivePlan("monthly")}
              loading={loading}
            />
            <PlanCard
              title="Yearly"
              price={`₹${PRICING.yearly}`}
              sub="Best value"
              active={isActivePlan("yearly")}
              expiry={isActivePlan("yearly") ? expiryDisplay : null}
              bullet={[
                "Everything in Monthly",
                "Early manga drops",
                "Premium supporter badge",
              ]}
              onPay={() => startPay("yearly")}
              disabled={isActivePlan("yearly")}
              loading={loading}
            />
          </div>

          {paymentLink && !verified && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={verifyPayment}
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,.4)] disabled:opacity-60"
              >
                {loading ? "Checking payment..." : "Verify Payment"}
              </button>
            </div>
          )}

          <AnimatePresence>
            {msgVisible && (
              <motion.div
                key="verified"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1.2, 1], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="mt-10 text-center relative"
              >
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-gradient-to-r from-fuchsia-400/40 via-indigo-400/40 to-purple-400/40"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.5] }}
                  transition={{ duration: 1 }}
                  style={{ width: 300, height: 300 }}
                />
                {[...Array(14)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,.6)]"
                    style={{
                      width: Math.random() * 6 + 2,
                      height: Math.random() * 6 + 2,
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.4, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 160,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: Math.random() * 0.3,
                      ease: "easeOut",
                    }}
                  />
                ))}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 text-2xl font-extrabold bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400"
                >
                  ✨ Payment Verified! Plan Activated!
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {err && (
            <div className="mt-4 text-red-400 text-sm text-center break-words">
              razorpay error: {JSON.stringify({ message: err })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  sub,
  bullet = [],
  expiry,
  active,
  onPay,
  disabled,
  loading,
}) {
  return (
    <div
      className={`relative rounded-2xl p-[1px] ${
        active
          ? "bg-gradient-to-r from-emerald-500 via-fuchsia-400 to-indigo-500"
          : "bg-gradient-to-r from-white/10 via-white/5 to-white/10"
      }`}
    >
      <div className="rounded-2xl bg-[#0a0a0f]/90 backdrop-blur p-6 border border-white/10 relative">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-4xl font-extrabold">{price}</div>
              <div className="text-sm text-white/70">{sub}</div>
            </div>

            <div className="mt-2 min-h-[1.25rem] flex items-center">
              {active && expiry ? (
                <div className="text-emerald-400 text-sm font-medium">
                  Active plan — valid until {expiry}
                </div>
              ) : (
                <div className="invisible text-sm font-medium">placeholder</div>
              )}
            </div>
          </div>
        </div>

        <ul className="mt-5 space-y-2 text-white/80">
          {bullet.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg
                className="mt-[2px]"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.2 4.8 12 3.4 13.4 9 19l12-12-1.4-1.4z" />
              </svg>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <button
            onClick={onPay}
            disabled={loading || disabled}
            className="w-full px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition shadow-[0_10px_30px_rgba(99,102,241,.35)] disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay on Razorpay • " + title}
          </button>
        </div>
      </div>
    </div>
  );
}
