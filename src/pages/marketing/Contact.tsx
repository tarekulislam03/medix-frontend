import SEO from '@/components/common/SEO';

const Contact = () => {
    return (
        <>
            <SEO title="Contact Us" description="Get in touch with the MediX team for support or inquiries." />
            <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-xl">
                    <h1 className="text-3xl font-bold text-slate-900 text-center">Contact Us</h1>
                    <form className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                            <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                            <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                            <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
                        </div>
                        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Send Message</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Contact;
