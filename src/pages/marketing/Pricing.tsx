import SEO from '@/components/common/SEO';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <>
            <SEO
                title="Pricing Plans"
                description="Affordable pricing plans for pharmacies of all sizes. Start free, upgrade as you grow."
            />

            <div className="bg-slate-50 py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Simple, transparent pricing</h1>
                        <p className="mt-4 text-lg text-slate-600">No hidden fees. Cancel anytime.</p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        {[
                            { name: 'Starter', price: 'Free', desc: 'Perfect for small pharmacies just starting out.', features: ['Up to 100 Products', 'Basic Reports', '1 User'] },
                            { name: 'Pro', price: '$29', desc: 'Everything you need to grow your business.', features: ['Unlimited Products', 'Advanced Analytics', '3 Users', 'Priority Support'], popular: true },
                            { name: 'Enterprise', price: '$99', desc: 'For large chains and hospitals.', features: ['Unlimited Everything', 'API Access', 'Dedicated Manager', 'Custom Integrations'] }
                        ].map((plan, idx) => (
                            <div key={idx} className={`relative rounded-2xl bg-white p-8 shadow-sm ring-1 ${plan.popular ? 'ring-blue-600 scale-105 shadow-xl' : 'ring-slate-200'}`}>
                                {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">Most Popular</span>}
                                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                                <p className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-bold tracking-tight text-slate-900">{plan.price}</span>
                                    {plan.price !== 'Free' && <span className="text-slate-500">/month</span>}
                                </p>
                                <p className="mt-4 text-sm text-slate-600">{plan.desc}</p>
                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center text-sm text-slate-600">
                                            <svg className="mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register" className={`mt-8 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}>
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pricing;
