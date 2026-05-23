"use client";
import { useState, useEffect, useRef } from "react";
import logoDark from "../../assets/logo-dark.png";
import productVideo from "../../assets/PRODUCT-VIDEO.mp4";
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────
// HOOKS & UTILS
// ─────────────────────────────────────────────

function clsx(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

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

                // Color: Teal for visibility on light bg
                ctx.strokeStyle = `rgba(26, 140, 140, ${p.a + 0.1})`;
                ctx.fillStyle = `rgba(32, 163, 163, ${p.a * 0.3})`;
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
                    ctx.fillStyle = `rgba(130, 204, 204, ${p.a * 0.5})`; // Very light teal fill
                    ctx.fill();
                    ctx.strokeStyle = `rgba(32, 163, 163, ${p.a * 0.8})`;
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
            <rect x="4" y="14" width="40" height="28" rx="4" stroke="#1a8c8c" strokeWidth="2.5" fill="none" />
            <path d="M14 14V10a10 10 0 0 1 20 0v4" stroke="#1a8c8c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M20 26h8M24 22v8" stroke="#20a3a3" strokeWidth="2.5" strokeLinecap="round" />
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
    Database: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    const links = ["Home", "Features", "About", "Pricing", "Contact"];

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled ? "py-3 bg-[var(--navy)]/85 backdrop-blur-[16px] border-b border-[rgba(26,140,140,0.12)]" : "py-5 bg-transparent border-b border-transparent"
        )}>
            <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#home" className="no-underline flex items-center gap-3">
                    <img src={logoDark} alt="MediX Logo" className="w-11 h-11 object-contain" />
                    <span className="font-['Syne',sans-serif] font-extrabold text-[1.4rem] text-[var(--text-primary)] tracking-tight">
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
                    <Link
                        to="/partner"
                        className="text-[var(--accent)] no-underline text-[0.88rem] font-bold tracking-[0.3px] relative py-1 transition-colors duration-300 hover:text-[var(--accent-bright)] group"
                    >
                        Earn With Us
                        <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--accent-bright)] rounded-full transition-all duration-300 group-hover:w-full" />
                    </Link>
                    <a
                        href="#contact"
                        className="bg-[var(--accent)] text-white no-underline px-[24px] py-[10px] rounded-full text-[0.88rem] font-bold tracking-[0.5px] shadow-[0_4px_20px_rgba(26,140,140,0.4)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(26,140,140,0.6)]"
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
                "absolute top-full left-0 right-0 bg-[var(--navy)]/97 backdrop-blur-[20px] border-b border-[rgba(26,140,140,0.15)] px-6 py-5 transition-all duration-300 origin-top",
                mobile ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"
            )}>
                {links.map((l) => (
                    <a
                        key={l}
                        href={`#${l.toLowerCase().replace(" ", "")}`}
                        onClick={() => setMobile(false)}
                        className="block no-underline py-3 border-b border-[rgba(26,140,140,0.08)] text-[0.95rem] font-medium text-[var(--text-secondary)]"
                    >
                        {l}
                    </a>
                ))}
                <Link
                    to="/partner"
                    className="block no-underline py-3 border-b border-[rgba(26,140,140,0.08)] text-[0.95rem] font-bold text-[var(--accent)]"
                >
                    Earn With Us
                </Link>
            </div>
        </nav>
    );
};

const Hero = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    return (
        <section id="home" className="min-h-screen flex flex-col items-center justify-center relative pt-[120px] pb-24 px-4 md:px-6">
            {/* Top badge removed as per request */}

            <div className="max-w-[860px] text-center relative z-10 w-full">
                <h1 className={clsx(
                    "font-['Syne',sans-serif] font-extrabold text-[clamp(2rem,7vw,5rem)] leading-[1.1] tracking-[-0.02em] transition-all duration-1000 delay-300 ease-[cubic-bezier(0.22,1,0.36,1)] text-[var(--text-primary)]",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
                )}>
                    The Future of <br className="hidden md:block" />
                    <span className="text-[var(--accent)] drop-shadow-[0_0_40px_rgba(26,140,140,0.3)]">Pharmacy Management</span>
                </h1>

                <p className={clsx(
                    "text-[var(--text-secondary)] text-[clamp(1rem,1.4vw,1.15rem)] max-w-[640px] mx-auto mt-6 md:mt-8 leading-[1.6] md:leading-[1.7] transition-all duration-900 delay-500 ease-[cubic-bezier(0.22,1,0.36,1)] px-2",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                )}>
                    An all-in-one Pharmacy Store Management Software designed for modern pharmacies. Streamline regular customers, inventory, billing, and sales — all in one seamless cloud-powered software.
                </p>

                {/* CTA Buttons */}
                <div className={clsx(
                    "flex flex-col sm:flex-row items-center justify-center gap-5 mt-10 md:mt-12 w-full sm:w-auto transition-all duration-900 delay-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                )}>
                    <a
                        href="tel:+918101402916"
                        className="w-full sm:w-auto bg-[var(--accent)] text-white no-underline px-10 py-4 rounded-full text-[1rem] font-bold tracking-[0.5px] shadow-[0_6px_30px_rgba(26,140,140,0.4)] flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(26,140,140,0.6)]"
                    >
                        <Icons.Phone /> Call Now
                    </a>
                    <a
                        href="#contact"
                        className="w-full sm:w-auto text-[var(--text-primary)] no-underline px-10 py-4 rounded-full text-[1rem] font-semibold border-2 border-[rgba(26,140,140,0.3)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-transparent flex items-center justify-center transition-all duration-300"
                    >
                        Book a Demo
                    </a>
                </div>

                {/* App Screenshot */}
                <div className={clsx(
                    "mt-20 md:mt-24 relative max-w-[1000px] mx-auto transition-all duration-1000 delay-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
                )}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-20 blur-[100px] rounded-[40px] pointer-events-none"></div>
                    <video 
                        src={productVideo} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        controls
                        className="relative z-10 w-full aspect-auto rounded-[24px] border border-[var(--card-border)] shadow-[0_20px_80px_rgba(0,0,0,0.6)] object-cover bg-[rgba(26,140,140,0.05)]" 
                    />
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

const FeatureCard = ({ icon, title, desc, tag, delay, index }: typeof featureData[0] & { delay: number, index: number }) => {
    const spanClass = [
        "md:col-span-2 lg:col-span-2",
        "md:col-span-1 lg:col-span-1",
        "md:col-span-1 lg:col-span-1",
        "md:col-span-2 lg:col-span-2",
        "md:col-span-1 lg:col-span-2",
        "md:col-span-1 lg:col-span-1",
    ][index] || "";

    const isLarge = index === 0 || index === 3 || index === 4;

    return (
        <div className={clsx("reveal group", spanClass)} style={{ transitionDelay: `${delay}ms` }}>
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[20px] p-[30px_36px] backdrop-blur-md transition-all duration-400 h-full flex flex-col group-hover:-translate-y-1 group-hover:bg-[rgba(26,140,140,0.04)] group-hover:border-[var(--accent-glow-strong)] group-hover:shadow-[0_12px_40px_rgba(26,140,140,0.08)]">
                <span className="inline-block self-start bg-[var(--accent)] text-white text-[0.75rem] font-bold tracking-[1.2px] uppercase px-3.5 py-1.5 rounded-[20px] mb-6 shadow-sm">
                    {tag}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-[rgba(26,140,140,0.15)] border border-[rgba(26,140,140,0.2)] flex items-center justify-center text-[var(--accent)] mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)]">
                    {icon}
                </div>
                <h3 className={clsx("font-['Syne',sans-serif] font-bold mb-3 text-[var(--text-primary)]", isLarge ? "text-[1.5rem]" : "text-[1.2rem]")}>
                    {title}
                </h3>
                <p className="text-[var(--text-secondary)] text-[0.95rem] leading-[1.7] flex-1">
                    {desc}
                </p>
                <div className="mt-6 h-0.5 rounded-full bg-transparent transition-colors duration-400 group-hover:bg-gradient-to-r group-hover:from-[var(--accent)] group-hover:to-transparent" />
            </div>
        </div>
    );
};

const Features = () => (
    <section id="features" className="relative z-10 py-20 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
            <div className="reveal text-center mb-[72px]">
                <span className="inline-block bg-[rgba(26,140,140,0.08)] border border-[rgba(26,140,140,0.2)] text-[var(--accent-bright)] text-[0.7rem] font-semibold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureData.map((f, i) => <FeatureCard key={i} {...f} delay={i * 100} index={i} />)}
            </div>
        </div>
    </section>
);

const About = () => (
    <section id="about" className="relative z-10 py-20 md:py-28 px-6">
        <div className="max-w-[1000px] mx-auto">
            <div className="reveal text-center mb-[60px]">
                <span className="inline-block bg-[rgba(26,140,140,0.08)] border border-[rgba(26,140,140,0.2)] text-[var(--accent-bright)] text-[0.7rem] font-semibold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                    About Us
                </span>
                <h2 className="font-['Syne',sans-serif] font-extrabold text-[clamp(2.2rem,4.5vw,3.2rem)] text-[var(--text-primary)] leading-[1.15]">
                    MediX <span className="bg-gradient-to-br from-[var(--accent-bright)] to-[var(--accent)] bg-clip-text text-transparent">The Story</span>
                </h2>
            </div>
            
            <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                <div className="text-[var(--text-secondary)] text-[1rem] leading-[1.8] font-normal">
                    <p className="mb-6">
                        The idea came to me in December 2025. A close friend of mine was working at a pharmacy store, and one day he reached out knowing I was a software developer. The store was struggling — managing stock levels and tracking medicine expiry dates had become a serious challenge.
                    </p>
                    <p>
                        Everything was recorded on paper, and keeping up with it all had turned into a nightmare. That's when it clicked for me. I decided to build something that could genuinely help them run their store more efficiently and effectively. That's how MediX was born.
                    </p>
                </div>
                
                <div className="text-[var(--text-secondary)] text-[1rem] leading-[1.8] font-normal">
                    <blockquote className="border-l-4 border-[var(--accent)] pl-6 mb-8 text-[1.1rem] italic font-medium text-[var(--text-primary)]">
                        "My vision is to create a solution that not only simplifies pharmacy management but empowers store owners to focus on what they do best."
                    </blockquote>
                    <p>
                        The goal at first was to just make an app for the store, but later it grew in my mind to start it as a startup. I'm now alone as a team of one, but I'm deeply committed to making MediX the best it can be. I believe that with the right tools, even small pharmacies can thrive in today's competitive landscape.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const Pricing = () => (
    <section id="pricing" className="relative z-10 py-20 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
            <div className="reveal text-center mb-[72px]">
                <span className="inline-block bg-[rgba(26,140,140,0.08)] border border-[rgba(26,140,140,0.2)] text-[var(--accent-bright)] text-[0.7rem] font-semibold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                    Pricing
                </span>
                <h2 className="font-['Syne',sans-serif] font-extrabold text-[clamp(2.2rem,4.5vw,3.2rem)] text-[var(--text-primary)] leading-[1.15]">
                    Simple, transparent pricing
                </h2>
                <p className="mt-6 text-[var(--text-secondary)] text-[1.1rem] max-w-[600px] mx-auto leading-[1.7]">
                    Choose the plan that fits your pharmacy needs. No subscriptions, no hidden charges.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 max-w-[900px] mx-auto">
                {/* Plan 1 */}
                <div className="reveal-left bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[24px] backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_40px_rgba(26,140,140,0.12)] hover:-translate-y-1 flex flex-col">
                    <div className="bg-[var(--text-primary)] p-8 text-center relative rounded-t-[22px]">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-[var(--accent)] border-4 border-[var(--navy-mid)]">
                            <Icons.Pharmacy />
                        </div>
                        <h3 className="text-white font-['Syne',sans-serif] font-bold text-2xl">Medix Software</h3>
                    </div>
                    <div className="p-8 flex-grow flex flex-col items-center bg-white/50 rounded-b-[22px]">
                        <p className="text-[0.75rem] font-bold tracking-[2px] text-[var(--text-muted)] uppercase mb-3 text-center">One-Time Payment</p>
                        <div className="font-['Syne',sans-serif] font-bold text-5xl text-[var(--text-primary)] mb-8 flex items-baseline justify-center gap-1">
                            <span className="text-3xl text-[var(--text-muted)]">₹</span>13,500
                        </div>
                        
                        <div className="w-full h-px bg-[rgba(26,140,140,0.2)] mb-8"></div>
                        
                        <ul className="w-full flex-grow flex flex-col gap-5 text-left mb-8">
                            {["Barcode billing & invoicing", "Receipt printer support", "Inventory management", "Expiry & stock alerts", "Sales analytics dashboard", "Customer history & loyalty", "1 year free support"].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[rgba(26,140,140,0.15)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-[2px]">
                                        <Icons.Check />
                                    </div>
                                    <span className="text-[var(--text-primary)] font-medium text-[1.05rem]">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Plan 2 */}
                <div className="reveal-right bg-[var(--card-bg)] border-[2px] border-[var(--accent)] rounded-[24px] backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_50px_rgba(26,140,140,0.25)] hover:-translate-y-2 flex flex-col relative shadow-[0_8px_30px_rgba(26,140,140,0.15)] md:scale-105 z-20">
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--accent)] text-white font-bold px-5 py-2 rounded-full uppercase tracking-wider text-xs shadow-[0_4px_15px_rgba(26,140,140,0.4)] border-[3px] border-[var(--card-bg)] z-30">
                        Best Value
                    </div>
                    
                    <div className="bg-[var(--text-primary)] p-8 text-center relative rounded-t-[22px]">
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-[var(--accent)] border-4 border-[var(--navy-mid)]">
                            <Icons.Database />
                        </div>
                        <h3 className="text-white font-['Syne',sans-serif] font-bold text-2xl">Medix Full Setup</h3>
                    </div>
                    <div className="p-8 flex-grow flex flex-col items-center bg-gradient-to-b from-white/50 to-[rgba(26,140,140,0.05)] rounded-b-[22px]">
                        <p className="text-[0.75rem] font-bold tracking-[2px] text-[var(--text-muted)] uppercase mb-3 text-center">One-Time Payment</p>
                        <div className="font-['Syne',sans-serif] font-bold text-5xl text-[var(--text-primary)] mb-8 flex items-baseline justify-center gap-1">
                            <span className="text-3xl text-[var(--text-muted)]">₹</span>28,000
                        </div>
                        
                        <div className="w-full text-center mb-6">
                            <span className="text-[var(--accent)] font-semibold text-[0.95rem]">Everything in Medix Software</span>
                            <div className="flex items-center justify-center gap-4 my-2">
                                <div className="h-px w-12 bg-[rgba(26,140,140,0.3)]"></div>
                                <span className="text-[0.7rem] uppercase tracking-widest text-[var(--text-muted)] font-bold">Plus</span>
                                <div className="h-px w-12 bg-[rgba(26,140,140,0.3)]"></div>
                            </div>
                        </div>
                        
                        <ul className="w-full flex-grow flex flex-col gap-5 text-left mb-8">
                            {[
                                { text: "10-inch tablet", sub: "(pre-installed)" },
                                { text: "Barcode receipt printer" },
                                { text: "Barcode label printer" },
                                { text: "Barcode scanner" },
                                { text: "Ready to bill from day one" }
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0 mt-[2px] shadow-sm">
                                        <Icons.Check />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[var(--text-primary)] font-semibold text-[1.05rem]">{feature.text}</span>
                                        {feature.sub && <span className="text-[var(--text-muted)] text-[0.85rem] italic">{feature.sub}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Banner */}
            <div className="reveal mt-16 max-w-[900px] mx-auto bg-[var(--text-primary)] rounded-[20px] p-8 md:p-10 shadow-xl relative overflow-hidden border border-[rgba(26,140,140,0.2)]">
                <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(26,140,140,0.15)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute bottom-[-100px] left-[-100px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(26,140,140,0.1)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-20 h-20 rounded-[20px] bg-[rgba(26,140,140,0.15)] flex items-center justify-center shrink-0 border border-[rgba(26,140,140,0.3)] text-[var(--accent-bright)]">
                        <Icons.Shield />
                    </div>
                    <div>
                        <h3 className="text-white font-['Syne',sans-serif] font-bold text-[clamp(1.5rem,3vw,2.5rem)] mb-2 leading-[1.3]">
                            One-time payment.<br />
                            No subscription.<br />
                            <span className="inline-block bg-[var(--accent)] text-white px-5 py-1.5 mt-3 rounded-[10px] transform -rotate-1 shadow-lg tracking-wide">No hidden charges.</span>
                        </h3>
                    </div>
                </div>

                <div className="w-full h-px bg-[rgba(255,255,255,0.1)] my-8"></div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
                    {[
                        { icon: <Icons.Shield />, label: "Secure" },
                        { icon: <Icons.Database />, label: "Reliable" },
                        { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>, label: "Dedicated Support" },
                        { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>, label: "Designed for Pharmacies" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                            <div className="w-14 h-14 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center text-[var(--accent-bright)] hover:bg-[var(--accent)] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(26,140,140,0.3)] transition-all duration-300">
                                {item.icon}
                            </div>
                            <span className="text-[rgba(255,255,255,0.95)] text-[0.95rem] font-semibold tracking-wide">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="relative z-10 py-20 md:py-28 px-6">
            <div className="max-w-[1200px] mx-auto bg-[var(--card-bg)] border border-[rgba(26,140,140,0.15)] rounded-[40px] p-8 md:p-16 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] z-20"></div>
                <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(26,140,140,0.05)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="reveal-left relative z-10">
                    <span className="inline-block bg-[rgba(26,140,140,0.1)] text-[var(--accent-bright)] text-[0.7rem] font-bold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                        Contact
                    </span>
                    <h2 className="font-['Syne',sans-serif] font-extrabold text-[clamp(2rem,3.8vw,2.8rem)] text-[var(--text-primary)] leading-[1.2] mb-4">
                        Ready to transform<br />
                        <span className="bg-gradient-to-br from-[var(--accent-bright)] via-[var(--accent)] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(26,140,140,0.2)]">
                            your shop?
                        </span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-[1rem] leading-[1.8] mb-10 max-w-[400px]">
                        Get in touch with our team to schedule a personalized demo or discuss how MediX fits your workflow.
                    </p>

                    {[
                        { icon: <Icons.Mail />, label: "Email", value: <a href="mailto:medix.pos@gmail.com" className="text-inherit no-underline hover:text-[var(--accent-bright)] transition-colors">medix.pos@gmail.com</a> },
                        { icon: <Icons.Phone />, label: "Phone", value: <a href="tel:+918101402916" className="text-inherit no-underline hover:text-[var(--accent-bright)] transition-colors">+91 8101402916</a> },
                        { icon: <Icons.Location />, label: "Office", value: "Nawabpur, Hooghly, West Bengal, India" },
                    ].map((c, i) => (
                        <div key={i} className="flex items-center gap-5 mb-6 group">
                            <div className="w-12 h-12 rounded-xl bg-[rgba(26,140,140,0.1)] border border-[rgba(26,140,140,0.2)] flex items-center justify-center text-[var(--accent-bright)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                                {c.icon}
                            </div>
                            <div>
                                <div className="text-[0.75rem] text-[var(--text-muted)] uppercase tracking-[1px] mb-0.5">{c.label}</div>
                                <div className="text-[var(--text-primary)] text-[0.95rem] font-medium">{c.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reveal-right relative z-10">
                    <div className="w-full">
                        {!sent ? (
                            <>
                                <h3 className="font-['Syne',sans-serif] font-bold text-[1.4rem] mb-2 text-[var(--text-primary)]">Book A Free Software Demo</h3>
                                <p className="text-[var(--text-secondary)] text-[0.9rem] mb-[32px]">Fill out the form below and we'll get back to you shortly.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    {[
                                        { label: "Full Name", name: "name", placeholder: "Jane Smith" },
                                        { label: "Phone", name: "phone", placeholder: "+91 9876543210" }
                                    ].map((f) => (
                                        <div key={f.name}>
                                            <label className="text-[0.75rem] text-[var(--text-muted)] font-bold uppercase tracking-[1px] mb-2 block">{f.label}</label>
                                            <input
                                                name={f.name}
                                                value={form[f.name as keyof typeof form]}
                                                onChange={handleChange}
                                                placeholder={f.placeholder}
                                                className="w-full bg-[rgba(255,255,255,0.5)] border border-[rgba(26,140,140,0.2)] rounded-[12px] p-[14px_16px] text-[var(--text-primary)] text-[0.95rem] font-sans outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-[4px] focus:ring-[rgba(26,140,140,0.15)] focus:bg-white placeholder-[var(--text-muted)]"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-5">
                                    <label className="text-[0.75rem] text-[var(--text-muted)] font-bold uppercase tracking-[1px] mb-2 block">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="jane@pharmacare.com"
                                        className="w-full bg-[rgba(255,255,255,0.5)] border border-[rgba(26,140,140,0.2)] rounded-[12px] p-[14px_16px] text-[var(--text-primary)] text-[0.95rem] font-sans outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-[4px] focus:ring-[rgba(26,140,140,0.15)] focus:bg-white placeholder-[var(--text-muted)]"
                                    />
                                </div>

                                <div className="mb-8">
                                    <label className="text-[0.75rem] text-[var(--text-muted)] font-bold uppercase tracking-[1px] mb-2 block">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your pharmacy..."
                                        rows={4}
                                        className="w-full bg-[rgba(255,255,255,0.5)] border border-[rgba(26,140,140,0.2)] rounded-[12px] p-[14px_16px] text-[var(--text-primary)] text-[0.95rem] font-sans outline-none transition-all duration-300 resize-none focus:border-[var(--accent)] focus:ring-[4px] focus:ring-[rgba(26,140,140,0.15)] focus:bg-white placeholder-[var(--text-muted)]"
                                    />
                                </div>

                                <button
                                    onClick={async () => {
                                        if (!form.name || !form.email) return;
                                        try {
                                            const res = await fetch('https://medix-bend.vercel.app/api/v1/contact', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(form),
                                            });
                                            if (res.ok) setSent(true);
                                            else alert("Failed to send message. Please try again.");
                                        } catch (error) {
                                            console.error("Error sending message:", error);
                                            alert("An error occurred. Please try again later.");
                                        }
                                    }}
                                    className="w-full bg-[var(--accent)] text-white no-underline px-6 py-[16px] rounded-[12px] text-[1rem] font-bold tracking-[0.5px] shadow-[0_4px_20px_rgba(26,140,140,0.4)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,140,140,0.6)] hover:-translate-y-1"
                                >
                                    Submit & Get Started →
                                </button>


                                <p className="text-[var(--text-muted)] text-[0.72rem] leading-[1.6]">
                                    By submitting, you agree to our <Link to="/privacy" className="text-[var(--accent)] no-underline hover:text-[var(--accent-bright)] transition-colors">Privacy Policy</Link> & <Link to="/terms" className="text-[var(--accent)] no-underline hover:text-[var(--accent-bright)] transition-colors">Terms of Service</Link>
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
                                    className="mt-6 bg-transparent border border-[rgba(26,140,140,0.3)] text-[var(--accent-bright)] px-6 py-2.5 rounded-full text-[0.85rem] cursor-pointer font-medium hover:bg-[rgba(26,140,140,0.05)] transition-colors"
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
    <footer className="relative z-10 py-9 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-5 border-t border-[rgba(26,140,140,0.1)] pt-7">
            <p className="text-[var(--text-muted)] text-[0.78rem] text-center md:text-left">© 2026 MediX Technologies. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {[
                    { label: "Privacy Policy", path: "/privacy" },
                    { label: "Terms of Service", path: "/terms" },
                    { label: "Cookie Policy", path: "/cookie" },
                    { label: "Earn With Us", path: "/partner" }
                ].map((l) => (
                    <Link
                        key={l.label}
                        to={l.path}
                        className="text-[var(--text-muted)] no-underline text-[0.78rem] transition-colors duration-300 hover:text-[var(--accent-bright)]"
                    >
                        {l.label}
                    </Link>
                ))}
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
            <Pricing />
            <Contact />
            <Footer />
        </div>
    );
}