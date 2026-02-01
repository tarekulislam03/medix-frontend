import { Outlet, Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const MarketingLayout = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <header className="fixed top-0 z-50 w-full bg-[#1e3a8a] text-white">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="brightness-0 invert filter">
                            <Logo />
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/features" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">Features</Link>
                        <Link to="/pricing" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">Pricing</Link>
                        <Link to="/about" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">About</Link>
                        <Link to="/contact" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-6 py-2 rounded-lg bg-[#FFE492] text-[#043873] text-sm font-semibold hover:bg-[#ffeab3] transition-colors">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-2 rounded-lg bg-[#4F9CF9] text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
                        >
                            Try MediX free
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-16">
                <Outlet />
            </main>

            <footer className="bg-[#1e3a8a] text-white pt-20 pb-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div>
                            <div className="mb-6 brightness-0 invert filter">
                                <Logo />
                            </div>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                MediX was created for the new ways we live and work. We make beauty and definition a part of the daily pharmacy experience.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Product</h4>
                            <ul className="space-y-4 text-blue-200">
                                <li><Link to="#" className="hover:text-white">Overview</Link></li>
                                <li><Link to="#" className="hover:text-white">Pricing</Link></li>
                                <li><Link to="#" className="hover:text-white">Customer stories</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Resources</h4>
                            <ul className="space-y-4 text-blue-200">
                                <li><Link to="#" className="hover:text-white">Blog</Link></li>
                                <li><Link to="#" className="hover:text-white">Guides</Link></li>
                                <li><Link to="#" className="hover:text-white">Webinars</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Company</h4>
                            <ul className="space-y-4 text-blue-200">
                                <li><Link to="#" className="hover:text-white">About us</Link></li>
                                <li><Link to="#" className="hover:text-white">Careers</Link></li>
                                <li><Link to="#" className="hover:text-white">Media kit</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center text-blue-200 text-sm">
                        <div className="flex gap-8 mb-4 md:mb-0">
                            <span>Terms & Conditions</span>
                            <span>Security</span>
                            <span>Status</span>
                        </div>
                        <div>
                            © {new Date().getFullYear()} MediX. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MarketingLayout;
