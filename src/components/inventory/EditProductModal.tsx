import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product: Product | null;
}

const CATEGORIES = [
    'MEDICINE',
    'SUPPLEMENT',
    'COSMETIC',
    'MEDICAL_EQUIPMENT',
    'PERSONAL_CARE',
    'BABY_CARE',
    'OTHER',
];

const DOSAGE_FORMS = [
    { id: 'TABLET', label: 'Tablet / Capsule' },
    { id: 'SYRUP', label: 'Syrup / Liquid' },
    { id: 'INJECTION', label: 'Injection' },
    { id: 'CREAM', label: 'Cream / Ointment' },
    { id: 'OTHER', label: 'Other/Equipment' },
];

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
    const [loading, setLoading] = useState(false);
    const [dosageForm, setDosageForm] = useState('TABLET');
    const [formData, setFormData] = useState({
        name: '',
        category: 'MEDICINE',
        supplier: '', // Replaces manufacturer in UI
        costPrice: '',
        sellingPrice: '',
        mrp: '',
        taxPercent: '0',
        quantity: '', // Opening Stock
        minStockLevel: '10',
        reorderLevel: '20',
        unit: 'pcs',
        batchNumber: '',
        expiryDate: '',

        // Dynamic fields
        tabletsPerStrip: '',
        qtyInMl: '',
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || 'MEDICINE',
                supplier: product.manufacturer || '', // manufacturer field maps to supplier UI
                costPrice: product.costPrice?.toString() || '',
                sellingPrice: product.sellingPrice?.toString() || '',
                mrp: product.mrp?.toString() || '',
                taxPercent: product.taxPercent?.toString() || '0',
                quantity: product.quantity?.toString() || '',
                minStockLevel: product.minStockLevel?.toString() || '10',
                reorderLevel: product.reorderLevel?.toString() || '20',
                unit: product.unit || 'pcs',
                batchNumber: product.batchNumber || '',
                expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
                tabletsPerStrip: product.tabletsPerStrip?.toString() || '',
                qtyInMl: product.qtyInMl?.toString() || '',
            });
            setDosageForm(product.dosageForm || 'TABLET');
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Auto-set Selling Price = MRP when MRP changes
    const handleMrpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev,
            mrp: value,
            sellingPrice: value, // MRP = Selling Price
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setLoading(true);

        try {
            const costPrice = parseFloat(formData.costPrice);
            const sellingPrice = parseFloat(formData.sellingPrice);
            const mrp = parseFloat(formData.mrp);
            const quantity = parseInt(formData.quantity);

            if (isNaN(costPrice) || isNaN(sellingPrice) || isNaN(mrp) || isNaN(quantity)) {
                toast.error('Please fill all required numeric fields (Cost Price, Selling Price, MRP, Stock)');
                setLoading(false);
                return;
            }

            const payload: any = {
                name: formData.name,
                category: formData.category,
                manufacturer: formData.supplier || undefined, // supplier stored as manufacturer

                costPrice,
                sellingPrice,
                mrp,
                taxPercent: parseFloat(formData.taxPercent) || 0,

                quantity,
                minStockLevel: parseInt(formData.minStockLevel) || 10,
                reorderLevel: parseInt(formData.reorderLevel) || 20,
                unit: formData.unit,

                batchNumber: formData.batchNumber || undefined,
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,

                tabletsPerStrip: dosageForm === 'TABLET' && formData.tabletsPerStrip
                    ? parseInt(formData.tabletsPerStrip) || undefined
                    : undefined,

                qtyInMl: dosageForm === 'SYRUP' && formData.qtyInMl
                    ? parseFloat(formData.qtyInMl) || undefined
                    : undefined,
            };

            await api.put(`/products/${product.id}`, payload);
            toast.success('Product updated successfully!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to update product', error);
            const message = error.response?.data?.message || 'Failed to update product. Please check inputs.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="flex items-center justify-between mb-5">
                                        <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                                            Edit Product
                                        </Dialog.Title>
                                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Basic Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Category *</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                >
                                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Dosage Form</label>
                                                <select
                                                    value={dosageForm}
                                                    onChange={(e) => setDosageForm(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                >
                                                    {DOSAGE_FORMS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                                </select>
                                            </div>

                                            {/* Dynamic Fields based on Dosage Form */}
                                            {dosageForm === 'TABLET' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Tablets per Strip</label>
                                                    <input
                                                        type="number"
                                                        name="tabletsPerStrip"
                                                        value={formData.tabletsPerStrip}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                        placeholder="e.g 10"
                                                    />
                                                </div>
                                            )}

                                            {dosageForm === 'SYRUP' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Quantity in ML</label>
                                                    <input
                                                        type="number"
                                                        name="qtyInMl"
                                                        value={formData.qtyInMl}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                        placeholder="e.g 100"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                                                <input
                                                    type="text"
                                                    name="supplier"
                                                    value={formData.supplier}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                    placeholder="Supplier name"
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200"></div>

                                        {/* Pricing */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Cost Price *</label>
                                                <input
                                                    type="number"
                                                    name="costPrice"
                                                    required
                                                    value={formData.costPrice}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">MRP * (= Selling Price)</label>
                                                <input
                                                    type="number"
                                                    name="mrp"
                                                    required
                                                    value={formData.mrp}
                                                    onChange={handleMrpChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Selling Price *</label>
                                                <input
                                                    type="number"
                                                    name="sellingPrice"
                                                    required
                                                    value={formData.sellingPrice}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Tax %</label>
                                                <input
                                                    type="number"
                                                    name="taxPercent"
                                                    value={formData.taxPercent}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200"></div>

                                        {/* Stock & Expiry */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    required
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                                                <input
                                                    type="text"
                                                    name="batchNumber"
                                                    value={formData.batchNumber}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                                <input
                                                    type="date"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Reorder Level</label>
                                                <input
                                                    type="number"
                                                    name="reorderLevel"
                                                    value={formData.reorderLevel}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 -mx-6 -mb-4 mt-6">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={onClose}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EditProductModal;
