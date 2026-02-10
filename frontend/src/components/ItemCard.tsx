import React from 'react';
import type { JewelryItem } from '../types/Item';
import { useCart } from '../context/CartContext';
import ImageWithFallback from './ImageWithFallback';

interface ItemCardProps {
    item: JewelryItem;
    onViewDetail: (item: JewelryItem) => void;
    onEdit: (item: JewelryItem) => void;
    onDelete: (item: JewelryItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetail, onEdit, onDelete }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(item);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(item);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(item);
    };

    return (
        <div
            onClick={() => onViewDetail(item)}
            className="bg-luxury-dark rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 overflow-hidden border border-white/5 group relative flex flex-col cursor-pointer transform hover:scale-[1.02]"
        >
            {/* Image Section */}
            <div className="relative h-44 sm:h-48 bg-gradient-to-br from-luxury-darker to-black overflow-hidden">
                <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.designNo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-darker via-transparent to-transparent opacity-70"></div>

                {/* Design No Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-lg rounded-lg border border-gold-500/40 shadow-lg">
                    <span className="text-[10px] font-bold text-gold-500 uppercase tracking-wide">
                        {item.designNo}
                    </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-lg rounded-lg border border-purple-500/40 shadow-lg">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                        {item.category}
                    </span>
                </div>

                {/* Action Buttons - Always Visible */}
                <div className="absolute bottom-2.5 right-2.5 flex gap-2 transition-all duration-300">
                    <button
                        onClick={handleEdit}
                        className="p-2 bg-blue-500 text-white rounded-xl shadow-xl hover:scale-110 hover:bg-blue-600 transform transition-all backdrop-blur-sm"
                        title="Edit"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-red-500 text-white rounded-xl shadow-xl hover:scale-110 hover:bg-red-600 transform transition-all backdrop-blur-sm"
                        title="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                {/* Add to Cart Quick Button */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-2.5 left-2.5 p-2.5 rounded-xl shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-gold text-white shadow-gold-500/30"
                    title="Add to Cart"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Details Section */}
            <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-luxury-dark to-luxury-darker">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2.5 line-clamp-1 group-hover:text-gold-500 transition-colors">
                        {item.designNo}
                    </h3>

                    <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Pcs</span>
                            <span className="text-[11px] font-medium text-gray-200">{item.pcs}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Size</span>
                            <span className="text-[11px] font-medium text-gray-200">{item.size}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Net Weight</span>
                            <span className="text-[11px] font-medium text-gray-200">{item.netWeight}g</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Rhodium</span>
                            <span className="text-[11px] font-medium text-gray-200 capitalize">{item.rhodium}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Gold</span>
                            <span className="text-[11px] font-medium text-gray-200 capitalize">{item.gold}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">Rose Gold</span>
                            <span className="text-[11px] font-medium text-gray-200 capitalize">{item.roseGold}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Border Hover Effect */}
            <div className="absolute inset-0 border-2 border-gold-500/0 group-hover:border-gold-500/30 transition-colors duration-500 rounded-2xl pointer-events-none"></div>
        </div>
    );
};

export default ItemCard;
