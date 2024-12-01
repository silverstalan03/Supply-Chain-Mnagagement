import React, { useState, useEffect, useCallback } from 'react';
import { orderService, healthService } from './services/api';
import Stats from './components/Dashboard/Stats';
import OrderForm from './components/Orders/OrderForm';
import OrderList from './components/Orders/OrderList';
import Sidebar from './components/Layout/Sidebar';
import Notifications from './components/Layout/Notifications';
import NotificationBell from './components/Layout/NotificationBell';
import InventoryList from './components/Inventory/InventoryList';
import CustomerList from './components/Customers/CustomerList';
import DetailedAnalytics from './components/Analytics/DetailedAnalytics';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // State management
  const [activeView, setActiveView] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Notification handlers
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: notification.id || Date.now(),
      type: notification.type || 'info',
      message: notification.message,
      order_id: notification.order_id,
      timestamp: notification.timestamp || new Date().toISOString(),
      isPersistent: true
    };

    setNotifications(prev => {
      const isDuplicate = prev.some(n => 
        n.message === newNotification.message && 
        n.timestamp === newNotification.timestamp
      );
      if (isDuplicate) return prev;
      return [newNotification, ...prev];
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // API Handlers
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      addNotification({
        type: 'error',
        message: 'Failed to fetch orders'
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const handleCreateOrder = async (orderData) => {
    try {
      setLoading(true);
      console.log('Creating order with data:', orderData);

      const createdOrder = await orderService.createOrder(orderData);
      console.log('Order created:', createdOrder);
      
      setShowOrderForm(false);
      await fetchOrders();

      addNotification({
        type: 'success',
        message: `Order ${createdOrder.order_id} created successfully`,
        order_id: createdOrder.order_id
      });
    } catch (err) {
      console.error('Error creating order:', err);
      addNotification({
        type: 'error',
        message: err.message || 'Failed to create order'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      
      addNotification({
        type: 'success',
        message: `Order ${orderId} status updated to ${newStatus}`,
        order_id: orderId
      });
    } catch (err) {
      console.error('Error updating status:', err);
      addNotification({
        type: 'error',
        message: 'Failed to update status',
        order_id: orderId
      });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      setLoading(true);
      await orderService.deleteOrder(orderId);
      await fetchOrders();
      
      addNotification({
        type: 'success',
        message: `Order ${orderId} deleted successfully`,
        order_id: orderId
      });
    } catch (err) {
      console.error('Error deleting order:', err);
      addNotification({
        type: 'error',
        message: 'Failed to delete order',
        order_id: orderId
      });
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Check system health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthService.check();
        setError(null);
      } catch (err) {
        console.error('Health check failed:', err);
        setError('System is currently unavailable');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Render content based on active view
  const renderContent = () => {
    if (error) {
      return (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={fetchOrders}
            className="mt-2 bg-red-100 px-4 py-2 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      );
    }

    if (loading && !orders.length) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (showOrderForm) {
      return (
        <OrderForm
          onSubmit={handleCreateOrder}
          onCancel={() => setShowOrderForm(false)}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <Stats orders={orders} />
            <OrderList
              orders={orders.slice(0, 5)}
              title="Recent Orders"
              onDelete={handleDeleteOrder}
              onStatusChange={handleStatusChange}
            />
          </>
        );
      case 'order management':
        return (
          <OrderList
            orders={orders}
            showActions={true}
            onDelete={handleDeleteOrder}
            onStatusChange={handleStatusChange}
          />
        );
      case 'inventory':
        return <InventoryList />;
      case 'customers':
        return <CustomerList />;
      case 'analytics':
        return <DetailedAnalytics orders={orders} />;
      default:
        return (
          <div className="flex justify-center items-center h-full text-gray-500">
            Coming Soon
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>

            <div className="flex items-center space-x-4">
              {activeView === 'order management' && !showOrderForm && !loading && (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700"
                >
                  + New Order
                </button>
              )}

              <div className="relative">
                <NotificationBell
                  count={notifications.length}
                  onClick={() => setShowNotifications(!showNotifications)}
                  onClear={clearNotifications}
                />
                
                {showNotifications && (
                  <Notifications
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    onDismiss={dismissNotification}
                    onClearAll={clearNotifications}
                    show={showNotifications}
                  />
                )}
              </div>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;