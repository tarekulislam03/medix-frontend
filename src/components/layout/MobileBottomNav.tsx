import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    ShoppingBagIcon as ShoppingBagIconSolid,
    ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
    ChartBarIcon as ChartBarIconSolid,
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface MobileBottomNavProps {
    onMenuClick: () => void;
}

const navItems = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Inventory', href: '/inventory', icon: ClipboardDocumentListIcon, activeIcon: ClipboardDocumentListIconSolid },
    { name: 'POS', href: '/pos', icon: ShoppingBagIcon, activeIcon: ShoppingBagIconSolid, primary: true },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, activeIcon: ChartBarIconSolid },
];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onMenuClick }) => {
    const { pathname } = useLocation();

    // Generate mobile tutorial selector based on href
    const getMobileTutorialAttr = (href: string) => {
        const pathMap: Record<string, string> = {
            '/dashboard': 'mobile-nav-dashboard',
            '/inventory': 'mobile-nav-inventory',
            '/pos': 'mobile-nav-pos',
            '/analytics': 'mobile-nav-analytics',
        };
        return pathMap[href];
    };

    return (
        <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = isActive ? item.activeIcon : item.icon;
                    const tutorialAttr = getMobileTutorialAttr(item.href);

                    if (item.primary) {
                        // POS Button - Large and prominent
                        return (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                data-tutorial-mobile={tutorialAttr}
                                className="flex flex-col items-center justify-center -mt-6"
                            >
                                <div className={clsx(
                                    "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200",
                                    isActive
                                        ? "bg-blue-700 shadow-blue-500/40"
                                        : "bg-gradient-to-br from-blue-600 to-blue-800 shadow-blue-500/30"
                                )}>
                                    <Icon className="h-7 w-7 text-white" />
                                </div>
                                <span className={clsx(
                                    "text-[10px] mt-1 font-semibold",
                                    isActive ? "text-blue-700" : "text-gray-600"
                                )}>
                                    {item.name}
                                </span>
                            </NavLink>
                        );
                    }

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            data-tutorial-mobile={tutorialAttr}
                            className="flex flex-col items-center justify-center min-w-[56px] py-2 touch-manipulation"
                        >
                            <Icon className={clsx(
                                "h-6 w-6 transition-colors duration-200",
                                isActive ? "text-blue-700" : "text-gray-400"
                            )} />
                            <span className={clsx(
                                "text-[10px] mt-1 font-medium",
                                isActive ? "text-blue-700" : "text-gray-500"
                            )}>
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}

                {/* More Menu Button */}
                <button
                    onClick={onMenuClick}
                    data-tutorial-mobile="mobile-nav-more"
                    className="flex flex-col items-center justify-center min-w-[56px] py-2 touch-manipulation"
                >
                    <Bars3Icon className="h-6 w-6 text-gray-400" />
                    <span className="text-[10px] mt-1 font-medium text-gray-500">More</span>
                </button>
            </div>
        </nav>
    );
};

export default MobileBottomNav;
