import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '@/utils/tutorialTranslations';
import { XMarkIcon, GlobeAsiaAustraliaIcon, PlayCircleIcon } from '@heroicons/react/24/solid';

interface OnboardingWelcomeProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (lang: Language) => void;
}

const languages: { id: Language; label: string; native: string; flag: string }[] = [
    { id: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { id: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ isOpen, onClose, onStart }) => {
    const [step, setStep] = useState<'welcome' | 'language'>('welcome');

    if (!isOpen) return null;

    // Simplified without motion for stability
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Step 1: Welcome Splash */}
                {step === 'welcome' && (
                    <div className="p-8 flex flex-col items-center text-center space-y-6 animate-fade-in-up">
                        <div
                            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl"
                        >
                            🚀
                        </div>

                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Welcome to MediX</h2>
                            <p className="text-gray-500 mt-2 text-lg">Your smart pharmacy assistant.</p>
                        </div>

                        <p className="text-gray-600">
                            Let's take a quick interactive tour to master the system in 2 minutes.
                        </p>

                        <button
                            onClick={() => setStep('language')}
                            className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
                        >
                            Get Started
                        </button>
                    </div>
                )}

                {/* Step 2: Language Selection */}
                {step === 'language' && (
                    <div className="p-8 flex flex-col items-center text-center space-y-6 animate-fade-in">
                        <div
                            className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
                        >
                            <GlobeAsiaAustraliaIcon className="h-8 w-8 text-purple-600" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Choose Language</h2>
                            <p className="text-gray-500 mt-1">Select your preferred language for the tour.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 w-full">
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => onStart(lang.id)}
                                    className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-colors group text-left w-full"
                                >
                                    <span className="text-2xl mr-4">{lang.flag}</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 group-hover:text-blue-700">{lang.label}</p>
                                        <p className="text-xs text-gray-500">{lang.native}</p>
                                    </div>
                                    <PlayCircleIcon className="h-6 w-6 ml-auto text-gray-300 group-hover:text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingWelcome;
