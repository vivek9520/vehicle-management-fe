'use client'; // Ensure this component is client-side

import React, { useState } from 'react';

const SearchPage = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!registrationNumber) return;

    setLoading(true);
    setError(null);

    // Get the token from localStorage (or any other storage mechanism)
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token is missing.');
      setLoading(false);
      return;
    }

    try {
      // Make the API request with the Bearer token in the Authorization header
      const response = await fetch(`http://localhost:8080/api/v1/vehicle/get-vehicle-details?registrationNo=${registrationNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDetails(data.data); // Set the details state with the 'data' field from the response
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
     <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 bg-gradient-to-r from-[#A888B5] via-[#8174A0] to-[#EFB6C8] text-transparent bg-clip-text shadow-xl tracking-wide p-4">
  Search Vehicle by Registration Number
</h1>

      
      <div className="mb-6 flex justify-center space-x-4">
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          className="p-3 border border-[#A888B5] rounded-lg shadow-md w-96 focus:outline-none focus:ring-2 focus:ring-[#A888B5] placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 text-sm bg-[#A888B5] text-white rounded-lg border border-[#A888B5] hover:bg-[#8174A0] hover:border-[#8174A0] transition duration-300"
        >
          Search
        </button>
      </div>


      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {details && (
        <div className="mt-8 max-w-full mx-auto bg-white shadow-lg p-6 rounded-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Vehicle Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="font-medium text-gray-700">Registration No:</p>
              <p className="text-xl font-semibold text-gray-900">{details.registrationNo}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Model:</p>
              <p className="text-xl font-semibold text-gray-900">{details.tradeDesignation}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Brand:</p>
              <p className="text-xl font-semibold text-gray-900">{details.brand}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Color:</p>
              <p className="text-xl font-semibold text-gray-900">{details.color}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Vehicle Category:</p>
              <p className="text-xl font-semibold text-gray-900">{details.vehicleCategory}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Emission Class:</p>
              <p className="text-xl font-semibold text-gray-900">{details.emissionClass}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">CO2 Level:</p>
              <p className="text-xl font-semibold text-gray-900">{details.co2Level} g/km</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Fuel Type:</p>
              <p className="text-xl font-semibold text-gray-900">{details.fuel}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Rear Tire Dimension:</p>
              <p className="text-xl font-semibold text-gray-900">{details.rearTireDimension}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Insurance Company:</p>
              <p className="text-xl font-semibold text-gray-900">{details.insuranceCompany}</p>
            </div>
            {/* Displaying missing or optional data */}
            <div>
              <p className="font-medium text-gray-700">Date of First Commissioning:</p>
              <p className="text-xl font-semibold text-gray-900">{details.dateOfFirstCommissioning || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Acquisition Date:</p>
              <p className="text-xl font-semibold text-gray-900">{details.acquisitionDate || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">E-Identification Number:</p>
              <p className="text-xl font-semibold text-gray-900">{details.eidentificationNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Action Buttons (Right Aligned) */}
          <div className="mt-8 flex justify-end space-x-6">
            <button
              onClick={() => alert("Viewing Service History")}
              className="px-6 py-2 text-sm bg-[#A888B5] text-white rounded-lg border border-[#A888B5] hover:bg-[#8174A0] transition duration-300 transform hover:scale-105"
            >
              View Service History
            </button>
            <button
              onClick={() => alert("Adding New Service")}
              className="px-6 py-2 text-sm bg-[#EFB6C8] text-white rounded-lg border border-[#EFB6C8] hover:bg-[#FFD2A0] transition duration-300 transform hover:scale-105"
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
