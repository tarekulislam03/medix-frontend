import { useState } from "react";
import { Link } from "react-router-dom";

// ── Icon ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── CompactDemoForm ─────────────────────────────────────────────────────────────
interface CompactDemoFormProps {
  className?: string;
  onSuccess?: () => void;
}

export default function CompactDemoForm({ className = "", onSuccess }: CompactDemoFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", storeName: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.storeName) return;
    setLoading(true);
    try {
      const res = await fetch("https://medix-bend.vercel.app/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        onSuccess?.();
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ── shared input class — dark theme ──────────────────────────────────────
  const inputCls =
    "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] " +
    "rounded-[12px] p-[10px_14px] text-white text-[0.9rem] " +
    "font-sans outline-none transition-all duration-300 " +
    "focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[rgba(26,140,140,0.15)] " +
    "focus:bg-[rgba(255,255,255,0.06)] placeholder-[rgba(255,255,255,0.2)]";

  const labelCls =
    "text-[0.65rem] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-[0.8px] mb-1.5 block";

  // ── success state ────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <div className="w-[56px] h-[56px] rounded-full bg-[rgba(76,175,80,0.1)] border-2 border-[rgba(76,175,80,0.25)] flex items-center justify-center mx-auto mb-4 text-[#4caf50]">
          <CheckIcon />
        </div>
        <h3 className="font-heading font-bold text-[1.2rem] mb-2 text-white">
          Demo Requested!
        </h3>
        <p className="text-[rgba(255,255,255,0.5)] text-[0.85rem] leading-[1.6]">
          We'll contact you at {form.phone} shortly.
          Thanks, {form.name}!
        </p>
      </div>
    );
  }

  // ── form state ───────────────────────────────────────────────────────────
  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Pharmacy / Store Name</label>
          <input
            name="storeName"
            type="text"
            value={form.storeName}
            onChange={handleChange}
            placeholder="City Care Pharmacy"
            className={inputCls}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !form.name || !form.phone || !form.storeName}
        className="w-full mt-6 bg-[var(--accent)] text-white px-5 py-[12px] rounded-[12px] text-[0.95rem] font-bold tracking-[0.5px] shadow-[0_4px_20px_rgba(26,140,140,0.3)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,140,140,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer border-none"
      >
        {loading ? "Sending…" : "Book Demo Now"}
      </button>

      <p className="mt-4 text-center text-[rgba(255,255,255,0.25)] text-[0.65rem] leading-[1.5]">
        By submitting, you agree to our{" "}
        <Link to="/privacy" className="text-[var(--accent-bright)] no-underline hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
