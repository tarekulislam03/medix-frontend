import { Link } from 'react-router-dom';

const Privacy = () => {
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
                    Privacy <span className="text-[var(--accent)]">Policy</span>
                </h1>
                
                <div className="prose prose-lg prose-slate prose-invert max-w-none text-[var(--text-secondary)] leading-[1.8]">
                    <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-8 font-bold">Last Updated: October 2026</p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">1. Information We Collect</h2>
                    <p className="mb-6">
                        We collect information to provide better services to our pharmacy partners. This includes:
                        <ul className="list-disc pl-6 mt-2">
                            <li>Account information (name, email, pharmacy license details)</li>
                            <li>Operational data (inventory logs, transaction histories) processed through the MediX POS software</li>
                            <li>Technical data regarding system performance and hardware diagnostics</li>
                        </ul>
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">2. How We Use Information</h2>
                    <p className="mb-6">
                        The data collected is used strictly to provide, maintain, and improve the MediX platform. Operational data (such as sales and inventory) is encrypted and accessible only by authorized personnel at your pharmacy. We use system data to monitor our 99.97% uptime SLA and proactively resolve issues.
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">3. Data Security & Compliance</h2>
                    <p className="mb-6">
                        Security is our top priority. MediX features enterprise-grade security and is fully SOC 2 and HIPAA compliant. All patient and prescription data passing through the system is encrypted at rest and in transit.
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">4. Data Sharing</h2>
                    <p className="mb-6">
                        We do not sell your personal or operational data to third parties. Data may be shared with trusted cloud infrastructure providers strictly for the purpose of hosting the MediX platform, under strict confidentiality agreements.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
