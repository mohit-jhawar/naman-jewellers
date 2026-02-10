import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useItems } from '../context/ItemContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import ImageWithFallback from '../components/ImageWithFallback';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
    const { createOrder } = useOrders();
    const { refreshItems } = useItems();
    const { showToast } = useToast();
    const [showCheckout, setShowCheckout] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleCheckout = () => {
        setShowCheckout(true);
    };

    const handleCreateOrder = async () => {
        if (!customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
            showToast('Please fill in all required fields (name, email, and phone)', 'error');
            return;
        }

        try {
            await createOrder(customerDetails, cart);
            await refreshItems(); // Refresh items to update stock on homepage
            clearCart();
            setCustomerDetails({ fullName: '', email: '', phone: '', address: '' });
            setShowCheckout(false);
            showToast('Order created successfully!', 'success');
            navigate('/orders');
        } catch (error) {
            showToast('Failed to create order. Please try again.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-luxury-darker text-white flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Your Cart</h1>
                        <p className="text-gray-400 mt-1 text-sm">Review and checkout your selected items</p>
                    </div>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear All
                        </button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-24 glass-card rounded-3xl animate-in fade-in duration-700">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2">Your cart is empty</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            Looks like you haven't added anything to your cart yet. Explore our collection and find something beautiful!
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-10 py-3 bg-gradient-gold text-white font-bold rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all hover:scale-105"
                        >
                            Go Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="glass-card rounded-2xl p-4 flex gap-4 animate-in slide-in-from-left duration-500">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-luxury-dark border border-white/5 flex-shrink-0">
                                        <ImageWithFallback
                                            src={item.imageUrl}
                                            alt={item.designNo}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-bold text-white">Item #{item.designNo}</h4>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Quantity</p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-white font-bold min-w-[20px] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-28">
                            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Order Summary</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-400">
                                    <span>Total Items</span>
                                    <span className="text-white font-bold">{totalItems}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold">FREE</span>
                                </div>
                            </div>

                            {!showCheckout ? (
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-gradient-gold text-white font-bold rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Full Name *</label>
                                            <input
                                                type="text"
                                                value={customerDetails.fullName}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, fullName: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Email *</label>
                                            <input
                                                type="email"
                                                value={customerDetails.email}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                                                placeholder="Enter email"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Phone Number *</label>
                                            <input
                                                type="text"
                                                value={customerDetails.phone}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                                                placeholder="Enter phone"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Address</label>
                                            <textarea
                                                value={customerDetails.address}
                                                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 h-20"
                                                placeholder="Enter delivery address"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCreateOrder}
                                        className="w-full py-4 bg-gradient-gold text-white font-bold rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        Place Order
                                    </button>
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        className="w-full py-2 text-gray-500 hover:text-white text-xs font-bold transition-colors"
                                    >
                                        Back to Cart
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CartPage;
