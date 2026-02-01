import SEO from '@/components/common/SEO';

const Features = () => {
    return (
        <>
            <SEO
                title="Features - Inventory, Billing & CRM"
                description="Explore the powerful features of MediX: Inventory Management, POS, Customer Relationship Management, and Analytics."
            />

            <div className="bg-white pt-16 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Features that empower you</h1>
                        <p className="mt-6 text-lg text-slate-600">Built for speed, accuracy, and reliability.</p>
                    </div>

                    <div className="mt-20 space-y-24">
                        {[
                            {
                                title: 'Advanced Inventory Management',
                                desc: 'Keep track of thousands of medicines with batch numbers, expiry dates, and rack locations. Get low-stock alerts instantly.',
                                image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Inventory+Dashboard'
                            },
                            {
                                title: 'Lightning Fast POS',
                                desc: 'Process sales in seconds. Support for barcode scanners, thermal printers, and digital receipts.',
                                image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=POS+Interface'
                            },
                            {
                                title: 'Deep Analytics',
                                desc: 'Visualize your daily sales, profit margins, and top-selling items with interactive charts.',
                                image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Analytics+View'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`flex flex-col gap-12 lg:items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">{item.title}</h2>
                                    <p className="mt-4 text-lg text-slate-600">{item.desc}</p>
                                </div>
                                <div className="flex-1">
                                    <img src={item.image} alt={item.title} loading="lazy" width={600} height={400} className="rounded-xl shadow-2xl ring-1 ring-slate-900/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Features;
