import { Outlet, Link } from 'react-router-dom';
import { Fragment } from 'react';

const MarketingLayout = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                            M
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">MediX</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
                        <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
                        <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">About</Link>
                        <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</Link>
                        <Link
                            to="/register"
                            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 hover:shadow-md transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link to="/features" className="text-sm text-gray-600 hover:text-blue-600">Features</Link></li>
                                <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-blue-600">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link to="/about" className="text-sm text-gray-600 hover:text-blue-600">About</Link></li>
                                <li><Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600">Privacy</Link></li>
                                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-blue-600">Terms</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Social</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600">Twitter</a></li>
                                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-200 pt-8 text-center">
                        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} MediX. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MarketingLayout;
