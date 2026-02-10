import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

interface NavbarProps {
    onAddItem?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddItem }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const { orders } = useOrders();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        {
            label: 'Home', path: '/home', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            label: 'Orders', path: '/orders', badge: pendingOrdersCount, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            label: 'Cart', path: '/cart', badge: totalItems, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 11V9a3 3 0 016 0v2m-6 0h6" />
                </svg>
            )
        },
    ];

    return (
        <header className="sticky top-0 z-[100] bg-gradient-to-r from-luxury-dark/95 via-luxury-dark/90 to-luxury-dark/95 backdrop-blur-2xl border-b border-gold-500/20 shadow-2xl shadow-gold-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Brand Section */}
                    <div className="flex items-center gap-8">
                        <div className="group cursor-pointer flex-shrink-0" onClick={() => navigate('/home')}>
                            <img
                                src="/logo.png"
                                alt="Naman Jewellers"
                                className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group ${location.pathname === item.path
                                        ? 'text-gold-500 bg-white/5 shadow-inner shadow-gold-500/5'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white shadow-lg shadow-gold-500/30 animate-in zoom-in duration-300">
                                            {item.badge}
                                        </span>
                                    )}
                                    {location.pathname === item.path && (
                                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-gold rounded-full shadow-gold-500/50 shadow-sm" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Action Section */}
                    <div className="flex items-center gap-3">
                        {/* Admin Action: Add Item (Desktop) */}
                        {onAddItem && (
                            <button
                                onClick={onAddItem}
                                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-white text-sm font-bold rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all duration-300 hover:scale-[1.05] active:scale-95 border border-white/10"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Item
                            </button>
                        )}

                        {/* User Profile / Logout (Desktop) */}
                        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-white/10 ml-2">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Authenticated</p>
                                <p className="text-sm font-bold text-white leading-none">{user?.username}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl border border-white/5 transition-all duration-300 hover:rotate-12"
                                title="Sign Out"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden" ref={mobileMenuRef}>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all ${isMobileMenuOpen ? 'rotate-90 bg-white/10 border-gold-500/30' : ''}`}
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>

                            {/* Mobile Dropdown */}
                            {isMobileMenuOpen && (
                                <div className="absolute right-4 mt-4 w-64 bg-luxury-dark rounded-2xl p-2 shadow-2xl border border-gold-500/30 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Logged in</p>
                                        <p className="text-sm font-bold text-white truncate">{user?.username}</p>
                                    </div>

                                    {navItems.map((item) => (
                                        <button
                                            key={item.path}
                                            onClick={() => {
                                                navigate(item.path);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                                ? 'bg-gold-500/10 text-gold-400'
                                                : 'text-gray-300 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.icon}
                                                <span className="font-bold">{item.label}</span>
                                            </div>
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <span className="px-2 py-0.5 bg-gold-500 text-white text-[10px] font-bold rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    ))}

                                    {onAddItem && (
                                        <button
                                            onClick={() => {
                                                onAddItem();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gold-500 font-bold hover:bg-white/5 transition-all mt-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add New Item
                                        </button>
                                    )}

                                    <div className="h-px bg-white/5 my-2" />

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-bold hover:bg-red-500/5 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
