import React, { useEffect, useState, useRef } from 'react';
import { useTutorial, type TutorialStep } from '@/context/TutorialContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import pharmacistAvatar from '@/assets/AvatarMaker.svg'; // Make sure this path is correct

// ============================================
// MASCOT / AVATAR COMPONENT
// ============================================

const Avatar: React.FC<{ mood?: string }> = ({ mood }) => {
    // Determine animation based on mood
    const getAnimationClass = () => {
        switch (mood) {
            case 'excited': return 'animate-bounce';
            case 'pointing': return 'animate-point';
            case 'celebrating': return 'animate-spin'; // Or a jump animation
            default: return 'animate-float';
        }
    };

    return (
        <div className={`transition-all duration-300 transform hover:scale-110 ${getAnimationClass()}`}>
            {/* Pop-out Effect Wrapper */}
            <div className="relative w-20 h-20">
                {/* 1. Base Circle (Clips the bottom of the avatar) */}
                <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden">
                    <img
                        src={pharmacistAvatar}
                        alt="Pharmacist Max"
                        className="w-24 h-24 max-w-none absolute bottom-[-5px] left-1/2 -translate-x-1/2"
                    />
                </div>

                {/* 2. Top Overlay (Allows the head to pop out) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                    {/* Clip-path creates a window showing only the top 45% of the image, 
                         aligning with where the border would cut it off. 
                         Adjust inset percentage if needed. 
                     */}
                    <div style={{ clipPath: 'inset(0 0 40% 0)' }} className="w-full h-full relative">
                        <img
                            src={pharmacistAvatar}
                            alt="Pharmacist Max"
                            className="w-24 h-24 max-w-none absolute bottom-[-5px] left-1/2 -translate-x-1/2"
                        />
                    </div>
                </div>
            </div>

            {/* Mood Emoji Badge */}
            {mood && (
                <div className="absolute -bottom-1 -right-1 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-xl border border-gray-100">
                    {mood === 'excited' && '🤩'}
                    {mood === 'happy' && '😊'}
                    {mood === 'thinking' && '🤔'}
                    {mood === 'pointing' && '👉'}
                    {mood === 'celebrating' && '🎉'}
                </div>
            )}
        </div>
    );
};

// ============================================
// CONFETTI ANIMATION
// ============================================

const Confetti: React.FC = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const confettiCount = 50;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {[...Array(confettiCount)].map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 20}px`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '0',
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${Math.random() * 2 + 2}s`,
                    }}
                />
            ))}
        </div>
    );
};

// ============================================
// SPOTLIGHT OVERLAY
// ============================================

const SpotlightOverlay: React.FC<{
    targetRect: DOMRect | null;
    padding: number;
    allowInteraction?: boolean;
    noOverlay?: boolean; // Skip the dark overlay entirely (useful for sidebar menu items)
}> = ({ targetRect, padding, allowInteraction, noOverlay }) => {
    // If noOverlay is true, don't render any overlay - just let users interact freely
    if (noOverlay) {
        // Only show the glow ring if we have a target
        if (targetRect) {
            const spotlightStyle = {
                left: targetRect.left - padding,
                top: targetRect.top - padding,
                width: targetRect.width + padding * 2,
                height: targetRect.height + padding * 2,
            };
            return (
                <div
                    className="fixed rounded-xl border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-pulse pointer-events-none z-[9999]"
                    style={{
                        left: spotlightStyle.left,
                        top: spotlightStyle.top,
                        width: spotlightStyle.width,
                        height: spotlightStyle.height,
                    }}
                />
            );
        }
        return null;
    }

    if (!targetRect) {
        return (
            <div className={`fixed inset-0 bg-black/70 z-[9990] transition-opacity duration-300 ${allowInteraction ? 'pointer-events-none' : ''}`} />
        );
    }

    const spotlightStyle = {
        left: targetRect.left - padding,
        top: targetRect.top - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
    };

    return (
        <div className={`fixed inset-0 z-[9990] ${allowInteraction ? 'pointer-events-none' : ''}`}>
            {/* SVG mask for spotlight effect */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect
                            x={spotlightStyle.left}
                            y={spotlightStyle.top}
                            width={spotlightStyle.width}
                            height={spotlightStyle.height}
                            rx="12"
                            ry="12"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.75)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Glow ring around spotlight */}
            <div
                className="absolute rounded-xl border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-pulse pointer-events-none"
                style={{
                    left: spotlightStyle.left,
                    top: spotlightStyle.top,
                    width: spotlightStyle.width,
                    height: spotlightStyle.height,
                }}
            />
        </div>
    );
};

// ============================================
// TOOLTIP/CARD COMPONENT
// ============================================

interface TooltipProps {
    step: TutorialStep;
    targetRect: DOMRect | null;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
    currentIndex: number;
    totalSteps: number;
    progress: number;
    soundEnabled: boolean;
    onToggleSound: () => void;
}

const TutorialTooltip: React.FC<TooltipProps> = ({
    step,
    targetRect,
    onNext,
    onPrev,
    onSkip,
    currentIndex,
    totalSteps: _totalSteps,
    progress,
    soundEnabled,
    onToggleSound
}) => {
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);
    const showNextButton = !step.waitForSelector && !step.waitForPath && !step.autoAdvanceDelay;

    useEffect(() => {
        if (!tooltipRef.current) return;

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const padding = 20;

        let left = 0;
        let top = 0;

        if (step.position === 'center' || !targetRect) {
            // Center on screen
            left = (viewport.width - tooltipRect.width) / 2;
            top = (viewport.height - tooltipRect.height) / 2;
        } else {
            // Position relative to target
            switch (step.position) {
                case 'bottom':
                    left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                    top = targetRect.bottom + padding;
                    break;
                case 'top':
                    left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                    top = targetRect.top - tooltipRect.height - padding;
                    break;
                case 'left':
                    left = targetRect.left - tooltipRect.width - padding;
                    top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                    break;
                case 'right':
                    left = targetRect.right + padding;
                    top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                    break;
            }

            // Keep within viewport
            left = Math.max(padding, Math.min(left, viewport.width - tooltipRect.width - padding));
            top = Math.max(padding, Math.min(top, viewport.height - tooltipRect.height - padding));
        }

        // Add some jitter/float effect offset
        setPosition({ left, top });
    }, [step, targetRect]);

    return (
        <div
            ref={tooltipRef}
            className="fixed z-[9995] w-96 max-w-[90vw] transition-all duration-500 ease-out animate-slide-up"
            style={{ left: position.left, top: position.top }}
        >
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-visible border border-gray-100 relative">

                {/* Floating Avatar - positioned absolutely relative to card */}
                <div className="absolute -top-10 -left-10 z-10 hidden sm:block">
                    <Avatar mood={step.avatarMood} />
                </div>

                {/* Sound Toggle */}
                <button
                    onClick={onToggleSound}
                    className="absolute -top-3 -right-3 p-1.5 bg-white rounded-full shadow-md text-gray-500 hover:text-blue-600 transition-colors z-20"
                    title={soundEnabled ? "Mute sound" : "Enable sound"}
                >
                    {soundEnabled ? (
                        <SpeakerWaveIcon className="w-4 h-4" />
                    ) : (
                        <SpeakerXMarkIcon className="w-4 h-4" />
                    )}
                </button>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-t-2xl overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Header */}
                <div className="px-6 pt-5 pl-12 flex items-start justify-between min-h-[60px]">
                    {/* sm:pl-12 accounts for avatar overlap on desktop, otherwise minimal padding */}
                    <div className="flex-1 ml-2 sm:ml-4">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                            {step.title}
                        </h3>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <p className="text-gray-600 leading-relaxed text-base">
                        {step.description}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSkip}
                            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider"
                        >
                            Skip
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Only show Prev if not first step */}
                        {currentIndex > 0 && (
                            <button
                                onClick={onPrev}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                        )}

                        {showNextButton && (
                            <button
                                onClick={onNext}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                                        font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 
                                        transition-all transform hover:scale-105 active:scale-95
                                        flex items-center gap-2 shadow-lg shadow-blue-500/25 animate-pulse"
                            >
                                <span>{step.actionLabel || 'Next'}</span>
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        )}

                        {!showNextButton && (
                            <div className="text-sm font-medium text-blue-600 italic animate-pulse px-4 py-2">
                                {step.actionLabel || 'Waiting for you...'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Arrow indicator pointing to target */}
            {step.showArrow && targetRect && (
                <div className="absolute animate-bounce z-0 pointer-events-none">
                    {step.position === 'bottom' && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
                        </div>
                    )}
                    {step.position === 'top' && (
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
                        </div>
                    )}
                    {step.position === 'left' && (
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2">
                            <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white" />
                        </div>
                    )}
                    {step.position === 'right' && (
                        <div className="absolute top-1/2 -left-4 -translate-y-1/2">
                            <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================
// MAIN TUTORIAL OVERLAY
// ============================================

// Helper to check if we're on mobile (< 1024px - lg breakpoint)
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

// Helper to resolve step with mobile overrides
const resolveStepForDevice = (step: TutorialStep, isMobile: boolean): TutorialStep => {
    if (!isMobile || !step.mobile) {
        return step;
    }

    return {
        ...step,
        targetSelector: step.mobile.targetSelector ?? step.targetSelector,
        interactionTarget: step.mobile.interactionTarget ?? step.interactionTarget,
        position: step.mobile.position ?? step.position,
        description: step.mobile.description ?? step.description,
        actionLabel: step.mobile.actionLabel ?? step.actionLabel,
        noOverlay: step.mobile.noOverlay ?? step.noOverlay,
    };
};

const TutorialOverlay: React.FC = () => {
    const {
        isActive,
        currentStep,
        currentStepIndex,
        totalSteps,
        progress,
        nextStep,
        prevStep,
        endTutorial,
        soundEnabled,
        toggleSound
    } = useTutorial();

    const navigate = useNavigate();
    const location = useLocation();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const isMobile = useIsMobile();

    // Resolve the current step with mobile overrides if applicable
    const resolvedStep = currentStep ? resolveStepForDevice(currentStep, isMobile) : null;



    useEffect(() => {
        if (!isActive) return;

        let retryCount = 0;
        const maxRetries = 10; // Keep trying for up to 1 second (10 x 100ms)
        let retryTimeout: ReturnType<typeof setTimeout>;

        const tryUpdateRect = () => {
            if (!resolvedStep?.targetSelector) {
                setTargetRect(null);
                return;
            }

            const element = document.querySelector(resolvedStep.targetSelector);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                // Don't scroll to center for bottom nav elements on mobile
                if (isMobile && resolvedStep.targetSelector.includes('mobile-')) {
                    // Bottom nav is fixed, no scrolling needed
                } else {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else if (retryCount < maxRetries) {
                // Element not found - retry after delay (useful for sidebar animation)
                retryCount++;
                retryTimeout = setTimeout(tryUpdateRect, 100);
            } else {
                setTargetRect(null);
            }
        };

        // Initial update with delay
        const timeout = setTimeout(tryUpdateRect, resolvedStep?.delay || 100);

        // Listen for window events
        const handleResize = () => {
            retryCount = 0; // Reset retry count on resize
            tryUpdateRect();
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true); // Capture scroll on any element

        return () => {
            clearTimeout(timeout);
            clearTimeout(retryTimeout);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
        };
    }, [isActive, resolvedStep, currentStepIndex, isMobile]); // Re-run when step or mobile changes

    // Handle navigation for steps that require specific pages
    useEffect(() => {
        if (!isActive || !currentStep?.requiredPage) return;

        if (!location.pathname.startsWith(currentStep.requiredPage)) {
            navigate(currentStep.requiredPage);
        }
    }, [isActive, currentStep, location.pathname, navigate]);

    // Handle confetti
    useEffect(() => {
        if (currentStep?.confetti) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                endTutorial();
            } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && !currentStep?.waitForSelector && !currentStep?.waitForPath) {
                // Only allow keyboard next if we are NOT waiting for interaction
                nextStep();
            } else if (e.key === 'ArrowLeft') {
                prevStep();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, nextStep, prevStep, endTutorial, currentStep]);

    if (!isActive || !resolvedStep) return null;

    return (
        <>
            {showConfetti && <Confetti />}

            <SpotlightOverlay
                targetRect={targetRect}
                padding={resolvedStep.highlightPadding ?? 12}
                allowInteraction={resolvedStep.interaction === 'click' || resolvedStep.interaction === 'auto'}
                noOverlay={resolvedStep.noOverlay}
            />

            <TutorialTooltip
                step={resolvedStep}
                targetRect={targetRect}
                onNext={nextStep}
                onPrev={prevStep}
                onSkip={endTutorial}
                currentIndex={currentStepIndex}
                totalSteps={totalSteps}
                progress={progress}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
            />
        </>
    );
};

export default TutorialOverlay;
