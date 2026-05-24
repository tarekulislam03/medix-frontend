"use client";
import { useState, useEffect, useRef } from "react";
import logoDark from "../../assets/logo-light.png";
import productVideo from "../../assets/PRODUCT-VIDEO.mp4";
import { Link } from 'react-router-dom';
import BookDemoForm from "../../components/BookDemoForm";
import CompactDemoForm from "../../components/CompactDemoForm";

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

function useCountUp(end: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const animate = (now: number) => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * end));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration]);

    return { count, ref };
}

// ─────────────────────────────────────────────
// PARTICLE CANVAS
// ─────────────────────────────────────────────

const ParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
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

        for (let i = 0; i < 35; i++) {
            const typeRandom = Math.random();
            let type: 'cross' | 'hexagon' | 'circle' = 'circle';
            if (typeRandom > 0.75) type = 'cross';
            else if (typeRandom > 0.5) type = 'hexagon';

            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                r: Math.random() * 8 + 4,
                a: Math.random() * 0.15 + 0.05,
                type: type,
                rotation: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.015,
            });
        }

        const drawCapsule = (ctx: CanvasRenderingContext2D, r: number) => {
            const w = r * 2.5;
            const h = r * 1.2;
            ctx.beginPath();
            ctx.moveTo(-w / 2 + h / 2, -h / 2);
            ctx.lineTo(w / 2 - h / 2, -h / 2);
            ctx.arc(w / 2 - h / 2, 0, h / 2, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(-w / 2 + h / 2, h / 2);
            ctx.arc(-w / 2 + h / 2, 0, h / 2, Math.PI / 2, -Math.PI / 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -h / 2);
            ctx.lineTo(0, h / 2);
            ctx.stroke();
        };

        const drawSyringe = (ctx: CanvasRenderingContext2D, r: number) => {
            const len = r * 3;
            const w = r * 0.8;
            ctx.beginPath();
            ctx.rect(-w / 2, -len / 2, w, len * 0.7);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, len / 2 * 0.4);
            ctx.lineTo(0, len / 2 + r);
            ctx.stroke();
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
                p.x += p.vx; p.y += p.vy;
                p.rotation += p.vr;
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;
                if (p.y < -20) p.y = canvas.height + 20;
                if (p.y > canvas.height + 20) p.y = -20;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.strokeStyle = `rgba(26, 140, 140, ${p.a * 0.6})`;
                ctx.fillStyle = `rgba(32, 163, 163, ${p.a * 0.2})`;
                ctx.lineWidth = 1;

                if (p.type === 'hexagon') {
                    drawCapsule(ctx, p.r);
                } else if (p.type === 'cross') {
                    drawSyringe(ctx, p.r);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(26, 140, 140, ${p.a * 0.3})`;
                    ctx.fill();
                    ctx.strokeStyle = `rgba(32, 163, 163, ${p.a * 0.5})`;
                    ctx.stroke();
                }
                ctx.restore();
            });
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────

const Icons = {
    Pharmacy: () => (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="14" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path d="M14 14V10a10 10 0 0 1 20 0v4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M20 26h8M24 22v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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
    ChevronDown: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Zap: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    ),
};


// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────

const Navbar = () => {
    const scrolled = useStickyNav();
    const [mobile, setMobile] = useState(false);
    const links = ["Home", "Features", "About", "Pricing", "Contact"];

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled
                ? "py-3 bg-[rgba(8,8,13,0.88)] backdrop-blur-[16px] border-b border-[rgba(255,255,255,0.06)]"
                : "py-4 bg-transparent border-b border-transparent"
        )}>
            <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
                <a href="#home" className="no-underline flex items-center gap-3">
                    <img src={logoDark} alt="MediX Logo" className="w-11 h-11 object-contain" />
                    <span className="font-heading font-bold text-[1.4rem] text-white tracking-tight">
                        Medi<span className="text-[var(--accent-bright)]">X</span>
                    </span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map((l, i) => (
                        <a
                            key={l}
                            href={`#${l.toLowerCase()}`}
                            className={clsx(
                                "no-underline text-[0.88rem] font-medium tracking-[0.3px] px-5 py-2.5 rounded-full transition-all duration-300",
                                i === 0
                                    ? "text-[var(--accent-bright)] bg-[rgba(26,140,140,0.1)]"
                                    : "text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]"
                            )}
                        >
                            {l}
                        </a>
                    ))}
                    <Link
                        to="/partner"
                        className="text-[var(--accent-bright)] no-underline text-[0.88rem] font-bold tracking-[0.3px] px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-[rgba(26,140,140,0.1)]"
                    >
                        Earn With Us
                    </Link>
                </div>

                <div className="hidden md:block">
                    <a
                        href="#contact"
                        className="bg-[var(--accent)] text-white no-underline px-[24px] py-[10px] rounded-full text-[0.88rem] font-bold tracking-[0.5px] shadow-[0_4px_20px_rgba(26,140,140,0.3)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(26,140,140,0.5)]"
                    >
                        Get Started
                    </a>
                </div>

                <button
                    onClick={() => setMobile(!mobile)}
                    className="md:hidden bg-none border-none text-white cursor-pointer p-2"
                >
                    {mobile ? <Icons.X /> : <Icons.Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={clsx(
                "absolute top-full left-0 right-0 bg-[rgba(8,8,13,0.97)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.06)] px-6 py-5 transition-all duration-300 origin-top",
                mobile ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible"
            )}>
                {links.map((l) => (
                    <a
                        key={l}
                        href={`#${l.toLowerCase().replace(" ", "")}`}
                        onClick={() => setMobile(false)}
                        className="block no-underline py-3 border-b border-[rgba(255,255,255,0.06)] text-[0.95rem] font-medium text-[rgba(255,255,255,0.6)]"
                    >
                        {l}
                    </a>
                ))}
                <Link
                    to="/partner"
                    className="block no-underline py-3 text-[0.95rem] font-bold text-[var(--accent-bright)]"
                >
                    Earn With Us
                </Link>
            </div>
        </nav>
    );
};


// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────

const Hero = () => {
    const [visible, setVisible] = useState(false);
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

    

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative pt-[100px] md:pt-[120px] pb-12 px-4 md:px-8">
            {/* Subtle background glow for text contrast */}
            <div className="absolute top-[20%] left-[-10%] w-[800px] h-[800px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1100px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                
                {/* Left Side Content */}
                <div className="lg:col-span-7 text-left flex flex-col items-start w-full max-w-[720px] mx-auto lg:mx-0">
                    {/* Floating Notification Card */}
                    <div className={clsx(
                        "inline-flex flex-row items-center gap-2.5 sm:gap-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] pr-4 sm:pr-5 pl-1.5 sm:pl-2 py-1.5 rounded-full mb-6 sm:mb-8 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-700 delay-100",
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
                    )}>
                        {/* Avatar Group */}
                        <div className="flex -space-x-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#101018] bg-[#1a2b3c] flex items-center justify-center text-[0.55rem] sm:text-[0.6rem] font-bold text-[#4ade80]">
                                SK
                            </div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#101018] bg-[#2d1b36] flex items-center justify-center text-[0.55rem] sm:text-[0.6rem] font-bold text-[#c084fc]">
                                RM
                            </div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#101018] bg-[var(--accent)] flex items-center justify-center text-[0.55rem] sm:text-[0.6rem] font-bold text-white">
                                +4
                            </div>
                        </div>
                        {/* Text */}
                        <div className="flex flex-col items-start leading-tight">
                            <div className="flex items-center gap-1.5">
                                <div className="flex gap-0.5 text-[#ffb400]">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px]">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <span className="text-[rgba(255,255,255,0.7)] text-[0.65rem] sm:text-[0.75rem] font-medium tracking-wide">
                                4+ pharmacies booked a demo
                            </span>
                        </div>
                    </div>

                    <h1 className={clsx(
                        "font-heading font-semibold text-[clamp(1.8rem,8vw,2.5rem)] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.6rem] leading-[1.15] md:leading-[1.05] tracking-tight transition-all duration-1000 delay-300 ease-[cubic-bezier(0.22,1,0.36,1)] text-white drop-shadow-sm",
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
                    )}>
                        The Operating System for<br className="hidden md:block" />
                        <span className="text-[var(--accent-bright)]">Modern Pharmacies</span>.
                    </h1>

                    <p className={clsx(
                        "text-[rgba(255,255,255,0.7)] text-[1rem] sm:text-[1.05rem] md:text-[1.15rem] max-w-[600px] mt-5 sm:mt-6 md:mt-8 leading-[1.6] md:leading-[1.7] transition-all duration-900 delay-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                    )}>
                        Streamline inventory, automate billing, and increase sales with a minimalist platform designed exclusively for healthcare retail. No clutter, just results.
                    </p>

                    {/* CTA Buttons */}
                    <div className={clsx(
                        "flex flex-col sm:flex-row items-center justify-start gap-4 mt-6 md:mt-10 w-full sm:w-auto transition-all duration-900 delay-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                    )}>
                        <button
                            onClick={() => setIsDemoModalOpen(true)}
                            className="w-full sm:w-auto bg-[var(--accent)] text-white no-underline px-8 py-3.5 sm:px-10 sm:py-4 rounded-[14px] sm:rounded-full text-[0.95rem] sm:text-[1rem] font-bold tracking-[0.5px] shadow-[0_6px_30px_rgba(26,140,140,0.35)] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(26,140,140,0.5)] cursor-pointer border-none"
                        >
                            Book Free Demo
                        </button>
                        <a
                            href="tel:+918101402916"
                            className="group w-full sm:w-auto text-white no-underline px-8 py-3.5 sm:px-10 sm:py-4 rounded-[14px] sm:rounded-full text-[0.95rem] sm:text-[1rem] font-medium border border-[rgba(255,255,255,0.15)] hover:border-[var(--accent)] hover:text-[var(--accent-bright)] bg-[rgba(255,255,255,0.02)] sm:bg-transparent flex items-center justify-center gap-2.5 transition-all duration-300"
                        >
                            <span className="w-4 h-4 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity"><Icons.Phone /></span> Call Now
                        </a>
                    </div>

                    
                    {/* <div className={clsx(
                        "flex flex-wrap items-center justify-start gap-3 mt-10 transition-all duration-1000 delay-900 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                    )}>
                        {[
                            { icon: <Icons.Check />, text: "GST Ready" },
                            { icon: <Icons.Sync />, text: "Cloud Sync" },
                            { icon: <Icons.Shield />, text: "Bank-grade Security" }
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] text-[0.8rem] font-medium tracking-wide bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm hover:bg-[rgba(255,255,255,0.06)] transition-all">
                                <span className="text-[var(--accent-bright)] w-[14px] h-[14px] flex items-center justify-center">{badge.icon}</span> {badge.text}
                            </div>
                        ))}
                    </div> */}
                </div>

                {/* Right Side Video */}
                <div className={clsx(
                    "lg:col-span-5 relative w-full transition-all duration-1000 delay-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[50px]"
                )}>
                    {/* Glassmorphic border container */}
                    <div className="relative p-2 sm:p-4 rounded-[20px] sm:rounded-[32px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)] to-transparent opacity-[0.08] blur-[60px] rounded-[32px] pointer-events-none"></div>
                        <video
                            src={productVideo}
                            autoPlay loop muted playsInline controls
                            className="relative z-10 w-full aspect-auto rounded-[12px] sm:rounded-[20px] border border-[rgba(255,255,255,0.08)] object-cover bg-[rgba(255,255,255,0.02)]"
                        />
                    </div>
                </div>

            </div>

            {/* Demo Modal */}
            {isDemoModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300" onClick={() => setIsDemoModalOpen(false)}>
                    <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto relative p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setIsDemoModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/5">
                            <Icons.X />
                        </button>
                        <h3 className="font-heading font-bold text-[1.4rem] mb-2 text-white">Book A Free Demo</h3>
                        <p className="text-[rgba(255,255,255,0.4)] text-[0.85rem] mb-6">Fill out the quick form below and we'll get back to you shortly.</p>
                        <CompactDemoForm onSuccess={() => setTimeout(() => setIsDemoModalOpen(false), 2000)} />
                    </div>
                </div>
            )}
        </section>
    );
};


// ─────────────────────────────────────────────
// FEATURES — 2×3 Bento Grid
// ─────────────────────────────────────────────

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

const Features = () => (
    <section id="features" className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-[1100px] mx-auto">
            <div className="reveal text-center mb-16">
                <h2 className="font-heading font-bold text-[1.8rem] md:text-[2.2rem] lg:text-[2.6rem] text-white leading-[1.15]">
                    Built for the Modern Pharmacy.<br className="hidden md:block" />
                    <span className="block md:inline">Powered by <span className="text-[var(--accent-bright)] italic">Technology</span>.</span>
                </h2>
                <p className="text-[rgba(255,255,255,0.45)] max-w-[560px] mx-auto mt-5 text-[0.95rem] leading-[1.7]">
                    Every feature is purpose-built to solve real pharmacy challenges — from regulatory compliance to patient experience.
                </p>
            </div>

            {/* 2-col Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureData.map((f, i) => (
                    <div key={i} className="reveal group" style={{ transitionDelay: `${i * 80}ms` }}>
                        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[18px] p-6 md:p-7 h-full flex gap-5 items-start transition-all duration-400 group-hover:bg-[rgba(255,255,255,0.05)] group-hover:border-[rgba(26,140,140,0.25)] group-hover:-translate-y-0.5">
                            <div className="w-12 h-12 min-w-[3rem] rounded-xl bg-[rgba(26,140,140,0.1)] border border-[rgba(26,140,140,0.15)] flex items-center justify-center text-[var(--accent-bright)] transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] group-hover:scale-110">
                                {f.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-heading font-semibold text-[1.1rem] text-white mb-1.5 leading-snug">
                                    {f.title}
                                </h3>
                                <p className="text-[rgba(255,255,255,0.4)] text-[0.85rem] leading-[1.7] m-0">
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


// ─────────────────────────────────────────────
// ABOUT + STATS ROW
// ─────────────────────────────────────────────

const StatCounter = ({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) => {
    const { count, ref } = useCountUp(value);
    return (
        <div ref={ref} className="text-center px-2">
            <div className="font-heading font-bold text-[clamp(2.2rem,5vw,3.8rem)] text-white leading-none tracking-tight">
                {count}{suffix}
            </div>
            <div className="text-[rgba(255,255,255,0.35)] text-[0.78rem] font-medium mt-2 tracking-wide uppercase">
                {label}
            </div>
        </div>
    );
};

const About = () => (
    <section id="about" className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-[1100px] mx-auto">
            <div className="reveal text-center mb-14">
                <span className="inline-block bg-[rgba(26,140,140,0.08)] border border-[rgba(26,140,140,0.15)] text-[var(--accent-bright)] text-[0.7rem] font-semibold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                    About Us
                </span>
                <h2 className="font-heading font-bold text-[clamp(2rem,4.5vw,3rem)] text-white leading-[1.15]">
                    MediX — <span className="text-[var(--accent-bright)] italic">The Story</span>
                </h2>
            </div>

            {/* Content Columns */}
            <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start mb-0">
                <div className="text-[rgba(255,255,255,0.5)] text-[0.95rem] leading-[1.8]">
                    <p className="mb-6">
                        The idea came to me in December 2025. A close friend of mine was working at a pharmacy store, and one day he reached out knowing I was a software developer. The store was struggling — managing stock levels and tracking medicine expiry dates had become a serious challenge.
                    </p>
                    <p>
                        Everything was recorded on paper, and keeping up with it all had turned into a nightmare. That's when it clicked for me. I decided to build something that could genuinely help them run their store more efficiently and effectively. That's how MediX was born.
                    </p>
                </div>

                <div className="text-[rgba(255,255,255,0.5)] text-[0.95rem] leading-[1.8]">
                    <blockquote className="border-l-4 border-[var(--accent)] pl-6 mb-8 text-[1.05rem] italic font-medium text-[rgba(255,255,255,0.8)]">
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


// ─────────────────────────────────────────────
// PRICING — 3 Cards
// ─────────────────────────────────────────────

const Pricing = () => (
    <section id="pricing" className="relative z-10 py-24 md:py-32 px-6">
        <div className="max-w-[1100px] mx-auto">
            <div className="reveal text-center mb-16">
                <h2 className="font-heading font-bold text-[clamp(2rem,4.5vw,3rem)] text-white leading-[1.15]">
                    Choose the Plan<br />That's Right for You
                </h2>
                <p className="mt-6 text-[rgba(255,255,255,0.45)] text-[0.95rem] max-w-[560px] mx-auto leading-[1.7]">
                    Choose the plan that fits your pharmacy needs. No subscriptions, no hidden charges.
                </p>
            </div>

            {/* 3-col Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1050px] mx-auto items-stretch">

                {/* Free Demo */}
                <div className="reveal-left bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[22px] p-7 flex flex-col transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-1">
                    <div className="mb-6">
                        <h3 className="font-heading font-semibold text-lg text-white">Free Demo</h3>
                        <p className="text-[rgba(255,255,255,0.35)] text-[0.8rem] mt-1">Try before you buy</p>
                    </div>

                    <div className="mb-6">
                        <div className="font-heading font-bold text-[2.8rem] text-white leading-none flex items-baseline gap-1">
                            <span className="text-[1.3rem] text-[rgba(255,255,255,0.35)]">₹</span>0
                        </div>
                        <p className="text-[rgba(255,255,255,0.3)] text-[0.72rem] font-medium tracking-[1.5px] uppercase mt-2">Free forever</p>
                    </div>

                    <div className="w-full h-px bg-[rgba(255,255,255,0.06)] mb-6"></div>

                    <ul className="flex flex-col gap-3.5 flex-grow mb-8">
                        {["Live product demo", "Guided store walkthrough", "Feature consultation", "No commitment needed"].map((f, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-4.5 h-4.5 rounded-full bg-[rgba(26,140,140,0.1)] flex items-center justify-center text-[var(--accent-bright)] shrink-0 mt-[3px]">
                                    <Icons.Check />
                                </div>
                                <span className="text-[rgba(255,255,255,0.55)] text-[0.88rem]">{f}</span>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="#contact"
                        className="w-full text-center text-[rgba(255,255,255,0.7)] no-underline py-3 rounded-[12px] text-[0.88rem] font-semibold border border-[rgba(255,255,255,0.1)] hover:border-[var(--accent)] hover:text-[var(--accent-bright)] hover:bg-[rgba(26,140,140,0.05)] transition-all duration-300"
                    >
                        Book a Demo
                    </a>
                </div>

                {/* Medix Software — Highlighted */}
                <div className="reveal bg-[rgba(26,140,140,0.06)] border-[2px] border-[var(--accent)] rounded-[22px] p-7 flex flex-col relative shadow-[0_0_60px_rgba(26,140,140,0.1)] md:scale-[1.04] z-20 transition-all duration-300 hover:shadow-[0_0_80px_rgba(26,140,140,0.18)] hover:-translate-y-2">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-white font-bold px-5 py-1.5 rounded-full uppercase tracking-[1.5px] text-[0.6rem] shadow-[0_4px_15px_rgba(26,140,140,0.4)] z-30">
                        Popular
                    </div>

                    <div className="mb-6 mt-2">
                        <h3 className="font-heading font-semibold text-lg text-white">Medix Software</h3>
                        <p className="text-[rgba(255,255,255,0.35)] text-[0.8rem] mt-1">Complete POS solution</p>
                    </div>

                    <div className="mb-6">
                        <div className="font-heading font-bold text-[2.8rem] text-white leading-none flex items-baseline gap-1">
                            <span className="text-[1.3rem] text-[rgba(255,255,255,0.35)]">₹</span>13,500
                        </div>
                        <p className="text-[rgba(255,255,255,0.3)] text-[0.72rem] font-medium tracking-[1.5px] uppercase mt-2">One-Time Payment</p>
                    </div>

                    <div className="w-full h-px bg-[rgba(26,140,140,0.2)] mb-6"></div>

                    <ul className="flex flex-col gap-3.5 flex-grow mb-8">
                        {["Barcode billing & invoicing", "Receipt printer support", "Inventory management", "Expiry & stock alerts", "Sales analytics dashboard", "Customer history & loyalty", "1 year free support"].map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-4.5 h-4.5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0 mt-[3px]">
                                    <Icons.Check />
                                </div>
                                <span className="text-[rgba(255,255,255,0.7)] font-medium text-[0.88rem]">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="#contact"
                        className="w-full text-center bg-[var(--accent)] text-white no-underline py-3.5 rounded-[12px] text-[0.9rem] font-bold shadow-[0_4px_20px_rgba(26,140,140,0.3)] hover:shadow-[0_8px_30px_rgba(26,140,140,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Get Started
                    </a>
                </div>

                {/* Medix Full Setup */}
                <div className="reveal-right bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[22px] p-7 flex flex-col relative transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-1">
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-[rgba(255,255,255,0.1)] text-white font-bold px-4 py-1.5 rounded-full uppercase tracking-[1.5px] text-[0.6rem] border border-[rgba(255,255,255,0.15)] z-30">
                        Best Value
                    </div>

                    <div className="mb-6 mt-2">
                        <h3 className="font-heading font-semibold text-lg text-white">Medix Full Setup</h3>
                        <p className="text-[rgba(255,255,255,0.35)] text-[0.8rem] mt-1">Hardware + Software bundle</p>
                    </div>

                    <div className="mb-6">
                        <div className="font-heading font-bold text-[2.8rem] text-white leading-none flex items-baseline gap-1">
                            <span className="text-[1.3rem] text-[rgba(255,255,255,0.35)]">₹</span>28,000
                        </div>
                        <p className="text-[rgba(255,255,255,0.3)] text-[0.72rem] font-medium tracking-[1.5px] uppercase mt-2">One-Time Payment</p>
                    </div>

                    <div className="w-full h-px bg-[rgba(255,255,255,0.06)] mb-6"></div>

                    <div className="mb-4">
                        <span className="text-[var(--accent-bright)] font-semibold text-[0.82rem]">Everything in Medix Software</span>
                        <div className="flex items-center gap-3 my-2">
                            <div className="h-px w-8 bg-[rgba(255,255,255,0.08)]"></div>
                            <span className="text-[0.6rem] uppercase tracking-[2px] text-[rgba(255,255,255,0.3)] font-bold">Plus</span>
                            <div className="h-px w-8 bg-[rgba(255,255,255,0.08)]"></div>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-3.5 flex-grow mb-8">
                        {[
                            { text: "10-inch tablet", sub: "(pre-installed)" },
                            { text: "Barcode receipt printer" },
                            { text: "Barcode label printer" },
                            { text: "Barcode scanner" },
                            { text: "Ready to bill from day one" }
                        ].map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-4.5 h-4.5 rounded-full bg-[rgba(26,140,140,0.1)] flex items-center justify-center text-[var(--accent-bright)] shrink-0 mt-[3px]">
                                    <Icons.Check />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[rgba(255,255,255,0.55)] text-[0.88rem]">{feature.text}</span>
                                    {feature.sub && <span className="text-[rgba(255,255,255,0.25)] text-[0.78rem] italic">{feature.sub}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="#contact"
                        className="w-full text-center text-[rgba(255,255,255,0.7)] no-underline py-3 rounded-[12px] text-[0.88rem] font-semibold border border-[rgba(255,255,255,0.1)] hover:border-[var(--accent)] hover:text-[var(--accent-bright)] hover:bg-[rgba(26,140,140,0.05)] transition-all duration-300"
                    >
                        Contact Sales
                    </a>
                </div>
            </div>

            {/* Bottom Banner */}
            <div className="reveal mt-16 max-w-[1050px] mx-auto bg-[#101018] rounded-[24px] p-8 md:p-10 relative overflow-hidden border border-[rgba(255,255,255,0.06)]">
                <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(26,140,140,0.1)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute bottom-[-100px] left-[-100px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(26,140,140,0.08)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-20 h-20 rounded-[20px] bg-[rgba(26,140,140,0.1)] flex items-center justify-center shrink-0 border border-[rgba(26,140,140,0.2)] text-[var(--accent-bright)]">
                        <Icons.Shield />
                    </div>
                    <div>
                        <h3 className="text-white font-heading font-bold text-[clamp(1.3rem,3vw,2.2rem)] mb-2 leading-[1.3]">
                            One-time payment.<br />
                            No subscription.<br />
                            <span className="inline-block bg-[var(--accent)] text-white px-5 py-1.5 mt-3 rounded-[10px] transform -rotate-1 shadow-[0_4px_20px_rgba(26,140,140,0.3)] tracking-wide text-[clamp(1rem,2vw,1.3rem)]">No hidden charges.</span>
                        </h3>
                    </div>
                </div>

                <div className="w-full h-px bg-[rgba(255,255,255,0.06)] my-8"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
                    {[
                        { icon: <Icons.Shield />, label: "Secure" },
                        { icon: <Icons.Database />, label: "Reliable" },
                        { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>, label: "Dedicated Support" },
                        { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>, label: "Designed for Pharmacies" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-xl flex items-center justify-center text-[var(--accent-bright)] hover:bg-[var(--accent)] hover:text-white hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(26,140,140,0.25)] transition-all duration-300">
                                {item.icon}
                            </div>
                            <span className="text-[rgba(255,255,255,0.7)] text-[0.85rem] font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);


// ─────────────────────────────────────────────
// FAQ — Accordion
// ─────────────────────────────────────────────

const faqData = [
    {
        q: "What is MediX and how does it work?",
        a: "MediX is an all-in-one Pharmacy Store Management Software designed for modern pharmacies. It streamlines regular customers, inventory, billing, and sales — all in one seamless cloud-powered software. You can manage everything from barcode billing to expiry tracking in a single dashboard."
    },
    {
        q: "What hardware is included in the Full Setup plan?",
        a: "The Medix Full Setup plan includes a 10-inch tablet (pre-installed with MediX), a barcode receipt printer, a barcode label printer, and a barcode scanner. Everything comes ready to bill from day one — no technical setup required on your end."
    },
    {
        q: "Is there a monthly subscription fee?",
        a: "No. MediX works on a one-time payment model with no subscriptions and no hidden charges. Once you purchase, the software is yours. Both plans include 1 year of free support."
    },
    {
        q: "Can I import my existing product catalog?",
        a: "Yes! MediX features Auto Product Import — you can import products from major suppliers with a single click. No manual entry, no errors — just seamless inventory management."
    },
    {
        q: "How do I get started with MediX?",
        a: "Simply book a free demo through our contact form or call us directly at +91 8101402916. Our team will walk you through every feature and help you choose the plan that fits your pharmacy needs."
    },
];

const FAQItem = ({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) => (
    <div className="border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between py-6 px-1 text-left bg-transparent border-none cursor-pointer group"
        >
            <span className="font-heading font-semibold text-[1rem] text-[rgba(255,255,255,0.85)] pr-4 group-hover:text-[var(--accent-bright)] transition-colors duration-300">{q}</span>
            <div className={clsx(
                "w-7 h-7 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[rgba(255,255,255,0.5)] shrink-0 transition-all duration-300",
                isOpen && "bg-[var(--accent)] text-white border-[var(--accent)] rotate-180"
            )}>
                <Icons.ChevronDown />
            </div>
        </button>
        <div className={clsx("faq-answer", isOpen && "open")}>
            <div>
                <p className="px-1 pb-6 text-[rgba(255,255,255,0.4)] text-[0.9rem] leading-[1.8] m-0">
                    {a}
                </p>
            </div>
        </div>
    </div>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative z-10 py-24 md:py-32 px-6">
            <div className="max-w-[750px] mx-auto">
                <div className="reveal text-center mb-14">
                    <h2 className="font-heading font-bold text-[clamp(2rem,4.5vw,3rem)] text-white leading-[1.15]">
                        Frequently Asked<br />Questions
                    </h2>
                    <p className="text-[rgba(255,255,255,0.4)] max-w-[480px] mx-auto mt-5 text-[0.92rem] leading-[1.7]">
                        Everything you need to know about MediX and how it can transform your pharmacy operations.
                    </p>
                </div>

                <div className="reveal">
                    {faqData.map((faq, i) => (
                        <FAQItem
                            key={i}
                            q={faq.q}
                            a={faq.a}
                            isOpen={openIndex === i}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};


// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="relative z-10 py-24 md:py-32 px-6">
            <div className="max-w-[1100px] mx-auto bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[28px] p-8 md:p-14 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16 items-start relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] z-20"></div>
                <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(26,140,140,0.04)_0%,transparent_70%)] pointer-events-none" />

                <div className="reveal-left relative z-10">
                    <span className="inline-block bg-[rgba(26,140,140,0.08)] border border-[rgba(26,140,140,0.15)] text-[var(--accent-bright)] text-[0.7rem] font-bold tracking-[1.8px] uppercase px-[18px] py-[6px] rounded-[20px] mb-6">
                        Contact
                    </span>
                    <h2 className="font-heading font-bold text-[clamp(2rem,3.8vw,2.8rem)] text-white leading-[1.2] mb-4">
                        Ready to transform<br />
                        <span className="text-[var(--accent-bright)] italic">your shop?</span>
                    </h2>
                    <p className="text-[rgba(255,255,255,0.45)] text-[0.92rem] leading-[1.8] mb-10 max-w-[400px]">
                        Get in touch with our team to schedule a personalized demo or discuss how MediX fits your workflow.
                    </p>

                    {[
                        { icon: <Icons.Mail />, label: "Email", value: <a href="mailto:medix.pos@gmail.com" className="text-inherit no-underline hover:text-[var(--accent-bright)] transition-colors">medix.pos@gmail.com</a> },
                        { icon: <Icons.Phone />, label: "Phone", value: <a href="tel:+918101402916" className="text-inherit no-underline hover:text-[var(--accent-bright)] transition-colors">+91 8101402916</a> },
                        { icon: <Icons.Location />, label: "Office", value: "Nawabpur, Hooghly, West Bengal, India" },
                    ].map((c, i) => (
                        <div key={i} className="flex items-center gap-5 mb-6 group">
                            <div className="w-11 h-11 rounded-xl bg-[rgba(26,140,140,0.08)] border border-[rgba(26,140,140,0.12)] flex items-center justify-center text-[var(--accent-bright)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                                {c.icon}
                            </div>
                            <div>
                                <div className="text-[0.7rem] text-[rgba(255,255,255,0.3)] uppercase tracking-[1px] mb-0.5">{c.label}</div>
                                <div className="text-[rgba(255,255,255,0.75)] text-[0.9rem] font-medium">{c.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reveal-right relative z-10">
                    <div className="w-full">
                        {!sent ? (
                            <>
                                <h3 className="font-heading font-bold text-[1.3rem] mb-2 text-white">Book A Free Software Demo</h3>
                                <p className="text-[rgba(255,255,255,0.4)] text-[0.88rem] mb-[28px]">Fill out the form below and we'll get back to you shortly.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    {[
                                        { label: "Full Name", name: "name", placeholder: "Jane Smith" },
                                        { label: "Phone", name: "phone", placeholder: "+91 9876543210" }
                                    ].map((f) => (
                                        <div key={f.name}>
                                            <label className="text-[0.7rem] text-[rgba(255,255,255,0.3)] font-bold uppercase tracking-[1px] mb-2 block">{f.label}</label>
                                            <input
                                                name={f.name}
                                                value={form[f.name as keyof typeof form]}
                                                onChange={handleChange}
                                                placeholder={f.placeholder}
                                                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[12px] p-[13px_16px] text-white text-[0.92rem] font-sans outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[rgba(26,140,140,0.15)] focus:bg-[rgba(255,255,255,0.06)] placeholder-[rgba(255,255,255,0.2)]"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <label className="text-[0.7rem] text-[rgba(255,255,255,0.3)] font-bold uppercase tracking-[1px] mb-2 block">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="jane@pharmacare.com"
                                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[12px] p-[13px_16px] text-white text-[0.92rem] font-sans outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[rgba(26,140,140,0.15)] focus:bg-[rgba(255,255,255,0.06)] placeholder-[rgba(255,255,255,0.2)]"
                                    />
                                </div>

                                <div className="mb-7">
                                    <label className="text-[0.7rem] text-[rgba(255,255,255,0.3)] font-bold uppercase tracking-[1px] mb-2 block">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your pharmacy..."
                                        rows={4}
                                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[12px] p-[13px_16px] text-white text-[0.92rem] font-sans outline-none transition-all duration-300 resize-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[rgba(26,140,140,0.15)] focus:bg-[rgba(255,255,255,0.06)] placeholder-[rgba(255,255,255,0.2)]"
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
                                    className="w-full bg-[var(--accent)] text-white px-6 py-[14px] rounded-[12px] text-[0.95rem] font-bold shadow-[0_4px_20px_rgba(26,140,140,0.3)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(26,140,140,0.5)] hover:-translate-y-1 cursor-pointer border-none"
                                >
                                    Submit & Get Started →
                                </button>

                                <p className="text-[rgba(255,255,255,0.25)] text-[0.7rem] leading-[1.6] mt-4">
                                    By submitting, you agree to our <Link to="/privacy" className="text-[var(--accent-bright)] no-underline hover:underline">Privacy Policy</Link> & <Link to="/terms" className="text-[var(--accent-bright)] no-underline hover:underline">Terms of Service</Link>
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-[72px] h-[72px] rounded-full bg-[rgba(76,175,80,0.1)] border-2 border-[rgba(76,175,80,0.25)] flex items-center justify-center mx-auto mb-6 text-[#4caf50]">
                                    <Icons.Check />
                                </div>
                                <h3 className="font-heading font-bold text-[1.4rem] mb-2.5 text-white">We got your message!</h3>
                                <p className="text-[rgba(255,255,255,0.5)] text-[0.9rem] leading-[1.7]">
                                    Our team will reach out within 24 hours to schedule your personalized demo. Thanks, {form.name}!
                                </p>
                                <button
                                    onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                                    className="mt-6 bg-transparent border border-[rgba(26,140,140,0.25)] text-[var(--accent-bright)] px-6 py-2.5 rounded-full text-[0.85rem] cursor-pointer font-medium hover:bg-[rgba(26,140,140,0.08)] transition-colors"
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


// ─────────────────────────────────────────────
// FOOTER — Multi-Column
// ─────────────────────────────────────────────

const Footer = () => (
    <footer className="relative z-10 pt-16 pb-8 px-6 border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                {/* About */}
                <div>
                    <div className="flex items-center gap-2.5 mb-5">
                        <img src={logoDark} alt="MediX Logo" className="w-9 h-9 object-contain" />
                        <span className="font-heading font-bold text-[1.2rem] text-white">
                            Medi<span className="text-[var(--accent-bright)]">X</span>
                        </span>
                    </div>
                    <p className="text-[rgba(255,255,255,0.4)] text-[0.82rem] leading-[1.7] mb-4">
                        An all-in-one Pharmacy Store Management Software designed for modern pharmacies.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-heading font-semibold text-[0.88rem] text-white mb-5 tracking-wide">Quick Links</h4>
                    <ul className="flex flex-col gap-3">
                        {["Home", "Features", "About", "Pricing", "Contact"].map((l) => (
                            <li key={l}>
                                <a href={`#${l.toLowerCase()}`} className="text-[rgba(255,255,255,0.4)] no-underline text-[0.82rem] hover:text-[var(--accent-bright)] transition-colors duration-300">{l}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h4 className="font-heading font-semibold text-[0.88rem] text-white mb-5 tracking-wide">Help</h4>
                    <ul className="flex flex-col gap-3">
                        {[
                            { label: "Privacy Policy", path: "/privacy" },
                            { label: "Terms of Service", path: "/terms" },
                            { label: "Cookie Policy", path: "/cookie" },
                            { label: "Earn With Us", path: "/partner" }
                        ].map((l) => (
                            <li key={l.label}>
                                <Link to={l.path} className="text-[rgba(255,255,255,0.4)] no-underline text-[0.82rem] hover:text-[var(--accent-bright)] transition-colors duration-300">{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h4 className="font-heading font-semibold text-[0.88rem] text-white mb-5 tracking-wide">Connect With Us</h4>
                    <div className="flex flex-col gap-4">
                        <a href="mailto:medix.pos@gmail.com" className="flex items-center gap-3 text-[rgba(255,255,255,0.4)] no-underline text-[0.82rem] hover:text-[var(--accent-bright)] transition-colors duration-300">
                            <Icons.Mail /> medix.pos@gmail.com
                        </a>
                        <a href="tel:+918101402916" className="flex items-center gap-3 text-[rgba(255,255,255,0.4)] no-underline text-[0.82rem] hover:text-[var(--accent-bright)] transition-colors duration-300">
                            <Icons.Phone /> +91 8101402916
                        </a>
                        <div className="flex items-center gap-3 text-[rgba(255,255,255,0.4)] text-[0.82rem]">
                            <Icons.Location /> Nawabpur, Hooghly, WB
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[rgba(255,255,255,0.25)] text-[0.75rem] text-center md:text-left">© 2026 MediX Technologies. All rights reserved.</p>
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
                            className="text-[rgba(255,255,255,0.25)] no-underline text-[0.75rem] transition-colors duration-300 hover:text-[var(--accent-bright)]"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);


// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

export default function PharmaSyncLanding() {
    useReveal();

    return (
        <div className="min-h-screen bg-[var(--navy)] text-white font-['Inter',sans-serif] overflow-x-hidden antialiased selection:bg-[var(--accent-glow)] selection:text-white">
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
            <Features />
            <About />
            <Pricing />
            <FAQ />
            <Contact />
            <Footer />
        </div>
    );
}