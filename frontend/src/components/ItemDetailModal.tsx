import React from 'react';
import type { JewelryItem } from '../types/Item';
import ImageWithFallback from './ImageWithFallback';

interface ItemDetailModalProps {
    item: JewelryItem | null;
    onClose: () => void;
    onAddToCart: (item: JewelryItem) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onAddToCart }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-luxury-dark rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 flex flex-col md:flex-row">
                {/* Left: Image Section */}
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-luxury-darker relative">
                    <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.designNo}
                        className="w-full h-full object-contain p-4"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors md:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Right: Content Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-white mb-2">
                                {item.designNo}
                            </h2>
                            <div className="flex gap-2 items-center">
                                <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 font-bold tracking-wider text-xs">
                                    {item.category}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="hidden md:block p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-8 flex-1">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Pcs</p>
                            <p className="text-lg font-medium text-gray-100">{item.pcs}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Size</p>
                            <p className="text-lg font-medium text-gray-100">{item.size}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Net Weight</p>
                            <p className="text-lg font-medium text-gray-100">{item.netWeight}g</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Rhodium</p>
                            <p className="text-lg font-medium text-gray-100 capitalize">{item.rhodium}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Gold</p>
                            <p className="text-lg font-medium text-gray-100 capitalize">{item.gold}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Rose Gold</p>
                            <p className="text-lg font-medium text-gray-100 capitalize">{item.roseGold}</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={() => onAddToCart(item)}
                            className="w-full py-4 text-lg btn-primary flex items-center justify-center gap-3 transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
                            </svg>
                            Add to Cart
                        </button>
                        <p className="text-center text-xs text-gray-500">
                            100% Genuine Certified Jewelry
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailModal;
