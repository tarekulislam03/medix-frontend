import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { tutorialSounds } from '@/utils/tutorialSounds';

// ============================================
// TUTORIAL STEP TYPES
// ============================================

export type TutorialStepId =
    // Dashboard steps
    | 'welcome'
    | 'dashboard-overview'
    | 'dashboard-stats'
    | 'sidebar-navigation'
    // Inventory steps
    | 'go-to-inventory'
    | 'inventory-overview'
    | 'add-product-button'
    | 'add-product-form'
    | 'close-add-modal'
    | 'auto-import-button'
    | 'auto-import-explained'
    // POS steps
    | 'go-to-pos'
    | 'pos-overview'
    | 'search-product'
    | 'cart-overview'
    | 'customer-select'
    | 'checkout-section'
    // Customers
    | 'go-to-customers'
    | 'mobile-open-menu-customers' // Mobile: open sidebar then click customers
    | 'customers-overview'
    | 'add-customer'
    // Analytics
    | 'go-to-analytics'
    | 'analytics-overview'
    // Settings
    | 'go-to-settings'
    | 'mobile-open-menu-settings' // Mobile: open sidebar then click settings
    | 'settings-overview'
    // End
    | 'tutorial-complete';

export interface TutorialStep {
    id: TutorialStepId;
    title: string;
    description: string;
    targetSelector?: string; // CSS selector for element to highlight
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';

    // Interaction types
    interaction?: 'click' | 'navigate' | 'none' | 'auto';
    interactionTarget?: string; // Selector for clickable element (if different from highlight)
    waitForSelector?: string; // Wait for this selector to appear before auto-advancing
    waitForPath?: string; // Wait for navigation to this path

    actionLabel?: string;
    nextStep?: TutorialStepId;
    requiredPage?: string; // Page path required for this step
    highlightPadding?: number;
    showArrow?: boolean;
    noOverlay?: boolean; // Skip dark overlay - just show glow ring (useful for sidebar menus)

    // Effects
    confetti?: boolean;
    sound?: 'welcome' | 'step' | 'success' | 'click' | 'progress' | 'navigate';

    // Avatar mood
    avatarMood?: 'happy' | 'excited' | 'pointing' | 'thinking' | 'celebrating';

    delay?: number; // Delay before showing step
    autoAdvanceDelay?: number; // Auto-advance after this many ms

    // Mobile-specific overrides (used when screen width < 1024px)
    mobile?: {
        targetSelector?: string;
        interactionTarget?: string;
        position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
        description?: string;
        actionLabel?: string;
        noOverlay?: boolean;
    };
}

// ============================================
// TUTORIAL STEPS CONFIGURATION
// ============================================

export const TUTORIAL_STEPS: Record<TutorialStepId, TutorialStep> = {
    // === WELCOME ===
    'welcome': {
        id: 'welcome',
        title: "🎉 Welcome to MediX!",
        description: "Hi! I'm Max, your pharmacy assistant. Let me show you around MediX - your new pharmacy management system. It'll only take 2 minutes!",
        position: 'center',
        interaction: 'none',
        actionLabel: "Let's Start!",
        nextStep: 'dashboard-overview',
        confetti: true,
        sound: 'welcome',
        avatarMood: 'excited',
    },

    // === DASHBOARD ===
    'dashboard-overview': {
        id: 'dashboard-overview',
        title: "📊 Your Command Center",
        description: "This is your Dashboard - the heart of your pharmacy operations. You'll see all important metrics at a glance here.",
        targetSelector: '.dashboard-content',
        position: 'center',
        interaction: 'none',
        actionLabel: 'Next',
        nextStep: 'dashboard-stats',
        requiredPage: '/dashboard',
        sound: 'step',
        avatarMood: 'happy',
    },
    'dashboard-stats': {
        id: 'dashboard-stats',
        title: "💰 Key Metrics",
        description: "These cards show today's sales, monthly revenue, customers, and low stock alerts. Keep an eye on the red alerts!",
        targetSelector: '.stats-grid',
        position: 'bottom',
        interaction: 'none',
        actionLabel: 'Got it!',
        nextStep: 'sidebar-navigation',
        requiredPage: '/dashboard',
        showArrow: true,
        sound: 'step',
        avatarMood: 'pointing',
    },
    'sidebar-navigation': {
        id: 'sidebar-navigation',
        title: "🧭 Navigation",
        description: "Use this sidebar to navigate. Let's explore Inventory first - that's where you manage all your products!",
        targetSelector: '.sidebar',
        position: 'right',
        interaction: 'none',
        actionLabel: 'Next',
        nextStep: 'go-to-inventory',
        showArrow: true,
        sound: 'step',
        avatarMood: 'pointing',
        mobile: {
            targetSelector: '.mobile-bottom-nav',
            position: 'top',
            description: "Use this bottom navigation bar to access different sections. Let's explore Inventory first - that's where you manage all your products!",
        },
    },

    // === INVENTORY ===
    'go-to-inventory': {
        id: 'go-to-inventory',
        title: "📦 Click on Inventory",
        description: "Go ahead, click on 'Inventory' in the sidebar. I'll wait for you!",
        targetSelector: '[href="/inventory"]',
        position: 'right',
        interaction: 'click',
        interactionTarget: '[href="/inventory"]',
        waitForPath: '/inventory',
        actionLabel: 'Click Inventory →',
        nextStep: 'inventory-overview',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
        mobile: {
            targetSelector: '[data-tutorial-mobile="mobile-nav-inventory"]',
            interactionTarget: '[data-tutorial-mobile="mobile-nav-inventory"]',
            position: 'top',
            description: "Tap on 'Inventory' in the bottom bar. I'll wait for you!",
        },
    },
    'inventory-overview': {
        id: 'inventory-overview',
        title: "📋 Your Product Catalog",
        description: "Here you can see all your products, stock levels, prices, and expiry dates. Let me show you how to add products!",
        targetSelector: '.inventory-content',
        position: 'center',
        interaction: 'none',
        actionLabel: 'Show me!',
        nextStep: 'add-product-button',
        requiredPage: '/inventory',
        delay: 500,
        sound: 'navigate',
        avatarMood: 'happy',
    },
    'add-product-button': {
        id: 'add-product-button',
        title: "➕ Add a Product",
        description: "Click the 'Add Product' button to add products manually. Try clicking it!",
        targetSelector: '[data-tutorial="add-product"]',
        position: 'bottom',
        interaction: 'click',
        interactionTarget: '[data-tutorial="add-product"]',
        waitForSelector: '[role="dialog"]',
        actionLabel: 'Click to Add →',
        nextStep: 'add-product-form',
        requiredPage: '/inventory',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
    },
    'add-product-form': {
        id: 'add-product-form',
        title: "📝 Product Form",
        description: "Fill in the details here - product name, price, quantity, batch number, and expiry date. The MRP automatically becomes your selling price!",
        targetSelector: '[role="dialog"]',
        position: 'center',
        interaction: 'none',
        actionLabel: 'Got it! Close this',
        nextStep: 'close-add-modal',
        highlightPadding: 0,
        sound: 'step',
        avatarMood: 'happy',
    },
    'close-add-modal': {
        id: 'close-add-modal',
        title: "❌ Close the Form",
        description: "For now, click the X or Cancel to close this form. I'll show you a faster way to add products!",
        targetSelector: '[role="dialog"]',
        position: 'center',
        interaction: 'auto',
        // Note: Modal close is detected by a dedicated useEffect handler, no waitForSelector needed
        actionLabel: 'Close & Continue →',
        nextStep: 'auto-import-button',
        sound: 'step',
        avatarMood: 'thinking',
    },
    'auto-import-button': {
        id: 'auto-import-button',
        title: "📸 Magic Import Feature!",
        description: "THIS is the game-changer! Click 'Import From Supplier Bill' - you can take a photo of your bill and we'll extract ALL products automatically!",
        targetSelector: '[data-tutorial="import-invoice"]',
        position: 'bottom',
        interaction: 'none',
        actionLabel: 'Amazing! Next →',
        nextStep: 'auto-import-explained',
        requiredPage: '/inventory',
        showArrow: true,
        sound: 'progress',
        avatarMood: 'excited',
        delay: 500, // Wait for modal close animation to complete
    },
    'auto-import-explained': {
        id: 'auto-import-explained',
        title: "🤖 AI-Powered Import",
        description: "Just upload a photo of your supplier invoice, our AI reads it, and adds all products in seconds! No more manual typing. Now let's learn about billing!",
        position: 'center',
        interaction: 'none',
        actionLabel: 'Show me POS!',
        nextStep: 'go-to-pos',
        sound: 'step',
        avatarMood: 'celebrating',
    },

    // === POS ===
    'go-to-pos': {
        id: 'go-to-pos',
        title: "💳 Time to Sell!",
        description: "Click on 'POS / Billing' to create customer bills. This is where you'll spend most of your time!",
        targetSelector: '[href="/pos"]',
        position: 'right',
        interaction: 'click',
        interactionTarget: '[href="/pos"]',
        waitForPath: '/pos',
        actionLabel: 'Click POS →',
        nextStep: 'pos-overview',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
        mobile: {
            targetSelector: '[data-tutorial-mobile="mobile-nav-pos"]',
            interactionTarget: '[data-tutorial-mobile="mobile-nav-pos"]',
            position: 'top',
            description: "Tap on 'POS' in the bottom bar to create customer bills. This is where you'll spend most of your time!",
        },
    },
    'pos-overview': {
        id: 'pos-overview',
        title: "🛒 Point of Sale",
        description: "This is your billing counter! Search products on the left, see your cart on the right. Super fast and intuitive!",
        position: 'center',
        interaction: 'none',
        actionLabel: 'Show me more!',
        nextStep: 'search-product',
        requiredPage: '/pos',
        delay: 500,
        sound: 'navigate',
        avatarMood: 'happy',
    },
    'search-product': {
        id: 'search-product',
        title: "🔍 Search Products",
        description: "Type a product name here to search. You can also connect a barcode scanner - it works automatically! Products appear instantly as you type.",
        targetSelector: '[data-tutorial="product-search"]',
        position: 'bottom',
        interaction: 'none',
        actionLabel: 'Next',
        nextStep: 'cart-overview',
        requiredPage: '/pos',
        showArrow: true,
        sound: 'step',
        avatarMood: 'pointing',
    },
    'cart-overview': {
        id: 'cart-overview',
        title: "🛒 Your Cart",
        description: "When you add products, they appear here. You can adjust quantities, apply discounts to individual items, and see the running total!",
        targetSelector: '[data-tutorial="cart"]',
        position: 'left',
        interaction: 'none',
        actionLabel: 'Next',
        nextStep: 'customer-select',
        requiredPage: '/pos',
        showArrow: true,
        sound: 'step',
        avatarMood: 'happy',
    },
    'customer-select': {
        id: 'customer-select',
        title: "👤 Select Customer",
        description: "Choose a customer from your database, or leave it empty for walk-in customers. Regular customers' purchase history is tracked automatically!",
        targetSelector: '[data-tutorial="customer-select"]',
        position: 'bottom',
        interaction: 'none',
        actionLabel: 'Next',
        nextStep: 'checkout-section',
        requiredPage: '/pos',
        showArrow: true,
        sound: 'step',
        avatarMood: 'pointing',
    },
    'checkout-section': {
        id: 'checkout-section',
        title: "💵 Complete the Sale",
        description: "Add any discounts, select payment method, and click 'Charge' to complete! The bill will print automatically. Now let's see customer management!",
        targetSelector: '[data-tutorial="charge-btn"]',
        position: 'left',
        interaction: 'none',
        actionLabel: 'Show Customers →',
        nextStep: 'go-to-customers',
        requiredPage: '/pos',
        showArrow: true,
        sound: 'progress',
        avatarMood: 'excited',
    },

    // === CUSTOMERS ===
    'go-to-customers': {
        id: 'go-to-customers',
        title: "👥 Customer Database",
        description: "Click on 'Customers' to manage your customer list and track their purchase history!",
        targetSelector: '[href="/customers"]',
        position: 'right',
        interaction: 'click',
        interactionTarget: '[href="/customers"]',
        waitForPath: '/customers',
        actionLabel: 'Click Customers →',
        nextStep: 'customers-overview',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
        mobile: {
            targetSelector: '[data-tutorial-mobile="mobile-nav-more"]',
            interactionTarget: '[data-tutorial-mobile="mobile-nav-more"]',
            position: 'top',
            description: "First, tap on 'More' to open the menu.",
            actionLabel: 'Tap More →',
        },
        // On mobile, this step waits for sidebar to open, then we need another step
    },
    'mobile-open-menu-customers': {
        id: 'mobile-open-menu-customers',
        title: "👥 Now tap Customers",
        description: "Great! Now tap on 'Customers' in the menu to manage your customer list.",
        targetSelector: '[href="/customers"]',
        position: 'bottom', // Position below menu items so they're visible
        interaction: 'click',
        interactionTarget: '[href="/customers"]',
        waitForPath: '/customers',
        actionLabel: 'Tap Customers →',
        nextStep: 'customers-overview',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
        delay: 500, // Wait for sidebar animation
        noOverlay: true, // Don't block sidebar - just show glow ring
    },
    'customers-overview': {
        id: 'customers-overview',
        title: "📇 Your Customers",
        description: "See all your customers here with their contact info and purchase history. Building relationships is key to a successful pharmacy!",
        position: 'center',
        interaction: 'none',
        actionLabel: 'Next',
        nextStep: 'add-customer',
        requiredPage: '/customers',
        delay: 500,
        sound: 'navigate',
        avatarMood: 'happy',
    },
    'add-customer': {
        id: 'add-customer',
        title: "➕ Add New Customer",
        description: "Click here to add a new customer anytime. You can also add customers directly from POS while billing!",
        targetSelector: '[data-tutorial="add-customer"]',
        position: 'bottom',
        interaction: 'none',
        actionLabel: 'Show Analytics →',
        nextStep: 'go-to-analytics',
        requiredPage: '/customers',
        showArrow: true,
        sound: 'step',
        avatarMood: 'pointing',
    },

    // === ANALYTICS ===
    'go-to-analytics': {
        id: 'go-to-analytics',
        title: "📈 Business Insights",
        description: "Click on 'Analytics' to see charts, reports, and insights about your business performance!",
        targetSelector: '[href="/analytics"]',
        position: 'right',
        interaction: 'click',
        interactionTarget: '[href="/analytics"]',
        waitForPath: '/analytics',
        actionLabel: 'Click Analytics →',
        nextStep: 'analytics-overview',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
        mobile: {
            targetSelector: '[data-tutorial-mobile="mobile-nav-analytics"]',
            interactionTarget: '[data-tutorial-mobile="mobile-nav-analytics"]',
            position: 'top',
            description: "Tap on 'Analytics' in the bottom bar to see charts and business insights!",
        },
    },
    'analytics-overview': {
        id: 'analytics-overview',
        title: "📊 Reports & Charts",
        description: "View sales trends, top products, profit margins, and more. Use these insights to make smart business decisions! One last stop - Settings!",
        position: 'center',
        interaction: 'none',
        actionLabel: 'Show Settings →',
        nextStep: 'go-to-settings',
        requiredPage: '/analytics',
        delay: 500,
        sound: 'navigate',
        avatarMood: 'happy',
    },

    // === SETTINGS ===
    'go-to-settings': {
        id: 'go-to-settings',
        title: "⚙️ Configure MediX",
        description: "Click on 'Settings' to customize your store details, GST info, and preferences!",
        targetSelector: '[href="/settings"]',
        position: 'right',
        interaction: 'click',
        interactionTarget: '[href="/settings"]',
        waitForPath: '/settings',
        actionLabel: 'Click Settings →',
        nextStep: 'settings-overview',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
        mobile: {
            targetSelector: '[data-tutorial-mobile="mobile-nav-more"]',
            interactionTarget: '[data-tutorial-mobile="mobile-nav-more"]',
            position: 'top',
            description: "First, tap on 'More' to open the menu.",
            actionLabel: 'Tap More →',
        },
    },
    'mobile-open-menu-settings': {
        id: 'mobile-open-menu-settings',
        title: "⚙️ Now tap Settings",
        description: "Great! Now tap on 'Settings' in the menu to customize your store.",
        targetSelector: '[href="/settings"]',
        position: 'bottom', // Position below menu items so they're visible
        interaction: 'click',
        interactionTarget: '[href="/settings"]',
        waitForPath: '/settings',
        actionLabel: 'Tap Settings →',
        nextStep: 'settings-overview',
        showArrow: true,
        sound: 'click',
        avatarMood: 'pointing',
        delay: 500, // Wait for sidebar animation
        noOverlay: true, // Don't block sidebar - just show glow ring
    },
    'settings-overview': {
        id: 'settings-overview',
        title: "🔧 Your Settings",
        description: "Configure your store name, address, GST details, and print templates here. That's everything! Ready to get started?",
        position: 'center',
        interaction: 'none',
        actionLabel: "I'm Ready! 🚀",
        nextStep: 'tutorial-complete',
        requiredPage: '/settings',
        delay: 500,
        sound: 'progress',
        avatarMood: 'excited',
    },

    // === COMPLETE ===
    'tutorial-complete': {
        id: 'tutorial-complete',
        title: "🎊 You're All Set!",
        description: "Congratulations! You now know how to use MediX. Remember, I'm always here - just click 'Take Tour' from the Dashboard or Help page anytime. Happy selling!",
        position: 'center',
        interaction: 'none',
        actionLabel: 'Start Using MediX!',
        confetti: true,
        sound: 'success',
        avatarMood: 'celebrating',
    },
};

// Tutorial flow order
export const TUTORIAL_FLOW: TutorialStepId[] = [
    'welcome',
    'dashboard-overview',
    'dashboard-stats',
    'sidebar-navigation',
    'go-to-inventory',
    'inventory-overview',
    'add-product-button',
    'add-product-form',
    'close-add-modal',
    'auto-import-button',
    'auto-import-explained',
    'go-to-pos',
    'pos-overview',
    'search-product',
    'cart-overview',
    'customer-select',
    'checkout-section',
    'go-to-customers',
    'mobile-open-menu-customers', // Mobile: intermediate step after tapping More
    'customers-overview',
    'add-customer',
    'go-to-analytics',
    'analytics-overview',
    'go-to-settings',
    'mobile-open-menu-settings', // Mobile: intermediate step after tapping More
    'settings-overview',
    'tutorial-complete',
];

// ============================================
// TUTORIAL CONTEXT
// ============================================

interface TutorialContextValue {
    isActive: boolean;
    currentStep: TutorialStep | null;
    currentStepIndex: number;
    totalSteps: number;
    progress: number; // 0-100
    soundEnabled: boolean;

    // Actions
    startTutorial: () => void;
    endTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipToStep: (stepId: TutorialStepId) => void;
    toggleSound: () => void;

    // For interaction detection
    notifyInteraction: (selector: string) => void;
    notifyNavigation: (path: string) => void;
    notifyModalOpen: (selector: string) => void;
    notifyModalClose: () => void;

    // Check if tutorial should show for new users
    hasSeenTutorial: boolean;
    markTutorialAsSeen: () => void;
}

const TutorialContext = createContext<TutorialContextValue | undefined>(undefined);

// ============================================
// TUTORIAL PROVIDER
// ============================================

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [hasSeenTutorial, setHasSeenTutorial] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
    const location = useLocation();

    // Detect mobile on resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check localStorage on mount
    useEffect(() => {
        const seen = localStorage.getItem('medix_tutorial_seen');
        if (!seen) {
            setHasSeenTutorial(false);
        }

        const soundPref = localStorage.getItem('medix_tutorial_sound');
        if (soundPref === 'false') {
            setSoundEnabled(false);
            tutorialSounds.setEnabled(false);
        }
    }, []);

    const currentStep = isActive ? TUTORIAL_STEPS[TUTORIAL_FLOW[currentStepIndex]] : null;
    const totalSteps = TUTORIAL_FLOW.length;
    const progress = ((currentStepIndex + 1) / totalSteps) * 100;

    // Play sound when step changes
    useEffect(() => {
        if (!isActive || !currentStep?.sound) return;

        const soundDelay = currentStep.delay || 0;
        const timer = setTimeout(() => {
            switch (currentStep.sound) {
                case 'welcome':
                    tutorialSounds.playWelcome();
                    break;
                case 'step':
                    tutorialSounds.playStep();
                    break;
                case 'success':
                    tutorialSounds.playSuccess();
                    break;
                case 'click':
                    tutorialSounds.playClick();
                    break;
                case 'progress':
                    tutorialSounds.playProgress();
                    break;
                case 'navigate':
                    tutorialSounds.playNavigate();
                    break;
            }
        }, soundDelay + 100);

        return () => clearTimeout(timer);
    }, [isActive, currentStep, currentStepIndex]);

    const startTutorial = useCallback(() => {
        setCurrentStepIndex(0);
        setIsActive(true);
    }, []);

    const endTutorial = useCallback(() => {
        setIsActive(false);
        setCurrentStepIndex(0);
        localStorage.setItem('medix_tutorial_seen', 'true');
        setHasSeenTutorial(true);
    }, []);

    const nextStep = useCallback(() => {
        if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            endTutorial();
        }
    }, [currentStepIndex, totalSteps, endTutorial]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    const skipToStep = useCallback((stepId: TutorialStepId) => {
        const index = TUTORIAL_FLOW.indexOf(stepId);
        if (index !== -1) {
            setCurrentStepIndex(index);
        }
    }, []);

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => {
            const newValue = !prev;
            localStorage.setItem('medix_tutorial_sound', String(newValue));
            tutorialSounds.setEnabled(newValue);
            return newValue;
        });
    }, []);

    // Auto-detect Navigation
    useEffect(() => {
        if (!isActive || !currentStep?.waitForPath) return;

        if (location.pathname.startsWith(currentStep.waitForPath)) {
            // Add a small delay for the page to render
            setTimeout(() => {
                nextStep();
            }, 500);
        }
    }, [location.pathname, isActive, currentStep, nextStep]);

    // Auto-detect Clicks (with mobile support)
    useEffect(() => {
        if (!isActive || !currentStep) return;

        // Get the appropriate interaction target based on device
        const interactionTarget = isMobile && currentStep.mobile?.interactionTarget
            ? currentStep.mobile.interactionTarget
            : currentStep.interactionTarget;

        if (!interactionTarget) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.closest(interactionTarget)) {
                // User clicked the correct element!
                tutorialSounds.playClick();

                // Special handling for mobile menu flow
                // When on mobile clicking "More" for customers/settings, go to intermediate step
                if (isMobile && interactionTarget.includes('mobile-nav-more')) {
                    if (currentStep.id === 'go-to-customers') {
                        // Go to mobile sidebar customers step
                        setTimeout(() => skipToStep('mobile-open-menu-customers'), 300);
                        return;
                    } else if (currentStep.id === 'go-to-settings') {
                        // Go to mobile sidebar settings step
                        setTimeout(() => skipToStep('mobile-open-menu-settings'), 300);
                        return;
                    }
                }

                // If the step just wants a click and doesn't wait for other things
                if (!currentStep.waitForSelector && !currentStep.waitForPath && !currentStep.autoAdvanceDelay) {
                    setTimeout(() => nextStep(), 300);
                }
            }
        };

        window.addEventListener('click', handleClick, true);
        return () => window.removeEventListener('click', handleClick, true);
    }, [isActive, currentStep, nextStep, skipToStep, isMobile]);

    // Auto-detect Modal/Element Appearance
    useEffect(() => {
        if (!isActive || !currentStep?.waitForSelector) return;

        const checkExist = setInterval(() => {
            const element = document.querySelector(currentStep.waitForSelector!);
            if (element) {
                clearInterval(checkExist);
                setTimeout(() => nextStep(), 500);
            }
        }, 200);

        return () => clearInterval(checkExist);
    }, [isActive, currentStep, nextStep]);

    // Auto-advance
    useEffect(() => {
        if (!isActive || !currentStep?.autoAdvanceDelay || currentStep.waitForSelector) return;

        const timer = setTimeout(() => {
            nextStep();
        }, currentStep.autoAdvanceDelay);
        return () => clearTimeout(timer);
    }, [isActive, currentStep, nextStep]);

    // Manual notifications (kept for specific edge cases or manual instrumentation)
    const notifyInteraction = useCallback((_selector: string) => {
        // handled by global listener
    }, []);

    const notifyNavigation = useCallback((_path: string) => {
        // handled by useLocation
    }, []);

    const notifyModalOpen = useCallback((_selector: string) => {
        // handled by polling
    }, []);

    const notifyModalClose = useCallback(() => {
        // handled by polling
    }, []);

    // Check if modal closes for specific step (close-add-modal)
    useEffect(() => {
        if (!isActive || currentStep?.id !== 'close-add-modal') return;

        const checkGone = setInterval(() => {
            const dialog = document.querySelector('[role="dialog"]');
            if (!dialog) {
                clearInterval(checkGone);
                setTimeout(() => nextStep(), 300);
            }
        }, 200);

        return () => clearInterval(checkGone);
    }, [isActive, currentStep, nextStep]);

    const markTutorialAsSeen = useCallback(() => {
        localStorage.setItem('medix_tutorial_seen', 'true');
        setHasSeenTutorial(true);
    }, []);

    return (
        <TutorialContext.Provider
            value={{
                isActive,
                currentStep,
                currentStepIndex,
                totalSteps,
                progress,
                soundEnabled,
                startTutorial,
                endTutorial,
                nextStep,
                prevStep,
                skipToStep,
                toggleSound,
                notifyInteraction,
                notifyNavigation,
                notifyModalOpen,
                notifyModalClose,
                hasSeenTutorial,
                markTutorialAsSeen,
            }}
        >
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = (): TutorialContextValue => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within TutorialProvider');
    }
    return context;
};

export default TutorialContext;
