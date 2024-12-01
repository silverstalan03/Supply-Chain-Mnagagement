// src/components/Analytics/DetailedAnalytics.js
import React, { useEffect, useState } from 'react';

const DetailedAnalytics = ({ orders }) => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedRevenue: 0
  });

  useEffect(() => {
    // Calculate metrics whenever orders change
    if (orders && orders.length > 0) {
      const totalOrders = orders.length;
      
      // Total revenue from all orders
      const totalRevenue = orders.reduce((sum, order) => 
        sum + parseFloat(order.total_amount), 0).toFixed(2);

      // Revenue only from completed orders
      const completedRevenue = orders
        .filter(order => order.status === 'COMPLETED')
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
        .toFixed(2);

      setMetrics({
        totalOrders,
        totalRevenue,
        completedRevenue
      });
    }
  }, [orders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Total Orders</h3>
        <p className="text-3xl font-bold text-blue-600">{metrics.totalOrders}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-green-600">${metrics.totalRevenue}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Completed Revenue</h3>
        <p className="text-3xl font-bold text-green-600">${metrics.completedRevenue}</p>
      </div>
    </div>
  );
};

export default DetailedAnalytics;