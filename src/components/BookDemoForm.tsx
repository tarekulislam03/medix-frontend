import { useState } from "react";
import { Link } from "react-router-dom";

// ── Icon ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── BookDemoForm ─────────────────────────────────────────────────────────────
interface BookDemoFormProps {
  className?: string;
  onSuccess?: () => void;
}

export default function BookDemoForm({ className = "", onSuccess }: BookDemoFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
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

  const handleReset = () => {
    setSent(false);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  // ── shared input class — dark theme ──────────────────────────────────────
  const inputCls =
    "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] " +
    "rounded-[12px] p-[13px_16px] text-white text-[0.92rem] " +
    "font-sans outline-none transition-all duration-300 " +
    "focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[rgba(26,140,140,0.15)] " +
    "focus:bg-[rgba(255,255,255,0.06)] placeholder-[rgba(255,255,255,0.2)]";

  const labelCls =
    "text-[0.7rem] text-[rgba(255,255,255,0.3)] font-bold uppercase tracking-[1px] mb-2 block";

  // ── success state ────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className={`text-center py-10 ${className}`}>
        <div className="w-[72px] h-[72px] rounded-full bg-[rgba(76,175,80,0.1)] border-2 border-[rgba(76,175,80,0.25)] flex items-center justify-center mx-auto mb-6 text-[#4caf50]">
          <CheckIcon />
        </div>
        <h3 className="font-heading font-bold text-[1.4rem] mb-2.5 text-white">
          We got your message!
        </h3>
        <p className="text-[rgba(255,255,255,0.5)] text-[0.9rem] leading-[1.7]">
          Our team will reach out within 24 hours to schedule your personalized demo.
          Thanks, {form.name}!
        </p>
        <button
          onClick={handleReset}
          className="mt-6 bg-transparent border border-[rgba(26,140,140,0.25)] text-[var(--accent-bright)] px-6 py-2.5 rounded-full text-[0.85rem] cursor-pointer font-medium hover:bg-[rgba(26,140,140,0.08)] transition-colors"
        >
          Send another →
        </button>
      </div>
    );
  }

  // ── form state ───────────────────────────────────────────────────────────
  return (
    <div className={`w-full ${className}`}>
      <h3 className="font-heading font-bold text-[1.3rem] mb-2 text-white">
        Registration Form
      </h3>
      <p className="text-[rgba(255,255,255,0.4)] text-[0.88rem] mb-[28px]">
        Fill out the form below ato register for Partnership Program.
      </p>

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: "Full Name", name: "name", placeholder: "Jane Smith", type: "text" },
          { label: "Phone",     name: "phone", placeholder: "+91 9876543210", type: "tel" },
        ].map((f) => (
          <div key={f.name}>
            <label className={labelCls}>{f.label}</label>
            <input
              name={f.name}
              type={f.type}
              value={form[f.name as keyof typeof form]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className={labelCls}>Email Address</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="jane@pharmacare.com"
          className={inputCls}
        />
      </div>

      {/* Message */}
      <div className="mb-7">
        <label className={labelCls}>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.name || !form.email}
        className="w-full bg-[var(--accent)] text-white px-6 py-[14px] rounded-[12px] text-[0.95rem] font-bold tracking-[0.5px] shadow-[0_4px_20px_rgba(26,140,140,0.3)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,140,140,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer border-none"
      >
        {loading ? "Sending…" : "Submit & Get Started →"}
      </button>

      {/* Legal */}
      <p className="mt-4 text-[rgba(255,255,255,0.25)] text-[0.7rem] leading-[1.6]">
        By submitting, you agree to our{" "}
        <Link to="/privacy" className="text-[var(--accent-bright)] no-underline hover:underline">
          Privacy Policy
        </Link>{" "}
        &{" "}
        <Link to="/terms" className="text-[var(--accent-bright)] no-underline hover:underline">
          Terms of Service
        </Link>
      </p>
    </div>
  );
}