import SEO from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline'; // Need to ensure heroicons is installed, which it is.

const Home = () => {
    return (
        <>
            <SEO
                title="Pharmacy POS & Management System"
                description="Streamline your pharmacy operations with MediX. Storage, billing, and customer management in one unified platform."
            />

            {/* 1. HERO SECTION (Dark Blue) */}
            <section className="bg-[#1e3a8a] text-white pt-20 pb-20 overflow-hidden relative">
                {/* Background squiggle (SVG) - simplified */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0 0 C 50 100 80 100 100 0 Z" fill="none" stroke="white" strokeWidth="0.5" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                                Get More Done with <span className="relative z-10">MediX</span>
                            </h1>
                            <p className="text-lg text-blue-100 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                MediX streamlines your pharmacy operations, from inventory tracking to instant billing.
                                Experience the power of a modern, cloud-based POS.
                            </p>
                            <Link
                                to="/register"
                                className="inline-block px-8 py-4 rounded-lg bg-[#4F9CF9] text-white font-semibold text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50"
                            >
                                Try MediX free
                            </Link>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            {/* Hero Image Placeholder */}
                            <div className="w-full h-[400px] bg-[#C4DEFD] rounded-md shadow-2xl flex items-center justify-center text-blue-900 font-bold text-xl relative overflow-hidden">
                                {/* Mock UI elements */}
                                <div className="absolute top-4 left-4 w-3/4 h-6 bg-white/50 rounded"></div>
                                <div className="absolute top-14 left-4 w-1/4 h-20 bg-white/50 rounded"></div>
                                <div className="absolute top-14 right-4 w-2/3 h-64 bg-white/70 rounded shadow-inner flex items-center justify-center">
                                    Dashboard Preview
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. INVENTORY (White) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 order-2 lg:order-1">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 relative">
                                Inventory <br />
                                <span className="relative inline-block">
                                    Management
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FFE492]" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5 L 100 0 Q 50 5 0 0 Z" fill="currentColor" opacity="0.6" />
                                    </svg>
                                </span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Track every pill, bottle, and strip. Our smart inventory system alerts you before stock runs low
                                and helps you manage expiry dates effortlessly.
                            </p>
                            <button className="px-8 py-4 rounded-lg bg-[#4F9CF9] text-white font-semibold text-lg hover:bg-blue-600 transition-colors">
                                Get Started
                            </button>
                        </div>
                        <div className="lg:w-1/2 order-1 lg:order-2">
                            <div className="w-full h-[350px] bg-[#C4DEFD] rounded-md shadow-lg"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. POS / WORK TOGETHER (White) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            {/* Circular Diagram Mockup */}
                            <div className="relative w-full max-w-md mx-auto aspect-square">
                                <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-xl z-10">POS</div>
                                </div>
                                {/* Orbiting items */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400 rounded-full shadow-lg"></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-red-400 rounded-full shadow-lg"></div>
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-400 rounded-full shadow-lg"></div>
                                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-400 rounded-full shadow-lg"></div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                Lightning Fast <br /> Billing
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Process sales in seconds, not minutes. Whether it's a refill or a new prescription,
                                MediX POS handles barcodes, discounts, and varied payment modes seamlessly.
                            </p>
                            <button className="px-8 py-4 rounded-lg bg-[#4F9CF9] text-white font-semibold text-lg hover:bg-blue-600 transition-colors">
                                Try it now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. EXTENSION / ANALYTICS (Dark Blue) */}
            <section className="py-24 bg-[#1e3a8a] text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 order-2 lg:order-1">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Real-time <br /> Analytics
                            </h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                Know exactly how your pharmacy is performing. Track sales, profit margins, and customer
                                trends with our comprehensive dashboard extension.
                            </p>
                            <button className="px-8 py-4 rounded-lg bg-[#4F9CF9] text-white font-semibold text-lg hover:bg-blue-500 transition-colors">
                                Let's Go
                            </button>
                        </div>
                        <div className="lg:w-1/2 order-1 lg:order-2">
                            <div className="w-full h-[350px] bg-[#C4DEFD] rounded-md shadow-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CUSTOMIZE (White) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="w-full h-[350px] bg-[#C4DEFD] rounded-md shadow-lg"></div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                Customize it to <br /> your needs
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                MediX adapts to your pharmacy size. Configure tax rates, receipt formats, and user roles
                                to fit your specific business requirements.
                            </p>
                            <button className="px-8 py-4 rounded-lg bg-[#4F9CF9] text-white font-semibold text-lg hover:bg-blue-600 transition-colors">
                                Customize Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PRICING (White) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Choose Your Plan</h2>
                    <p className="text-slate-600 text-lg mb-16 max-w-2xl mx-auto">
                        Whether you want to get organized, keep your personal life on track, or boost workplace productivity, MediX has the right plan for you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="border border-yellow-200 rounded-xl p-8 text-left hover:shadow-xl transition-shadow bg-white transform hover:-translate-y-1 duration-300">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Free</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-6">$0</div>
                            <p className="text-slate-600 mb-6 font-medium">Capture ideas and find them quickly</p>
                            <ul className="space-y-4 mb-8">
                                {['Sync unlimited devices', '10 GB monthly uploads', '200 MB max. note size'].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-slate-700">
                                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-lg border border-[#FFE492] text-slate-900 font-semibold hover:bg-[#FFE492] transition-colors">
                                Get Started
                            </button>
                        </div>

                        {/* Personal Plan (Highlighted) */}
                        <div className="border border-[#1e3a8a] rounded-xl p-8 text-left shadow-2xl transform scale-105 bg-[#1e3a8a] text-white relative z-10">
                            <h3 className="text-xl font-bold mb-4">Personal</h3>
                            <div className="text-4xl font-bold mb-6 text-[#FFE492]">$11.99</div>
                            <p className="text-blue-100 mb-6 font-medium">Keep home and family on track</p>
                            <ul className="space-y-4 mb-8">
                                {['Sync unlimited devices', '10 GB monthly uploads', '200 MB max. note size', 'Customize Home dashboard'].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-white">
                                        <CheckIcon className="w-5 h-5 text-[#FFE492] flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-lg bg-[#4F9CF9] text-white font-semibold hover:bg-blue-500 transition-colors">
                                Get Started
                            </button>
                        </div>

                        {/* Organization Plan */}
                        <div className="border border-gray-200 rounded-xl p-8 text-left hover:shadow-xl transition-shadow bg-white transform hover:-translate-y-1 duration-300">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Organization</h3>
                            <div className="text-4xl font-bold text-slate-900 mb-6">$49.99</div>
                            <p className="text-slate-600 mb-6 font-medium">Capture ideas and find them quickly</p>
                            <ul className="space-y-4 mb-8">
                                {['Sync unlimited devices', '10 GB monthly uploads', '200 MB max. note size', 'Admin Dashboard'].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-slate-700">
                                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-3 rounded-lg border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition-colors">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. EVERYWHERE (Dark Blue) */}
            {/* 8. DATA (White) omitted to save space, user said 'like that', focusing on key sections */}

            {/* 9. SPONSORS */}
            <section className="py-20 bg-white text-center">
                <h2 className="text-4xl font-bold text-slate-900 mb-12 relative inline-block">
                    Our sponsors
                    <span className="absolute -bottom-2 right-0 w-20 h-1 bg-[#FFE492]"></span>
                </h2>
                <div className="container mx-auto flex flex-wrap justify-center gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Using text placeholders styled like logos */}
                    <div className="text-3xl font-bold text-slate-800 flex items-center gap-2"><div className="w-8 h-8 bg-black rounded"></div> Apple</div>
                    <div className="text-3xl font-bold text-slate-800 flex items-center gap-2"><div className="w-8 h-8 bg-blue-500 rounded"></div> Microsoft</div>
                    <div className="text-3xl font-bold text-slate-800 flex items-center gap-2"><div className="w-8 h-8 bg-purple-500 rounded"></div> Slack</div>
                    <div className="text-3xl font-bold text-slate-800 flex items-center gap-2"><div className="w-8 h-8 bg-red-500 rounded"></div> Google</div>
                </div>
            </section>

            {/* 10. APPS (Dark Blue) */}
            <section className="py-24 bg-[#1e3a8a] text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="w-full h-[400px] border border-blue-400/30 rounded-3xl relative flex items-center justify-center">
                                {/* Abstract app constellation */}
                                <div className="w-20 h-20 bg-blue-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Work with Your Favorite Apps Using MediX
                            </h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                MediX fits right into your existing workflow. Connect with accounting software,
                                CRM tools, and more.
                            </p>
                            <button className="px-8 py-4 rounded-lg bg-[#4F9CF9] text-white font-semibold text-lg hover:bg-blue-500 transition-colors">
                                Read more
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 11. TESTIMONIALS */}
            <section className="py-24 bg-white text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16">What Our Clients Says</h2>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg text-left border border-slate-100">
                            <div className="mb-6 flex text-yellow-400">★★★★★</div>
                            <p className="text-slate-600 mb-8 border-b border-slate-100 pb-8">
                                "MediX has completely transformed how I manage my pharmacy. Inventory is a breeze now."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Oberon Shaw</h4>
                                    <p className="text-sm text-slate-500">Pharmacist</p>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 (Blue) */}
                        <div className="bg-[#4F9CF9] p-8 rounded-2xl shadow-lg text-left text-white transform md:-translate-y-4">
                            <div className="mb-6 flex text-[#FFE492]">★★★★★</div>
                            <p className="text-white mb-8 border-b border-white/20 pb-8">
                                "The billing speed is incredible. We serve customers 2x faster than before."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-300 rounded-full"></div>
                                <div>
                                    <h4 className="font-bold text-white">Oberon Shaw</h4>
                                    <p className="text-sm text-blue-100">Store Manager</p>
                                </div>
                            </div>
                        </div>
                        {/* Card 3 (Blue) */}
                        <div className="bg-[#4F9CF9] p-8 rounded-2xl shadow-lg text-left text-white transform md:-translate-y-4">
                            <div className="mb-6 flex text-[#FFE492]">★★★★★</div>
                            <p className="text-white mb-8 border-b border-white/20 pb-8">
                                "I love the analytics dashboard. It helps me make data-driven decisions."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-300 rounded-full"></div>
                                <div>
                                    <h4 className="font-bold text-white">Oberon Shaw</h4>
                                    <p className="text-sm text-blue-100">Owner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 12. BOTTOM CTA (Dark Blue) */}
            <section className="py-24 bg-[#1e3a8a] text-center text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">Try MediX today</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Get started for free. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/register" className="px-8 py-4 rounded-lg bg-[#4F9CF9] text-white font-semibold text-lg hover:bg-blue-500 transition-colors">
                            Try MediX free
                        </Link>
                        <Link to="/contact" className="px-8 py-4 rounded-lg bg-transparent border border-white text-white font-semibold text-lg hover:bg-white/10 transition-colors">
                            Contact Sales
                        </Link>
                    </div>

                    <div className="mt-16 flex justify-center text-5xl gap-4">
                        {/* Icons */}
                        <span>🍏</span><span>🤖</span><span>💻</span>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Home;
