import React, { useState, useEffect } from 'react';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';
import type { JewelryItem } from '../types/Item';

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: JewelryItem | null;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item }) => {
    const { updateItem } = useItems();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        designNo: '',
        pcs: '' as any,
        size: '' as any,
        rhodium: '' as 'yes' | 'no',
        gold: '' as 'yes' | 'no',
        roseGold: '' as 'yes' | 'no',
        category: 'Bangles' as 'Bangles' | 'Kada' | 'Ring',
        netWeight: '' as any,
        imageUrl: '',
    });
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (item) {
            setFormData({
                designNo: item.designNo || '',
                pcs: (item.pcs !== undefined && item.pcs !== null) ? item.pcs.toString() : '',
                size: (item.size !== undefined && item.size !== null) ? item.size.toString() : '',
                rhodium: (item.rhodium === 'yes' || item.rhodium === 'no') ? item.rhodium : '' as any,
                gold: (item.gold === 'yes' || item.gold === 'no') ? item.gold : '' as any,
                roseGold: (item.roseGold === 'yes' || item.roseGold === 'no') ? item.roseGold : '' as any,
                category: item.category || 'Bangles',
                netWeight: (item.netWeight !== undefined && item.netWeight !== null) ? item.netWeight.toString() : '',
                imageUrl: item.imageUrl || '',
            });
            setImagePreview(item.imageUrl || '');
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setFormData(prev => ({ ...prev, imageUrl: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (item) {
            // Convert string values to numbers for submission
            const submissionData = {
                ...formData,
                pcs: parseInt(formData.pcs as any) || 0,
                size: parseFloat(formData.size as any) || 0,
                netWeight: parseFloat(formData.netWeight as any) || 0,
            };

            try {
                await updateItem(item.id, submissionData);
                showToast('Item updated successfully!', 'success');
                onClose();
            } catch (error) {
                console.error('Failed to update item:', error);
                showToast('Failed to update item. Please try again.', 'error');
            }
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-luxury-dark rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
                {/* Header */}
                <div className="bg-gradient-gold p-6 rounded-t-2xl">
                    <h2 className="text-3xl font-display font-bold text-white">Edit Jewelry Item</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-200 cursor-pointer"
                                style={{ colorScheme: 'dark' }}
                                required
                            >
                                <option value="Bangles" className="bg-luxury-dark text-white">Bangles</option>
                                <option value="Kada" className="bg-luxury-dark text-white">Kada</option>
                                <option value="Ring" className="bg-luxury-dark text-white">Ring</option>
                            </select>
                        </div>

                        {/* Design No */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Design No *
                            </label>
                            <input
                                type="text"
                                name="designNo"
                                value={formData.designNo}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                required
                                placeholder=""
                            />
                        </div>

                        {/* Pcs */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Pcs *
                            </label>
                            <input
                                type="number"
                                name="pcs"
                                value={formData.pcs}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                required
                                min="1"
                                placeholder=""
                            />
                        </div>

                        {/* Size */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Size *
                            </label>
                            <input
                                type="number"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                required
                                step="any"
                                placeholder=""
                            />
                        </div>

                        {/* Net Weight */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Net Weight (grams) *
                            </label>
                            <input
                                type="number"
                                name="netWeight"
                                value={formData.netWeight}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-200"
                                required
                                step="0.001"
                                placeholder=""
                            />
                        </div>

                        {/* Rhodium */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Rhodium *
                            </label>
                            <select
                                name="rhodium"
                                value={formData.rhodium}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-200 cursor-pointer"
                                style={{ colorScheme: 'dark' }}
                                required
                            >
                                <option value="" disabled className="bg-luxury-dark text-gray-500">Select</option>
                                <option value="yes" className="bg-luxury-dark text-white">Yes</option>
                                <option value="no" className="bg-luxury-dark text-white">No</option>
                            </select>
                        </div>

                        {/* Gold */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Gold *
                            </label>
                            <select
                                name="gold"
                                value={formData.gold}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-200 cursor-pointer"
                                style={{ colorScheme: 'dark' }}
                                required
                            >
                                <option value="" disabled className="bg-luxury-dark text-gray-500">Select</option>
                                <option value="yes" className="bg-luxury-dark text-white">Yes</option>
                                <option value="no" className="bg-luxury-dark text-white">No</option>
                            </select>
                        </div>

                        {/* Rose Gold */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Rose Gold *
                            </label>
                            <select
                                name="roseGold"
                                value={formData.roseGold}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-200 cursor-pointer"
                                style={{ colorScheme: 'dark' }}
                                required
                            >
                                <option value="" disabled className="bg-luxury-dark text-gray-500">Select</option>
                                <option value="yes" className="bg-luxury-dark text-white">Yes</option>
                                <option value="no" className="bg-luxury-dark text-white">No</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Product Image
                            </label>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-contain bg-white/5 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Upload Button */}
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-300">{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-semibold hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary py-3"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItemModal;
