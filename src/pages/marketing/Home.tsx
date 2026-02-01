import SEO from '@/components/common/SEO';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <SEO
                title="Pharmacy POS & Management System"
                description="Streamline your pharmacy operations with MediX. storage, billing, and customer management in one unified platform."
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-32">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-white opacity-40"></div>
                <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                        Modern Pharmacy Management <br className="hidden sm:block" />
                        <span className="text-blue-600">Reimagined</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
                        Manage inventory, track sales, and build customer loyalty with the most intuitive POS system designed for modern pharmacies.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/register" className="rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-blue-500 hover:shadow-xl transition-all">
                            Start Free Trial
                        </Link>
                        <Link to="/features" className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-md ring-1 ring-slate-900/10 hover:bg-gray-50 hover:shadow-lg transition-all">
                            View Features
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to run your pharmacy</h2>
                        <p className="mt-4 text-lg text-slate-600">Powerful tools compliant with industry standards.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: 'Smart Inventory', desc: 'Real-time tracking, expiry alerts, and auto-ordering.', icon: '📦' },
                            { title: 'Fast Billing', desc: 'Lightning fast POS with barcode scanning and touch support.', icon: '⚡' },
                            { title: 'Analytics', desc: 'Deep insights into sales, profits, and customer trends.', icon: '📊' },
                        ].map((feature, idx) => (
                            <div key={idx} className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-shadow">
                                <div className="mb-4 text-4xl">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                <p className="mt-2 text-slate-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
