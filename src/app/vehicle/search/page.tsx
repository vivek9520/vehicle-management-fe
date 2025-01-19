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
  const [step, setStep] = useState(1); // For progress bar
  const router = useRouter();
  const [office, setOffice] = useState<Office | null>(null);
  
  // Add loading state for buttons
  const [buttonLoading, setButtonLoading] = useState(false);

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
        setStep(2); // Move to next step after successful fetch
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

  const handleCreate = async (path: string) => {
    setButtonLoading(true);  // Show spinner when button is clicked
    router.push(path);  // Simulate navigation (could be a real API call or route change)
    setButtonLoading(false); // Hide spinner after navigation (or action completion)
  };

  const handleCreateCommon = async (url: string) => {
    setButtonLoading(true);  // Show spinner when button is clicked
    router.push(url);  // Navigate to the provided URL
    setButtonLoading(false); // Hide spinner after navigation
  };

  const filterDetails = (details: any) => {
    const excludedFields = [
      'createdDate', 'modifiedDate', 'createdBy', 'lastModifiedBy', 'idVehicle', 'idOffice'
    ];
    return Object.entries(details).filter(([key]) => !excludedFields.includes(key));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 font-sans">
      
      {/* Progress Bar - Horizontal layout */}
      <div className="flex items-center mb-6">
        <div className={`flex-1 h-2 bg-gray-200 rounded-full relative`}>
          <div
            className={`absolute top-0 left-0 h-2 rounded-full bg-blue-600`}
            style={{ width: `${step === 1 ? 50 : 100}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-sm mt-2">
          <div className={`${step >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>Search</div>
          <div className={`${step >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>Search Result</div>
        </div>
      </div>

      {/* New Vehicle Button - Always visible */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleCreate('/vehicle/create')}
          className="px-6 py-2 text-sm text-[#0A3981] rounded-lg border border-[#0A3981] hover:bg-[#D4EBF8] hover:text-[#0A3981] transition duration-300 shadow-md"
        >
          {buttonLoading ? (
            <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-2 border-[#0A3981] rounded-full"></span>
          ) : (
            'New Vehicle'
          )}
        </button>
      </div>

      {/* Section Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Vehicle Search</h1>
        <p className="text-gray-500">Review and manage your vehicle details.</p>
      </div>

      {/* Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Details</th>
                  <th className="py-3 px-4 text-left">Value</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {/* Filtered details */}
                {filterDetails(details).map(([key, value], index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
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
