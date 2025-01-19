"use client"


import Link from "next/link";
// pages/index.js
import { useState } from "react";

export default function Home() {
  // Simulating user permissions
  const [permissions, setPermissions] = useState({
    canAccessVehicleManagement: true,
    canAccessMobileManagement: true,
  });

  return (
    <div className="min-h-screen bg-white">


      {/* Main Content */}
      <main className="flex flex-col items-center justify-center py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Vehicle Management Card */}
          <div
            className={`relative flex flex-col items-center justify-center h-48 w-80 rounded-lg border-2 ${
              permissions.canAccessVehicleManagement
                ? "border-[#001A6E] bg-white text-[#001A6E] hover:bg-[#001A6E] hover:text-white"
                : "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
            } shadow-md transition-colors duration-300`}
          >
            {permissions.canAccessVehicleManagement ? (
              <Link
                href="/vehicle/search"
                className="text-xl font-semibold"
                
              >
                Vehicle Management
              </Link>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white text-lg font-semibold rounded-lg">
                <span className="text-2xl font-bold">Access Denied</span>
                <p className="mt-2">Vehicle Management</p>
              </div>
            )}
          </div>

          {/* Mobile Management Card */}
          <div
            className={`relative flex flex-col items-center justify-center h-48 w-80 rounded-lg border-2 ${
              permissions.canAccessMobileManagement
                ? "border-[#001A6E] bg-white text-[#001A6E] hover:bg-[#001A6E] hover:text-white"
                : "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
            } shadow-md transition-colors duration-300`}
          >
            {permissions.canAccessMobileManagement ? (
              <Link
                href="/mobile/search"
                className="text-xl font-semibold"
              >
                Mobile Management
              </Link>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white text-lg font-semibold rounded-lg">
                <span className="text-2xl font-bold">Access Denied</span>
                <p className="mt-2">Mobile Management</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
