"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────

function useReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}


function useStickyNav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return scrolled;
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

const ParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        // Expanded particle definition with 'type' and 'rotation'
        const particles: {
            x: number; y: number; vx: number; vy: number; r: number; a: number;
            type: 'cross' | 'hexagon' | 'circle'; rotation: number; vr: number
        }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Create random particles
        for (let i = 0; i < 35; i++) {
            const typeRandom = Math.random();
            let type: 'cross' | 'hexagon' | 'circle' = 'circle';
            if (typeRandom > 0.75) type = 'cross';
            else if (typeRandom > 0.5) type = 'hexagon'; // Using hexagon as 'pill/capsule' variant

            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2, // Very slow
                vy: (Math.random() - 0.5) * 0.2,
                r: Math.random() * 8 + 4, // Larger for visibility
                a: Math.random() * 0.15 + 0.05,
                type: type,
                rotation: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.015,
            });
        }

        const drawCapsule = (ctx: CanvasRenderingContext2D, r: number) => {
            // Capsule shape: rounded rectangle
            const w = r * 2.5;
            const h = r * 1.2;
            ctx.beginPath();
            // Simple capsule: arc - line - arc - line
            ctx.moveTo(-w / 2 + h / 2, -h / 2);
            ctx.lineTo(w / 2 - h / 2, -h / 2);
            ctx.arc(w / 2 - h / 2, 0, h / 2, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(-w / 2 + h / 2, h / 2);
            ctx.arc(-w / 2 + h / 2, 0, h / 2, Math.PI / 2, -Math.PI / 2);
            ctx.stroke();
            // Split line
            ctx.beginPath();
            ctx.moveTo(0, -h / 2);
            ctx.lineTo(0, h / 2);
            ctx.stroke();
        };

        const drawSyringe = (ctx: CanvasRenderingContext2D, r: number) => {
            // Simple syringe icon
            const len = r * 3;
            const w = r * 0.8;
            ctx.beginPath();
            // Body
            ctx.rect(-w / 2, -len / 2, w, len * 0.7);
            ctx.stroke();
            // Needle
            ctx.beginPath();
            ctx.moveTo(0, len / 2 * 0.4); // Start from bottom of body (visual approximation)
            ctx.lineTo(0, len / 2 + r);
            ctx.stroke();
            // Plunger
            ctx.beginPath();
            ctx.moveTo(-w, -len / 2);
            ctx.lineTo(w, -len / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -len / 2);
            ctx.lineTo(0, -len / 2 - r);
            ctx.stroke();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                // Move
                p.x += p.vx; p.y += p.vy;
                p.rotation += p.vr;

                // Wrap around screen
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
                if (p.y < -20) p.y = canvas.height + 20;
                if (p.y > canvas.height + 20) p.y = -20;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);

                // Color: Darker blue for visibility on light bg
                ctx.strokeStyle = `rgba(37, 99, 235, ${p.a + 0.1})`;
                ctx.fillStyle = `rgba(59, 130, 246, ${p.a * 0.3})`;
                ctx.lineWidth = 1.2;

                if (p.type === 'hexagon') {
                    // Re-purposing hexagon slot for Capsule
                    drawCapsule(ctx, p.r);
                } else if (p.type === 'cross') {
                    // Re-purposing cross slot for Syringe
                    drawSyringe(ctx, p.r);
                } else {
                    // Circle (Bubble/Pill)
                    ctx.beginPath();
                    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(147, 197, 253, ${p.a * 0.5})`; // Very light blue fill
                    ctx.fill();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${p.a * 0.8})`;
                    ctx.stroke();
                }

                ctx.restore();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
};

const Icons = {
    Pharmacy: () => (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="14" width="40" height="28" rx="4" stroke="#4a90d9" strokeWidth="2.5" fill="none" />
            <path d="M14 14V10a10 10 0 0 1 20 0v4" stroke="#4a90d9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M20 26h8M24 22v8" stroke="#5fa8f5" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    ),
    Shield: () => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L5 8v6c0 6.5 4.5 12.5 11 14 6.5-1.5 11-7.5 11-14V8L16 3z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
            <path d="M11 16l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    BarChart: () => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="18" width="5" height="9" rx="1.5" fill="currentColor" opacity="0.5" />
            <rect x="13" y="12" width="5" height="15" rx="1.5" fill="currentColor" opacity="0.7" />
            <rect x="22" y="6" width="5" height="21" rx="1.5" fill="currentColor" />
        </svg>
    ),
    Clock: () => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M16 9v7l5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Users: () => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M4 26c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="22" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M22 19c2.8 0 5 1.6 5 4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    ),
    Sync: () => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M20 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 16V8a8 8 0 0 1 12.6-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M12 28l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 16v8a8 8 0 0 1-12.6 1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    ),
    Mail: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M2 4l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Phone: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.8 2.6a2 2 0 0 1-.5 2.3l-1.2 1.2a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.3-.5c.8.4 1.7.7 2.6.8A2 2 0 0 1 22 16.9z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
        </svg>
    ),
    Location: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
    Arrow: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Check: () => (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    X: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
};


const Navbar = () => {
    const scrolled = useStickyNav();
    const [mobile, setMobile] = useState(false);
    const links = ["Home", "Features", "About", "Contact"];

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled ? "py-3 bg-[var(--navy)]/85 backdrop-blur-[16px] border-b border-[rgba(74,144,217,0.12)]" : "py-5 bg-transparent border-b border-transparent"
        )}>
            <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#home" className="no-underline flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md">
                        <div className="absolute inset-0 bg-white/10 rounded-lg" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-white z-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[var(--navy)] shadow-sm z-20"></div>
                    </div>
                    <span className="font-['Syne',sans-serif] font-extrabold text-[1.2rem] text-[var(--text-primary)] tracking-tight">
                        Medi<span className="text-[var(--accent-bright)]">X</span>
                    </span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((l) => (
                        <a
                            key={l}
                            href={`#${l.toLowerCase()}`}
                            className="text-[var(--text-secondary)] no-underline text-[0.88rem] font-medium tracking-[0.3px] relative py-1 transition-colors duration-300 hover:text-[var(--accent-bright)] group"
                        >
                            {l}
                            <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--accent-bright)] rounded-full transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="bg-gradient-to-br from-[var(--accent)] to-[#2c6aad] text-white no-underline px-[22px] py-[9px] rounded-full text-[0.82rem] font-semibold tracking-[0.5px] shadow-[0_4px_20px_rgba(74,144,217,0.3)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_28px_rgba(74,144,217,0.45)]"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile Trigger */}
                <button
                    onClick={() => setMobile(!mobile)}
                    className="md:hidden bg-none border-none text-[var(--text-primary)] cursor-pointer p-2"
                >
                    {mobile ? <Icons.X /> : <Icons.Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={clsx(
                "absolute top-full left-0 right-0 bg-[var(--navy)]/97 backdrop-blur-[20px] border-b border-[rgba(74,144,217,0.15)] px-6 py-5 transition-all duration-300 origin-top",
                mobile ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"
            )}>
                {[...links, "Get Started"].map((l) => (
                    <a
                        key={l}
                        href={`#${l.toLowerCase().replace(" ", "")}`}
                        onClick={() => setMobile(false)}
                        className={clsx(
                            "block no-underline py-3 border-b border-[rgba(74,144,217,0.08)] text-[0.92rem] font-medium",
                            l === "Get Started" ? "text-[var(--accent-bright)]" : "text-[var(--text-secondary)]"
                        )}
                    >
                        {l}
                    </a>
                ))}
            </div>
        </nav>
    );
};

const Hero = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative pt-[120px] pb-20 px-6">
            {/* Top badge removed as per request */}

            <div className="max-w-[860px] text-center relative z-10">
                <h1 className={clsx(
                    "font-['Syne',sans-serif] font-extrabold text-[clamp(2.8rem,6.5vw,5rem)] leading-[1.08] tracking-[-0.02em] transition-all duration-1000 delay-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
                )}>
                    The Future of
                    <br />
                    <span className="bg-gradient-to-br from-[var(--accent-bright)] via-[var(--accent)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                        Pharmacy Management
                    </span>
                    <br />
                    <span className="text-[0.82em] font-bold text-[var(--text-secondary)]">is already here</span>
                </h1>

                <p className={clsx(
                    "text-[var(--text-secondary)] text-[clamp(1rem,1.8vw,1.15rem)] max-w-[640px] mx-auto mt-7 leading-[1.7] font-normal transition-all duration-900 delay-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                )}>
                    An all-in-one Pharmacy Store Management Software designed for modern pharmacies. Streamline regular customers, inventory, billing, and sales — all in one seamless cloud-powered software.
                </p>

                {/* CTA Buttons */}
                <div className={clsx(
                    "flex items-center justify-center gap-4 mt-11 flex-wrap transition-all duration-900 delay-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                )}>
                    <a
                        href="/register"
                        className="bg-gradient-to-br from-[var(--accent)] to-[#2c6aad] text-white no-underline px-9 py-3.5 rounded-full text-[0.92rem] font-semibold tracking-[0.3px] shadow-[0_6px_30px_rgba(74,144,217,0.35)] flex items-center gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(74,144,217,0.5)]"
                    >
                        Use MediX for Free <Icons.Arrow />
                    </a>
                    <a
                        href="tel:+918101402916"
                        className="text-[var(--text-primary)] no-underline px-8 py-3.5 rounded-full text-[0.92rem] font-medium border border-[rgba(74,144,217,0.3)] transition-all duration-300 hover:border-[rgba(74,144,217,0.6)] hover:bg-[rgba(74,144,217,0.06)]"
                    >
                        Call Now For Assistance
                    </a>
                </div>


            </div>
        </section>
    );
};


const featureData = [
    {
        icon: <Icons.Shield />, title: "Compliance & Regulatory",
        desc: "Automated FDA & state compliance checks baked into every transaction. Stay audit-ready with real-time alerts and comprehensive reporting dashboards.",
        tag: "Security",
    },
    {
        icon: <Icons.BarChart />, title: "Analytics & Insights",
        desc: "AI-powered sales forecasting, inventory turnover heatmaps, and margin analysis. Turn data into decisions with intuitive, interactive dashboards.",
        tag: "Intelligence",
    },
    {
        icon: <Icons.Clock />, title: "Lightning-Fast POS",
        desc: "Get Proper GST Compliant Bills, Invoices, and Receipts with just a few clicks. Print Bills Seamlessly.",
        tag: "Performance",
    },
    {
        icon: <Icons.Users />, title: "Regular Customer",
        desc: "Track your regular customers and their purchase history. Automatic fill the cart while billing of your regular customers.",
        tag: "Management",
    },
    {
        icon: <Icons.Sync />, title: "Auto Product Import",
        desc: "Import products from major suppliers with a single click. No manual entry, no errors — just seamless inventory management.",
        tag: "Integration",
    },
    {
        icon: <Icons.Pharmacy />, title: "Stock And Expiry Alerts",
        desc: "Get notified when your stock is running low and when your products are about to expire. Never run out of stock or waste a single dose.",
        tag: "Automation",
    },
];

const FeatureCard = ({ icon, title, desc, tag, delay }: typeof featureData[0] & { delay: number }) => {
    return (
        <div className="reveal group" style={{ transitionDelay: `${delay}ms` }}>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[20px] p-[30px_36px] backdrop-blur-md transition-all duration-400 h-full flex flex-col group-hover:-translate-y-1 group-hover:bg-[rgba(37,99,235,0.04)] group-hover:border-[var(--accent-glow-strong)] group-hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)]">
                <span className="inline-block self-start bg-[rgba(74,144,217,0.1)] text-[var(--accent-bright)] text-[0.68rem] font-semibold tracking-[1.2px] uppercase px-3 py-1 rounded-[20px] mb-[22px]">
                    {tag}
                </span>
                <div className="text-[var(--accent)] mb-5 transition-colors duration-300 group-hover:text-[var(--accent-bright)]">
                    {icon}
                </div>
                <h3 className="font-['Syne',sans-serif] font-bold text-[1.2rem] mb-3 text-[var(--text-primary)]">
                    {title}
                </h3>
                <p className="text-[var(--text-secondary)] text-[0.87rem] leading-[1.7] flex-1">
                    {desc}
                </p>
                <div className="mt-6 h-0.5 rounded-full bg-transparent transition-colors duration-400 group-hover:bg-gradient-to-r group-hover:from-[var(--accent)] group-hover:to-transparent" />
            </div>
        </div>
    );
};

const Features = () => (
    <section id="features" className="relative z-10 py-[120px] px-6">
        <div className="max-w-[1200px] mx-auto">
            <div className="reveal text-center mb-[72px]">
                <span className="inline-block bg-[rgba(74,144,217,0.08)] border border-[rgba(74,144,217,0.2)] text-[var(--accent-bright)] text-[0.7rem] font-semibold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                    Capabilities
                </span>
                <h2 className="font-['Syne',sans-serif] font-extrabold text-[clamp(2.2rem,4.5vw,3.2rem)] text-[var(--text-primary)] leading-[1.15]">
                    Built for the<br />
                    <span className="bg-gradient-to-br from-[var(--accent-bright)] to-[var(--accent)] bg-clip-text text-transparent">
                        modern pharmacy
                    </span>
                </h2>
                <p className="text-[var(--text-secondary)] max-w-[560px] mx-auto mt-5 text-[1rem] leading-[1.7]">
                    Every feature is purpose-built to solve real pharmacy challenges — from regulatory compliance to patient experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
                {featureData.map((f, i) => <FeatureCard key={i} {...f} delay={i * 100} />)}
            </div>
        </div>
    </section>
);

const About = () => (
    <section id="about" className="relative z-10 py-[120px] px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Left: Visual */}
            <div className="reveal-left relative">
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[28px] p-10 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(74,144,217,0.15)_0%,transparent_70%)] pointer-events-none" />

                    <div className="flex flex-col gap-[18px] relative z-10">
                        {[
                            { label: "Today's Prescriptions", value: "1,284", trend: "+12%", color: "#4caf50" },
                            { label: "Revenue Today", value: "$48,920", trend: "+8.3%", color: "#4caf50" },
                            { label: "Inventory Alerts", value: "3", trend: "↓ 2", color: "#4a90d9" },
                            { label: "Avg. Transaction Time", value: "2.4s", trend: "-0.8s", color: "#4caf50" },
                        ].map((s, i) => (
                            <div key={i} className="flex justify-between items-center bg-[var(--navy-mid)] rounded-[14px] p-[16px_20px] border border-[rgba(37,99,235,0.1)]">
                                <div>
                                    <div className="text-[0.72rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-1">{s.label}</div>
                                    <div className="font-['Syne',sans-serif] font-bold text-[1.3rem] text-[var(--text-primary)]">{s.value}</div>
                                </div>
                                <span className={clsx(
                                    "text-[0.72rem] font-semibold px-2.5 py-1 rounded-[20px]",
                                    s.color === "#4caf50" ? "bg-[#4caf50]/10 text-[#4caf50]" : "bg-[rgba(37,99,235,0.1)] text-[var(--accent)]"
                                )}>
                                    {s.trend}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Bottom progress bar */}
                    <div className="mt-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-[0.72rem] text-[var(--text-muted)]">Inventory Health</span>
                            <span className="text-[0.72rem] text-[#4caf50] font-semibold">94%</span>
                        </div>
                        <div className="h-1.5 bg-[rgba(74,144,217,0.12)] rounded-full">
                            <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[#4a90d9] to-[#4caf50]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Text */}
            <div className="reveal-right">
                <span className="inline-block bg-[rgba(74,144,217,0.08)] border border-[rgba(74,144,217,0.2)] text-[var(--accent-bright)] text-[0.7rem] font-semibold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                    About Us
                </span>
                <h2 className="font-['Syne',sans-serif] font-extrabold text-[clamp(2rem,3.8vw,2.8rem)] text-[var(--text-primary)] leading-[1.2] mb-6">
                    Redefining pharmacy operations<br />
                    <span className="bg-gradient-to-br from-[var(--accent-bright)] via-[var(--accent)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                        from the ground up
                    </span>
                </h2>
                <p className="text-[var(--text-secondary)] text-[0.95rem] leading-[1.85] mb-5">
                    Founded in 2026, MediX was born from a simple frustration: pharmacy management software hadn't meaningfully evolved in over a decade. We set out to change that.
                </p>
                <p className="text-[var(--text-secondary)] text-[0.95rem] leading-[1.85] mb-9">
                    Our team of healthcare technologists and former pharmacy operators built a platform that speaks the language of pharmacies — combining cutting-edge cloud infrastructure with an intuitive interface that reduces training time by 80%.
                </p>
                {/* Checklist */}
                {["FDA & DEA compliant by default", "99.97% uptime SLA with real-time monitoring", "24/7 dedicated pharmacy support", "Enterprise-grade security (SOC 2, HIPAA)"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3.5">
                        <div className="w-6 h-6 rounded-full min-w-[24px] bg-[rgba(74,144,217,0.12)] border border-[rgba(74,144,217,0.25)] flex items-center justify-center text-[var(--accent-bright)] mt-[1px]">
                            <Icons.Check />
                        </div>
                        <span className="text-[var(--text-secondary)] text-[0.88rem] leading-[1.6]">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [sent, setSent] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="relative z-10 py-[120px] px-6">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-20 items-start">
                <div className="reveal-left">
                    <span className="inline-block bg-[rgba(74,144,217,0.08)] border border-[rgba(74,144,217,0.2)] text-[var(--accent-bright)] text-[0.7rem] font-semibold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                        Contact
                    </span>
                    <h2 className="font-['Syne',sans-serif] font-extrabold text-[clamp(2rem,3.8vw,2.8rem)] text-[var(--text-primary)] leading-[1.2] mb-4">
                        Ready to transform<br />
                        <span className="bg-gradient-to-br from-[var(--accent-bright)] via-[var(--accent)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                            your shop?
                        </span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-[0.95rem] leading-[1.8] mb-10">
                        Get in touch with our team to schedule a personalized demo or discuss how MediX fits your workflow.
                    </p>

                    {[
                        {
                            icon: <Icons.Mail />,
                            label: "Email",
                            value: (
                                <a
                                    href="mailto:techcodex.hub@gmail.com"
                                    className="text-inherit no-underline hover:underline"
                                >
                                    techcodex.hub@gmail.com
                                </a>
                            )
                        }
                        ,
                        {
                            icon: <Icons.Phone />,
                            label: "Phone",
                            value: (
                                <a
                                    href="tel:+918101402916"
                                    className="text-inherit no-underline hover:underline"
                                >
                                    +91 8101402916
                                </a>
                            )
                        }
                        ,
                        { icon: <Icons.Location />, label: "Office", value: "Nawabpur, Hooghly, West Bengal, India" },
                    ].map((c, i) => (
                        <div key={i} className="flex items-center gap-4 mb-6">
                            <div className="w-11 h-11 rounded-[14px] bg-[rgba(74,144,217,0.08)] border border-[rgba(74,144,217,0.15)] flex items-center justify-center text-[var(--accent-bright)]">
                                {c.icon}
                            </div>
                            <div>
                                <div className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-0.5">{c.label}</div>
                                <div className="text-[var(--text-secondary)] text-[0.9rem] font-medium">{c.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reveal-right">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-[40px_36px] backdrop-blur-md">
                        {!sent ? (
                            <>
                                <h3 className="font-['Syne',sans-serif] font-bold text-[1.3rem] mb-2">Start your free trial</h3>
                                <p className="text-[var(--text-muted)] text-[0.82rem] mb-[30px]">No credit card required. Set up in minutes.</p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {[
                                        { label: "Full Name", name: "name", placeholder: "Jane Smith" },
                                        { label: "Phone", name: "phone", placeholder: "+1 (555) 000-0000" }
                                    ].map((f) => (
                                        <div key={f.name}>
                                            <label className="text-[0.72rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-1.5 block">{f.label}</label>
                                            <input
                                                name={f.name}
                                                value={form[f.name as keyof typeof form]}
                                                onChange={handleChange}
                                                onFocus={() => setFocused(f.name)}
                                                onBlur={() => setFocused(null)}
                                                placeholder={f.placeholder}
                                                className={clsx(
                                                    "w-full bg-[var(--navy-mid)] border rounded-[14px] p-[14px_18px] text-[var(--text-primary)] text-[0.9rem] font-sans outline-none transition-all duration-300",
                                                    focused === f.name ? "border-[rgba(37,99,235,0.5)] ring-[3px] ring-[rgba(37,99,235,0.12)]" : "border-[rgba(37,99,235,0.15)]"
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <label className="text-[0.72rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-1.5 block">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("email")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="jane@pharmacare.com"
                                        className={clsx(
                                            "w-full bg-[var(--navy-mid)] border rounded-[14px] p-[14px_18px] text-[var(--text-primary)] text-[0.9rem] font-sans outline-none transition-all duration-300",
                                            focused === "email" ? "border-[rgba(37,99,235,0.5)] ring-[3px] ring-[rgba(37,99,235,0.12)]" : "border-[rgba(37,99,235,0.15)]"
                                        )}
                                    />
                                </div>

                                <div className="mb-7">
                                    <label className="text-[0.72rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-1.5 block">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocused("message")}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Tell us about your pharmacy..."
                                        rows={4}
                                        className={clsx(
                                            "w-full bg-[var(--navy-mid)] border rounded-[14px] p-[14px_18px] text-[var(--text-primary)] text-[0.9rem] font-sans outline-none transition-all duration-300 resize-none",
                                            focused === "message" ? "border-[rgba(37,99,235,0.5)] ring-[3px] ring-[rgba(37,99,235,0.12)]" : "border-[rgba(37,99,235,0.15)]"
                                        )}
                                    />
                                </div>


                                <button
                                    onClick={async () => {
                                        if (!form.name || !form.email) return;

                                        // Backend API call
                                        try {
                                            const res = await fetch('https://medix-bend.vercel.app/api/v1/contact', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(form),
                                            });

                                            if (res.ok) {
                                                setSent(true);
                                            } else {
                                                alert("Failed to send message. Please try again.");
                                            }
                                        } catch (error) {
                                            console.error("Error sending message:", error);
                                            alert("An error occurred. Please try again later.");
                                        }
                                    }}
                                    className="w-full
bg-gradient-to-br from-[var(--accent)] to-[#2c6aad]
text-white no-underline
px-9 py-3.5
rounded-full
text-[0.92rem] font-semibold tracking-[0.3px]
shadow-[0_6px_30px_rgba(74,144,217,0.35)]
flex items-center justify-center gap-2
transition-all duration-250
hover:-translate-y-0.5
hover:shadow-[0_10px_40px_rgba(74,144,217,0.5)]
text-center"
                                >
                                    Submit & Get Started →
                                </button>


                                <p className="text-center text-[var(--text-muted)] text-[0.72rem] mt-[18px]">
                                    By submitting, you agree to our <a href="#" className="text-[var(--accent)] no-underline">Privacy Policy</a> & <a href="#" className="text-[var(--accent)] no-underline">Terms of Service</a>
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-[72px] h-[72px] rounded-full bg-[rgba(76,175,80,0.12)] border-2 border-[rgba(76,175,80,0.3)] flex items-center justify-center mx-auto mb-6 text-[#4caf50]">
                                    <Icons.Check />
                                </div>
                                <h3 className="font-['Syne',sans-serif] font-bold text-[1.4rem] mb-2.5">We got your message!</h3>
                                <p className="text-[var(--text-secondary)] text-[0.9rem] leading-[1.7]">
                                    Our team will reach out within 24 hours to schedule your personalized demo. Thanks, {form.name}!
                                </p>
                                <button
                                    onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                                    className="mt-6 bg-transparent border border-[rgba(74,144,217,0.3)] text-[var(--accent-bright)] px-6 py-2.5 rounded-full text-[0.85rem] cursor-pointer font-medium hover:bg-[rgba(74,144,217,0.05)] transition-colors"
                                >
                                    Send another →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="relative z-10 border-t border-[rgba(74,144,217,0.1)] pt-[72px] pb-9 px-6">
        <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-[60px]">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2.5 mb-[18px]">
                        <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md">
                            <div className="absolute inset-0 bg-white/10 rounded-lg" />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-white z-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full border-2 border-[var(--navy)] shadow-sm z-20"></div>
                        </div>
                        <span className="font-['Syne',sans-serif] font-extrabold text-[1.1rem] tracking-tight">
                            Medi<span className="text-[var(--accent-bright)]">X</span>
                        </span>
                    </div>
                    <p className="text-[var(--text-muted)] text-[0.84rem] leading-[1.75] max-w-[280px]">
                        The next-generation pharmacy management platform. Streamlining operations for pharmacies of every size since 2026.
                    </p>
                    <div className="flex gap-3 mt-[22px]">
                        {["in", "tw", "gh"].map((s) => (
                            <a
                                key={s}
                                href="#"
                                className="w-[38px] h-[38px] rounded-[10px] bg-[rgba(74,144,217,0.08)] border border-[rgba(74,144,217,0.15)] flex items-center justify-center text-[var(--text-muted)] no-underline text-[0.72rem] font-bold uppercase tracking-[0.5px] transition-all duration-300 hover:border-[rgba(74,144,217,0.4)] hover:text-[var(--accent-bright)]"
                            >
                                {s}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link Columns */}
                {[
                    { title: "Product", links: ["Features", "Pricing", "Integrations", "Security", "Changelog"] },
                    { title: "Company", links: ["About", "Careers", "Blog", "Press", "Partners"] },
                    { title: "Support", links: ["Documentation", "Help Center", "Status", "Contact Us", "Community"] },
                ].map((col) => (
                    <div key={col.title}>
                        <h4 className="font-['Syne',sans-serif] font-bold text-[0.85rem] mb-5 text-[var(--text-primary)] uppercase tracking-[1px]">
                            {col.title}
                        </h4>
                        {col.links.map((l) => (
                            <a
                                key={l}
                                href="#"
                                className="block text-[var(--text-muted)] no-underline text-[0.84rem] py-1.5 transition-colors duration-300 hover:text-[var(--accent-bright)]"
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                ))}
            </div>

            {/* Bottom */}
            <div className="border-t border-[rgba(74,144,217,0.08)] pt-7 flex justify-between items-center flex-wrap gap-3">
                <p className="text-[var(--text-muted)] text-[0.78rem]">© 2026 MediX Technologies. All rights reserved.</p>
                <div className="flex gap-6">
                    {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                        <a
                            key={l}
                            href="#"
                            className="text-[var(--text-muted)] no-underline text-[0.78rem] transition-colors duration-300 hover:text-[var(--accent-bright)]"
                        >
                            {l}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default function PharmaSyncLanding() {
    useReveal();

    return (
        <div className="min-h-screen bg-[var(--navy)] text-[var(--text-primary)] font-['Inter',sans-serif] overflow-x-hidden antialiased selection:bg-[var(--accent-glow)] selection:text-[var(--text-primary)]">
            {/* Backgrounds */}
            <div className="bg-mesh" />
            <div className="bg-grid" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <ParticleCanvas />

            {/* Content */}
            <Navbar />
            <Hero />
            {/* <StatsBar /> */}
            <Features />
            <About />
            <Contact />
            <Footer />
        </div>
    );
}