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
    router.push('/vehicle/search'); // Navigate to the dashboard page
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
    <header className="bg-[#001A6E] text-white py-4 shadow-md border-b border-white">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
        <div className="flex items-center space-x-6">
          {/* Logo 1 */}
          <img
            src="/logo/logo 1.png" // Replace with your logo path
            alt="Logo 1"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
          {/* Logo 2 */}
          <img
            src="/logo/logo2.png" // Replace with your logo path
            alt="Logo 2"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
        <h1 className="text-2xl font-bold hidden sm:block">Service Management</h1>
        <div className="space-x-4 hidden sm:flex">
          <button
            onClick={navigateToHome}
            className="px-3 py-1.5 text-sm bg-white text-[#001A6E] rounded hover:bg-[#E6E6E6] transition duration-200"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm bg-[#001A6E] text-white border border-white rounded hover:bg-[#002A9C] transition duration-200"
          >
            Logout
          </button>
        </div>
        {/* Mobile View */}
        <div className="sm:hidden flex items-center space-x-2">
          <button
            onClick={navigateToHome}
            className="px-2 py-1 text-sm bg-white text-[#001A6E] rounded hover:bg-[#E6E6E6] transition duration-200"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="px-2 py-1 text-sm bg-[#001A6E] text-white border border-white rounded hover:bg-[#002A9C] transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
