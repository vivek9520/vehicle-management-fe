'use client'; // Ensure this component is client-side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Office, Vehicle } from '@/app/models/types';
import axios from 'axios';

const SearchPage = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [details, setDetails] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [office, setOffice] = useState<Office | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!registrationNumber) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/vehicle/get-vehicle-details?registrationNo=${registrationNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDetails(data.data);
        getOfficeDetails(data.data.idOffice);
      } else {
        setError(data.message || 'Error fetching details');
        setDetails(null);
      }
    } catch (err) {
      setError('Error fetching details');
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getOfficeDetails = async (id: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }
    try {
      const result = await axios.get(`http://localhost:8080/api/v1/office?officeId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (result.status === 200) {
        setOffice(result.data.data);
      }
    } catch (error) {
      setError('Error fetching office details');
    }
  };

  const handleCreateCommon = async (url: string) => {
    setButtonLoading(true);
    router.push(url);
    setButtonLoading(false);
  };

  const filterDetails = (details: any) => {
    const excludedFields = [
      'createdDate',
      'modifiedDate',
      'createdBy',
      'lastModifiedBy',
      'idOffice',
    ];
    return Object.entries(details).filter(([key]) => !excludedFields.includes(key));
  };

  return (
    <div >
      {/* Section Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-400">Vehicle Search</h1>
        {/* <p className="text-gray-500">Review and manage your vehicle details.</p> */}
      </div>

      {/* Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter Registration Number"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            className="p-3 border rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-100 p-2 rounded-lg text-red-500">{error}</div>}

      {/* Vehicle Details Table */}
      {details && (
  <div className="bg-white shadow rounded-lg p-6 mt-6">
    <h2 className="text-xl font-medium text-gray-700 mb-4">Vehicle Details</h2>
    <div className="overflow-x-auto">
      <div className="overflow-y-auto max-h-64 border rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left sticky top-0 bg-gray-100 border-b border-gray-200">Details</th>
              <th className="py-3 px-4 text-left sticky top-0 bg-gray-100 border-b border-gray-200">Value</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filterDetails(details).map(([key, value], index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-4 font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </td>
                <td className="py-3 px-4">{value || 'N/A'}</td>
              </tr>
            ))}
            {office && (
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4 font-medium">Office Name</td>
                <td className="py-3 px-4">{office.officeName || 'N/A'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}


      {/* New Buttons Section */}
      {details && (
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => handleCreateCommon(`/vehicle/service-history/${details.idVehicle}`)}
            className="px-6 py-2 border-2 border-[#0A3981] text-[#0A3981] rounded-md hover:bg-[#D4EBF8] hover:text-[#0A3981] transition duration-300 ease-in-out"
          >
            {buttonLoading ? (
              <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-2 border-[#0A3981] rounded-full"></span>
            ) : (
              'Service History'
            )}
          </button>
          <button
            onClick={() => handleCreateCommon(`/vehicle/create-service/${details.idVehicle}`)}
            className="px-6 py-2 border-2 border-[#0A3981] text-[#0A3981] rounded-md hover:bg-[#D4EBF8] hover:text-[#0A3981] transition duration-300 ease-in-out"
          >
            {buttonLoading ? (
              <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-2 border-[#0A3981] rounded-full"></span>
            ) : (
              'New Service'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
