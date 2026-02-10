import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import OrderTrackingNotes from '../components/OrderTrackingNotes';
import ConfirmationModal from '../components/ConfirmationModal';
import type { OrderStatus } from '../types/Order';

const OrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders, deleteOrder, updateOrderStatus, addTrackingNote } = useOrders();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm'
    });

    const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

    React.useEffect(() => {
        if (selectedOrder) {
            setSelectedStatus(selectedOrder.status);
        } else {
            setSelectedStatus('');
        }
    }, [selectedOrder]);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
            case 'Processing':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
            case 'Shipped':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
            case 'Delivered':
                return 'bg-green-500/20 text-green-400 border-green-500/40';
            case 'Cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/40';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
        }
    };

    const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
    const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

    return (
        <div className="min-h-screen bg-luxury-darker text-gray-100 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">Order Management</h1>
                    <p className="text-gray-400 mt-1 text-sm">Track and manage all customer orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-24 glass-card rounded-3xl animate-in fade-in duration-700">
                        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2">No orders found</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            When customers place orders, they will appear here for you to manage and track their status.
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-10 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
                        >
                            Return to Catalog
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Pending Orders */}
                        {pendingOrders.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-xl font-bold text-white">Active Orders</h2>
                                    <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold">
                                        {pendingOrders.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className="glass-card rounded-2xl p-6 hover:border-gold-500/40 transition-all cursor-pointer group hover:scale-[1.02] duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Order #{order.id.slice(0, 8)}</p>
                                                    <h4 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">{order.customerDetails.fullName || order.customerDetails.name}</h4>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {order.customerDetails.phone}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                                <span className="text-gold-500 text-sm font-bold">Details →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Completed Orders */}
                        {completedOrders.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-xl font-bold text-white">Past Orders</h2>
                                    <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">
                                        {completedOrders.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {completedOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className="glass-card rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer opacity-70 hover:opacity-100 group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Order #{order.id.slice(0, 8)}</p>
                                                    <h4 className="text-lg font-bold text-white">{order.customerDetails.fullName || order.customerDetails.name}</h4>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                {order.status === 'Cancelled' ? 'Cancelled on' : 'Completed on'} {new Date(order.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>

            {/* Order Detail Modal */}
            {selectedOrderId && selectedOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4" onClick={() => setSelectedOrderId(null)}>
                    <div className="bg-luxury-dark rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="p-8 sm:p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-3xl font-display font-bold text-white mb-2">Order Details</h3>
                                    <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em]">#{selectedOrder.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrderId(null)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Customer Info</h4>
                                    <div className="space-y-3">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-white font-bold">{selectedOrder.customerDetails.fullName || selectedOrder.customerDetails.name}</p>
                                            <p className="text-gray-400 text-sm mt-1">{selectedOrder.customerDetails.email}</p>
                                            <p className="text-gray-400 text-sm">{selectedOrder.customerDetails.phone}</p>
                                            {selectedOrder.customerDetails.address && (
                                                <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-white/5">{selectedOrder.customerDetails.address}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Items Summary</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5 text-sm">
                                                <div>
                                                    <span className="text-white font-bold block">Item #{item.designNo}</span>
                                                    {item.size && <span className="text-xs text-gray-500">Size: {item.size}</span>}
                                                </div>
                                                <span className="text-gold-500 font-bold">×{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Status Change - Only for non-final orders */}
                            {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                <div className="bg-white/5 rounded-[2rem] p-6 border border-gold-500/20 shadow-inner">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Update Order Status</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(selectedOrder.status)}`}>
                                            Current: {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1 group">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                                                className="w-full pl-4 pr-10 py-3.5 bg-luxury-dark/50 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all text-sm cursor-pointer"
                                                style={{ colorScheme: 'dark' }}
                                            >
                                                <option value="" className="bg-luxury-dark text-gray-400">Select new status...</option>
                                                <option value="Pending" className="bg-luxury-dark text-white">Pending</option>
                                                <option value="Processing" className="bg-luxury-dark text-white">Processing</option>
                                                <option value="Shipped" className="bg-luxury-dark text-white">Shipped</option>
                                                <option value="Delivered" className="bg-luxury-dark text-white">Delivered</option>
                                                <option value="Cancelled" className="bg-luxury-dark text-red-400">Cancelled</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (selectedStatus && selectedStatus !== selectedOrder.status) {
                                                    const handleUpdate = () => {
                                                        updateOrderStatus(selectedOrder.id, selectedStatus, user?.username);
                                                        setSelectedStatus('');
                                                    };

                                                    // If selecting cancelled, ask for confirmation
                                                    if (selectedStatus === 'Cancelled') {
                                                        setModalConfig({
                                                            isOpen: true,
                                                            title: 'Cancel Order',
                                                            message: 'Are you sure you want to cancel this order?',
                                                            confirmText: 'Cancel Order',
                                                            onConfirm: handleUpdate
                                                        });
                                                        return;
                                                    }
                                                    handleUpdate();
                                                }
                                            }}
                                            disabled={!selectedStatus || selectedStatus === selectedOrder.status}
                                            className={`px-8 py-3.5 ${selectedStatus === 'Cancelled' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-gradient-gold text-white'} font-bold rounded-xl shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2`}
                                        >
                                            {selectedStatus === 'Cancelled' ? 'Cancel Order' : 'Update Status'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Status Timeline */}
                            <OrderStatusTimeline
                                currentStatus={selectedOrder.status}
                                statusHistory={selectedOrder.statusHistory}
                            />

                            {/* Tracking Notes */}
                            <OrderTrackingNotes
                                notes={selectedOrder.trackingNotes}
                                onAddNote={(message) => {
                                    addTrackingNote(selectedOrder.id, message);
                                }}
                            />

                            <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-white/5">
                                {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
                                    <button
                                        onClick={() => {
                                            setModalConfig({
                                                isOpen: true,
                                                title: 'Delete Order',
                                                message: 'Delete this completed order? This action cannot be undone.',
                                                confirmText: 'Delete Order',
                                                onConfirm: () => {
                                                    deleteOrder(selectedOrder.id);
                                                    setSelectedOrderId(null);
                                                }
                                            });
                                        }}
                                        className="py-4 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-2xl transition-all order-2 sm:order-1"
                                    >
                                        Delete Order
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedOrderId(null)}
                                    className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all order-1 sm:order-2"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isDanger={true}
                confirmText={modalConfig.confirmText}
            />
        </div>
    );
};

export default OrdersPage;
