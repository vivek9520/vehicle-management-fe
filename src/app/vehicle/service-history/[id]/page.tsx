'use client'; // Ensure this component is client-side

import React from 'react';

const ServiceHistoryPage = () => {
  const data = [
    {
      idService: 3,
      serviceType: 'Oil Change',
      serviceDate: '2024-11-23',
      description: 'Changed engine oil and replaced oil filter.',
    },
    {
      idService: 4,
      serviceType: 'Brake Inspection',
      serviceDate: '2024-11-15',
      description: 'Checked and replaced brake pads.',
    },
    // Add more data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 bg-gradient-to-r from-[#A888B5] via-[#8174A0] to-[#EFB6C8] text-transparent bg-clip-text shadow-md tracking-wide">
        Vehicle Service Details
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-gray-600 font-semibold">Service ID</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Service Type</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Service Date</th>
              <th className="px-4 py-2 text-gray-600 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.idService}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-2 text-gray-700">{item.idService}</td>
                <td className="px-4 py-2 text-gray-700">{item.serviceType}</td>
                <td className="px-4 py-2 text-gray-700">{item.serviceDate}</td>
                <td className="px-4 py-2 text-gray-700">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <button className="px-6 py-2 bg-[#A888B5] text-white rounded-lg hover:bg-[#8174A0] transition duration-300">
          Add New Service
        </button>
      </div>
    </div>
  );
};

export default ServiceHistoryPage;
