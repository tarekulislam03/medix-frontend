import { Outlet, Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const MarketingLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-light)] font-sans text-[var(--text-dark)]">
            <header className="fixed top-0 z-50 w-full bg-[var(--dark-blue)] text-white border-b border-white/10 shadow-[var(--shadow-sm)] backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 transform transition-transform hover:scale-105 duration-300">
                        <div className="brightness-0 invert filter">
                            <Logo />
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-10">
                        {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="text-[15px] font-medium text-[var(--light-blue)] hover:text-white transition-all duration-300 relative group"
                            >
                                {item}
                                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#FFE492] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-6 py-2.5 rounded-[var(--radius)] bg-[#FFE492] text-[#043873] text-[15px] font-semibold hover:bg-[#ffeab3] hover:shadow-[0_4px_12px_rgba(255,228,146,0.4)] transition-all transform hover:-translate-y-0.5">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-2.5 rounded-[var(--radius)] bg-[var(--primary-blue)] text-white text-[15px] font-semibold hover:bg-[#4F9CF9] hover:shadow-[0_4px_12px_rgba(79,156,249,0.3)] transition-all transform hover:-translate-y-0.5"
                        >
                            Try MediX free
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                <Outlet />
            </main>

            <footer className="bg-[var(--dark-blue)] text-white pt-24 pb-12 border-t border-white/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        <div>
                            <div className="mb-8 brightness-0 invert filter opacity-90">
                                <Logo />
                            </div>
                            <p className="text-[var(--light-blue)] text-sm leading-[var(--line-height-loose)]">
                                MediX was created for the new ways we live and work. We make beauty and definition a part of the daily pharmacy experience.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-8 text-white">Product</h4>
                            <ul className="space-y-4 text-[var(--light-blue)]">
                                <li><Link to="#" className="hover:text-white transition-colors">Overview</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Customer stories</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-8 text-white">Resources</h4>
                            <ul className="space-y-4 text-[var(--light-blue)]">
                                <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Guides</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Webinars</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-8 text-white">Company</h4>
                            <ul className="space-y-4 text-[var(--light-blue)]">
                                <li><Link to="#" className="hover:text-white transition-colors">About us</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Media kit</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[var(--light-blue)] text-sm">
                        <div className="flex gap-8 mb-4 md:mb-0">
                            <span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Security</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Status</span>
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
