import { Link } from 'react-router-dom';

const Terms = () => {
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
                    Terms of <span className="text-[var(--accent)]">Service</span>
                </h1>
                
                <div className="prose prose-lg prose-slate prose-invert max-w-none text-[var(--text-secondary)] leading-[1.8]">
                    <p className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-8 font-bold">Last Updated: October 2026</p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">1. Agreement to Terms</h2>
                    <p className="mb-6">
                        By accessing or using MediX, you agree to be bound by these Terms of Service. MediX provides pharmacy management software and related hardware setups ("the Service").
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">2. Payment and Pricing</h2>
                    <p className="mb-6">
                        MediX is provided on a <strong>one-time payment</strong> basis. There are no recurring subscription fees or hidden charges. 
                        We offer two tiers: 
                        <ul className="list-disc pl-6 mt-2">
                            <li><strong>MediX Software (₹13,500)</strong> - Software license and 1 year of free support.</li>
                            <li><strong>MediX Full Setup (₹28,000)</strong> - Software license plus hardware bundle (tablet, printers, scanner).</li>
                        </ul>
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">3. Support and Maintenance</h2>
                    <p className="mb-6">
                        All purchases include one year of free dedicated support. We guarantee a 99.97% uptime SLA for cloud services. After the first year, optional support contracts may be offered, but the core software license remains yours perpetually.
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">4. Compliance</h2>
                    <p className="mb-6">
                        While MediX is designed to be FDA and DEA compliant by default, it is the responsibility of the pharmacy operator to ensure that their use of the software complies with all local, state, and federal regulations regarding the dispensing of medications.
                    </p>

                    <h2 className="text-[1.5rem] font-bold text-[var(--text-primary)] mt-10 mb-4 font-['Syne',sans-serif]">5. Limitation of Liability</h2>
                    <p className="mb-6">
                        MediX Technologies shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
