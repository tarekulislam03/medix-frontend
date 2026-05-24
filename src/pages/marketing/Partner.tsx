import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoDark from '../../assets/logo-light.png';
import powerbankImg from '../../assets/powerbank.jpg';
import coolerImg from '../../assets/cooler.jpg';
import smartwatchImg from '../../assets/smartwatch.webp';
import earbudsImg from '../../assets/earbuds.webp';
import BookDemoForm from '@/components/BookDemoForm';

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

const SectionPill = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-white text-[11px] font-bold tracking-widest uppercase px-[16px] py-[6px] rounded-full">
            <Icon />
            {title}
        </span>
    </div>
);

const Accordion = ({ title, content }: { title: string, content: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 bg-white mb-3">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-start gap-4 p-5 text-left bg-transparent border-none cursor-pointer text-slate-900"
            >
                <div className="text-[var(--accent)] shrink-0 mt-0.5">
                    {open ? <TablerIcons.ChevronUp /> : <TablerIcons.Plus />}
                </div>
                <span className="font-bold text-[14px] flex-1 pr-4">{title}</span>
            </button>
            {open && (
                <div className="px-5 pb-5 pl-[52px] text-gray-600 text-[14px] leading-relaxed">
                    <p className="m-0">{content}</p>
                </div>
            )}
        </div>
    );
};

const Partner = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
            
            {/* Simple Nav - Removed bottom border on mobile */}
            <nav className="bg-slate-900 text-white p-4 sm:border-b border-[rgba(255,255,255,0.1)]">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="no-underline flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
                        <img src={logoDark} alt="MediX Logo" className="w-11 h-11 object-contain" />
                        <span className="font-['Syne',sans-serif] font-extrabold text-[1.4rem] tracking-tight">
                            Medi<span className="text-[var(--accent-bright)]">X</span>
                        </span>
                    </Link>
                    <Link to="/" className="text-[11px] text-gray-300 no-underline hover:text-white uppercase font-bold tracking-widest">
                        Back to site
                    </Link>
                </div>
            </nav>

            {/* Hero section — Navy */}
            <section className="bg-slate-900 px-4 py-[32px] text-center text-white">
                <div className="max-w-3xl mx-auto">
                    <SectionPill title="Partner Program" icon={TablerIcons.Bolt} />
                    
                    <h1 className="text-[36px] font-bold mb-6 text-white font-['Syne',sans-serif]">
                        Become Our Partner & Earn
                    </h1>
                    
                    <div className="bg-transparent inline-block mb-10">
                        <p className="text-[var(--accent-bright)] text-[24px] font-bold m-0 leading-none font-['Syne',sans-serif]">₹2,500 / sale</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-10">
                        <a href="#join" className="bg-[var(--accent)] text-white no-underline px-8 py-3 font-bold text-[14px] rounded-full w-full sm:w-auto shadow-[0_6px_30px_rgba(26,140,140,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(26,140,140,0.6)]">
                            Start earning
                        </a>
                        <a href="#how-it-works" className="bg-transparent text-white no-underline font-bold text-[14px] hover:underline">
                            Learn more
                        </a>
                    </div>

                    {/* Stats - Horizontal Grid */}
                    <div className="grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 pt-6 mt-6 text-left">
                        <div className="px-4">
                            <p className="text-[14px] font-bold text-white m-0">48hr</p>
                            <p className="text-gray-400 text-[11px] m-0 mt-1 uppercase font-bold">Payout</p>
                        </div>
                        <div className="px-4">
                            <p className="text-[24px] font-bold text-[var(--accent-bright)] m-0 leading-none font-['Syne',sans-serif]">₹2500</p>
                            <p className="text-gray-400 text-[11px] m-0 mt-2 uppercase font-bold">Commission</p>
                        </div>
                        <div className="px-4">
                            <p className="text-[14px] font-bold text-white m-0">50</p>
                            <p className="text-gray-400 text-[11px] m-0 mt-1 uppercase font-bold">Pts per sale</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-[#f8fafb] px-4 py-16" id="join">
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-[0_4px_40px_rgba(0,0,0,0.08)] p-8 sm:p-12">
        <BookDemoForm />
    </div>
</div>

            {/* Why pharmacies want this — Light Gray */}
            <section className="bg-gray-50 px-4 py-[32px]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-[24px] font-bold mb-8 text-center text-slate-900 font-['Syne',sans-serif]">Why pharmacies want this</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: TablerIcons.Target, title: "Built for them", desc: "Tailored strictly for Indian pharmacy workflows." },
                            { icon: TablerIcons.TrendingUp, title: "Cheaper", desc: "Tired of Marg ERP and expensive yearly fees." },
                            { icon: TablerIcons.Shield, title: "One-time fee", desc: "No recurring subs. Pay once, use forever." },
                            { icon: TablerIcons.Star, title: "Simple UI", desc: "Fast and remarkably easy for any staff member." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 p-5 rounded-sm">
                                <div className="text-[var(--accent)] mb-3">
                                    <item.icon />
                                </div>
                                <h3 className="font-bold text-[14px] mb-1 text-slate-900">{item.title}</h3>
                                <p className="text-gray-600 text-[14px] m-0 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works section — White */}
            <section id="how-it-works" className="bg-white px-4 py-[32px]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-[24px] font-bold mb-8 text-center text-slate-900 font-['Syne',sans-serif]">Earning Process</h2>

                    {/* Your role - Navy styling */}
                    <div className="bg-slate-900 border border-slate-900 text-white p-6 mb-8 rounded-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                            <h3 className="font-bold text-[14px] m-0 uppercase tracking-widest text-white">Your role</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="text-[14px] text-gray-400 font-bold w-4">1.</div>
                                <div>
                                    <h4 className="font-bold text-[14px] mb-1 text-white">Identify</h4>
                                    <p className="text-gray-300 m-0 text-[14px]">Visit pharmacies in your territory.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-[14px] text-gray-400 font-bold w-4">2.</div>
                                <div>
                                    <h4 className="font-bold text-[14px] mb-1 text-white">Pitch</h4>
                                    <p className="text-gray-300 m-0 text-[14px]">Take 5 mins to explain Medix. Convince them to buy.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-[14px] text-gray-400 font-bold w-4">3.</div>
                                <div>
                                    <h4 className="font-bold text-[14px] mb-1 text-white">Share contact</h4>
                                    <p className="text-gray-300 m-0 text-[14px]">Tell them our team will call for a demo.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full-width transition banner */}
                    <div className="w-full bg-gray-100 py-3 text-center mb-8 border-y border-gray-200">
                        <span className="font-bold text-[11px] text-gray-500 tracking-widest uppercase">
                            Then we take over
                        </span>
                    </div>

                    {/* Our role - Solid Teal Styling */}
                    <div className="bg-[var(--accent)] border border-[var(--accent)] text-white p-6 rounded-sm mb-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
                            <h3 className="font-bold text-[14px] m-0 uppercase tracking-widest text-white">Our role</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="text-[14px] text-teal-100 font-bold w-4">4.</div>
                                <div>
                                    <h4 className="font-bold text-[14px] mb-1 text-white">Follow-up & demo</h4>
                                    <p className="text-teal-50 m-0 text-[14px]">We handle all technical questions.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-[14px] text-teal-100 font-bold w-4">5.</div>
                                <div>
                                    <h4 className="font-bold text-[14px] mb-1 text-white">Close the deal</h4>
                                    <p className="text-teal-50 m-0 text-[14px]">We finalize payment and setup.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-[14px] text-teal-100 font-bold w-4">6.</div>
                                <div>
                                    <h4 className="font-bold text-[14px] mb-1 text-white">Payout</h4>
                                    <p className="text-teal-50 m-0 text-[14px]">Your commission is credited instantly.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Standalone Payout Badge */}
                    <div className="text-center bg-gray-50 border border-gray-200 py-6 px-4">
                        <span className="inline-block bg-[var(--accent)] text-white text-[11px] font-bold px-3 py-1 uppercase tracking-widest mb-4">
                            Every single sale
                        </span>
                        <p className="text-[24px] font-bold m-0 text-slate-900 leading-none font-['Syne',sans-serif]">+50 points</p>
                    </div>
                </div>
            </section>

            {/* Rewards section — Light Gray */}
            <section className="bg-gray-50 px-4 py-[32px]">
                <div className="max-w-3xl mx-auto">
                    <SectionPill title="Milestone Rewards" icon={TablerIcons.Gift} />
                    <h2 className="text-[24px] font-bold mb-8 text-center text-slate-900 font-['Syne',sans-serif]">Earn Rewards</h2>
                    
                    <div className="flex flex-col gap-6">
                        {/* Bronze */}
                        <div className="bg-white border border-gray-200">
                            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                                <div className="font-bold text-[14px]">Bronze Tier</div>
                                <div className="text-[11px] font-bold tracking-widest uppercase">150 pts to unlock</div>
                            </div>
                            <div className="p-6 flex items-start gap-6">
                                <img src={powerbankImg} alt="USB Power Bank" className="w-24 h-24 object-cover border border-gray-100 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-[14px] mb-2 text-slate-900">USB Power Bank</h3>
                                    <p className="text-gray-500 text-[14px] m-0 mb-3 font-medium">Earned after 3 sales</p>
                                    <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wide m-0">3 more sales to unlock</p>
                                </div>
                            </div>
                        </div>

                        {/* Silver */}
                        <div className="bg-white border-[2px] border-[var(--accent)]">
                            <div className="bg-[var(--accent)] text-white p-4 flex justify-between items-center">
                                <div className="font-bold text-[14px]">Silver Tier</div>
                                <div className="text-[11px] font-bold tracking-widest uppercase">300 pts to unlock</div>
                            </div>
                            <div className="p-6 flex items-start gap-6 bg-[rgba(26,140,140,0.02)]">
                                <img src={coolerImg} alt="Mini Cooler" className="w-24 h-24 object-cover border border-[rgba(26,140,140,0.1)] shrink-0" />
                                <div>
                                    <h3 className="font-bold text-[14px] mb-2 text-slate-900">Mini Cooler</h3>
                                    <p className="text-gray-500 text-[14px] m-0 mb-3 font-medium">Earned after 6 sales</p>
                                    <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wide m-0">6 more sales to unlock</p>
                                </div>
                            </div>
                        </div>

                        {/* Gold */}
                        <div className="bg-white border border-gray-200">
                            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                                <div className="font-bold text-[14px]">Gold Tier</div>
                                <div className="text-[11px] font-bold tracking-widest uppercase">450 pts to unlock</div>
                            </div>
                            <div className="p-6 flex items-start gap-6">
                                <img src={smartwatchImg} alt="Smartwatch" className="w-24 h-24 object-cover border border-gray-100 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-[14px] mb-2 text-slate-900">Smartwatch</h3>
                                    <p className="text-gray-500 text-[14px] m-0 mb-3 font-medium">Earned after 9 sales</p>
                                    <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wide m-0">9 more sales to unlock</p>
                                </div>
                            </div>
                        </div>

                        {/* Platinum */}
                        <div className="bg-white border border-gray-200">
                            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                                <div className="font-bold text-[14px]">Platinum Tier</div>
                                <div className="text-[11px] font-bold tracking-widest uppercase">600 pts to unlock</div>
                            </div>
                            <div className="p-6 flex items-start gap-6">
                                <img src={earbudsImg} alt="Premium Earbuds" className="w-24 h-24 object-cover border border-gray-100 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-[14px] mb-2 text-slate-900">Premium Earbuds</h3>
                                    <p className="text-gray-500 text-[14px] m-0 mb-3 font-medium">Earned after 12 sales</p>
                                    <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wide m-0">12 more sales to unlock</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ section — White */}
            <section className="bg-white px-4 py-[32px]">
                <div className="max-w-2xl mx-auto">
                    <SectionPill title="FAQ" icon={TablerIcons.Question} />
                    <h2 className="text-[24px] font-bold mb-2 text-center text-slate-900 font-['Syne',sans-serif]">Common questions</h2>
                    <p className="text-center text-[14px] text-gray-500 mb-8">Everything you need to know before joining.</p>
                    
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

            {/* Final CTA section — Navy */}
            <section id="join" className="bg-slate-900 px-4 py-[32px] text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-[24px] font-bold mb-8 text-white font-['Syne',sans-serif]">
                        120 pharmacies need MediX. Go find them.
                    </h2>
                    
                    <a href="tel:+918101402916" className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-[14px] no-underline transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] shadow-[0_6px_30px_rgba(255,255,255,0.1)] mb-8">
                        <TablerIcons.Rocket /> Start earning today
                    </a>
                    
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-sm text-[14px] text-gray-300 mb-8">
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <span className="font-bold text-white">+91 8101402916</span>
                            <span className="hidden sm:inline text-slate-600">|</span>
                            <span>medix.pos@gmail.com</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Partner;
