"use client";

import React, { useState } from "react";
import Select from "react-select";

// Dummy data for vehicles (replace with real data or API)
const vehicles = [
  { value: "1", label: "Toyota Camry" },
  { value: "2", label: "Honda Civic" },
  { value: "3", label: "Ford Mustang" },
  { value: "4", label: "Chevrolet Malibu" },
  { value: "5", label: "BMW 3 Series" },
];

const SearchVehicle = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle to search.");
      return;
    }

    // Simulate a search (replace with real API call)
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults([
        {
          id: "1",
          model: "Toyota Camry",
          year: 2020,
          color: "Blue",
          price: "$20,000",
        },
        {
          id: "2",
          model: "Honda Civic",
          year: 2021,
          color: "Red",
          price: "$18,000",
        },
      ]);
      setIsSearching(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Search Vehicle</h1>

      {/* Searchable Dropdown */}
      <div className="max-w-md mx-auto mb-6">
        <Select
          options={vehicles}
          onChange={(selected) => setSelectedVehicle(selected)}
          placeholder="Select a vehicle"
        />
      </div>

      <div className="text-center mb-6">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Search Results Table */}
      {isSearching ? (
        <div className="text-center">Loading...</div>
      ) : (
        searchResults.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Model</th>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-4 py-2">{vehicle.id}</td>
                    <td className="px-4 py-2">{vehicle.model}</td>
                    <td className="px-4 py-2">{vehicle.year}</td>
                    <td className="px-4 py-2">{vehicle.color}</td>
                    <td className="px-4 py-2">{vehicle.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default SearchVehicle;
