import SEO from '@/components/common/SEO';

const About = () => {
    return (
        <>
            <SEO title="About Us" description="Learn about the mission and team behind MediX." />
            <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-4xl font-bold text-slate-900">About MediX</h1>
                    <div className="mt-6 prose prose-lg text-slate-600">
                        <p>
                            MediX was born from a simple mission: to make pharmacy management as easy as possible.
                            We understand the complexities of running a pharmacy—from expiration dates to complex billing—and
                            we've built a tool that handles it all for you.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
