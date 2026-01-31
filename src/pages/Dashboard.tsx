import React, { useEffect, useState } from 'react';
import {
    CurrencyRupeeIcon,
    ShoppingCartIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import AlertsModal from '@/components/common/AlertsModal';
import { useTutorial } from '@/context/TutorialContext';

const StatCard = ({ title, value, subtext, icon: Icon, color, className, ...props }: any) => {
    return (
        <div className={clsx("bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col touch-manipulation", className)} {...props}>
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2 truncate">{value}</h3>
                </div>
                <div className={clsx("p-2.5 sm:p-3 rounded-lg flex-shrink-0 ml-2", color)}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
            </div>
            {subtext && <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-500 truncate">{subtext}</p>}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAlerts, setShowAlerts] = useState(false);
    const { startTutorial, hasSeenTutorial } = useTutorial();

    useEffect(() => {
        const abortController = new AbortController();
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Short delay to ensure token propagation
                await new Promise(resolve => setTimeout(resolve, 500));

                // Fetch all dashboard data from single endpoint
                const response = await api.get('/dashboard', {
                    signal: abortController.signal
                });
                if (isMounted && response.data.success) {
                    setDashboardData(response.data.data);
                }
            } catch (err: any) {
                // Don't update state if request was aborted
                if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
                    return;
                }
                if (isMounted) {
                    console.error("Failed to load dashboard data", err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Check for alerts on first load
        const hasShownAlerts = sessionStorage.getItem('hasShownAlerts');
        if (!hasShownAlerts) {
            setShowAlerts(true);
            sessionStorage.setItem('hasShownAlerts', 'true');
        }

        // Cleanup function
        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, []);

    // Separate effect for auto-starting tutorial AFTER loading completes
    useEffect(() => {
        // Only auto-start tutorial after dashboard has loaded
        if (loading) return;
        if (hasSeenTutorial) return;

        // Small delay to ensure UI is fully rendered
        const timer = setTimeout(() => {
            startTutorial();
        }, 500);

        return () => clearTimeout(timer);
    }, [loading, hasSeenTutorial, startTutorial]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const todaySales = dashboardData?.todaySales || { totalAmount: 0, totalBills: 0 };
    const monthlySummary = dashboardData?.monthlySummary || { totalAmount: 0, totalBills: 0 };
    const customers = dashboardData?.customers || { totalCustomers: 0 };
    const inventory = dashboardData?.inventory || { lowStockCount: 0 };
    const recentBills = dashboardData?.recentBills || [];

    return (
        <div className="space-y-4 sm:space-y-6 dashboard-content" id="dashboard-container">
            <AlertsModal isOpen={showAlerts} onClose={() => setShowAlerts(false)} />

            {/* Page Header - Mobile Optimized (Button beside Title) */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-500 hidden sm:block">Welcome back, here's what's happening at your store.</p>
                </div>
                <button
                    onClick={startTutorial}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-700 to-blue-800 
                               text-white text-sm font-medium rounded-lg hover:from-purple-800 hover:to-blue-900 
                               transition-all shadow-md shadow-purple-600/25 touch-manipulation whitespace-nowrap"
                >
                    <SparklesIcon className="w-4 h-4" />
                    Take Tour
                </button>
            </div>

            {/* Stats Grid - 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 stats-grid" id="dashboard-stats-grid">
                <StatCard
                    id="dashboard-stat-todays-sales"
                    title="Today's Sales"
                    value={`₹${todaySales.totalAmount?.toLocaleString() || 0}`}
                    subtext={`${todaySales.totalBills || 0} bills today`}
                    icon={CurrencyRupeeIcon}
                    color="bg-blue-800"
                />
                <StatCard
                    id="dashboard-stat-monthly-revenue"
                    title="Monthly Revenue"
                    value={`₹${monthlySummary.totalAmount?.toLocaleString() || 0}`}
                    subtext={`${monthlySummary.totalBills || 0} bills this month`}
                    icon={CurrencyRupeeIcon}
                    color="bg-indigo-600"
                />
                <StatCard
                    id="dashboard-stat-total-customers"
                    title="Total Customers"
                    value={customers.totalCustomers || 0}
                    subtext="Registered customers"
                    icon={UsersIcon}
                    color="bg-teal-600"
                />
                <StatCard
                    id="dashboard-stat-low-stock"
                    title="Low Stock Items"
                    value={inventory.lowStockCount || 0}
                    subtext="Items below reorder level"
                    icon={ExclamationTriangleIcon}
                    color="bg-red-600"
                />
            </div>

            {/* Main Content Grid - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* Left Col: Recent Bills */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" id="dashboard-recent-transactions">
                        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
                            <Link to="/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-500 touch-manipulation">View All</Link>
                        </div>

                        {/* Mobile: Card-based layout */}
                        <div className="divide-y divide-gray-100 sm:hidden">
                            {recentBills.length > 0 ? recentBills.slice(0, 5).map((bill: any) => (
                                <div key={bill.id} className="p-4 touch-manipulation hover:bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{bill.billNumber}</p>
                                            <p className="text-xs text-gray-500">{bill.customerName || 'Walk-in'}</p>
                                        </div>
                                        <span className={clsx(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                            bill.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        )}>
                                            {bill.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            {new Date(bill.billedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">₹{bill.totalAmount?.toLocaleString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-6 text-center text-gray-500 text-sm">No recent transactions</div>
                            )}
                        </div>

                        {/* Desktop: Table layout */}
                        <div className="overflow-x-auto hidden sm:block table-scroll-mobile">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill No</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentBills.map((bill: any) => (
                                        <tr key={bill.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.billNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bill.customerName || 'Walk-in'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(bill.billedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">₹{bill.totalAmount?.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bill.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {bill.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentBills.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No recent transactions</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Col: Quick Actions - Show at top on mobile */}
                <div className="space-y-4 sm:space-y-6 order-first lg:order-none">
                    {/* Quick Actions - POS Button */}
                    <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-lg p-4 sm:p-6 text-white" id="dashboard-pos-shortcut">
                        <h3 className="text-base sm:text-lg font-bold mb-1">POS Billing</h3>
                        <p className="text-blue-200 text-xs sm:text-sm mb-3 sm:mb-4">Start a new sale instantly</p>
                        <Link
                            to="/pos"
                            className="w-full bg-white text-blue-800 font-semibold py-3 sm:py-2.5 rounded-lg shadow-md hover:bg-blue-50 transition flex justify-center items-center gap-2 touch-manipulation min-h-[44px]"
                        >
                            <ShoppingCartIcon className="h-5 w-5" />
                            New Bill
                        </Link>
                    </div>

                    {/* Low Stock Alert - Enhanced Visual Hierarchy */}
                    {inventory.lowStockCount > 0 && (
                        <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200 shadow-lg shadow-red-100">
                            {/* Pulsing Alert Indicator */}
                            <div className="absolute -top-2 -right-2 flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-500 rounded-lg">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-red-900 font-bold text-lg">Attention Needed</h3>
                                    <p className="text-red-600 text-xs font-medium">Immediate action required</p>
                                </div>
                            </div>

                            <div className="bg-white/60 rounded-lg p-3 mb-4">
                                <p className="text-red-800 font-semibold text-2xl">{inventory.lowStockCount}</p>
                                <p className="text-red-700 text-sm">products running low on stock</p>
                            </div>

                            <Link
                                to="/inventory?filter=lowStock"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                            >
                                View Inventory
                            </Link>
                        </div>
                    )}

                    {/* Expiring Soon Alert - Enhanced Visual Hierarchy */}
                    {inventory.expiringCount > 0 && (
                        <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-2 border-amber-200 shadow-lg shadow-amber-100 mt-4">
                            {/* Pulsing Alert Indicator */}
                            <div className="absolute -top-2 -right-2 flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500"></span>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-amber-500 rounded-lg">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-amber-900 font-bold text-lg">Expiry Alert</h3>
                                    <p className="text-amber-600 text-xs font-medium">Review inventory immediately</p>
                                </div>
                            </div>

                            <div className="bg-white/60 rounded-lg p-3 mb-4">
                                <p className="text-amber-800 font-semibold text-2xl">{inventory.expiringCount}</p>
                                <p className="text-amber-700 text-sm">products expiring soon or expired</p>
                            </div>

                            <Link
                                to="/inventory?filter=expiring"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-md"
                            >
                                View Expiring Items
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
