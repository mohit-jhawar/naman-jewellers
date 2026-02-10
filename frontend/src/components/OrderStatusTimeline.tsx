import React from 'react';
import type { OrderStatus, StatusHistory } from '../types/Order';

interface OrderStatusTimelineProps {
    currentStatus: OrderStatus;
    statusHistory: StatusHistory[];
}

const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ currentStatus, statusHistory }) => {
    const currentStatusIndex = ORDER_STATUSES.indexOf(currentStatus);

    const getStatusDate = (status: OrderStatus): Date | null => {
        const historyEntry = statusHistory.find(h => h.status === status);
        return historyEntry ? new Date(historyEntry.timestamp) : null;
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="py-6">
            <h3 className="text-lg font-semibold text-white mb-6">Order Timeline</h3>

            {/* Timeline */}
            <div className="relative">
                {ORDER_STATUSES.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = status === currentStatus;
                    const statusDate = getStatusDate(status);

                    return (
                        <div key={status} className="relative flex items-start mb-8 last:mb-0 group">
                            {/* Vertical Line */}
                            {index < ORDER_STATUSES.length - 1 && (
                                <div
                                    className={`absolute left-4 top-8 w-0.5 h-12 transition-all duration-500 ${isCompleted ? 'bg-gold-500' : 'bg-gray-700'
                                        }`}
                                    style={{
                                        transformOrigin: 'top',
                                        transform: isCompleted ? 'scaleY(1)' : 'scaleY(1)',
                                    }}
                                />
                            )}

                            {/* Status Dot */}
                            <div className="relative z-10 flex-shrink-0">
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompleted
                                            ? 'bg-gold-500 border-gold-500 shadow-lg shadow-gold-500/50'
                                            : 'bg-luxury-dark border-gray-700 group-hover:border-gray-600'
                                        }`}
                                >
                                    {isCompleted && (
                                        <svg
                                            className="w-4 h-4 text-luxury-dark transition-transform duration-300 group-hover:scale-110"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>

                                {/* Current Status Pulse */}
                                {isCurrent && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-gold-500 animate-ping opacity-30" />
                                        <div className="absolute inset-0 rounded-full bg-gold-500 opacity-20 animate-pulse" />
                                    </>
                                )}
                            </div>

                            {/* Status Content */}
                            <div className="ml-4 flex-1 transition-all duration-300 group-hover:translate-x-1">
                                <div className="flex items-center justify-between">
                                    <h4
                                        className={`font-semibold transition-colors duration-300 ${isCompleted ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'
                                            }`}
                                    >
                                        {status}
                                    </h4>
                                    {statusDate && (
                                        <span className={`text-xs transition-colors duration-300 ${isCompleted ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            {formatDate(statusDate)}
                                        </span>
                                    )}
                                </div>
                                {isCurrent && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gold-500/20 text-gold-500 rounded-full border border-gold-500/30 animate-fade-in">
                                        Current Status
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTimeline;
