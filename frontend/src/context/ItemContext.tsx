import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { JewelryItem } from '../types/Item';
import api from '../api/axios';

interface ItemContextType {
    items: JewelryItem[];
    addItem: (item: Omit<JewelryItem, 'id'>) => Promise<void>;
    updateItem: (id: string, updatedItem: Omit<JewelryItem, 'id'>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    refreshItems: () => Promise<void>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<JewelryItem[]>([]);

    const fetchItems = async () => {
        try {
            const response = await api.get('items');
            // Support both internal _id and id for compatibility
            const normalizedItems = response.data.map((item: any) => ({
                ...item,
                id: item._id || item.id
            }));
            setItems(normalizedItems);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const addItem = async (item: Omit<JewelryItem, 'id'>) => {
        try {
            const response = await api.post('items', item);
            console.log('Item added successfully:', response.data);

            // Add the new item to state immediately instead of refetching all items
            const newItem = {
                ...response.data,
                id: response.data._id || response.data.id
            };
            setItems(prevItems => [...prevItems, newItem]);
        } catch (error: any) {
            console.error('Failed to add item:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add item';
            throw new Error(errorMessage);
        }
    };

    const updateItem = async (id: string, updatedItem: Omit<JewelryItem, 'id'>) => {
        try {
            await api.put(`items/${id}`, updatedItem);
            await fetchItems();
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    const deleteItem = async (id: string) => {
        try {
            await api.delete(`items/${id}`);
            await fetchItems();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    return (
        <ItemContext.Provider value={{ items, addItem, updateItem, deleteItem, refreshItems: fetchItems }}>
            {children}
        </ItemContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemContext);
    if (context === undefined) {
        throw new Error('useItems must be used within an ItemProvider');
    }
    return context;
};
