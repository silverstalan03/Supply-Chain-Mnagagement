// src/components/Layout/Notifications.js
import React from 'react';
import { X, Trash2, AlertCircle, Info, CheckCircle, XCircle, Package, User, FileText } from 'lucide-react';

const getNotificationIcon = (type, event) => {
  if (event?.startsWith('CUSTOMER_')) return <User className="h-5 w-5 text-purple-500 mt-0.5" />;
  if (event?.startsWith('INVENTORY_') || event === 'LOW_STOCK_ALERT') return <Package className="h-5 w-5 text-green-500 mt-0.5" />;
  if (event?.startsWith('DOCUMENT_')) return <FileText className="h-5 w-5 text-blue-500 mt-0.5" />;

  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500 mt-0.5" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500 mt-0.5" />;
    default:
      return <Info className="h-5 w-5 text-gray-500 mt-0.5" />;
  }
};

function Notifications({ notifications = [], onDismiss, onClearAll, show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-50">
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div className="flex items-center space-x-4">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close notifications"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-32">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type, notification.event)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      {notification.order_id && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Order: {notification.order_id}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Dismiss notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;