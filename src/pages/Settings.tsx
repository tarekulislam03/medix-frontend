import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [storeSettings, setStoreSettings] = useState({
        storeName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        gstNumber: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [billWidth, setBillWidth] = useState<'58mm' | '90mm'>('90mm');
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    // Field validation states
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchStoreSettings();
        // Load bill width
        const savedWidth = localStorage.getItem('bill_width');
        if (savedWidth === '58mm' || savedWidth === '90mm') {
            setBillWidth(savedWidth as any);
        }
    }, []);

    const fetchStoreSettings = async () => {
        try {
            const response = await api.get('/dashboard/store');
            if (response.data.success && response.data.data) {
                const store = response.data.data;
                setStoreSettings({
                    storeName: store.name || '',
                    email: store.email || '',
                    phone: store.phone || '',
                    address: store.address || '',
                    city: store.city || '',
                    state: store.state || '',
                    pincode: store.postalCode || '',
                    gstNumber: store.gstNumber || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch store settings', error);
        }
    };

    const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStoreSettings({ ...storeSettings, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        setTouchedFields({ ...touchedFields, [e.target.name]: true });

        // Real-time validation
        const newErrors = { ...fieldErrors };
        const name = e.target.name;
        const value = e.target.value;

        if (name === 'newPassword' && value.length > 0 && value.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        } else if (name === 'newPassword') {
            delete newErrors.newPassword;
        }

        if (name === 'confirmPassword' && value !== passwordData.newPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        } else if (name === 'confirmPassword') {
            delete newErrors.confirmPassword;
        }

        setFieldErrors(newErrors);
    };

    const handleSaveStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Save bill width
        localStorage.setItem('bill_width', billWidth);

        try {
            await api.put('/dashboard/store', storeSettings);
            setMessage({ type: 'success', text: 'Store settings updated successfully!' });
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        setPasswordLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl" id="settings-container">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'}`}
                >
                    {message.type === 'success' ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span className="font-medium">{message.text}</span>
                    <button
                        onClick={() => setMessage(null)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Store Settings */}
            <form id="settings-profile" onSubmit={handleSaveStore} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Store Settings</h2>
                <p className="text-gray-500 mb-4">Configure your store details and business information.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input
                            type="text"
                            name="storeName"
                            value={storeSettings.storeName}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={storeSettings.email}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={storeSettings.phone}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">GST Number</label>
                        <input
                            type="text"
                            name="gstNumber"
                            value={storeSettings.gstNumber}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={storeSettings.address}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={storeSettings.city}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={storeSettings.state}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                        <input
                            type="text"
                            name="pincode"
                            value={storeSettings.pincode}
                            onChange={handleStoreChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-700 text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : showSaveSuccess ? (
                            <>
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Saved!
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </button>
                    {showSaveSuccess && (
                        <span className="text-green-600 text-sm font-medium animate-pulse">Changes saved successfully!</span>
                    )}
                </div>
            </form>


            {/* Bill Configuration */}
            <div id="settings-printer" className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Bill Configuration</h2>
                <p className="text-gray-500 mb-4">Select the print width for your thermal printer.</p>
                <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="billWidth"
                            value="58mm"
                            checked={billWidth === '58mm'}
                            onChange={(e) => setBillWidth(e.target.value as any)}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">58mm (Small)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="billWidth"
                            value="90mm"
                            checked={billWidth === '90mm'}
                            onChange={(e) => setBillWidth(e.target.value as any)}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">90mm (Large)</span>
                    </label>
                </div>
            </div>

            {/* Password Change */}
            <form onSubmit={handleChangePassword} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Security</h2>
                <p className="text-gray-500 mb-4">Change your password to keep your account secure.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-700 focus:border-blue-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            className={`mt-1 block w-full rounded-md shadow-sm border p-2 focus:ring-blue-700 focus:border-blue-700 ${fieldErrors.newPassword
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                    : touchedFields.newPassword && passwordData.newPassword.length >= 8
                                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                        : 'border-gray-300'
                                }`}
                        />
                        {fieldErrors.newPassword && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.newPassword}
                            </p>
                        )}
                        {touchedFields.newPassword && passwordData.newPassword.length >= 8 && !fieldErrors.newPassword && (
                            <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Password strength: Good
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            className={`mt-1 block w-full rounded-md shadow-sm border p-2 focus:ring-blue-700 focus:border-blue-700 ${fieldErrors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                    : touchedFields.confirmPassword && passwordData.confirmPassword === passwordData.newPassword && passwordData.confirmPassword.length >= 8
                                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                        : 'border-gray-300'
                                }`}
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.confirmPassword}
                            </p>
                        )}
                        {touchedFields.confirmPassword && passwordData.confirmPassword === passwordData.newPassword && passwordData.confirmPassword.length >= 8 && !fieldErrors.confirmPassword && (
                            <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Passwords match!
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={passwordLoading || Object.keys(fieldErrors).length > 0}
                        className="bg-blue-700 text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        {passwordLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Changing...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </div>
            </form>

            {/* Account Info */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Logged in as:</span>
                        <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Role:</span>
                        <p className="font-medium text-gray-900">{user?.role || 'User'}</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Settings;
