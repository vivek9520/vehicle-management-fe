'use client'; // Ensure this component is client-side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchPage = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false); // For search button
  const [addVehicleLoading, setAddVehicleLoading] = useState(false); // For add vehicle button
  const router = useRouter();

  const handleSearch = async () => {
    if (!registrationNumber) return;

    setSearchLoading(true); // Show spinner for search button
    setError(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      setSearchLoading(false); // Hide spinner on error
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/vehicle/get-vehicle-details?registrationNo=${registrationNumber}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDetails(data.data);
      } else {
        setError(data.message || 'Error fetching details');
        setDetails(null);
      }
    } catch (err) {
      setError('Error fetching details');
      setDetails(null);
    } finally {
      setSearchLoading(false); // Hide spinner after request is completed
    }
  };

  // Add Vehicle Button - Handles Spinner and Navigation
  const handleCreate = (path: string) => {
    setAddVehicleLoading(true); // Show spinner for add vehicle button

    setTimeout(() => {
      router.push(path); // Simulate navigation (could be a real API call or route change)
      setAddVehicleLoading(false); // Hide spinner after action is complete
    }, 1500); // Simulate delay
  };

  // Add Vehicle Button - Handles Spinner and Navigation
  const handleCreateCommon = (path: string) => {
    // Show spinner for add vehicle button
    router.push(path); // Simulate navigation (could be a real API call or route change)
  };

  return (
    <div className="min-h-screen bg-[#D4EBF8] p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#0A3981] bg-gradient-to-r from-[#0A3981] to-[#D4EBF8] text-transparent bg-clip-text shadow-xl tracking-wide p-4">
        Search Vehicle by Registration Number
      </h1>

      {/* Search and Add Vehicle Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        {/* Centered Search */}
        <div className="flex-grow flex justify-center">
          <div className="flex flex-col sm:flex-row space-x-4">
            <input
              type="text"
              placeholder="Enter Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="p-3 border border-[#0A3981] rounded-lg shadow-md w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-[#0A3981] placeholder-gray-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 text-sm bg-[#0A3981] text-white rounded-lg border border-[#0A3981] hover:bg-[#D4EBF8] hover:border-[#D4EBF8] transition duration-300 mt-4 sm:mt-0"
            >
              {searchLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M4 12a8 8 0 018-8V4m0 16v-2a8 8 0 00-8-8"
                    />
                  </svg>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* Add Vehicle Button */}
        <button
          onClick={() => handleCreate('/vehicle/create')}
          className="px-6 py-2 text-sm text-[#0A3981] rounded-lg border border-[#0A3981] hover:bg-[#D4EBF8] hover:text-[#0A3981] transition duration-300 shadow-md"
        >
          {addVehicleLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-[#0A3981]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M4 12a8 8 0 018-8V4m0 16v-2a8 8 0 00-8-8"
                />
              </svg>
              Adding Vehicle...
            </div>
          ) : (
            'Add Vehicle'
          )}
        </button>
      </div>

      {/* Loading, Error, and Details */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {details && (
        <div className="mt-8 max-w-full mx-auto bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-center mb-6 text-[#0A3981]">
            Vehicle Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vehicle Details */}
            <div>
              <p className="font-medium text-[#0A3981]">Registration No:</p>
              <p className="text-xl font-semibold text-gray-900">{details.registrationNo}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Model:</p>
              <p className="text-xl font-semibold text-gray-900">{details.tradeDesignation}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Brand:</p>
              <p className="text-xl font-semibold text-gray-900">{details.brand}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Color:</p>
              <p className="text-xl font-semibold text-gray-900">{details.color}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Vehicle Category:</p>
              <p className="text-xl font-semibold text-gray-900">{details.vehicleCategory}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Emission Class:</p>
              <p className="text-xl font-semibold text-gray-900">{details.emissionClass}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">CO2 Level:</p>
              <p className="text-xl font-semibold text-gray-900">{details.co2Level} g/km</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Fuel Type:</p>
              <p className="text-xl font-semibold text-gray-900">{details.fuel}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Date of First Commissioning:</p>
              <p className="text-xl font-semibold text-gray-900">{details.dateOfFirstCommissioning}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Acquisition Date:</p>
              <p className="text-xl font-semibold text-gray-900">{details.acquisitionDate}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Rear Tire Dimension:</p>
              <p className="text-xl font-semibold text-gray-900">{details.rearTireDimension}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">Insurance Company:</p>
              <p className="text-xl font-semibold text-gray-900">{details.insuranceCompany}</p>
            </div>
            <div>
              <p className="font-medium text-[#0A3981]">E-Identification Number:</p>
              <p className="text-xl font-semibold text-gray-900">{details.eidentificationNumber}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => handleCreateCommon(`/vehicle/service-history/${details.idVehicle}`)}
              className="px-6 py-2 border-2 border-[#0A3981] text-[#0A3981] rounded-md hover:bg-[#D4EBF8] hover:text-[#0A3981] transition duration-300 ease-in-out"
            >
              Service History
            </button>
            <button
              onClick={() => handleCreateCommon(`/vehicle/create-service/${details.idVehicle}`)}
              className="px-6 py-2 border-2 border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition duration-300 ease-in-out"
            >
              New Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
