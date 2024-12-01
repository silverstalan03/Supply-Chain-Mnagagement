import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const OrderForm = ({ onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    items: [{ product_id: '', name: '', quantity: '1', price: '0' }]
  });

  // Updated inventory with all 10 products
  const inventory = [
    {
      product_id: "RAM001",
      name: "Corsair Vengeance 32GB DDR5",
      price: "189.99",
      category: "RAM"
    },
    {
      product_id: "CPU001",
      name: "Intel Core i9-13900K",
      price: "599.99",
      category: "CPU"
    },
    {
      product_id: "GPU001",
      name: "NVIDIA RTX 4090",
      price: "1599.99",
      category: "GPU"
    },
    {
      product_id: "SSD001",
      name: "Samsung 2TB 970 EVO Plus",
      price: "179.99",
      category: "Storage"
    },
    {
      product_id: "MB001",
      name: "ASUS ROG Maximus Z790",
      price: "549.99",
      category: "Motherboard"
    },
    {
      product_id: "PSU001",
      name: "Corsair RM850x PSU",
      price: "149.99",
      category: "Power Supply"
    },
    {
      product_id: "CASE001",
      name: "Lian Li O11 Dynamic",
      price: "159.99",
      category: "Case"
    },
    {
      product_id: "COOL001",
      name: "NZXT Kraken X73",
      price: "199.99",
      category: "Cooling"
    },
    {
      product_id: "FAN001",
      name: "Noctua NF-A12x25 PWM",
      price: "29.99",
      category: "Cooling"
    },
    {
      product_id: "MON001",
      name: "LG 27GP950-B 4K",
      price: "799.99",
      category: "Monitor"
    }
  ];

  // Existing customers array
  const customers = [
    { customer_id: "CUST-001", name: "John Doe" },
    { customer_id: "CUST-002", name: "Jane Smith" },
    { customer_id: "CUST-003", name: "Robert Johnson" },
    { customer_id: "CUST-004", name: "Emily Brown" },
    { customer_id: "CUST-005", name: "Michael Wilson" },
    { customer_id: "CUST-006", name: "Sarah Davis" },
    { customer_id: "CUST-007", name: "David Miller" },
    { customer_id: "CUST-008", name: "Lisa Anderson" },
    { customer_id: "CUST-009", name: "James Taylor" },
    { customer_id: "CUST-010", name: "Jennifer Martin" }
  ];

  const handleProductSelect = (index, productId) => {
    const product = inventory.find(item => item.product_id === productId);
    if (!product) return;

    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      product_id: productId,
      name: product.name,
      price: product.price
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleQuantityChange = (index, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    const updatedItems = [...formData.items];
    updatedItems[index] = { 
      ...updatedItems[index], 
      quantity: quantity.toString()
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    setFormData({
      ...formData,
      customer_id: customerId,
      customer_name: customer?.name || ''
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', name: '', quantity: '1', price: '0' }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotal = () => {
    return formData.items
      .reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity || '0')), 0)
      .toFixed(2);
  };

  const validateForm = () => {
    if (!formData.customer_id) {
      throw new Error('Please select a customer');
    }

    if (!formData.items.length) {
      throw new Error('Please add at least one item');
    }

    const invalidItems = formData.items.some(item => !item.product_id);
    if (invalidItems) {
      throw new Error('Please select products for all items');
    }

    const invalidQuantities = formData.items.some(item => parseInt(item.quantity) < 1);
    if (invalidQuantities) {
      throw new Error('Quantity must be at least 1 for all items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    try {
      setLoading(true);
      setError('');

      // Validate form
      validateForm();

      const selectedCustomer = customers.find(c => c.customer_id === formData.customer_id);
      
      const orderData = {
        customer_id: selectedCustomer.customer_id,
        customer_name: selectedCustomer.name,
        items: formData.items.map(item => ({
          product_id: item.product_id,
          name: item.name,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        })),
        total_amount: calculateTotal()
      };

      console.log('Submitting order:', orderData);
      await onSubmit(orderData);
    } catch (err) {
      setError(err.message || 'Failed to create order');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
        <select
          value={formData.customer_id}
          onChange={(e) => handleCustomerChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          required
          disabled={loading}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.customer_id} value={customer.customer_id}>
              {customer.name} ({customer.customer_id})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Order Items</h3>
          <button
            type="button"
            onClick={addItem}
            disabled={loading}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center gap-1"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={item.product_id}
                onChange={(e) => handleProductSelect(index, e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
                disabled={loading}
              >
                <option value="">Select Product</option>
                {inventory.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name} (${parseFloat(product.price).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
                disabled={loading}
              />
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <div className="text-gray-900 py-2">
                ${parseFloat(item.price).toFixed(2)}
              </div>
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
              <div className="text-gray-900 py-2">
                ${(parseFloat(item.price) * parseInt(item.quantity || 0)).toFixed(2)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="mt-7 p-1 text-red-600 hover:bg-red-50 rounded"
              disabled={formData.items.length === 1 || loading}
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 flex justify-between items-center">
        <div className="text-lg">
          Total: <span className="font-bold">${calculateTotal()}</span>
        </div>
        <div className="space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50`}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OrderForm;