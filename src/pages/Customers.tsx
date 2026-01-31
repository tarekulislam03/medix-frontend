
import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    ShoppingBagIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { getCustomers, deleteCustomer, type Customer } from '@/services/customer';
import AddCustomerModal from '@/components/customers/AddCustomerModal';
import CustomerHistoryModal from '@/components/customers/CustomerHistoryModal';
import toast from 'react-hot-toast';
import { useConfirmation } from '@/context/ConfirmationContext';

const Customers: React.FC = () => {
    const { confirm } = useConfirmation();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, [page, searchTerm]);  // Re-fetch when page or search changes

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Debounce could be added for search
            const data = await getCustomers(page, 10, searchTerm);
            setCustomers(data.data);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerAdded = () => {
        // If editing, maybe stay on same page? But for simplicity, we refresh
        if (editingCustomer) {
            fetchCustomers();
        } else {
            setPage(1);
            setSearchTerm('');
            fetchCustomers();
        }
        setEditingCustomer(null); // Clear editing state implies modal closed
    };

    const handleViewHistory = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsHistoryModalOpen(true);
    };

    const handleEditClick = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (customer: Customer) => {
        const isConfirmed = await confirm(
            `Are you sure you want to delete customer "${customer.firstName} ${customer.lastName || ''}"?`,
            'Delete Customer',
            'danger'
        );

        if (isConfirmed) {
            try {
                await deleteCustomer(customer.id);
                toast.success('Customer deleted successfully');
                fetchCustomers();
            } catch (error: any) {
                console.error('Failed to delete customer', error);
                toast.error(error.response?.data?.message || 'Failed to delete customer. They may have associated bills.');
            }
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Stack on mobile */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customers</h1>
                <button
                    id="add-customer-btn"
                    data-tutorial="add-customer"
                    onClick={() => {
                        setEditingCustomer(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Customer
                </button>
            </div>

            {/* Search - Full width on mobile */}
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Name or Phone..."
                        className="block w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm transition-shadow touch-manipulation"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                        <div className="h-3 bg-gray-100 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : customers.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                        <p className="text-sm text-gray-500">No customers found.</p>
                    </div>
                ) : (
                    customers.map((customer) => (
                        <div key={customer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 touch-manipulation">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                    {customer.firstName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {customer.firstName} {customer.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{customer.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Total Purchases</p>
                                    <p className="text-sm font-semibold text-gray-900">₹{Number(customer.totalPurchases).toLocaleString('en-IN')}</p>
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleViewHistory(customer)}
                                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg touch-manipulation"
                                        title="View History"
                                    >
                                        <ShoppingBagIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(customer)}
                                        className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-lg touch-manipulation"
                                        title="Edit"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(customer)}
                                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg touch-manipulation"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" id="customers-table-container">
                <div className="overflow-x-auto table-scroll-mobile">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Info</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Total Purchases</th>
                                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Loading customers...
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                                    {customer.firstName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.firstName} {customer.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {customer.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {customer.phone}
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium hidden md:table-cell">
                                            ₹{Number(customer.totalPurchases).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                {formatDate(customer.updatedAt)}
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleViewHistory(customer)}
                                                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                                                    title="View History"
                                                >
                                                    <ShoppingBagIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(customer)}
                                                    className="text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded-lg transition-colors touch-manipulation"
                                                    title="Edit Customer"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(customer)}
                                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                                                    title="Delete Customer"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Mobile friendly */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-700">
                            Page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.totalPages}</span>
                        </p>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 touch-manipulation min-h-[44px]"
                            >
                                Prev
                            </button>
                            <button
                                disabled={page === pagination.totalPages}
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 touch-manipulation min-h-[44px]"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Mobile Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="sm:hidden flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-700">
                        Page <span className="font-medium">{pagination.page}</span> / <span className="font-medium">{pagination.totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 touch-manipulation"
                        >
                            Prev
                        </button>
                        <button
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 touch-manipulation"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddCustomerModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingCustomer(null);
                }}
                onSuccess={handleCustomerAdded}
                customerToEdit={editingCustomer}
            />

            <CustomerHistoryModal
                customer={selectedCustomer}
                isOpen={isHistoryModalOpen}
                onClose={() => {
                    setIsHistoryModalOpen(false);
                    setSelectedCustomer(null);
                }}
            />
        </div>
    );
};

export default Customers;
