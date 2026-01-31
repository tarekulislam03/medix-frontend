import React from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface BillSummaryProps {
    subtotal: number;
    totalTax: number;
    totalDiscount: number;

    // Modifiable
    globalDiscount: number;
    doctorFees: number;
    otherCharges: number;
    doctorName: string;
    notes: string;
    paymentMethod: string;
    amountPaid: number;

    onChange: (field: string, value: any) => void;
    onCheckout: () => void;
    loading: boolean;
}

const BillSummary: React.FC<BillSummaryProps> = (props) => {
    // Calculate Grand Total
    // Backend Logic: subtotal + totalTax + doctorFees + otherCharges - globalDiscount;
    const grandTotal = props.subtotal + props.totalTax + props.doctorFees + props.otherCharges - props.globalDiscount;
    const change = Math.max(0, props.amountPaid - grandTotal);
    const balance = Math.max(0, grandTotal - props.amountPaid);

    return (
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border border-gray-200 lg:h-full flex flex-col gap-3 sm:gap-4 relative">
            {/* Progress Indicator - Hidden on mobile to save space */}
            <div className="hidden sm:flex items-center gap-2 mb-2">
                <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-md">1</div>
                    <div className="h-0.5 w-8 bg-blue-700"></div>
                </div>
                <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-md">2</div>
                    <div className="h-0.5 w-8 bg-gray-200"></div>
                </div>
                <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">3</div>
                </div>
                <span className="text-xs text-gray-500 ml-auto">Review & Pay</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 sm:pb-3">Order Summary</h2>

            {/* Fees & Adjustments - No scroll on mobile, scroll on desktop */}
            <div className="space-y-3 lg:flex-1 lg:overflow-auto">
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{props.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">₹{props.totalTax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm gap-2">
                        <span className="text-gray-600">Dr. Fees</span>
                        <input
                            type="number" min="0"
                            className="w-20 rounded border-gray-300 py-0 text-right text-sm focus:ring-blue-700 bg-white"
                            value={props.doctorFees}
                            onChange={(e) => props.onChange('doctorFees', Number(e.target.value))}
                        />
                    </div>
                    <div className="flex justify-between items-center text-sm gap-2">
                        <span className="text-gray-600">Other</span>
                        <input
                            type="number" min="0"
                            className="w-20 rounded border-gray-300 py-0 text-right text-sm focus:ring-blue-700 bg-white"
                            value={props.otherCharges}
                            onChange={(e) => props.onChange('otherCharges', Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 shadow-sm">
                        <span>Total</span>
                        <span className="text-blue-800">₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Section with Enhanced Separation */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                        <div className="mt-1 flex gap-2">
                            {['CASH', 'UPI', 'CARD'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => props.onChange('paymentMethod', method)}
                                    className={clsx(
                                        "flex-1 py-2.5 sm:py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 touch-manipulation min-h-[44px]",
                                        props.paymentMethod === method
                                            ? "bg-blue-700 text-white border-blue-700 shadow-md"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                    )}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid</label>
                        <div className="relative mt-1 rounded-lg shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                                type="number"
                                className="block w-full rounded-lg border-0 py-3 pl-7 pr-12 text-gray-900 ring-2 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-xl font-bold"
                                placeholder="0.00"
                                value={props.amountPaid}
                                onChange={(e) => props.onChange('amountPaid', Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {balance > 0 ? (
                        <div className="text-red-600 text-sm font-semibold text-right bg-red-50 p-2 rounded-lg">
                            Balance Due: ₹{balance.toFixed(2)}
                        </div>
                    ) : (
                        <div className="text-green-600 text-sm font-semibold text-right bg-green-50 p-2 rounded-lg">
                            Change: ₹{change.toFixed(2)}
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={props.onCheckout}
                disabled={props.loading || grandTotal === 0}
                className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-blue-800 px-4 py-4 text-base font-bold text-white shadow-lg hover:from-blue-800 hover:to-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all duration-200 hover:shadow-xl touch-manipulation min-h-[52px]"
            >
                {props.loading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="text-sm sm:text-base">Processing...</span>
                    </>
                ) : (
                    <>
                        <PrinterIcon className="h-5 w-5" />
                        <span className="text-sm sm:text-base">Complete & Print</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default BillSummary;
