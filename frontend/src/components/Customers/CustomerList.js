import React from 'react';

const CustomerList = () => {
  // Default 10 customers
  const defaultCustomers = [
    {
      customer_id: "CUST-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St, City, Country"
    },
    {
      customer_id: "CUST-002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "234-567-8901",
      address: "456 Oak Ave, City, Country"
    },
    {
      customer_id: "CUST-003",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "345-678-9012",
      address: "789 Pine Rd, City, Country"
    },
    {
      customer_id: "CUST-004",
      name: "Emily Brown",
      email: "emily@example.com",
      phone: "456-789-0123",
      address: "321 Elm St, City, Country"
    },
    {
      customer_id: "CUST-005",
      name: "Michael Wilson",
      email: "michael@example.com",
      phone: "567-890-1234",
      address: "654 Maple Dr, City, Country"
    },
    {
      customer_id: "CUST-006",
      name: "Sarah Davis",
      email: "sarah@example.com",
      phone: "678-901-2345",
      address: "987 Cedar Ln, City, Country"
    },
    {
      customer_id: "CUST-007",
      name: "David Miller",
      email: "david@example.com",
      phone: "789-012-3456",
      address: "147 Birch Blvd, City, Country"
    },
    {
      customer_id: "CUST-008",
      name: "Lisa Anderson",
      email: "lisa@example.com",
      phone: "890-123-4567",
      address: "258 Willow Way, City, Country"
    },
    {
      customer_id: "CUST-009",
      name: "James Taylor",
      email: "james@example.com",
      phone: "901-234-5678",
      address: "369 Ash St, City, Country"
    },
    {
      customer_id: "CUST-010",
      name: "Jennifer Martin",
      email: "jennifer@example.com",
      phone: "012-345-6789",
      address: "741 Palm Ct, City, Country"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {defaultCustomers.map((customer) => (
                <tr key={customer.customer_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customer_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;