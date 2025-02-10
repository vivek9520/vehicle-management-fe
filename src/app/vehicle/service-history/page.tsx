'use client'; // Ensure this component is client-side

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ServiceHistory } from '@/app/models/types';

const ServiceHistoryPage = () => {
  const [tableData, setTableData] = useState<ServiceHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For routing

  useEffect(() => {
    if (searchQuery) {
      fetchHistoryData(searchQuery);
    }
  }, [searchQuery]);

  const fetchHistoryData = async (query: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const result = await axios.get<ServiceHistory[]>(
        `http://localhost:8080/api/v1/service_activity/search-service-history?idVehicle=${query}`,
        { headers }
      );

      if (result.status === 200) {
        const { data } = result.data;
        setTableData(data);
      } else {
        setError('Error fetching service history.');
      }
    } catch (error) {
      setError('Error fetching service history.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to the search page
  const handleBack = () => {
    router.push('/vehicle/search'); // Redirect to search page
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1] flex flex-col py-6 px-4 relative">
      {/* Back Link */}
      <div className="mb-6">
        <a
          href="#"
          onClick={handleBack}
          className="text-blue-500 mb-2 inline-block hover:text-blue-700 transition duration-300"
        >
          &larr; Back
        </a>
        <h1 className="text-3xl font-semibold text-gray-700">Vehicle Service History</h1>
        <p className="text-gray-500">Review the service details for this vehicle.</p>
      </div>

      {/* Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter Vehicle ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={() => fetchHistoryData(searchQuery)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-100 p-2 rounded-lg text-red-500">{error}</div>}

      {/* Service History Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4 border border-gray-200 mt-16">
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
            {tableData.length > 0 ? (
              tableData.map((item, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                  No service history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceHistoryPage;
