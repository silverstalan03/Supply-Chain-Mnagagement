// src/components/Layout/Sidebar.js
import React from 'react';
import { BarChart3, Package, Upload, Users, PieChart } from 'lucide-react';

function Sidebar({ activeView, setActiveView }) {
  const menuItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Order Management', icon: Package },
    { name: 'Inventory', icon: Upload },
    { name: 'Customers', icon: Users },
    { name: 'Analytics', icon: PieChart }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold">Order Management</span>
        </div>
      </div>

      <nav className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.name.toLowerCase())}
            className={`w-full flex items-center px-4 py-2 rounded-lg text-sm mb-1
              ${activeView === item.name.toLowerCase() 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;