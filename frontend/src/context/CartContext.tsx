import React, { createContext, useContext, useState, useEffect } from 'react';
import type { JewelryItem } from '../types/Item';
import { useItems } from './ItemContext';

interface CartItem extends JewelryItem {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: JewelryItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem('naman_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
            // If storage is corrupted or causes issues, reset it
            try {
                localStorage.removeItem('naman_cart');
            } catch (e) { /* ignore */ }
            return [];
        }
    });

    const { items } = useItems();

    useEffect(() => {
        try {
            // Optimize storage: Exclude imageUrl (Base64 is too large) and other potentially large fields
            const cartToSave = cart.map(item => {
                const { imageUrl, ...rest } = item;
                return rest;
            });
            localStorage.setItem('naman_cart', JSON.stringify(cartToSave));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }, [cart]);

    // Sync cart with items from ItemContext
    useEffect(() => {
        setCart(prevCart => {
            let hasChanges = false;
            const updatedCart = prevCart.map(cartItem => {
                const sourceItem = items.find(i => i.id === cartItem.id);
                if (sourceItem) {
                    // Check if any critical fields have changed
                    if (
                        sourceItem.imageUrl !== cartItem.imageUrl ||
                        sourceItem.designNo !== cartItem.designNo ||
                        sourceItem.category !== cartItem.category ||
                        sourceItem.pcs !== cartItem.pcs ||
                        sourceItem.size !== cartItem.size ||
                        sourceItem.rhodium !== cartItem.rhodium ||
                        sourceItem.gold !== cartItem.gold ||
                        sourceItem.roseGold !== cartItem.roseGold ||
                        sourceItem.netWeight !== cartItem.netWeight
                    ) {
                        hasChanges = true;
                        return { ...sourceItem, quantity: cartItem.quantity };
                    }
                }
                return cartItem;
            });
            return hasChanges ? updatedCart : prevCart;
        });
    }, [items]);

    const addToCart = (item: JewelryItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        setCart(prev => {
            if (newQuantity < 1) {
                return prev.filter(i => i.id !== itemId);
            }

            return prev.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i);
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
