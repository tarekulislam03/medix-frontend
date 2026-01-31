import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import api from '@/services/api';
import type { Product } from '@/types';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import ImportInvoiceModal from './ImportInvoiceModal';
import toast from 'react-hot-toast';

const InventoryList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'lowStock' | 'expiring'>('all');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchTerm,
            };

            if (filter === 'lowStock') params.lowStock = 'true';
            if (filter === 'expiring') params.expiring = 'true';

            const response = await api.get('/products', { params });
            setProducts(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filter, pagination.page]);

    const toggleFilter = (newFilter: 'all' | 'lowStock' | 'expiring') => {
        setFilter(prev => prev === newFilter ? 'all' : newFilter);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (productId: string) => {
        try {
            await api.delete(`/products/${productId}`);
            // Remove from local state for smooth UX (no full refetch)
            setProducts(prev => prev.filter(p => p.id !== productId));
            setPagination(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            setDeleteConfirm(null);
            toast.success('Product deleted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 inventory-content">
            {/* Header & Actions - Stack on mobile */}
            {/* Header & Actions - Stack on mobile, Side-by-side on Desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory</h1>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                        id="import-bill-btn"
                        data-tutorial="import-invoice"
                        onClick={() => setIsImportModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 sm:py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 w-full sm:w-auto touch-manipulation min-h-[44px]"
                    >
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="hidden sm:inline">Import From Supplier Bill</span>
                        <span className="sm:hidden">Import Bill</span>
                    </button>
                    <button
                        id="add-product-btn"
                        data-tutorial="add-product"
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 w-full sm:w-auto transition-colors touch-manipulation min-h-[44px]"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Filters & Search - Responsive Layout */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                {/* Search Bar - Grows on desktop but limited width */}
                <div className="relative w-full sm:max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        id="inventory-search"
                        type="text"
                        className="block w-full rounded-lg border-0 py-3 sm:py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-base sm:text-sm touch-manipulation"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Buttons - Aligned right on desktop */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        id="filter-low-stock"
                        onClick={() => toggleFilter('lowStock')}
                        className={clsx(
                            "flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border touch-manipulation min-h-[44px]",
                            filter === 'lowStock'
                                ? "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        )}
                    >
                        <ExclamationTriangleIcon className={clsx("h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2", filter === 'lowStock' ? "text-red-500" : "text-gray-400")} />
                        <span className="hidden sm:inline">Low Stock</span>
                        <span className="sm:hidden">Low</span>
                    </button>
                    <button
                        id="filter-expiring"
                        onClick={() => toggleFilter('expiring')}
                        className={clsx(
                            "flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border touch-manipulation min-h-[44px]",
                            filter === 'expiring'
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-200"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        )}
                    >
                        <span className="hidden sm:inline">Expiring Soon</span>
                        <span className="sm:hidden">Expiring</span>
                    </button>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden" id="inventory-mobile-cards">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                                <div className="flex justify-between mb-3">
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="h-6 bg-gray-100 rounded w-20"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="space-y-3">
                        {products.map((product) => {
                            const isLowStock = product.quantity <= product.reorderLevel;
                            const isExpiring = product.expiryDate ? new Date(product.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 90)) : false;

                            return (
                                <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 touch-manipulation">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                                            <p className="text-xs text-gray-500 truncate">Batch: {product.batchNumber || 'N/A'}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 ml-2">₹{product.mrp}</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <span className={clsx(
                                                "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
                                                isLowStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                            )}>
                                                {isLowStock && <ExclamationTriangleIcon className="h-3 w-3 mr-1" />}
                                                Stock: {product.quantity}
                                            </span>
                                            {isExpiring && (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                                                    Exp Soon
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Delete Confirmation */}
                                    {deleteConfirm === product.id && (
                                        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                            <p className="text-sm text-red-700 mb-2">Delete this product?</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-lg touch-manipulation"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="flex-1 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg touch-manipulation"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                        {filter === 'expiring' ? (
                            <>
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-900">No products expiring soon</p>
                                <p className="text-xs text-gray-500 mt-1">All products are within safe expiry range</p>
                            </>
                        ) : filter === 'lowStock' ? (
                            <>
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-900">No low stock products</p>
                                <p className="text-xs text-gray-500 mt-1">All products are well-stocked</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-gray-900">No products found</p>
                                <p className="text-xs text-gray-500 mt-1">Add your first product to get started</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden" id="inventory-table-container">
                <div className="overflow-x-auto table-scroll-mobile">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Batch</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Category</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Expiry</th>
                                <th scope="col" className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                // Skeleton Loader Rows
                                <>
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4">
                                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                <div className="h-3 bg-gray-100 rounded w-24"></div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-md w-16"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-md w-12"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-14"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                                                    <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ) : products.length > 0 ? (
                                products.map((product) => {
                                    const isLowStock = product.quantity <= product.reorderLevel;
                                    // Simple logic: if expiry date exists and < 30 days
                                    const isExpiring = product.expiryDate ? new Date(product.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 90)) : false;

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                    <span className="text-xs text-gray-500 text-truncate max-w-xs">{product.genericName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.batchNumber || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={clsx(
                                                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                                    isLowStock
                                                        ? "bg-red-50 text-red-700 ring-red-600/10"
                                                        : "bg-green-50 text-green-700 ring-green-600/20"
                                                )}>
                                                    {product.quantity} {product.unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.mrp && product.mrp > 0 ? `₹${product.mrp}` : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {product.expiryDate ? (
                                                    <div className="flex items-center gap-1.5">
                                                        {isExpiring && <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />}
                                                        <span className={clsx(isExpiring ? "text-red-600 font-medium" : "text-gray-500")}>
                                                            {new Date(product.expiryDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ) : <span className="text-gray-400">N/A</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {deleteConfirm === product.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Edit Product"
                                                        >
                                                            <PencilSquareIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(product.id)}
                                                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Delete Product"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        {/* Contextual Empty State based on filter */}
                                        <div className="flex flex-col items-center justify-center">
                                            {filter === 'expiring' ? (
                                                <>
                                                    <div className="w-20 h-20 mb-6 relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform rotate-6"></div>
                                                        <div className="absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products expiring soon</h3>
                                                    <p className="text-gray-500 text-sm max-w-sm">
                                                        Great news! None of your products are nearing their expiry date.
                                                    </p>
                                                </>
                                            ) : filter === 'lowStock' ? (
                                                <>
                                                    <div className="w-20 h-20 mb-6 relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform rotate-6"></div>
                                                        <div className="absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No low stock products</h3>
                                                    <p className="text-gray-500 text-sm max-w-sm">
                                                        All your products are well-stocked. Keep up the good work!
                                                    </p>
                                                </>
                                            ) : searchTerm ? (
                                                <>
                                                    <div className="w-20 h-20 mb-6 relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl transform rotate-6"></div>
                                                        <div className="absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                                            <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                                                    <p className="text-gray-500 text-sm max-w-sm">
                                                        No products match "{searchTerm}". Try a different search term.
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-24 h-24 mb-6 relative">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform rotate-6"></div>
                                                        <div className="absolute inset-0 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                                                    <p className="text-gray-500 text-sm mb-6 max-w-sm">
                                                        Your inventory is empty. Add products manually or import from a supplier bill to get started.
                                                    </p>

                                                    <div className="flex flex-wrap gap-3 justify-center">
                                                        <button
                                                            onClick={() => setIsAddModalOpen(true)}
                                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/25"
                                                        >
                                                            <PlusIcon className="h-5 w-5" />
                                                            Add Product
                                                        </button>
                                                        <button
                                                            onClick={() => setIsImportModalOpen(true)}
                                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <ArrowUpTrayIcon className="h-5 w-5" />
                                                            Import from Bill
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Simple Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    &larr; Prev
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page * pagination.limit >= pagination.total}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    Next &rarr;
                                    <span className="sr-only">Next</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProducts}
            />

            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSuccess={fetchProducts}
                product={selectedProduct}
            />

            <ImportInvoiceModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={fetchProducts}
            />
        </div>
    );
};

export default InventoryList;
