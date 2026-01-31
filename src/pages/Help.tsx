import React from 'react';
import { SparklesIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useTutorial } from '@/context/TutorialContext';

const Help: React.FC = () => {
    const { startTutorial } = useTutorial();

    return (
        <div className="space-y-6" id="help-container">
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>

            {/* Take Tour Card */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <PlayIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">Interactive Product Tour</h2>
                        <p className="text-purple-100 mt-1">
                            New to MediX? Take our guided tour to learn all the features and get started quickly!
                        </p>
                    </div>
                    <button
                        onClick={startTutorial}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold 
                                   rounded-lg hover:bg-purple-50 transition-all shadow-lg
                                   transform hover:scale-105 active:scale-95"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        Start Tour
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group border-b border-gray-100 pb-4">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-blue-600">
                            <span>How do I add a new product?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p className="text-gray-600 mt-2 group-open:animate-fadeIn text-sm leading-relaxed">
                            Go to the <strong>Inventory</strong> page from the sidebar and click the "Add Product" button. Fill in the required details including product name, price, SKU, and stock level. You can also use the <strong>Import From Supplier Bill</strong> feature to automatically extract products from invoice photos!
                        </p>
                    </details>
                    <details className="group border-b border-gray-100 pb-4">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-blue-600">
                            <span>How do I generate a bill?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p className="text-gray-600 mt-2 group-open:animate-fadeIn text-sm leading-relaxed">
                            Navigate to the <strong>POS</strong> page. Search for products in the left panel, add them to the cart, select a customer (optional), and click "Proceed to Pay" to complete the transaction.
                        </p>
                    </details>
                    <details className="group border-b border-gray-100 pb-4">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-blue-600">
                            <span>Can I add walk-in customers?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p className="text-gray-600 mt-2 group-open:animate-fadeIn text-sm leading-relaxed">
                            Yes. In the POS screen, if you don't select a customer, the bill will be assigned to a generic "Walk-in Customer". You can also create a new customer on the fly using the "+" button in the customer search.
                        </p>
                    </details>
                    <details className="group border-b border-gray-100 pb-4">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 hover:text-blue-600">
                            <span>How do I import products from supplier bills?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p className="text-gray-600 mt-2 group-open:animate-fadeIn text-sm leading-relaxed">
                            Go to <strong>Inventory</strong> and click "Import From Supplier Bill". Upload a photo of your supplier invoice, and our AI will automatically extract product details. Review the extracted data, make any corrections, and click Import to add all products at once!
                        </p>
                    </details>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <h3 className="text-blue-900 font-medium text-lg">Need more help?</h3>
                <p className="text-blue-700 mt-1">Contact our support team for assistance with any issues.</p>
                <div className="mt-4">
                    <a href="mailto:support@medix.com" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Help;

