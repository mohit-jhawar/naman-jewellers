import React, { useState } from 'react';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';


interface CreateItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({ isOpen, onClose }) => {
    const { addItem } = useItems();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        designNo: '',
        pcs: '' as unknown as number,
        size: '' as unknown as number,
        rhodium: '' as 'yes' | 'no',
        gold: '' as 'yes' | 'no',
        roseGold: '' as 'yes' | 'no',
        category: 'Bangles' as 'Bangles' | 'Kada' | 'Ring',
        netWeight: '' as unknown as number,
        imageUrl: '',
    });
    const [imagePreview, setImagePreview] = useState<string>('');

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                designNo: '',
                pcs: '' as unknown as number,
                size: '' as unknown as number,
                rhodium: '' as 'yes' | 'no',
                gold: '' as 'yes' | 'no',
                roseGold: '' as 'yes' | 'no',
                category: 'Bangles' as 'Bangles' | 'Kada' | 'Ring',
                netWeight: '' as unknown as number,
                imageUrl: '',
            });
            setImagePreview('');
        }
    }, [isOpen]);

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

        // Convert string values to numbers for submission
        const submissionData = {
            ...formData,
            pcs: parseInt(formData.pcs as any) || 0,
            size: parseFloat(formData.size as any) || 0,
            netWeight: parseFloat(formData.netWeight as any) || 0,
        };

        try {
            await addItem(submissionData);
            setFormData({
                designNo: '',
                pcs: '' as unknown as number,
                size: '' as unknown as number,
                rhodium: '' as 'yes' | 'no',
                gold: '' as 'yes' | 'no',
                roseGold: '' as 'yes' | 'no',
                category: 'Bangles' as 'Bangles' | 'Kada' | 'Ring',
                netWeight: '' as unknown as number,
                imageUrl: '',
            });
            setImagePreview('');
            showToast('Item created successfully!', 'success');
            onClose();
        } catch (error) {
            console.error('Failed to add item:', error);
            showToast('Failed to add item. Please try again.', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-luxury-dark rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
                {/* Header */}
                <div className="bg-gradient-gold p-6 rounded-t-2xl">
                    <h2 className="text-3xl font-display font-bold text-white">Add New Jewelry Item</h2>
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
                                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="relative">
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-gold-500 transition-colors bg-white/5 hover:bg-white/10"
                                >
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-400">
                                            <span className="font-semibold text-gold-500">Click to upload</span> or use camera
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg bg-white/5 text-white font-semibold hover:bg-white/10 transition-all border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary"
                        >
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateItemModal;
