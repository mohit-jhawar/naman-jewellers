import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemContext';
import { useCart } from '../context/CartContext';
import type { JewelryItem } from '../types/Item';
import ItemCard from '../components/ItemCard';
import CreateItemModal from '../components/CreateItemModal';
import EditItemModal from '../components/EditItemModal';
import ItemDetailModal from '../components/ItemDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { items, deleteItem } = useItems();
    const { addToCart } = useCart();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<JewelryItem['category'] | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<JewelryItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<JewelryItem | null>(null);

    const handleViewDetail = (item: JewelryItem) => {
        setSelectedItem(item);
    };

    const handleEdit = (item: JewelryItem) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item: JewelryItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch =
            item.designNo.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories: (JewelryItem['category'] | 'All')[] = ['All', 'Bangles', 'Kada', 'Ring'];

    return (
        <div className="min-h-screen bg-luxury-darker text-gray-100 flex flex-col">
            <Navbar onAddItem={() => setIsModalOpen(true)} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {/* Search and Category Filter */}
                <div className="mb-8 space-y-6">
                    {/* Search Bar */}
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by design number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300 hover:border-white/20 shadow-xl"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <span className="text-gray-500 font-bold text-[10px] tracking-widest uppercase">Filter by Category</span>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full sm:flex-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-gradient-gold text-white shadow-lg shadow-gold-500/30 scale-105'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-24 glass-card rounded-3xl animate-in fade-in duration-700">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2">No items found</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            We couldn't find any items matching your current filters. Try adjusting your search or category selection.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                            }}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ItemCard
                                    item={item}
                                    onViewDetail={handleViewDetail}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            <CreateItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {editingItem && (
                <EditItemModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingItem(null);
                    }}
                    item={editingItem}
                />
            )}

            <ItemDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onAddToCart={(item) => {
                    addToCart(item);
                    setSelectedItem(null);
                    navigate('/cart');
                }}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={() => {
                    if (itemToDelete) {
                        deleteItem(itemToDelete.id);
                    }
                }}
                title="Delete Item"
                message={`Are you sure you want to delete item ${itemToDelete?.designNo}? This action cannot be undone.`}
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default HomePage;
