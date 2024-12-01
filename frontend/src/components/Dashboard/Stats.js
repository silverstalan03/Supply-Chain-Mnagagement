// src/components/Dashboard/Stats.js
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Stats({ orders }) {
  const calculateMetrics = () => {
    const total = orders.length;
    const processing = orders.filter(o => o.status === 'PROCESSING').length;
    const completed = orders.filter(o => o.status === 'COMPLETED').length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    
    const recentOrders = orders.filter(o => 
      new Date(o.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const previousOrders = orders.filter(o => 
      new Date(o.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const orderGrowth = previousOrders.length 
      ? ((recentOrders.length - previousOrders.length) / previousOrders.length * 100).toFixed(1)
      : 100;

    return {
      total,
      processing,
      completed,
      pending,
      orderGrowth
    };
  };

  const metrics = calculateMetrics();
  
  const stats = [
    {
      title: 'Total Orders',
      value: metrics.total,
      growth: metrics.orderGrowth,
      color: 'blue'
    },
    {
      title: 'Processing',
      value: metrics.processing,
      color: 'yellow'
    },
    {
      title: 'Completed',
      value: metrics.completed,
      color: 'green'
    },
    {
      title: 'Pending',
      value: metrics.pending,
      color: 'red'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow px-5 py-6">
          <div className="text-sm text-gray-500">{stat.title}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className={`text-3xl font-semibold text-${stat.color}-600`}>
              {stat.value}
            </div>
            {stat.growth !== undefined && (
              <div className={`flex items-center text-sm ${
                Number(stat.growth) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Number(stat.growth) >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stat.growth)}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}