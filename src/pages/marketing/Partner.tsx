import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoDark from '../../assets/logo-light.png';
import powerbankImg from '../../assets/powerbank.jpg';
import coolerImg from '../../assets/cooler.jpg';
import smartwatchImg from '../../assets/smartwatch.webp';
import earbudsImg from '../../assets/earbuds.webp';
import BookDemoForm from '@/components/BookDemoForm';

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────

const TablerIcons = {
    Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>,
    Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>,
    ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>,
    ChevronUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 15l6 -6l6 6" /></svg>,
    Target: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /></svg>,
    TrendingUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 17l6 -6l4 4l8 -8" /><path d="M14 7l7 0l0 7" /></svg>,
    Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /></svg>,
    Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>,
    User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>,
    Rocket: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3"/><path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3"/><path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></svg>,
    Bolt: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" /></svg>,
    Gift: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" /><path d="M12 8l0 13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" /></svg>,
    Question: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4" /><path d="M12 19l0 .01" /></svg>
};

// ─────────────────────────────────────────────
// ACCORDION — Dark Theme
// ─────────────────────────────────────────────

const Accordion = ({ title, content }: { title: string, content: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 px-1 text-left bg-transparent border-none cursor-pointer group"
            >
                <span className="font-heading font-semibold text-[0.95rem] text-[rgba(255,255,255,0.85)] pr-4 flex-1 group-hover:text-[var(--accent-bright)] transition-colors duration-300">{title}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    open
                        ? 'bg-[var(--accent)] text-white border border-[var(--accent)] rotate-180'
                        : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)]'
                }`}>
                    <TablerIcons.ChevronDown />
                </div>
            </button>
            <div className={`faq-answer ${open ? 'open' : ''}`}>
                <div>
                    <p className="px-1 pb-5 text-[rgba(255,255,255,0.4)] text-[0.88rem] leading-[1.8] m-0">{content}</p>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// PARTNER PAGE
// ─────────────────────────────────────────────

const Partner = () => {
    return (
        <div className="min-h-screen bg-[var(--navy)] text-white font-['Inter',sans-serif] antialiased overflow-x-hidden">

            {/* ── Navbar ────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-[100] py-4 px-6 bg-[rgba(8,8,13,0.88)] backdrop-blur-[16px] border-b border-[rgba(255,255,255,0.06)]">
                <div className="max-w-[1100px] mx-auto flex justify-between items-center">
                    <Link to="/" className="no-underline flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
                        <img src={logoDark} alt="MediX Logo" className="w-10 h-10 object-contain" />
                        <span className="font-heading font-bold text-[1.3rem] tracking-tight">
                            Medi<span className="text-[var(--accent-bright)]">X</span>
                        </span>
                    </Link>
                    <Link to="/" className="text-[rgba(255,255,255,0.5)] no-underline text-[0.82rem] font-medium hover:text-[var(--accent-bright)] transition-colors uppercase tracking-[1px]">
                        ← Back to site
                    </Link>
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────── */}
            <section className="pt-[110px] pb-14 px-6 text-center relative">
                {/* Decorative glow */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(26,140,140,0.06)_0%,transparent_70%)] pointer-events-none" />

                <div className="max-w-[800px] mx-auto relative z-10">
                    <span className="inline-flex items-center gap-1.5 bg-[rgba(26,140,140,0.15)] border border-[rgba(26,140,140,0.3)] text-[var(--accent-bright)] text-[0.65rem] font-bold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-6">
                        <TablerIcons.Bolt /> Partner Program
                    </span>

                    <h1 className="font-heading font-bold text-[clamp(2.5rem,5vw,3.8rem)] leading-[1.05] tracking-tight mb-4 text-white">
                        Become Our Partner & <span className="text-[var(--accent-bright)] italic">Earn</span>
                    </h1>

                    <div className="mb-10 flex flex-col items-center justify-center">
                        <p className="text-[rgba(255,255,255,0.6)] text-[1rem] md:text-[1.1rem] mb-2">Get paid for every pharmacy that signs up.</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-bright)] to-teal-200 text-[clamp(2.8rem,7vw,4.5rem)] font-extrabold font-heading m-0 leading-none drop-shadow-[0_0_20px_rgba(26,140,140,0.4)]">₹2,500 <span className="text-[1.2rem] md:text-[1.5rem] text-[rgba(255,255,255,0.5)] font-medium bg-none tracking-normal">/ sale</span></p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-center justify-center mb-10">
                        <a href="#join" className="w-full sm:w-auto bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] text-white no-underline px-10 py-4 font-bold text-[1rem] rounded-full shadow-[0_8px_30px_rgba(26,140,140,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,140,140,0.6)] border border-[rgba(255,255,255,0.1)]">
                            Start earning today
                        </a>
                    </div>

                    
                </div>
            </section>

            {/* ── Registration Form ────────────────────── */}
            <section className="px-6 pb-12 pt-6" id="join">
                <div className="max-w-[600px] mx-auto bg-[rgba(255,255,255,0.02)] backdrop-blur-sm rounded-[24px] border border-[rgba(255,255,255,0.07)] p-8 sm:p-10 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)]"></div>
                    <BookDemoForm />
                </div>
            </section>

            {/* ── Why pharmacies want this ────────────── */}
            <section className="px-6 py-14">
                <div className="max-w-[900px] mx-auto">
                    <h2 className="font-heading font-bold text-[clamp(1.6rem,3.5vw,2.2rem)] mb-8 text-center text-white">
                        Why pharmacies <span className="text-[var(--accent-bright)] italic">want this</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { icon: TablerIcons.Target, title: "Built for them", desc: "Tailored strictly for Indian pharmacy workflows." },
                            { icon: TablerIcons.TrendingUp, title: "Cheaper", desc: "Tired of Marg ERP and expensive yearly fees." },
                            { icon: TablerIcons.Shield, title: "One-time fee", desc: "No recurring subs. Pay once, use forever." },
                            { icon: TablerIcons.Star, title: "Simple UI", desc: "Fast and remarkably easy for any staff member." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.06)] p-6 rounded-[16px] group hover:border-[var(--accent)] hover:shadow-[0_8px_30px_rgba(26,140,140,0.15)] hover:-translate-y-1 transition-all duration-400 cursor-default">
                                <div className="w-10 h-10 rounded-xl bg-[rgba(26,140,140,0.1)] border border-[rgba(26,140,140,0.15)] flex items-center justify-center text-[var(--accent-bright)] mb-4 group-hover:bg-gradient-to-br group-hover:from-[var(--accent)] group-hover:to-[var(--accent-bright)] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                                    <item.icon />
                                </div>
                                <h3 className="font-heading font-semibold text-[1.05rem] mb-1.5 text-white">{item.title}</h3>
                                <p className="text-[rgba(255,255,255,0.65)] text-[0.88rem] m-0 leading-[1.7]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ────────────────────────── */}
            <section id="how-it-works" className="px-6 py-14">
                <div className="max-w-[750px] mx-auto">
                    <h2 className="font-heading font-bold text-[clamp(1.6rem,3.5vw,2.2rem)] mb-10 text-center text-white">
                        Earning <span className="text-[var(--accent-bright)] italic">Process</span>
                    </h2>

                    {/* Your Role */}
                    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-7 mb-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                            <h3 className="font-bold text-[0.72rem] m-0 uppercase tracking-[2px] text-[rgba(255,255,255,0.6)]">Your role</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { step: "1", title: "Identify", desc: "Visit pharmacies in your territory." },
                                { step: "2", title: "Pitch", desc: "Take 5 mins to explain Medix. Convince them to buy." },
                                { step: "3", title: "Share contact", desc: "Tell them our team will call for a demo." },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(255,255,255,0.6)] text-[0.75rem] font-bold shrink-0">{item.step}</div>
                                    <div>
                                        <h4 className="font-heading font-semibold text-[0.95rem] mb-1 text-white">{item.title}</h4>
                                        <p className="text-[rgba(255,255,255,0.6)] m-0 text-[0.88rem]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transition */}
                    <div className="flex items-center gap-4 my-5">
                        <div className="h-px flex-1 bg-[rgba(255,255,255,0.06)]"></div>
                        <span className="font-bold text-[0.65rem] text-[rgba(255,255,255,0.4)] tracking-[2px] uppercase shrink-0">Then we take over</span>
                        <div className="h-px flex-1 bg-[rgba(255,255,255,0.06)]"></div>
                    </div>

                    {/* Our Role */}
                    <div className="bg-gradient-to-br from-[rgba(26,140,140,0.1)] to-[rgba(26,140,140,0.02)] border-[2px] border-[var(--accent)] rounded-[20px] p-7 mb-6 relative shadow-[0_0_40px_rgba(26,140,140,0.1)] backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(26,140,140,0.2)]">
                            <h3 className="font-bold text-[0.72rem] m-0 uppercase tracking-[2px] text-[var(--accent-bright)]">Our role</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { step: "4", title: "Follow-up & demo", desc: "We handle all technical questions." },
                                { step: "5", title: "Close the deal", desc: "We finalize payment and setup." },
                                { step: "6", title: "Payout", desc: "Your commission is credited instantly." },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bright)] flex items-center justify-center text-white text-[0.75rem] font-bold shrink-0 shadow-md">{item.step}</div>
                                    <div>
                                        <h4 className="font-heading font-semibold text-[0.95rem] mb-1 text-white">{item.title}</h4>
                                        <p className="text-[rgba(255,255,255,0.7)] m-0 text-[0.88rem]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payout Badge */}
                    <div className="text-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[16px] py-8 px-6">
                        <span className="inline-block bg-[var(--accent)] text-white text-[0.6rem] font-bold px-3.5 py-1.5 uppercase tracking-[2px] rounded-full mb-4 shadow-[0_4px_15px_rgba(26,140,140,0.3)]">
                            Every single sale
                        </span>
                        <p className="font-heading font-bold text-[1.8rem] m-0 text-white leading-none">+50 points</p>
                    </div>
                </div>
            </section>

            {/* ── Rewards ────────────────────────────── */}
            <section className="px-6 py-14">
                <div className="max-w-[750px] mx-auto">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-white text-[0.6rem] font-bold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4 shadow-[0_4px_15px_rgba(26,140,140,0.3)]">
                            <TablerIcons.Gift /> Milestone Rewards
                        </span>
                        <h2 className="font-heading font-bold text-[clamp(1.6rem,3.5vw,2.2rem)] text-white">
                            Earn <span className="text-[var(--accent-bright)] italic">Rewards</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Bronze */}
                        <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-sm border border-[rgba(255,255,255,0.06)] rounded-[18px] overflow-hidden hover:border-[rgba(255,255,255,0.15)] transition-all duration-300">
                            <div className="bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.06)] px-6 py-3.5 flex justify-between items-center">
                                <span className="font-heading font-semibold text-[0.95rem] text-white">Bronze Tier</span>
                                <span className="text-[0.65rem] font-bold tracking-[1.5px] uppercase text-[rgba(255,255,255,0.5)]">150 pts to unlock</span>
                            </div>
                            <div className="p-6 flex items-start gap-5">
                                <img src={powerbankImg} alt="USB Power Bank" className="w-20 h-20 object-cover rounded-xl border border-[rgba(255,255,255,0.08)] shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-[1.05rem] mb-1.5 text-white">USB Power Bank</h3>
                                    <p className="text-[rgba(255,255,255,0.6)] text-[0.88rem] m-0 mb-2">Earned after 3 sales</p>
                                    <p className="text-[0.72rem] font-bold text-[var(--accent-bright)] uppercase tracking-[1px] m-0">3 more sales to unlock</p>
                                </div>
                            </div>
                        </div>

                        {/* Silver — Highlighted */}
                        <div className="bg-gradient-to-br from-[rgba(26,140,140,0.15)] to-[rgba(26,140,140,0.02)] backdrop-blur-md border-[2px] border-[var(--accent)] rounded-[18px] overflow-hidden shadow-[0_0_40px_rgba(26,140,140,0.15)]">
                            <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] px-6 py-3.5 flex justify-between items-center">
                                <span className="font-heading font-bold text-[0.95rem] text-white shadow-sm">Silver Tier</span>
                                <span className="text-[0.65rem] font-bold tracking-[1.5px] uppercase text-white/90">300 pts to unlock</span>
                            </div>
                            <div className="p-6 flex items-start gap-5">
                                <img src={coolerImg} alt="Mini Cooler" className="w-20 h-20 object-cover rounded-xl border border-[rgba(26,140,140,0.3)] shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-[1.05rem] mb-1.5 text-white">Mini Cooler</h3>
                                    <p className="text-[rgba(255,255,255,0.7)] text-[0.88rem] m-0 mb-2">Earned after 6 sales</p>
                                    <p className="text-[0.72rem] font-bold text-[var(--accent-bright)] uppercase tracking-[1px] m-0">6 more sales to unlock</p>
                                </div>
                            </div>
                        </div>

                        {/* Gold */}
                        <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-sm border border-[rgba(255,255,255,0.06)] rounded-[18px] overflow-hidden hover:border-[rgba(255,255,255,0.15)] transition-all duration-300">
                            <div className="bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.06)] px-6 py-3.5 flex justify-between items-center">
                                <span className="font-heading font-semibold text-[0.95rem] text-white">Gold Tier</span>
                                <span className="text-[0.65rem] font-bold tracking-[1.5px] uppercase text-[rgba(255,255,255,0.5)]">450 pts to unlock</span>
                            </div>
                            <div className="p-6 flex items-start gap-5">
                                <img src={smartwatchImg} alt="Smartwatch" className="w-20 h-20 object-cover rounded-xl border border-[rgba(255,255,255,0.08)] shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-[1.05rem] mb-1.5 text-white">Smartwatch</h3>
                                    <p className="text-[rgba(255,255,255,0.6)] text-[0.88rem] m-0 mb-2">Earned after 9 sales</p>
                                    <p className="text-[0.72rem] font-bold text-[var(--accent-bright)] uppercase tracking-[1px] m-0">9 more sales to unlock</p>
                                </div>
                            </div>
                        </div>

                        {/* Platinum */}
                        <div className="bg-[rgba(255,255,255,0.02)] backdrop-blur-sm border border-[rgba(255,255,255,0.06)] rounded-[18px] overflow-hidden hover:border-[rgba(255,255,255,0.15)] transition-all duration-300">
                            <div className="bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.06)] px-6 py-3.5 flex justify-between items-center">
                                <span className="font-heading font-semibold text-[0.95rem] text-white">Platinum Tier</span>
                                <span className="text-[0.65rem] font-bold tracking-[1.5px] uppercase text-[rgba(255,255,255,0.5)]">600 pts to unlock</span>
                            </div>
                            <div className="p-6 flex items-start gap-5">
                                <img src={earbudsImg} alt="Premium Earbuds" className="w-20 h-20 object-cover rounded-xl border border-[rgba(255,255,255,0.08)] shrink-0" />
                                <div>
                                    <h3 className="font-heading font-semibold text-[1.05rem] mb-1.5 text-white">Premium Earbuds</h3>
                                    <p className="text-[rgba(255,255,255,0.6)] text-[0.88rem] m-0 mb-2">Earned after 12 sales</p>
                                    <p className="text-[0.72rem] font-bold text-[var(--accent-bright)] uppercase tracking-[1px] m-0">12 more sales to unlock</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ────────────────────────────────── */}
            <section className="px-6 py-14">
                <div className="max-w-[650px] mx-auto">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-white text-[0.6rem] font-bold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4 shadow-[0_4px_15px_rgba(26,140,140,0.3)]">
                            <TablerIcons.Question /> FAQ
                        </span>
                        <h2 className="font-heading font-bold text-[clamp(1.6rem,3.5vw,2.2rem)] text-white mb-2">Common questions</h2>
                        <p className="text-[rgba(255,255,255,0.6)] text-[0.95rem]">Everything you need to know before joining.</p>
                    </div>

                    <div>
                        <Accordion
                            title="When do I get paid?"
                            content="Within 24 hours of the pharmacy making their final payment."
                        />
                        <Accordion
                            title="How do I get paid?"
                            content="Direct bank transfer or UPI. Whichever you prefer."
                        />
                        <Accordion
                            title="How much can I earn?"
                            content="There is no cap. Sell to 100 pharmacies, get paid for 100 pharmacies."
                        />
                        <Accordion
                            title="Do I handle tech support?"
                            content="No. You only do the introduction. We handle demos, installation, and support."
                        />
                    </div>
                </div>
            </section>

            {/* ── Final CTA ────────────────────────────── */}
            <section className="px-6 py-14 mb-8">
                <div className="max-w-[700px] mx-auto">
                    <div className="bg-[#101018] rounded-[28px] p-10 md:p-14 text-center relative overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        {/* Inner glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(26,140,140,0.1)_0%,transparent_70%)] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />

                        <div className="relative z-10">
                            <h2 className="font-heading font-bold text-[clamp(1.4rem,3vw,2rem)] mb-8 text-white leading-[1.3]">
                                120 pharmacies need MediX.<br />Go <span className="text-[var(--accent-bright)] italic">find them</span>.
                            </h2>

                            <a href="tel:+918101402916" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-white px-10 py-4 rounded-full font-bold text-[0.95rem] no-underline transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(26,140,140,0.5)] shadow-[0_6px_30px_rgba(26,140,140,0.35)] mb-8">
                                <TablerIcons.Rocket /> Start earning today
                            </a>

                            <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-4 rounded-xl text-[0.88rem] text-[rgba(255,255,255,0.5)]">
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <span className="font-bold text-white">+91 8101402916</span>
                                    <span className="hidden sm:inline text-[rgba(255,255,255,0.15)]">|</span>
                                    <span>medix.pos@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────── */}
            <footer className="px-6 py-8 border-t border-[rgba(255,255,255,0.05)]">
                <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[rgba(255,255,255,0.25)] text-[0.75rem]">© 2026 MediX Technologies. All rights reserved.</p>
                    <div className="flex gap-6">
                        {[
                            { label: "Privacy", path: "/privacy" },
                            { label: "Terms", path: "/terms" },
                            { label: "Home", path: "/" }
                        ].map((l) => (
                            <Link key={l.label} to={l.path} className="text-[rgba(255,255,255,0.25)] no-underline text-[0.75rem] hover:text-[var(--accent-bright)] transition-colors">{l.label}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Partner;
