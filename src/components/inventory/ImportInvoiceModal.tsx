import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ArrowUpTrayIcon, DocumentTextIcon, CheckIcon, TrashIcon, CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';
import toast from 'react-hot-toast';
import DocumentScanner from '@/components/scanner/DocumentScanner';

interface ImportInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// Unified Product Structure - same as AddProductModal
interface ProductItem {
    name: string;
    category: string;
    supplier: string;
    costPrice: string;
    sellingPrice: string;
    mrp: string;
    quantity: string; // Opening Stock
    batchNumber: string;
    expiryDate: string;
}

interface InvoiceData {
    invoiceNumber?: string;
    invoiceDate?: string;
    supplierName?: string;
    totalAmount?: number;
}

// Text Extractor API URL (separate microservice)
const TEXT_EXTRACTOR_URL = 'https://auto-product-importrer.onrender.com';

/**
 * Parse expiry date from various formats (MM/YY, MM-YY, MMYY, MM/YYYY) to YYYY-MM-DD
 * Indian pharmacy bills typically use MM/YY format for expiry
 */
const parseExpiryDate = (dateStr: string): string => {
    if (!dateStr) return '';

    // Clean up the string
    const cleaned = dateStr.trim().replace(/\s+/g, '');

    // Try to extract month and year
    let month: string = '';
    let year: string = '';

    // Format: MM/YY or MM-YY or MM.YY
    const slashMatch = cleaned.match(/^(\d{1,2})[\/\-\.](\d{2,4})$/);
    if (slashMatch) {
        month = slashMatch[1].padStart(2, '0');
        year = slashMatch[2];
    }
    // Format: MMYY (4 digits)
    else if (/^\d{4}$/.test(cleaned)) {
        month = cleaned.substring(0, 2);
        year = cleaned.substring(2, 4);
    }
    // Format: MMYYYY (6 digits)
    else if (/^\d{6}$/.test(cleaned)) {
        month = cleaned.substring(0, 2);
        year = cleaned.substring(2, 6);
    }
    // Already in YYYY-MM-DD format
    else if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
        return cleaned;
    }
    // DD/MM/YY or DD-MM-YY format (less common for expiry)
    else if (/^\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4}$/.test(cleaned)) {
        const parts = cleaned.split(/[\/\-\.]/);
        // Assume DD/MM/YY format
        month = parts[1];
        year = parts[2];
    }
    else {
        // Can't parse, return empty
        console.warn('[Import] Could not parse expiry date:', dateStr);
        return '';
    }

    // Convert 2-digit year to 4-digit year
    if (year.length === 2) {
        const yearNum = parseInt(year);
        // Assume 20XX for years 00-50, 19XX for years 51-99
        year = yearNum <= 50 ? `20${year}` : `19${year}`;
    }

    // Validate month
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
        console.warn('[Import] Invalid month in expiry date:', dateStr);
        return '';
    }

    // Return as YYYY-MM-DD (first day of the month)
    return `${year}-${month.padStart(2, '0')}-01`;
};

const ImportInvoiceModal: React.FC<ImportInvoiceModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState<'upload' | 'preview'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<ProductItem[]>([]);
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({});
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannerMode, setScannerMode] = useState<'camera' | 'gallery'>('camera');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Open scanner in camera mode
    const openCameraScanner = () => {
        setScannerMode('camera');
        setIsScannerOpen(true);
    };

    // Open scanner in gallery mode (file picker)
    const openGalleryScanner = () => {
        setScannerMode('gallery');
        setIsScannerOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Handle captured image from scanner
    const handleScanCapture = (capturedFile: File) => {
        setFile(capturedFile);
        setIsScannerOpen(false);
    };


    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        try {
            // Step 1: Extract text from image using Text Extractor API
            const formData = new FormData();
            formData.append('image', file);

            const extractResponse = await fetch(`${TEXT_EXTRACTOR_URL}/api/extract`, {
                method: 'POST',
                body: formData
            });

            if (!extractResponse.ok) {
                throw new Error('Failed to extract text from image');
            }

            const extractData = await extractResponse.json();
            const extractedText = extractData.text;

            if (!extractedText) {
                throw new Error('No text extracted from image');
            }

            // Step 2: Parse text to JSON using Text Extractor API
            const parseResponse = await fetch(`${TEXT_EXTRACTOR_URL}/api/parse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: extractedText })
            });

            if (!parseResponse.ok) {
                throw new Error('Failed to parse bill data');
            }

            const parseData = await parseResponse.json();
            const billData = parseData.data;

            // Map to Unified Product Structure
            // MRP = Selling Price, Opening Stock = Quantity from invoice
            // Leave blank if not found, do not auto-generate
            console.log('[Import] Raw bill data:', billData);

            const mappedItems: ProductItem[] = (billData.items || []).map((item: any, idx: number) => {
                console.log(`[Import] Item ${idx}:`, item);

                // Try multiple field names for each value
                const mrpValue = item.mrp || item.MRP || item.mrp_price || item.maxRetailPrice || item.m_r_p || 0;
                const rateValue = item.rate || item.cost_price || item.costPrice || item.purchase_rate || item.purchaseRate || item.ptr || 0;
                const qtyValue = item.quantity || item.qty || item.Quantity || item.Qty || 0;

                // Parse expiry date from MM/YY format to YYYY-MM-DD
                const rawExpiry = item.expiry_date || item.expiryDate || item.expiry || item.exp_date || '';
                const parsedExpiry = parseExpiryDate(rawExpiry);

                return {
                    name: item.medicine_name || item.productName || item.product_name || item.name || item.medicineName || '',
                    category: 'MEDICINE',
                    supplier: billData.supplierName || billData.supplier_name || billData.distributorName || '',
                    costPrice: String(rateValue),
                    sellingPrice: String(mrpValue), // MRP = Selling Price
                    mrp: String(mrpValue),
                    quantity: String(qtyValue), // Opening Stock = Quantity from invoice
                    batchNumber: item.batch_number || item.batchNumber || item.batch || item.lot || '',
                    expiryDate: parsedExpiry, // Properly parsed date in YYYY-MM-DD format
                };
            });

            setItems(mappedItems);
            setInvoiceData({
                invoiceNumber: billData.invoiceNumber,
                invoiceDate: billData.invoiceDate,
                supplierName: billData.supplierName,
                totalAmount: billData.totalAmount
            });
            setStep('preview');
            toast.success(`Extracted ${mappedItems.length} products from bill`);

        } catch (error: any) {
            console.error('Bill extraction error', error);
            toast.error(error.message || 'Failed to analyze bill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleItemChange = (index: number, field: keyof ProductItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Auto-set Selling Price = MRP when MRP changes
        if (field === 'mrp') {
            newItems[index].sellingPrice = value;
        }

        setItems(newItems);
    };

    const handleDeleteRow = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleConfirm = async () => {
        if (items.length === 0) {
            toast.error('No products to import');
            return;
        }

        // Validate required fields
        const invalidItems = items.filter(item =>
            !item.name || !item.costPrice || !item.mrp || !item.quantity
        );

        if (invalidItems.length > 0) {
            toast.error('Please fill required fields (Name, Cost Price, MRP, Quantity) for all products');
            return;
        }

        setLoading(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            // Create each product using the same API as manual creation
            for (const item of items) {
                try {
                    // Generate SKU: first 3 chars of name + batch or timestamp + random
                    const autoSku = `${item.name.substring(0, 3).toUpperCase()}-${item.batchNumber || Date.now().toString().substring(0, 6)}-${Math.floor(Math.random() * 999)}`;

                    const costPrice = parseFloat(item.costPrice) || 0;
                    const mrp = parseFloat(item.mrp) || 0;
                    const sellingPrice = parseFloat(item.sellingPrice) || mrp; // MRP = Selling Price
                    const quantity = parseInt(item.quantity) || 0;

                    // Same payload format as AddProductModal
                    const payload = {
                        name: item.name,
                        sku: autoSku,
                        category: item.category || 'MEDICINE',
                        manufacturer: item.supplier || undefined,

                        costPrice,
                        sellingPrice,
                        mrp,

                        quantity,
                        reorderLevel: 10,
                        unit: 'pcs',

                        batchNumber: item.batchNumber || undefined,
                        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,

                        description: 'Imported from Supplier Bill'
                    };

                    console.log('[Import] Creating product:', payload);
                    await api.post('/products', payload);
                    successCount++;
                } catch (itemError: any) {
                    console.error(`[Import] Failed to create ${item.name}:`, itemError.response?.data || itemError);
                    errorCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`Successfully imported ${successCount} product(s)${errorCount > 0 ? `. ${errorCount} failed.` : ''}`);
                onSuccess();
                handleClose();
            } else {
                toast.error('Failed to import any products. Check console for details.');
            }
        } catch (error: any) {
            console.error('Import error', error);
            toast.error(error.response?.data?.message || 'Failed to import products');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('upload');
        setFile(null);
        setItems([]);
        setInvoiceData({});
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className={`mx-auto w-full bg-white rounded-xl shadow-lg transition-all ${step === 'preview' ? 'max-w-7xl h-[95vh]' : 'max-w-md'}`}>

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                {step === 'upload' ? 'Import From Supplier Bill' : 'Review Products Before Import'}
                            </Dialog.Title>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 h-full overflow-hidden flex flex-col">
                            {step === 'upload' ? (
                                <div className="flex flex-col items-center justify-center space-y-5 flex-1">
                                    {/* Title */}
                                    <div className="text-center mb-2">
                                        <p className="text-gray-600 text-sm">
                                            Scan or upload your supplier bill to automatically extract products
                                        </p>
                                    </div>

                                    {/* Scan / Upload Options */}
                                    <div className="w-full grid grid-cols-2 gap-3">
                                        {/* Camera Scanner Button */}
                                        <button
                                            type="button"
                                            onClick={openCameraScanner}
                                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-colors cursor-pointer touch-manipulation min-h-[140px] active:bg-blue-200"
                                        >
                                            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                                                <CameraIcon className="h-7 w-7 text-white" />
                                            </div>
                                            <p className="text-sm font-semibold text-blue-700">Scan Bill</p>
                                            <p className="text-xs text-blue-500 mt-1">Use camera</p>
                                        </button>

                                        {/* Gallery Upload Button - Now also uses scanner */}
                                        <button
                                            type="button"
                                            onClick={openGalleryScanner}
                                            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer touch-manipulation min-h-[140px] active:bg-gray-100"
                                        >
                                            <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                                                <PhotoIcon className="h-7 w-7 text-white" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700">Upload Image</p>
                                            <p className="text-xs text-gray-500 mt-1">From gallery</p>
                                        </button>
                                    </div>

                                    {/* Hidden file input - kept for fallback */}
                                    <input
                                        id="gallery-file-input"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="sr-only"
                                    />

                                    {/* Selected File Preview */}
                                    {file && (
                                        <div className="w-full bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <DocumentTextIcon className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setFile(null)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Analyze Button */}
                                    <button
                                        onClick={handleUpload}
                                        disabled={!file || loading}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl py-4 font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center shadow-lg touch-manipulation min-h-[52px]"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Extracting with AI...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                                                Analyze & Extract Products
                                            </>
                                        )}
                                    </button>

                                    {/* Info */}
                                    <p className="text-xs text-center text-gray-500 max-w-sm">
                                        AI will extract product details from your bill. You can review and edit before importing.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full pb-20">
                                    {/* Invoice Info Header */}
                                    {(invoiceData.invoiceNumber || invoiceData.supplierName) && (
                                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                            <div className="grid grid-cols-4 gap-4 text-sm">
                                                {invoiceData.invoiceNumber && (
                                                    <div>
                                                        <span className="text-gray-500">Invoice #:</span>
                                                        <span className="ml-2 font-medium">{invoiceData.invoiceNumber}</span>
                                                    </div>
                                                )}
                                                {invoiceData.invoiceDate && (
                                                    <div>
                                                        <span className="text-gray-500">Date:</span>
                                                        <span className="ml-2 font-medium">{invoiceData.invoiceDate}</span>
                                                    </div>
                                                )}
                                                {invoiceData.supplierName && (
                                                    <div>
                                                        <span className="text-gray-500">Supplier:</span>
                                                        <span className="ml-2 font-medium">{invoiceData.supplierName}</span>
                                                    </div>
                                                )}
                                                {invoiceData.totalAmount && (
                                                    <div>
                                                        <span className="text-gray-500">Total:</span>
                                                        <span className="ml-2 font-medium">₹{invoiceData.totalAmount}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Info Banner */}
                                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Review carefully:</strong> Edit any incorrect values below. Empty fields will remain blank. MRP = Selling Price.
                                        </p>
                                    </div>

                                    {/* Products List - Responsive */}
                                    <div className="flex-1 overflow-auto border border-gray-200 rounded-lg bg-gray-50">
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                                    <tr>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name *</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Batch #</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Expiry</th>
                                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase w-24">Stock *</th>
                                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase w-24">Cost *</th>
                                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase w-24">MRP *</th>
                                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase w-24">Selling</th>
                                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Supplier</th>
                                                        <th className="px-3 py-3 w-12"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {items.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 text-sm">
                                                            <td className="p-2">
                                                                <input
                                                                    value={item.name}
                                                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                                                                    placeholder="Product Name"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    value={item.batchNumber}
                                                                    onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                                                                    placeholder=""
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    value={item.expiryDate}
                                                                    onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-center"
                                                                    placeholder=""
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-right"
                                                                    placeholder=""
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={item.costPrice}
                                                                    onChange={(e) => handleItemChange(index, 'costPrice', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-right"
                                                                    placeholder=""
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={item.mrp}
                                                                    onChange={(e) => handleItemChange(index, 'mrp', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-right"
                                                                    placeholder=""
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={item.sellingPrice}
                                                                    onChange={(e) => handleItemChange(index, 'sellingPrice', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-right bg-gray-50"
                                                                    placeholder=""
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    value={item.supplier}
                                                                    onChange={(e) => handleItemChange(index, 'supplier', e.target.value)}
                                                                    className="w-full border border-gray-200 rounded px-2 py-1"
                                                                    placeholder=""
                                                                />
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <button
                                                                    onClick={() => handleDeleteRow(index)}
                                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                                    title="Remove Product"
                                                                >
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="md:hidden space-y-4 p-4">
                                            {items.map((item, index) => (
                                                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3 relative">
                                                    <button
                                                        onClick={() => handleDeleteRow(index)}
                                                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <XMarkIcon className="h-5 w-5" />
                                                    </button>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Product Name</label>
                                                        <input
                                                            value={item.name}
                                                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                            placeholder="Product Name"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Batch #</label>
                                                            <input
                                                                value={item.batchNumber}
                                                                onChange={(e) => handleItemChange(index, 'batchNumber', e.target.value)}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                                placeholder="Batch"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Expiry</label>
                                                            <input
                                                                value={item.expiryDate}
                                                                onChange={(e) => handleItemChange(index, 'expiryDate', e.target.value)}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                                placeholder="MM/YY"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Opening Stock</label>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Cost Price</label>
                                                            <input
                                                                type="number"
                                                                value={item.costPrice}
                                                                onChange={(e) => handleItemChange(index, 'costPrice', e.target.value)}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">MRP</label>
                                                            <input
                                                                type="number"
                                                                value={item.mrp}
                                                                onChange={(e) => handleItemChange(index, 'mrp', e.target.value)}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Selling Price</label>
                                                            <input
                                                                type="number"
                                                                value={item.sellingPrice}
                                                                onChange={(e) => handleItemChange(index, 'sellingPrice', e.target.value)}
                                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="mt-3 text-sm text-gray-600">
                                        Total Products: <strong>{items.length}</strong>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => setStep('upload')}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                                        >
                                            Re-Upload
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            disabled={loading || items.length === 0}
                                            className="px-6 py-2 text-white bg-green-600 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {loading ? 'Importing...' : (
                                                <>
                                                    <CheckIcon className="h-4 w-4" />
                                                    Import {items.length} Products
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Document Scanner - OUTSIDE Dialog to prevent portal conflicts */}
            <DocumentScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onCapture={handleScanCapture}
                startMode={scannerMode}
            />
        </>
    );
};

export default ImportInvoiceModal;
