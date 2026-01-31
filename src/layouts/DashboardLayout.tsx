import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

const DashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar - Hidden on mobile, visible on lg+ */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content - Add padding-bottom on mobile for bottom nav */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6 bg-gray-50 scrollbar-hide pb-20 lg:pb-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation - Hidden on lg+ */}
            <MobileBottomNav onMenuClick={() => setSidebarOpen(true)} />
        </div>
    );
};

export default DashboardLayout;

