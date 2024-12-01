import React, { useState } from 'react';
import { Eye, Trash2, XCircle } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Order Details: {order.order_id}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XCircle />
        </button>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Order ID</label>
            <p className="mt-1">{order.order_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <p className="mt-1">{order.customer_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1">{order.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created At</label>
            <p className="mt-1">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Items</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="px-4 py-2">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="text-lg font-bold">
            Total: ${parseFloat(order.total_amount).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrderList = ({ 
  orders = [], 
  title = 'Orders', 
  showActions = true, 
  onDelete, 
  onStatusChange 
}) => {
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleDelete = async (orderId) => {
    try {
      setDeletingOrder(orderId);
      await onDelete(orderId);
    } finally {
      setDeletingOrder(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At</th>
                  {showActions && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.order_id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 font-medium ${getStatusColor(order.status)}`}
                        disabled={deletingOrder === order.order_id}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                            disabled={deletingOrder === order.order_id}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(order.order_id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Order"
                            disabled={deletingOrder === order.order_id}
                          >
                            {deletingOrder === order.order_id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-600 rounded-full border-t-transparent" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewingOrder && (
        <OrderDetailsModal 
          order={viewingOrder} 
          onClose={() => setViewingOrder(null)} 
        />
      )}
    </div>
  );
};

export default OrderList;