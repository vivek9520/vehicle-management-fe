'use client'; // Ensure this component is client-side

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'; // Import usePathname hook

const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in by verifying the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    setIsLoggedIn(!!token); // If token exists, set logged in to true

    // Redirect to login page if not logged in and not on the login page
    if (!token && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]); // Add pathname and router to the dependency array

  const navigateToHome = () => {
    router.push('/pages/vehicle/search'); // Navigate to the dashboard page
  };

  const handleLogout = () => {
    // Clear the auth token from localStorage
    localStorage.removeItem('authToken');
    // Redirect to login page after logout
    router.push('/login');
  };

  // Only render the header with buttons if the user is logged in
  if (!isLoggedIn) {
    return null; // Do not render anything if the user is not logged in
  }

  return (
    <header className="bg-[#D4EBF8] text-white py-4 shadow-xl border-b-4 border-[#0A3981] transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-6">
          {/* Logo 1 */}
          <img
            src="/logo/logo 1.png" // Replace with your logo path
            alt="Logo 1"
            className="w-12 h-12"
          />
          {/* Logo 2 */}
          <img
            src="/logo/logo2.png" // Replace with your logo path
            alt="Logo 2"
            className="w-12 h-12"
          />
        </div>
        <h1 className="text-2xl font-bold text-[#0A3981]">Service Management</h1>
        <div className="space-x-4">
          <button
            onClick={navigateToHome}
            className="px-4 py-2 bg-[#0A3981] text-white rounded hover:bg-[#FFD2A0] transition duration-200"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#FFD2A0] text-[#0A3981] rounded hover:bg-[#EFB6C8] transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
