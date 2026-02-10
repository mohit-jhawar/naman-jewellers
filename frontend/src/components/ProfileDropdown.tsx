import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

interface ProfileDropdownProps {
    onAddItem?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onAddItem }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const { orders } = useOrders();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    const handleAddItemClick = () => {
        setIsOpen(false);
        if (onAddItem) onAddItem();
    };

    return (
        <>
            {/* Backdrop overlay when menu is open - starts below header */}
            {isOpen && (
                <div
                    className="fixed top-16 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10 relative z-[70]"
                >
                    {/* Hamburger Icon - 3 horizontal lines */}
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-luxury-dark rounded-xl py-2 shadow-2xl border border-gold-500/30 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Navigation Items - Always visible */}
                        <div className="py-1 border-b border-white/5">
                            <button
                                onClick={() => handleNavigation('/home')}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Home
                            </button>

                            {onAddItem && (
                                <button
                                    onClick={handleAddItemClick}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gold-500 hover:bg-white/5 hover:text-gold-400 transition-colors flex items-center gap-3 font-semibold"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Item
                                </button>
                            )}

                            <button
                                onClick={() => handleNavigation('/orders')}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Orders
                                </div>
                                {pendingOrdersCount > 0 && (
                                    <span className="px-2 py-0.5 bg-gold-500 text-white text-xs font-bold rounded-full">
                                        {pendingOrdersCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => handleNavigation('/cart')}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11V9a3 3 0 016 0v2m-6 0h6" />
                                    </svg>
                                    Cart
                                </div>
                                {totalItems > 0 && (
                                    <span className="px-2 py-0.5 bg-gold-500 text-white text-xs font-bold rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="px-4 py-2 border-b border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Logged in as</p>
                            <p className="text-sm font-bold text-white truncate">{user?.username}</p>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfileDropdown;
