"use client";

import Header from "@/app/components/Header";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+ App Router
import React, { useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleCreate = (path: string) => {
    setIsLoading(true); // Show spinner when the action starts
    setTimeout(() => {
      router.push(path); // Simulate action (e.g., navigation)
      setIsLoading(false); // Hide spinner after the action is complete
    }, 1500); // Simulate a delay (e.g., for API call or navigation)
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center w-full p-6">
        {isLoading ? (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <svg
              className="animate-spin h-16 w-16 border-t-4 border-b-4 border-white rounded-full"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="none"
                d="M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0z"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
            {/* Create Vehicle Card */}
            <div
              className="bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden relative"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0")',
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Create Vehicle
                </h2>
                <p className="text-white mb-6">
                  Add details for a new vehicle to the system.
                </p>
                <button
                  className="w-full bg-[#A888B5] text-white py-3 px-6 rounded-lg hover:bg-[#8174A0] transition duration-200"
                  onClick={() => handleCreate("/pages/vehicle/create")}
                >
                  Create Vehicle
                </button>
              </div>
            </div>

            {/* Create Service Card */}
            <div
              className="bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden relative"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0")',
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Create Service
                </h2>
                <p className="text-white mb-6">
                  Add details for a new service to the system.
                </p>
                <button
                  className="w-full bg-[#A888B5] text-white py-3 px-6 rounded-lg hover:bg-[#8174A0] transition duration-200"
                  onClick={() => handleCreate("/pages/service/create")}
                >
                  Create Service
                </button>
              </div>
            </div>

            {/* Search Vehicle Card */}
            <div
              className="bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden relative"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0")',
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Search Vehicle
                </h2>
                <p className="text-white mb-6">
                  Search and view vehicles in the system.
                </p>
                <button
                  className="w-full bg-[#A888B5] text-white py-3 px-6 rounded-lg hover:bg-[#8174A0] transition duration-200"
                  onClick={() => handleCreate("/pages/vehicle/search")}
                >
                  Search Vehicle
                </button>
              </div>
            </div>

            {/* Search Service Card */}
            <div
              className="bg-cover bg-center h-64 rounded-lg shadow-lg overflow-hidden relative"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0")',
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Search Service
                </h2>
                <p className="text-white mb-6">
                  Search and view services in the system.
                </p>
                <button
                  className="w-full bg-[#A888B5] text-white py-3 px-6 rounded-lg hover:bg-[#8174A0] transition duration-200"
                  onClick={() => handleCreate("/pages/service/search")}
                >
                  Search Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="w-full py-4 bg-[#8174A0] text-center text-white">
        <p>&copy; {new Date().getFullYear()} NHO. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
