import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface LogoProps {
    className?: string; // For container sizing
    textClassName?: string; // For text styling
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", textClassName = "text-xl font-bold text-gray-900", showText = true }) => {
    return (
        <div className="flex items-center gap-2">
            <div className={`relative flex items-center justify-center ${className} bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg shadow-md`}>
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-white/10 rounded-lg" />

                {/* Medical Cross Icon */}
                <PlusIcon className="h-2/3 w-2/3 text-white z-10 stroke-[3]" />

                {/* Decorative dot */}
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-white shadow-sm z-20"></div>
            </div>
            {showText && (
                <div className={`${textClassName} tracking-tight`}>
                    <span className="text-blue-800">Medi</span>
                    <span className="text-cyan-600">X</span>
                </div>
            )}
        </div>
    );
};

export default Logo;
