// app/components/Header.tsx
'use client'; // Ensure this component is client-side

import React from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push('/dashboard'); // Navigate to the dashboard page
  };

  const handleLogout = () => {
    // Handle your logout logic here (e.g., clearing session)
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-[#8174A0] text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Service Management</h1>
        <div className="space-x-4">
          <button
            onClick={navigateToDashboard}
            className="px-4 py-2 bg-[#A888B5] rounded hover:bg-[#8174A0] transition duration-200"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#FFD2A0] text-[#8174A0] rounded hover:bg-[#EFB6C8] transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
