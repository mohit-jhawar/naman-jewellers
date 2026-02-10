import React from 'react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, clearCart, totalItems } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md animate-in slide-in-from-right duration-300">
                    <div className="h-full flex flex-col bg-luxury-dark shadow-2xl border-l border-white/10">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
                                </svg>
                                Your Bag
                                <span className="ml-2 text-sm font-normal text-gray-500">({totalItems} items)</span>
                            </h2>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Your bag is empty</h3>
                                        <p className="text-sm text-gray-500 mt-1">Start adding some items to your inventory bag</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="btn-primary py-2 px-6 text-sm"
                                    >
                                        Explore Items
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-luxury-darker border border-white/5">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.designNo}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-white">
                                                    <h3 className="text-sm font-bold uppercase tracking-wider">{item.category}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500 font-bold">DESIGN: {item.designNo}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                    <p className="text-xs font-medium text-gold-500">{item.rhodium} | {item.size}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                            }
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="px-6 py-6 border-t border-white/10 space-y-4">
                                <button className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                                    Proceed to Export
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full py-2 text-xs text-gray-500 hover:text-white transition-colors"
                                >
                                    Clear Bag
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
