import { Link } from 'react-router-dom';

const Cookie = () => {
    return (
        <div className="min-h-screen bg-[var(--navy)] text-[var(--text-primary)] font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="bg-mesh"></div>
            <div className="orb-1 fixed pointer-events-none z-0"></div>
            <div className="orb-2 fixed pointer-events-none z-0"></div>

            <div className="relative z-10 max-w-[800px] mx-auto px-6 py-12 md:py-20">
                <Link to="/" className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors mb-12 font-medium">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16 10H4M8 6l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="font-['Syne',sans-serif] font-extrabold text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.1] mb-6">
                    Cookie <span className="text-[var(--accent)]">Policy</span>
                </h1>
                
                <div className="prose prose-lg prose-slate prose-invert max-w-none text-[var(--text-secondary)] leading-[1.8]">
                    <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-8 font-bold">Last Updated: October 2026</p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">1. What Are Cookies</h2>
                    <p className="mb-6">
                        Cookies are small text files that are stored on your device when you visit our website or use the MediX software platform. They help us ensure the platform functions correctly and securely.
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">2. How We Use Cookies</h2>
                    <p className="mb-6">
                        We use cookies for the following purposes:
                        <ul className="list-disc pl-6 mt-2">
                            <li><strong>Essential Cookies:</strong> Required to authenticate users, maintain active sessions during POS transactions, and enforce enterprise-grade security.</li>
                            <li><strong>Performance Cookies:</strong> Used to monitor system health, measure page load times, and ensure our 99.97% uptime SLA is met.</li>
                            <li><strong>Functional Cookies:</strong> Remember your dashboard preferences and settings to reduce training and setup time.</li>
                        </ul>
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">3. Managing Cookies</h2>
                    <p className="mb-6">
                        You can configure your browser to block or alert you about these cookies, but please note that some parts of the MediX platform (such as secure billing and invoicing sessions) may not function properly if essential cookies are disabled.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cookie;
