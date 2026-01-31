
import React, { useState, useMemo } from 'react';
import ProductSearch from '@/components/pos/ProductSearch';
import CustomerSelect from '@/components/pos/CustomerSelect';
import Cart from '@/components/pos/Cart';
import BillSummary from '@/components/pos/BillSummary';
import type { CartItem, Product, Customer } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useConfirmation } from '@/context/ConfirmationContext';
import AddCustomerModal from '@/components/customers/AddCustomerModal';

// Helper to calculate item totals
const recalculateItem = (item: CartItem) => {
    const gross = item.cartPrice * item.cartQuantity;
    const discount = (gross * item.discountPercent) / 100;
    const taxable = gross - discount;
    const tax = (taxable * item.taxPercent) / 100;
    item.taxAmount = tax;
    item.totalAmount = taxable + tax;
};

const POS: React.FC = () => {
    const { confirm } = useConfirmation();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

    // Fees & Payment
    const [globalDiscount, setGlobalDiscount] = useState(0);
    const [doctorFees, setDoctorFees] = useState(0);
    const [otherCharges, setOtherCharges] = useState(0);
    const [doctorName, setDoctorName] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [amountPaid, setAmountPaid] = useState(0);

    const [loading, setLoading] = useState(false);

    // Computed Totals
    const { subtotal, totalTax, totalDiscount } = useMemo(() => {
        let subtotal = 0;
        let totalTax = 0;
        let totalDiscount = 0;

        cart.forEach(item => {
            const gross = item.cartPrice * item.cartQuantity;
            const discount = (gross * item.discountPercent) / 100;
            const taxable = gross - discount;
            const tax = (taxable * item.taxPercent) / 100;

            subtotal += taxable;
            totalTax += tax;
            totalDiscount += discount;
        });

        return { subtotal, totalTax, totalDiscount };
    }, [cart]);

    const handleSelectProduct = React.useCallback((product: Product) => {
        setCart(prev => {
            const existing = prev.findIndex(p => p.id === product.id);
            if (existing >= 0) {
                // Increment
                const updated = [...prev];
                const item = updated[existing];
                // Check stock?
                if (item.cartQuantity < item.quantity) {
                    item.cartQuantity += 1;
                    const gross = item.cartPrice * item.cartQuantity;
                    const discount = (gross * item.discountPercent) / 100;
                    const taxable = gross - discount;
                    const tax = (taxable * item.taxPercent) / 100;
                    item.taxAmount = tax;
                    item.totalAmount = taxable + tax;
                } else {
                    toast.error(`Max stock reached for ${item.name}`);
                }
                return updated;
            } else {
                // Add new
                const gross = Number(product.sellingPrice) * 1;
                const discount = 0;
                const taxable = gross - discount;
                const tax = (taxable * (Number(product.taxPercent) || 0)) / 100;

                const newItem: CartItem = {
                    ...product,
                    cartQuantity: 1,
                    cartPrice: Number(product.sellingPrice),
                    discountPercent: 0,
                    taxAmount: tax,
                    totalAmount: taxable + tax,
                };
                return [...prev, newItem];
            }
        });
    }, []); // Dependencies empty as setCart is stable

    const handleUpdateCartItem = React.useCallback((index: number, updates: Partial<CartItem>) => {
        setCart(prev => {
            const updated = [...prev];
            const item = { ...updated[index], ...updates };

            const gross = item.cartPrice * item.cartQuantity;
            const discount = (gross * item.discountPercent) / 100;
            const taxable = gross - discount;
            const tax = (taxable * item.taxPercent) / 100;
            item.taxAmount = tax;
            item.totalAmount = taxable + tax;

            updated[index] = item;
            return updated;
        });
    }, []);

    const handleRemoveItem = React.useCallback((index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const payload = {
                customerId: selectedCustomer?.id,
                items: cart.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    productSku: item.sku,
                    quantity: item.cartQuantity,
                    unitPrice: item.cartPrice,
                    discountPercent: item.discountPercent,
                    taxPercent: item.taxPercent
                })),
                paymentMethod,
                amountPaid, // Backend will check if this covers total.
                discountAmount: globalDiscount,
                doctorFees,
                otherCharges,
                doctorName,
                notes
            };

            const res = await api.post('/billing/bills', payload);
            const billId = res.data.data.id;

            // Open print dialog using hidden iframe
            try {
                // Get configured bill width
                const savedWidth = localStorage.getItem('bill_width') || '80mm';

                const htmlResponse = await api.get(`/printing/bills/${billId}/html`, {
                    params: { size: savedWidth },
                    responseType: 'text'
                });

                const htmlContent = htmlResponse.data;

                // Create hidden iframe for printing
                const iframe = document.createElement('iframe');
                iframe.style.position = 'fixed';
                iframe.style.right = '0';
                iframe.style.bottom = '0';
                iframe.style.width = '0px';
                iframe.style.height = '0px';
                iframe.style.border = '0';
                document.body.appendChild(iframe);

                const doc = iframe.contentWindow?.document;
                if (doc) {
                    doc.open();
                    doc.write(htmlContent);
                    // Add script to print and then remove iframe
                    // We use extensive timeout to ensure print dialog has time to open/process before removal
                    // Although removal might be blocked until dialog closes in some browsers
                    doc.write(`
                        <script>
                            window.onload = function() {
                                window.print();
                                // Optional: notify parent or close?
                                // The iframe will remain in DOM until refreshed or we remove it.
                                // It's safer to remove it after a delay.
                            }
                        </script>
                    `);
                    doc.close();

                    // Cleanup iframe after 1 minute (sufficient time for user to print)
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                    }, 60000);

                    toast.success('Bill created! Printing...');
                }
            } catch (printError: any) {
                console.error('Print generation failed:', printError);
                toast.error('Bill created, but print failed.');
            }

            // Reset
            setCart([]);
            setSelectedCustomer(null);
            setAmountPaid(0);
            setGlobalDiscount(0);
            setDoctorFees(0);
            setOtherCharges(0);
            setDoctorName('');
            setNotes('');

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Checkout Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCustomer = async (customer: Customer | null) => {
        setSelectedCustomer(customer);

        if (customer && cart.length === 0) {
            // Check for previous bill items if cart is empty
            try {
                const response = await api.get(`/customers/${customer.id}/last-bill-items`);
                const items = response.data.data;

                if (items && items.length > 0) {
                    // Ask user confirmation
                    const confirmFill = await confirm(
                        `Found ${items.length} items from ${customer.firstName}'s last bill. Add them to current bill?`,
                        'Load Previous Items',
                        'info'
                    );

                    if (confirmFill) {
                        const newCartItems: CartItem[] = items.map((item: any) => {
                            const newItem: CartItem = {
                                id: item.productId,
                                name: item.productName,
                                sku: item.productSku,
                                sellingPrice: Number(item.product.sellingPrice),
                                mrp: Number(item.product.mrp),
                                quantity: Number(item.product.quantity), // Current stock
                                unit: item.product.unit,
                                isActive: item.product.isActive,
                                category: item.product.category || 'General',

                                // Missing required Product fields
                                costPrice: 0,
                                minStockLevel: 0,
                                reorderLevel: 0,
                                taxPercent: Number(item.product.taxPercent || 0),

                                // Cart specifics
                                cartQuantity: Number(item.quantity), // Use quantity from last bill
                                cartPrice: Number(item.product.sellingPrice), // Use CURRENT selling price
                                discountPercent: 0, // Reset discount
                                taxAmount: 0,
                                totalAmount: 0
                            };
                            recalculateItem(newItem);
                            return newItem;
                        });

                        setCart(newCartItems);
                        toast.success('Items loaded from history');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch last bill items', error);
            }
        }
    };

    return (
        <div className="min-h-0 lg:h-[calc(100vh-6rem)] flex flex-col gap-3 sm:gap-4 pb-4 lg:pb-0">
            {/* Top Bar: Search & Customer - Stack on mobile */}
            <div className="flex flex-col gap-3 sm:gap-4 flex-shrink-0">
                {/* Product Search - Full width and prominent on mobile */}
                <div className="w-full" id="pos-product-search" data-tutorial="product-search">
                    <ProductSearch onSelectProduct={handleSelectProduct} />
                </div>
                {/* Customer Select */}
                <div className="w-full" id="pos-customer-select" data-tutorial="customer-select">
                    <CustomerSelect
                        selectedCustomer={selectedCustomer}
                        onSelectCustomer={handleSelectCustomer}
                        onAddNew={() => setIsAddCustomerModalOpen(true)}
                    />
                    <AddCustomerModal
                        isOpen={isAddCustomerModalOpen}
                        onClose={() => setIsAddCustomerModalOpen(false)}
                        onSuccess={() => {
                            setIsAddCustomerModalOpen(false);
                            toast.success('Customer added successfully! You can now search for them.');
                        }}
                    />
                </div>
            </div>

            {/* Main Content: Cart & Summary - Stack on mobile, side by side on desktop */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 flex-1 lg:overflow-hidden" id="pos-cart-section" data-tutorial="cart">
                {/* Cart Table - Compact on mobile, priority on desktop */}
                <div className="lg:flex-[2] lg:overflow-hidden min-h-[180px] lg:min-h-[300px]">
                    <Cart
                        items={cart}
                        onUpdateItem={handleUpdateCartItem}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>

                {/* Order Summary - Expanded on mobile, no scroll needed */}
                <div className="lg:flex-1 lg:min-w-[320px] lg:overflow-auto" id="pos-checkout-section" data-tutorial="charge-btn">
                    <BillSummary
                        subtotal={subtotal}
                        totalTax={totalTax}
                        totalDiscount={totalDiscount}
                        globalDiscount={globalDiscount}
                        doctorFees={doctorFees}
                        otherCharges={otherCharges}
                        doctorName={doctorName}
                        notes={notes}
                        paymentMethod={paymentMethod}
                        amountPaid={amountPaid}
                        onChange={(field, value) => {
                            switch (field) {
                                case 'globalDiscount': setGlobalDiscount(value); break;
                                case 'doctorFees': setDoctorFees(value); break;
                                case 'otherCharges': setOtherCharges(value); break;
                                case 'doctorName': setDoctorName(value); break;
                                case 'notes': setNotes(value); break;
                                case 'paymentMethod': setPaymentMethod(value); break;
                                case 'amountPaid': setAmountPaid(value); break;
                            }
                        }}
                        onCheckout={handleCheckout}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default POS;

