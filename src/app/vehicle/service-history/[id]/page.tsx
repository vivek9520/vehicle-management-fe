'use client'; // Ensure this component is client-side

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ServiceHistory } from '@/app/models/types';

const ServiceHistoryPage = () => {
  const [tableData, setTableData] = useState<ServiceHistory[]>([]);
  const { id } = useParams();
  const router = useRouter(); // For routing

  useEffect(() => {
    fetchHistoryData();
  }, [id]);

  const fetchHistoryData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const result = await axios.get<ServiceHistory[]>(
        `http://localhost:8080/api/v1/service_activity/search-service-history?idVehicle=` + id,
        { headers }
      );

      if (result.status === 200) {
        const { data } = result.data;
        setTableData(data);
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
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

      {/* Add New Service Button (Top Right) */}
      <div className="absolute top-6 right-6">
        <button className="px-6 py-2 bg-[#001A6E] text-white rounded-lg hover:bg-[#8174A0] transition duration-300">
          Add New Service
        </button>
      </div>

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
            {tableData.map((item, index) => (
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
    </div>
  );
};

export default ServiceHistoryPage;
