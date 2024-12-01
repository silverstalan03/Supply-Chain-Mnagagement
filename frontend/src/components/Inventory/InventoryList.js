import React, { useState } from 'react';
import { Search } from 'lucide-react';

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const inventoryItems = [
    {
      product_id: "RAM001",
      name: "Corsair Vengeance 32GB DDR5",
      category: "RAM",
      stock_level: "50",
      price: "189.99"
    },
    {
      product_id: "CPU001",
      name: "Intel Core i9-13900K",
      category: "CPU",
      stock_level: "25",
      price: "599.99"
    },
    {
      product_id: "GPU001",
      name: "NVIDIA RTX 4090",
      category: "GPU",
      stock_level: "10",
      price: "1599.99"
    },
    {
      product_id: "SSD001",
      name: "Samsung 2TB 970 EVO Plus",
      category: "Storage",
      stock_level: "75",
      price: "179.99"
    },
    {
      product_id: "MB001",
      name: "ASUS ROG Maximus Z790",
      category: "Motherboard",
      stock_level: "30",
      price: "549.99"
    },
    {
      product_id: "PSU001",
      name: "Corsair RM850x PSU",
      category: "Power Supply",
      stock_level: "45",
      price: "149.99"
    },
    {
      product_id: "CASE001",
      name: "Lian Li O11 Dynamic",
      category: "Case",
      stock_level: "20",
      price: "159.99"
    },
    {
      product_id: "COOL001",
      name: "NZXT Kraken X73",
      category: "Cooling",
      stock_level: "35",
      price: "199.99"
    },
    {
      product_id: "FAN001",
      name: "Noctua NF-A12x25 PWM",
      category: "Cooling",
      stock_level: "100",
      price: "29.99"
    },
    {
      product_id: "MON001",
      name: "LG 27GP950-B 4K",
      category: "Monitor",
      stock_level: "15",
      price: "799.99"
    }
  ];

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Available Stocks</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.product_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.product_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.stock_level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;